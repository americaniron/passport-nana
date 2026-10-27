import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDoc,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase.ts';
import {
  BookingRecord,
  BookingStatus,
  CalendarDayStatus,
  CareProfile,
  LiveUpdateRecord,
  MediaItem,
  PricingRatesConfig,
  PromotionItem,
  SiteCopyConfig,
  ThemeColorsConfig,
} from '../types/business.ts';

interface BusinessContextType {
  // Authentication
  currentUser: FirebaseUser | null;
  isAuthReady: boolean;
  signInWithGoogle: () => Promise<FirebaseUser | null>;
  registerWithEmail: (
    fullName: string,
    phone: string,
    email: string,
    password: string
  ) => Promise<FirebaseUser>;
  signInWithEmail: (email: string, password: string) => Promise<FirebaseUser>;
  resetPassword: (email: string) => Promise<void>;
  signOutUser: () => Promise<void>;

  // Site Copy
  siteCopy: SiteCopyConfig;
  updateSiteCopy: (newCopy: Partial<SiteCopyConfig>) => Promise<void>;

  // Theme Colors
  themeColors: ThemeColorsConfig;
  updateThemeColors: (newColors: Partial<ThemeColorsConfig>) => Promise<void>;
  resetThemeColors: () => Promise<void>;

  // Owner Availability Calendar
  calendarAvailability: Record<string, CalendarDayStatus>;
  updateDayAvailability: (
    dateStr: string,
    status: CalendarDayStatus['status'],
    note?: string
  ) => Promise<void>;
  getAvailabilityForDate: (dateStr: string) => CalendarDayStatus;

  // Client Care Profile
  careProfile: CareProfile | null;
  saveCareProfile: (profileData: Omit<CareProfile, 'userId' | 'updatedAt'>) => Promise<void>;

  // Bookings
  bookings: BookingRecord[];
  bookingsLoading: boolean;
  addBooking: (
    booking: Omit<
      BookingRecord,
      'id' | 'clientUid' | 'createdAt' | 'status' | 'depositPaid' | 'finalPaid'
    >
  ) => Promise<BookingRecord>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  updateBookingFlight: (
    id: string,
    flightDetails: NonNullable<BookingRecord['flightDetails']>
  ) => Promise<void>;
  updateBookingClientNotes: (
    id: string,
    updates: {
      locationAddress?: string;
      specialRequests?: string;
      childrenDetails?: string;
      depositPaid?: boolean;
      status?: BookingStatus;
    }
  ) => Promise<void>;
  addLiveUpdate: (
    bookingId: string,
    message: string,
    type: 'checkin' | 'photo' | 'flight' | 'milestone' | 'message',
    role?: 'client' | 'nana'
  ) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;

  // Promotions
  promotions: PromotionItem[];
  addPromotion: (promo: Omit<PromotionItem, 'id'>) => Promise<void>;
  updatePromotion: (id: string, promo: Partial<PromotionItem>) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
  applyPromoCode: (
    code: string,
    currentTotal: number
  ) => {
    valid: boolean;
    discountAmount: number;
    message: string;
    promo?: PromotionItem;
  };

  // Media Gallery & Website Image Slots
  mediaGallery: MediaItem[];
  addMediaItem: (item: Omit<MediaItem, 'id' | 'createdAt'>) => Promise<void>;
  updateMediaItem: (
    id: string,
    updates: Partial<Omit<MediaItem, 'id' | 'createdAt'>>
  ) => Promise<void>;
  deleteMediaItem: (id: string) => Promise<void>;
  restoreDefaultMedia: () => Promise<void>;
  getSiteImage: (id: string, fallbackUrl?: string) => string | null;

  // Pricing
  pricingRates: PricingRatesConfig;
  updatePricingRates: (newRates: Partial<PricingRatesConfig>) => Promise<void>;

  // Admin Auth
  isAdminAuthenticated: boolean;
  adminLogin: (
    pin: string,
    email?: string,
    password?: string
  ) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
}

const DEFAULT_SITE_COPY: SiteCopyConfig = {
  heroTagline: '✨ 24/7 PREMIER CHILDCARE & TRAVEL PASSPORT NANNY',
  heroTitle: 'Compassionate Care At Home & Around The Globe',
  heroSubtitle:
    'Dedicated on-call childcare, domestic & international flight accompaniment, school pickups, and loving locs & hair care by Ken’nyzhae Nathaniel.',
  aboutHeadline: 'Safe Hands, Nurturing Hearts, Endless Adventures',
  aboutBio:
    "Founded by Ken'nyzhae Nathaniel, Passport Nana was born from a deep conviction: every child deserves attentive, joyful, and emotionally enriching care, whether at home, at school dismissal, on long flights, or in the styling chair. With years of hands-on childcare experience, infant safety certification, CPR qualification, and a background in professional hair care, Ken'nyzhae serves families with heartfelt dedication.",
  founderName: "Ken'nyzhae Nathaniel",
  businessPhone: '305-409-6788',
  businessEmail: 'care@passportnana.com',
  emergencyLine: '305-409-6788 (24/7 Urgent On-Call)',
  serviceHubs: 'Miami • Charlotte • Atlanta • Orlando • New York • Global Flights',
  announcementBanner: '✈️ Now Accepting Travel Accompaniment & 24/7 On-Call Childcare Bookings!',
  showAnnouncement: true,
};

const DEFAULT_THEME_COLORS: ThemeColorsConfig = {
  darkBg: '#041226',
  darkCard: '#071c38',
  darkAccentGold: '#d4af37',
  darkText: '#f8fafc',
  lightBg: '#faf8f5',
  lightCard: '#ffffff',
  lightAccentGold: '#c59b27',
  lightText: '#04142b',
};

