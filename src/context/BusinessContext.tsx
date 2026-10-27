import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
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

  // Media Gallery
  mediaGallery: MediaItem[];
  addMediaItem: (item: Omit<MediaItem, 'id' | 'createdAt'>) => Promise<void>;
  deleteMediaItem: (id: string) => Promise<void>;

  // Pricing
  pricingRates: PricingRatesConfig;
  updatePricingRates: (newRates: Partial<PricingRatesConfig>) => Promise<void>;

  // Admin Auth
  isAdminAuthenticated: boolean;
  adminLogin: (pin: string) => Promise<boolean>;
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
  const [mediaGallery, setMediaGallery] = useState<MediaItem[]>([]);
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
        if (user.email === 'info@fixmyiron.com' && user.emailVerified) {
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
        const list: MediaItem[] = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            title: d.title,
            url: d.url,
            category: d.category,
            caption: d.caption,
            createdAt: d.createdAt,
          });
        });
        setMediaGallery(list);
      },
      (err) => {
        console.error('Error reading mediaGallery:', err);
      }
    );
    return () => unsub();
  }, []);

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

  // Media Gallery Writers
  const addMediaItem = async (item: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const mediaId = `media_${Date.now()}`;
    const path = `mediaGallery/${mediaId}`;
    try {
      await setDoc(doc(db, 'mediaGallery', mediaId), {
        title: item.title.slice(0, 150),
        url: item.url.slice(0, 800000),
        category: item.category,
        caption: (item.caption || '').slice(0, 400),
        createdAt: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const deleteMediaItem = async (id: string) => {
    const path = `mediaGallery/${id}`;
    try {
      await deleteDoc(doc(db, 'mediaGallery', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // Admin Login
  const adminLogin = async (pin: string): Promise<boolean> => {
    let user = currentUser;
    if (!user) {
      user = await signInWithGoogle();
      if (!user) return false;
    }

    if (user.email === 'info@fixmyiron.com' && user.emailVerified) {
      setIsAdminAuthenticated(true);
      return true;
    }

    if (pin.trim() === 'nana2026') {
      try {
        await setDoc(doc(db, 'admins', user.uid), {
          uid: user.uid,
          email: (user.email || '').slice(0, 150),
          role: 'owner',
          pinPasscode: 'nana2026',
          createdAt: new Date().toISOString(),
        });
        setIsAdminAuthenticated(true);
        return true;
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `admins/${user.uid}`);
      }
    }

    return false;
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
        deleteMediaItem,
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