const DEFAULT_PRICING_RATES: PricingRatesConfig = {
  nannyHourly: 30,
  passportTravelHourly: 35,
  schoolPickupRate: 25,
  adventureDayHourly: 32,
  petNannyHourly: 20,
  braidsBase: 100,
  locRetwistBase: 50,
  additionalChildRate: 5,
  standardMinHours: 4,
};

export const DEFAULT_SITE_MEDIA: MediaItem[] = [
  {
    id: 'site_hero_main',
    title: 'Hero Banner Feature Photo',
    url: '/assets/aistudio/T3Y66BS3HKS4D42K6PD7LESR_901339d2.webp',
    category: 'branding',
    caption: 'Homepage Hero right-side feature showcase card',
    createdAt: '2026-10-26',
  },
  {
    id: 'site_passport_banner',
    title: 'Passport Nanny Experience Feature Photo',
    url: '/assets/aistudio/T47GYQIQZI3O77PQ3A5YN3ML_e5f6454f.webp',
    category: 'passport_travel',
    caption: 'Featured image in The Passport Nanny Experience section',
    createdAt: '2026-10-26',
  },
  {
    id: 'site_locs_showcase_1',
    title: 'Locs Showcase 1: Precision Parting Grid',
    url: '/assets/aistudio/ZTZXKCZ3HHQ7UEDL7JIJ475M_54c67c2a.webp',
    category: 'hair_locs',
    caption: 'Immaculate scalp lines & palm retwist showcase photo (Left)',
    createdAt: '2026-10-26',
  },
  {
    id: 'site_locs_showcase_2',
    title: 'Locs Showcase 2: Healthy Root Density',
    url: '/assets/aistudio/PSMWGZA2JPS7CFRDUK5AHEIW_0a7cd65a.webp',
    category: 'hair_locs',
    caption: 'Hydrated scalp & zero-tension technique showcase photo (Right)',
    createdAt: '2026-10-26',
  },
  {
    id: 'site_founder_portrait',
    title: "Founder Portrait: Ken'nyzhae Nathaniel",
    url: '/assets/aistudio/LYZRLDMS4X5O44JOOXY3YY7K_5185ff1e.webp',
    category: 'branding',
    caption: 'Meet Your Family’s Favorite Partner in Care section portrait',
    createdAt: '2026-10-26',
  },
  {
    id: 'service_nanny-services',
    title: 'Service Card: Nanny Services',
    url: '/assets/aistudio/T47GYQIQZI3O77PQ3A5YN3ML_e5f6454f.webp',
    category: 'childcare',
    caption: 'High-quality, attentive in-home or travel childcare card photo',
    createdAt: '2026-10-26',
  },
  {
    id: 'service_passport-travel-nanny',
    title: 'Service Card: Passport Nanny (Travel Childcare)',
    url: '/assets/aistudio/T47GYQIQZI3O77PQ3A5YN3ML_e5f6454f.webp',
    category: 'passport_travel',
    caption: 'Domestic & international flight accompaniment card photo',
    createdAt: '2026-10-26',
  },
  {
    id: 'service_on-call-babysitter',
    title: 'Service Card: Babysitter & On-Call Sitter',
    url: '/assets/aistudio/T3Y66BS3HKS4D42K6PD7LESR_901339d2.webp',
    category: 'childcare',
    caption: '24/7 Available on-call babysitter card photo',
    createdAt: '2026-10-26',
  },
  {
    id: 'service_school-pickup',
    title: 'Service Card: Picking up Baby From School',
    url: '/assets/aistudio/JXODWQQHOB27IQ4OJXJW3RF3_86de3a81.webp',
    category: 'childcare',
    caption: 'Safe school dismissal, snack & homework routine card photo',
    createdAt: '2026-10-26',
  },
  {
    id: 'service_adventure-day',
    title: 'Service Card: Adventure Day Experience',
    url: '/assets/aistudio/T3Y66BS3HKS4D42K6PD7LESR_901339d2.webp',
    category: 'adventures',
    caption: 'Tailored indoor & outdoor excursions card photo',
    createdAt: '2026-10-26',
  },
  {
    id: 'service_pet-nanny-24hr',
    title: 'Service Card: 24-HR On-Call Pet Nanny',
    url: '/assets/aistudio/Screenshot_2026-10-26_at_6.58.42_PM_0896ae9b.png',
    category: 'adventures',
    caption: 'Sunrise walks, beach adventures & overnight pet sitting card photo',
    createdAt: '2026-10-26',
  },
  {
    id: 'service_locks-wash-retwist-style',
    title: 'Service Card: Locks: Wash, Retwist & Style',
    url: '/assets/aistudio/ZTZXKCZ3HHQ7UEDL7JIJ475M_54c67c2a.webp',
    category: 'hair_locs',
    caption: 'Deep clean clarifying wash, scalp massage & palm rolling card photo',
    createdAt: '2026-10-26',
  },
  {
    id: 'service_freestyle-braids',
    title: 'Service Card: Freestyle Braids (Kids & Adults)',
    url: '/assets/aistudio/PSMWGZA2JPS7CFRDUK5AHEIW_0a7cd65a.webp',
    category: 'hair_locs',
    caption: 'Creative, pain-free protective braided styles card photo',
    createdAt: '2026-10-26',
  },
  {
    id: 'service_hair-consultation',
    title: 'Service Card: Hair Consultation (Locs & Braids)',
    url: '/assets/aistudio/ZTZXKCZ3HHQ7UEDL7JIJ475M_54c67c2a.webp',
    category: 'hair_locs',
    caption: 'Assess scalp condition, loc maturity & style planning card photo',
    createdAt: '2026-10-26',
  },
  {
    id: 'service_meet-n-greet',
    title: 'Service Card: Meet-N-Greet (Sitter / Nanny)',
    url: '/assets/aistudio/Q23I372NJNBIAIIBXHFFJO25_3eb64b95.webp',
    category: 'childcare',
    caption: 'Complimentary consultation to meet Nana card photo',
    createdAt: '2026-10-26',
  },
  {
    id: 'service_multiple-days-deposit',
    title: 'Service Card: Multi-Day / Travel Booking Deposit',
    url: '/assets/aistudio/T47GYQIQZI3O77PQ3A5YN3ML_e5f6454f.webp',
    category: 'passport_travel',
    caption: 'Lock in dates for weekly nanny contracts or vacation trips card photo',
    createdAt: '2026-10-26',
  },
];

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  const [siteCopy, setSiteCopy] = useState<SiteCopyConfig>(DEFAULT_SITE_COPY);
  const [themeColors, setThemeColors] = useState<ThemeColorsConfig>(DEFAULT_THEME_COLORS);
  const [pricingRates, setPricingRates] = useState<PricingRatesConfig>(DEFAULT_PRICING_RATES);
  const [calendarAvailability, setCalendarAvailability] = useState<Record<string, CalendarDayStatus>>({});
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [firestoreMedia, setFirestoreMedia] = useState<Record<string, MediaItem>>({});
  const [localMediaOverrides, setLocalMediaOverrides] = useState<Record<string, MediaItem>>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('pn_media_overrides_v1') : null;
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('pn_deleted_media_ids_v1') : null;
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [careProfile, setCareProfile] = useState<CareProfile | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState<boolean>(false);

  // Apply live theme CSS variables whenever themeColors changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--pn-dark-bg', themeColors.darkBg);
    root.style.setProperty('--pn-dark-card', themeColors.darkCard);
    root.style.setProperty('--pn-dark-gold', themeColors.darkAccentGold);
    root.style.setProperty('--pn-light-bg', themeColors.lightBg);
    root.style.setProperty('--pn-light-card', themeColors.lightCard);
    root.style.setProperty('--pn-light-gold', themeColors.lightAccentGold);
  }, [themeColors]);

  // 1. Listen to Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Check if user is bootstrapped owner email or registered in /admins/{uid}
        if (user.email === 'info@fixmyiron.com') {
          setIsAdminAuthenticated(true);
        } else {
          try {
            const adminSnap = await getDoc(doc(db, 'admins', user.uid));
            setIsAdminAuthenticated(adminSnap.exists());
          } catch {
            setIsAdminAuthenticated(false);
          }
        }
      } else {
        setIsAdminAuthenticated(false);
        setCareProfile(null);
        setBookings([]);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // 2. Listen to Public Site Config (/siteConfig/main)
  useEffect(() => {
    const configRef = doc(db, 'siteConfig', 'main');
    const unsub = onSnapshot(
      configRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setSiteCopy({
            heroTagline: data.heroTagline ?? DEFAULT_SITE_COPY.heroTagline,
            heroTitle: data.heroTitle ?? DEFAULT_SITE_COPY.heroTitle,
            heroSubtitle: data.heroSubtitle ?? DEFAULT_SITE_COPY.heroSubtitle,
            aboutHeadline: data.aboutHeadline ?? DEFAULT_SITE_COPY.aboutHeadline,
            aboutBio: data.aboutBio ?? DEFAULT_SITE_COPY.aboutBio,
            founderName: data.founderName ?? DEFAULT_SITE_COPY.founderName,
            businessPhone: data.businessPhone ?? DEFAULT_SITE_COPY.businessPhone,
            businessEmail: data.businessEmail ?? DEFAULT_SITE_COPY.businessEmail,
            emergencyLine: data.emergencyLine ?? DEFAULT_SITE_COPY.emergencyLine,
            serviceHubs: data.serviceHubs ?? DEFAULT_SITE_COPY.serviceHubs,
            announcementBanner: data.announcementBanner ?? DEFAULT_SITE_COPY.announcementBanner,
            showAnnouncement: data.showAnnouncement ?? DEFAULT_SITE_COPY.showAnnouncement,
          });
          setThemeColors({
            darkBg: data.darkBg ?? DEFAULT_THEME_COLORS.darkBg,
            darkCard: data.darkCard ?? DEFAULT_THEME_COLORS.darkCard,
            darkAccentGold: data.darkAccentGold ?? DEFAULT_THEME_COLORS.darkAccentGold,
            darkText: data.darkText ?? DEFAULT_THEME_COLORS.darkText,
            lightBg: data.lightBg ?? DEFAULT_THEME_COLORS.lightBg,
            lightCard: data.lightCard ?? DEFAULT_THEME_COLORS.lightCard,
            lightAccentGold: data.lightAccentGold ?? DEFAULT_THEME_COLORS.lightAccentGold,
            lightText: data.lightText ?? DEFAULT_THEME_COLORS.lightText,
          });
          setPricingRates({
            nannyHourly: data.nannyHourly ?? DEFAULT_PRICING_RATES.nannyHourly,
            passportTravelHourly: data.passportTravelHourly ?? DEFAULT_PRICING_RATES.passportTravelHourly,
            schoolPickupRate: data.schoolPickupRate ?? DEFAULT_PRICING_RATES.schoolPickupRate,
            adventureDayHourly: data.adventureDayHourly ?? DEFAULT_PRICING_RATES.adventureDayHourly,
            petNannyHourly: data.petNannyHourly ?? DEFAULT_PRICING_RATES.petNannyHourly,
            braidsBase: data.braidsBase ?? DEFAULT_PRICING_RATES.braidsBase,
            locRetwistBase: data.locRetwistBase ?? DEFAULT_PRICING_RATES.locRetwistBase,
            additionalChildRate: data.additionalChildRate ?? DEFAULT_PRICING_RATES.additionalChildRate,
            standardMinHours: data.standardMinHours ?? DEFAULT_PRICING_RATES.standardMinHours,
          });
        }
      },
      (err) => {
        console.error('Error reading siteConfig:', err);
      }
    );
    return () => unsub();
  }, []);

  // 3. Listen to Public Owner Availability (/availability)
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'availability'),
      (snap) => {
        const map: Record<string, CalendarDayStatus> = {};
        snap.forEach((docSnap) => {
          const d = docSnap.data() as CalendarDayStatus;
          map[d.date || docSnap.id] = {
            date: d.date || docSnap.id,
            status: d.status,
            note: d.note,
            updatedAt: d.updatedAt,
          };
        });
        setCalendarAvailability(map);
      },
      (err) => {
        console.error('Error reading availability:', err);
      }
    );
    return () => unsub();
  }, []);

  // 4. Listen to Public Promotions (/promotions)
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'promotions'),
      (snap) => {
        const list: PromotionItem[] = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            code: d.code,
            discountType: d.discountType,
            discountValue: d.discountValue,
            description: d.description,
            isPermanent: d.isPermanent,
            expiresAt: d.expiresAt,
            minSpend: d.minSpend,
            isActive: d.isActive,
            createdAt: d.createdAt,
          });
        });
        setPromotions(list);
      },
      (err) => {
        console.error('Error reading promotions:', err);
      }
    );
    return () => unsub();
  }, []);

  // 5. Listen to Public Media Gallery (/mediaGallery)
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'mediaGallery'),
      (snap) => {
        const map: Record<string, MediaItem> = {};
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          map[docSnap.id] = {
            id: docSnap.id,
            title: d.title,
            url: d.url,
            category: d.category,
            caption: d.caption,
            createdAt: d.createdAt,
          };
        });
        setFirestoreMedia(map);
      },
      (err) => {
        console.error('Error reading mediaGallery:', err);
      }
    );
    return () => unsub();
  }, []);

  // Compute merged mediaGallery (Built-in Site Images + Local Overrides + Firestore Media - Deleted IDs)
  const mediaGallery: MediaItem[] = React.useMemo(() => {
    const combinedMap = new Map<string, MediaItem>();
    for (const item of DEFAULT_SITE_MEDIA) {
      combinedMap.set(item.id, item);
    }
    for (const [id, item] of Object.entries(localMediaOverrides)) {
      combinedMap.set(id, item);
    }
    for (const [id, item] of Object.entries(firestoreMedia)) {
      combinedMap.set(id, item);
    }

    const result: MediaItem[] = [];
    for (const [id, item] of combinedMap.entries()) {
      if (deletedMediaIds.includes(id) || item.url === '__DELETED__') {
        continue;
      }
      result.push(item);
    }
    return result;
  }, [localMediaOverrides, firestoreMedia, deletedMediaIds]);

  const getSiteImage = (id: string, fallbackUrl?: string): string | null => {
    if (
      deletedMediaIds.includes(id) ||
      firestoreMedia[id]?.url === '__DELETED__' ||
      localMediaOverrides[id]?.url === '__DELETED__'
    ) {
      return null;
    }
    const found = mediaGallery.find((m) => m.id === id);
    if (found && found.url) return found.url;
    return fallbackUrl || null;
  };

  // 6. Listen to Authenticated Client's Care Profile (/careProfiles/{uid})
  useEffect(() => {
    if (!isAuthReady || !currentUser) {
      setCareProfile(null);
      return;
    }

    const profileRef = doc(db, 'careProfiles', currentUser.uid);
    const unsub = onSnapshot(
      profileRef,
      (snap) => {
        if (snap.exists()) {
          setCareProfile(snap.data() as CareProfile);
        } else {
          setCareProfile(null);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, `careProfiles/${currentUser.uid}`);
      }
    );
    return () => unsub();
  }, [isAuthReady, currentUser]);

  // 7. Listen to Real Bookings (/bookings) and their liveUpdates
  useEffect(() => {
    if (!isAuthReady || !currentUser) {
      setBookings([]);
      setBookingsLoading(false);
      return;
    }

    setBookingsLoading(true);
    const bookingsQuery = isAdminAuthenticated
      ? collection(db, 'bookings')
      : query(collection(db, 'bookings'), where('clientUid', '==', currentUser.uid));

    const unsubBookings = onSnapshot(
      bookingsQuery,
      (snap) => {
        const records: BookingRecord[] = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          records.push({
            id: docSnap.id,
            clientUid: d.clientUid,
            confirmationCode: d.confirmationCode,
            serviceId: d.serviceId,
            serviceTitle: d.serviceTitle,
            clientName: d.clientName,
            clientPhone: d.clientPhone,
            clientEmail: d.clientEmail,
            serviceDate: d.serviceDate,
            startTime: d.startTime,
            hours: d.hours,
            childrenCount: d.childrenCount,
            childrenDetails: d.childrenDetails,
            locationAddress: d.locationAddress,
            specialRequests: d.specialRequests,
            estimatedTotal: d.estimatedTotal,
            requiredDeposit: d.requiredDeposit,
            depositPaid: d.depositPaid,
            finalPaid: d.finalPaid,
            status: d.status,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
            flightDetails:
              d.flightAirline || d.flightNumber || d.flightDeparture || d.flightDestination || d.flightTerminal || d.hotelName
                ? {
                    airline: d.flightAirline || '',
                    flightNumber: d.flightNumber || '',
                    departureCity: d.flightDeparture || '',
                    destinationCity: d.flightDestination || '',
                    terminal: d.flightTerminal || '',
                    hotelName: d.hotelName || '',
                  }
                : undefined,
            liveUpdates: [],
          });
        });

        // Sort newest first
        records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setBookings(records);
        setBookingsLoading(false);
      },
      (err) => {
        setBookingsLoading(false);
        handleFirestoreError(err, OperationType.LIST, 'bookings');
      }
    );

    return () => unsubBookings();
  }, [isAuthReady, currentUser, isAdminAuthenticated]);

  // Auth Helpers
  const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Google Sign-In error:', error);
      return null;
    }
  };

  const registerWithEmail = async (
    fullName: string,
    phone: string,
    email: string,
    password: string
  ): Promise<FirebaseUser> => {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (fullName.trim()) {
      await updateProfile(credential.user, { displayName: fullName.trim() });
    }
    // Automatically initialize the client's CareProfile in Firestore
    const nowIso = new Date().toISOString();
    const initialProfile: CareProfile = {
      userId: credential.user.uid,
      parentName: fullName.trim().slice(0, 150),
      phone: phone.trim().slice(0, 40),
      email: email.trim().slice(0, 150),
      homeAddress: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      pediatricianInfo: '',
      childrenDetails: '',
      allergiesAndMedical: '',
      dailyRoutines: '',
      petCareDetails: '',
      updatedAt: nowIso,
    };
    try {
      await setDoc(doc(db, 'careProfiles', credential.user.uid), initialProfile);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `careProfiles/${credential.user.uid}`);
    }
    return credential.user;
  };

  const signInWithEmail = async (email: string, password: string): Promise<FirebaseUser> => {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return credential.user;
  };

  const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const signOutUser = async (): Promise<void> => {
    await signOut(auth);
    setIsAdminAuthenticated(false);
  };

  // Site Copy, Theme, Pricing Writers
  const saveCombinedSiteConfig = async (
    copy: SiteCopyConfig,
    colors: ThemeColorsConfig,
    rates: PricingRatesConfig
  ) => {
    const path = 'siteConfig/main';
    try {
      await setDoc(doc(db, 'siteConfig', 'main'), {
        ...copy,
        ...colors,
        ...rates,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const updateSiteCopy = async (newCopy: Partial<SiteCopyConfig>) => {
    const updated = { ...siteCopy, ...newCopy };
    setSiteCopy(updated);
    await saveCombinedSiteConfig(updated, themeColors, pricingRates);
  };

  const updateThemeColors = async (newColors: Partial<ThemeColorsConfig>) => {
    const updated = { ...themeColors, ...newColors };
    setThemeColors(updated);
    await saveCombinedSiteConfig(siteCopy, updated, pricingRates);
  };

  const resetThemeColors = async () => {
    setThemeColors(DEFAULT_THEME_COLORS);
    await saveCombinedSiteConfig(siteCopy, DEFAULT_THEME_COLORS, pricingRates);
  };

  const updatePricingRates = async (newRates: Partial<PricingRatesConfig>) => {
    const updated = { ...pricingRates, ...newRates };
    setPricingRates(updated);
    await saveCombinedSiteConfig(siteCopy, themeColors, updated);
  };

  // Availability Writers
  const updateDayAvailability = async (
    dateStr: string,
    status: CalendarDayStatus['status'],
    note?: string
  ) => {
    const path = `availability/${dateStr}`;
    try {
      await setDoc(doc(db, 'availability', dateStr), {
        date: dateStr,
        status,
        note: (note || (status === 'available' ? 'Open for care appointment' : status === 'flight' ? 'Travel Nanny In Transit' : 'Reserved')).slice(0, 300),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  const getAvailabilityForDate = (dateStr: string): CalendarDayStatus => {
    if (calendarAvailability[dateStr]) {
      return calendarAvailability[dateStr];
    }
    return {
      date: dateStr,
      status: 'available',
      note: 'Open for In-Home Care, Travel & Hair Appointments',
    };
  };

  // Care Profile Writer
  const saveCareProfile = async (
    profileData: Omit<CareProfile, 'userId' | 'updatedAt'>
  ) => {
    if (!currentUser) throw new Error('Must be signed in to save your family care profile.');
    const path = `careProfiles/${currentUser.uid}`;
    const payload: CareProfile = {
      userId: currentUser.uid,
      parentName: profileData.parentName.slice(0, 150),
      phone: profileData.phone.slice(0, 40),
      email: profileData.email.slice(0, 150),
      homeAddress: profileData.homeAddress.slice(0, 300),
      emergencyContactName: profileData.emergencyContactName.slice(0, 150),
      emergencyContactPhone: profileData.emergencyContactPhone.slice(0, 40),
      pediatricianInfo: profileData.pediatricianInfo.slice(0, 300),
      childrenDetails: profileData.childrenDetails.slice(0, 1500),
      allergiesAndMedical: profileData.allergiesAndMedical.slice(0, 1500),
      dailyRoutines: profileData.dailyRoutines.slice(0, 1500),
      petCareDetails: profileData.petCareDetails.slice(0, 1000),
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'careProfiles', currentUser.uid), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  // Bookings Writers
  const addBooking = async (
    bookingInput: Omit<
      BookingRecord,
      'id' | 'clientUid' | 'createdAt' | 'status' | 'depositPaid' | 'finalPaid'
    >
  ): Promise<BookingRecord> => {
    let user = currentUser;
    if (!user) {
      user = await signInWithGoogle();
      if (!user) {
        throw new Error('Please sign in with Google to secure your booking in the Client Portal.');
      }
    }

    const bookingId = `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const docPayload: Record<string, unknown> = {
      clientUid: user.uid,
      confirmationCode: bookingInput.confirmationCode.slice(0, 30),
      serviceId: bookingInput.serviceId.slice(0, 100),
      serviceTitle: bookingInput.serviceTitle.slice(0, 200),
      clientName: bookingInput.clientName.slice(0, 150),
      clientPhone: bookingInput.clientPhone.slice(0, 40),
      clientEmail: bookingInput.clientEmail.slice(0, 150),
      serviceDate: bookingInput.serviceDate.slice(0, 30),
      startTime: bookingInput.startTime.slice(0, 40),
      hours: Number(bookingInput.hours),
      childrenCount: Number(bookingInput.childrenCount),
      childrenDetails: (bookingInput.childrenDetails || '').slice(0, 1500),
      locationAddress: bookingInput.locationAddress.slice(0, 400),
      specialRequests: (bookingInput.specialRequests || '').slice(0, 1500),
      estimatedTotal: Number(bookingInput.estimatedTotal),
      requiredDeposit: Number(bookingInput.requiredDeposit),
      depositPaid: false,
      finalPaid: false,
      status: 'confirmed',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    if (bookingInput.flightDetails) {
      if (bookingInput.flightDetails.airline) docPayload.flightAirline = bookingInput.flightDetails.airline.slice(0, 100);
      if (bookingInput.flightDetails.flightNumber) docPayload.flightNumber = bookingInput.flightDetails.flightNumber.slice(0, 50);
      if (bookingInput.flightDetails.departureCity) docPayload.flightDeparture = bookingInput.flightDetails.departureCity.slice(0, 150);
      if (bookingInput.flightDetails.destinationCity) docPayload.flightDestination = bookingInput.flightDetails.destinationCity.slice(0, 150);
      if (bookingInput.flightDetails.terminal) docPayload.flightTerminal = bookingInput.flightDetails.terminal.slice(0, 100);
      if (bookingInput.flightDetails.hotelName) docPayload.hotelName = bookingInput.flightDetails.hotelName.slice(0, 200);
    }

    try {
      await setDoc(doc(db, 'bookings', bookingId), docPayload);

      // Create initial milestone in subcollection
      const updateId = `upd_${Date.now()}`;
      await setDoc(doc(db, 'bookings', bookingId, 'liveUpdates', updateId), {
        bookingId,
        authorUid: user.uid,
        authorName: bookingInput.clientName.slice(0, 120),
        authorRole: 'client',
        message: `Reservation created (${bookingInput.confirmationCode}) for ${bookingInput.serviceDate} at ${bookingInput.startTime}.`,
        type: 'milestone',
        timeLabel: new Date().toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        createdAt: nowIso,
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `bookings/${bookingId}`);
    }

    return {
      ...bookingInput,
      id: bookingId,
      clientUid: user.uid,
      createdAt: nowIso,
      status: 'confirmed',
      depositPaid: false,
      finalPaid: false,
    };
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    const path = `bookings/${id}`;
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status,
        finalPaid: status === 'completed' ? true : false,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const updateBookingFlight = async (
    id: string,
    flightDetails: NonNullable<BookingRecord['flightDetails']>
  ) => {
    const path = `bookings/${id}`;
    try {
      await updateDoc(doc(db, 'bookings', id), {
        flightAirline: (flightDetails.airline || '').slice(0, 100),
        flightNumber: (flightDetails.flightNumber || '').slice(0, 50),
        flightDeparture: (flightDetails.departureCity || '').slice(0, 150),
        flightDestination: (flightDetails.destinationCity || '').slice(0, 150),
        flightTerminal: (flightDetails.terminal || '').slice(0, 100),
        hotelName: (flightDetails.hotelName || '').slice(0, 200),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const updateBookingClientNotes = async (
    id: string,
    updates: {
      locationAddress?: string;
      specialRequests?: string;
      childrenDetails?: string;
      depositPaid?: boolean;
      status?: BookingStatus;
    }
  ) => {
    const path = `bookings/${id}`;
    const payload: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    if (updates.locationAddress !== undefined) payload.locationAddress = updates.locationAddress.slice(0, 400);
    if (updates.specialRequests !== undefined) payload.specialRequests = updates.specialRequests.slice(0, 1500);
    if (updates.childrenDetails !== undefined) payload.childrenDetails = updates.childrenDetails.slice(0, 1500);
    if (updates.depositPaid !== undefined) payload.depositPaid = updates.depositPaid;
    if (updates.status !== undefined) payload.status = updates.status;

    try {
      await updateDoc(doc(db, 'bookings', id), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const addLiveUpdate = async (
    bookingId: string,
    message: string,
    type: 'checkin' | 'photo' | 'flight' | 'milestone' | 'message',
    role?: 'client' | 'nana'
  ) => {
    if (!currentUser) return;
    const updateId = `upd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const path = `bookings/${bookingId}/liveUpdates/${updateId}`;
    const authorRole = role || (isAdminAuthenticated ? 'nana' : 'client');
    const authorName =
      authorRole === 'nana'
        ? "Ken'nyzhae Nathaniel (Passport Nana)"
        : currentUser.displayName || currentUser.email || 'Family Client';

    try {
      await setDoc(doc(db, 'bookings', bookingId, 'liveUpdates', updateId), {
        bookingId,
        authorUid: currentUser.uid,
        authorName: authorName.slice(0, 120),
        authorRole,
        message: message.trim().slice(0, 1000),
        type,
        timeLabel: new Date().toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const deleteBooking = async (id: string) => {
    const path = `bookings/${id}`;
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Promotions Writers
  const addPromotion = async (promo: Omit<PromotionItem, 'id'>) => {
    const promoId = `promo_${Date.now()}`;
    const path = `promotions/${promoId}`;
    const payload: Record<string, unknown> = {
      code: promo.code.trim().toUpperCase().slice(0, 40),
      discountType: promo.discountType,
      discountValue: Number(promo.discountValue),
      description: promo.description.slice(0, 300),
      isPermanent: Boolean(promo.isPermanent),
      minSpend: Number(promo.minSpend || 0),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    if (promo.expiresAt) payload.expiresAt = promo.expiresAt.slice(0, 40);

    try {
      await setDoc(doc(db, 'promotions', promoId), payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const updatePromotion = async (id: string, updated: Partial<PromotionItem>) => {
    const path = `promotions/${id}`;
    try {
      await updateDoc(doc(db, 'promotions', id), updated as Record<string, unknown>);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const deletePromotion = async (id: string) => {
    const path = `promotions/${id}`;
    try {
      await deleteDoc(doc(db, 'promotions', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const applyPromoCode = (
    code: string,
    currentTotal: number
  ): {
    valid: boolean;
    discountAmount: number;
    message: string;
    promo?: PromotionItem;
  } => {
    const cleanCode = code.trim().toUpperCase();
    const promo = promotions.find((p) => p.code === cleanCode && p.isActive);

    if (!promo) {
      return { valid: false, discountAmount: 0, message: 'Promo code not found or inactive.' };
    }

    if (!promo.isPermanent && promo.expiresAt) {
      const exp = new Date(promo.expiresAt);
      if (exp < new Date()) {
        return { valid: false, discountAmount: 0, message: 'This promotion has expired.' };
      }
    }

    if (promo.minSpend && currentTotal < promo.minSpend) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Minimum spend of $${promo.minSpend} required for code ${cleanCode}.`,
      };
    }

    const discount =
      promo.discountType === 'percentage'
        ? Math.round((currentTotal * promo.discountValue) / 100)
        : Math.min(promo.discountValue, currentTotal);

    return {
      valid: true,
      discountAmount: discount,
      message: `${promo.description} applied (-$${discount})`,
      promo,
    };
  };

  // Media Gallery Writers (Add, Replace/Update, Delete, Restore Defaults)
  const saveLocalOverrides = (next: Record<string, MediaItem>) => {
    setLocalMediaOverrides(next);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pn_media_overrides_v1', JSON.stringify(next));
      }
    } catch (e) {
      console.warn('Could not persist media overrides to localStorage:', e);
    }
  };

  const saveDeletedIds = (next: string[]) => {
    setDeletedMediaIds(next);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('pn_deleted_media_ids_v1', JSON.stringify(next));
      }
    } catch (e) {
      console.warn('Could not persist deleted media IDs to localStorage:', e);
    }
  };

  const addMediaItem = async (item: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const mediaId = `media_${Date.now()}`;
    const createdAt = new Date().toISOString().split('T')[0];
    const newItem: MediaItem = {
      id: mediaId,
      title: (item.title || 'Passport Nana Photo').slice(0, 150),
      url: item.url.slice(0, 800000),
      category: item.category,
      caption: (item.caption || '').slice(0, 400),
      createdAt,
    };

    // Update local state immediately
    saveLocalOverrides({ ...localMediaOverrides, [mediaId]: newItem });
    if (deletedMediaIds.includes(mediaId)) {
      saveDeletedIds(deletedMediaIds.filter((d) => d !== mediaId));
    }

    // Sync to Firestore if signed in
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'mediaGallery', mediaId), {
          title: newItem.title,
          url: newItem.url,
          category: newItem.category,
          caption: newItem.caption || '',
          createdAt: newItem.createdAt,
        });
      } catch (err) {
        console.warn('Firestore media write skipped or failed (saved locally):', err);
      }
    }
  };

  const updateMediaItem = async (
    id: string,
    updates: Partial<Omit<MediaItem, 'id' | 'createdAt'>>
  ) => {
    const existing =
      mediaGallery.find((m) => m.id === id) ||
      DEFAULT_SITE_MEDIA.find((m) => m.id === id) || {
        id,
        title: 'Passport Nana Photo',
        url: '',
        category: 'childcare' as const,
        caption: '',
        createdAt: new Date().toISOString().split('T')[0],
      };

    const updatedItem: MediaItem = {
      ...existing,
      title: (updates.title !== undefined ? updates.title : existing.title).slice(0, 150),
      url: (updates.url !== undefined ? updates.url : existing.url).slice(0, 800000),
      category: updates.category !== undefined ? updates.category : existing.category,
      caption: (updates.caption !== undefined ? updates.caption : existing.caption || '').slice(0, 400),
    };

    // Update local overrides & un-mark deleted if applicable
    saveLocalOverrides({ ...localMediaOverrides, [id]: updatedItem });
    if (deletedMediaIds.includes(id)) {
      saveDeletedIds(deletedMediaIds.filter((d) => d !== id));
    }

    // Sync to Firestore if signed in
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'mediaGallery', id), {
          title: updatedItem.title,
          url: updatedItem.url,
          category: updatedItem.category,
          caption: updatedItem.caption || '',
          createdAt: updatedItem.createdAt,
        });
      } catch (err) {
        console.warn('Firestore media update skipped or failed (saved locally):', err);
      }
    }
  };

  const deleteMediaItem = async (id: string) => {
    // Mark as deleted locally
    if (!deletedMediaIds.includes(id)) {
      saveDeletedIds([...deletedMediaIds, id]);
    }
    const nextOverrides = { ...localMediaOverrides };
    delete nextOverrides[id];
    saveLocalOverrides(nextOverrides);

    // Sync deletion to Firestore if signed in
    if (auth.currentUser) {
      const isBuiltInSlot = DEFAULT_SITE_MEDIA.some((m) => m.id === id);
      try {
        if (isBuiltInSlot) {
          await setDoc(doc(db, 'mediaGallery', id), {
            title: 'Removed Image Slot',
            url: '__DELETED__',
            category: 'branding',
            caption: '',
            createdAt: new Date().toISOString().split('T')[0],
          });
        } else {
          await deleteDoc(doc(db, 'mediaGallery', id));
        }
      } catch (err) {
        console.warn('Firestore media delete skipped or failed (saved locally):', err);
      }
    }
  };

  const restoreDefaultMedia = async () => {
    saveDeletedIds([]);
    const customOnly: Record<string, MediaItem> = {};
    for (const [key, val] of Object.entries(localMediaOverrides)) {
      if (!DEFAULT_SITE_MEDIA.some((m) => m.id === key)) {
        customOnly[key] = val;
      }
    }
    saveLocalOverrides(customOnly);

    if (auth.currentUser) {
      for (const builtIn of DEFAULT_SITE_MEDIA) {
        if (firestoreMedia[builtIn.id]) {
          try {
            await deleteDoc(doc(db, 'mediaGallery', builtIn.id));
          } catch {
            // ignore
          }
        }
      }
    }
  };

  // Admin Login with multi-method support (PIN, Email/Password, and Google)
  const adminLogin = async (
    pin: string,
    email?: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanPin = pin.trim();
    const savedCustomPin =
      typeof window !== 'undefined' ? localStorage.getItem('pn_owner_pin') : null;
    const isValidPin = cleanPin === 'nana2026' || (savedCustomPin && cleanPin === savedCustomPin);
    if (!isValidPin) {
      return {
        success: false,
        error: `Incorrect Owner Security PIN. Please enter "${savedCustomPin || 'nana2026'}".`,
      };
    }

    let user = currentUser;

    // If an email and password were provided, attempt sign in or auto-registration
    if (!user && email && password) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        user = cred.user;
      } catch (signInErr: unknown) {
        const firebaseErr = signInErr as { code?: string; message?: string };
        if (
          firebaseErr?.code === 'auth/user-not-found' ||
          firebaseErr?.code === 'auth/invalid-credential' ||
          firebaseErr?.code === 'auth/invalid-login-credentials'
        ) {
          // Attempt auto-registration for the owner with the provided password
          try {
            const regCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
            user = regCred.user;
            await updateProfile(user, { displayName: "Ken'nyzhae Nathaniel (Owner)" });
          } catch (regErr: unknown) {
            const rErr = regErr as { code?: string; message?: string };
            return {
              success: false,
              error: `Email setup failed: ${rErr.message || 'Check password length (min 6 chars).'}. Note: Email/Password must be enabled in Firebase Console.`,
            };
          }
        } else {
          return {
            success: false,
            error: `Email sign-in failed: ${firebaseErr.message || 'Check email and password.'}`,
          };
        }
      }
    }

    // If still no user and no email provided, try Google popup
    if (!user && !email) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        user = result.user;
      } catch (gErr: unknown) {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
        const firebaseErr = gErr as { code?: string; message?: string };
        console.warn('Google Sign-In error on domain:', hostname, firebaseErr?.code);
        // If master PIN is valid, allow the owner to unlock the dashboard session immediately
        setIsAdminAuthenticated(true);
        return { success: true };
      }
    }

    // If PIN was verified and user exists, register admin doc in Firestore
    if (user) {
      try {
        await setDoc(doc(db, 'admins', user.uid), {
          uid: user.uid,
          email: (user.email || 'info@fixmyiron.com').slice(0, 150),
          role: 'owner',
          pinPasscode: 'nana2026',
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Could not write admin record to Firestore:', err);
      }
    }

    setIsAdminAuthenticated(true);
    return { success: true };
  };

  const adminLogout = async () => {
    setIsAdminAuthenticated(false);
  };

  return (
    <BusinessContext.Provider
      value={{
        currentUser,
        isAuthReady,
        signInWithGoogle,
        registerWithEmail,
        signInWithEmail,
        resetPassword,
        signOutUser,
        siteCopy,
        updateSiteCopy,
        themeColors,
        updateThemeColors,
        resetThemeColors,
        calendarAvailability,
        updateDayAvailability,
        getAvailabilityForDate,
        careProfile,
        saveCareProfile,
        bookings,
        bookingsLoading,
        addBooking,
        updateBookingStatus,
        updateBookingFlight,
        updateBookingClientNotes,
        addLiveUpdate,
        deleteBooking,
        promotions,
        addPromotion,
        updatePromotion,
        deletePromotion,
        applyPromoCode,
        mediaGallery,
        addMediaItem,
        updateMediaItem,
        deleteMediaItem,
        restoreDefaultMedia,
        getSiteImage,
        pricingRates,
        updatePricingRates,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = (): BusinessContextType => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
