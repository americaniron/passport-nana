import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BookingRecord,
  BookingStatus,
  CalendarDayStatus,
  MediaItem,
  PricingRatesConfig,
  PromotionItem,
  SiteCopyConfig,
  ThemeColorsConfig,
} from '../types/business.ts';

interface BusinessContextType {
  // Site Copy
  siteCopy: SiteCopyConfig;
  updateSiteCopy: (newCopy: Partial<SiteCopyConfig>) => void;

  // Theme Colors
  themeColors: ThemeColorsConfig;
  updateThemeColors: (newColors: Partial<ThemeColorsConfig>) => void;
  resetThemeColors: () => void;

  // Owner Availability Calendar
  calendarAvailability: Record<string, CalendarDayStatus>;
  updateDayAvailability: (dateStr: string, status: CalendarDayStatus['status'], note?: string) => void;
  getAvailabilityForDate: (dateStr: string) => CalendarDayStatus;

  // Bookings
  bookings: BookingRecord[];
  addBooking: (booking: Omit<BookingRecord, 'id' | 'createdAt' | 'status' | 'depositPaid' | 'finalPaid'>) => BookingRecord;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  updateBookingFlight: (id: string, flightDetails: BookingRecord['flightDetails']) => void;
  addLiveUpdate: (bookingId: string, message: string, type: 'checkin' | 'photo' | 'flight' | 'milestone') => void;
  deleteBooking: (id: string) => void;

  // Promotions
  promotions: PromotionItem[];
  addPromotion: (promo: Omit<PromotionItem, 'id'>) => void;
  updatePromotion: (id: string, promo: Partial<PromotionItem>) => void;
  deletePromotion: (id: string) => void;
  applyPromoCode: (code: string, currentTotal: number) => { valid: boolean; discountAmount: number; message: string; promo?: PromotionItem };

  // Media Gallery
  mediaGallery: MediaItem[];
  addMediaItem: (item: Omit<MediaItem, 'id' | 'createdAt'>) => void;
  deleteMediaItem: (id: string) => void;

  // Pricing
  pricingRates: PricingRatesConfig;
  updatePricingRates: (newRates: Partial<PricingRatesConfig>) => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  adminLogin: (pin: string) => boolean;
  adminLogout: () => void;
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
  announcementBanner: '✈️ Now Accepting Summer & Holiday Travel Bookings! 24/7 On-Call Available.',
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

const DEFAULT_PROMOTIONS: PromotionItem[] = [
  {
    id: 'promo-1',
    code: 'PASSPORT50',
    discountType: 'fixed',
    discountValue: 50,
    description: '$50 Off Any Travel Nanny Flight Accompaniment',
    isPermanent: true,
    minSpend: 250,
    isActive: true,
  },
  {
    id: 'promo-2',
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    description: '20% Off Your First Childcare Booking',
    isPermanent: true,
    minSpend: 100,
    isActive: true,
  },
  {
    id: 'promo-3',
    code: 'MEETFREE',
    discountType: 'percentage',
    discountValue: 100,
    description: '100% Free Virtual or In-Person Meet-N-Greet',
    isPermanent: true,
    isActive: true,
  },
  {
    id: 'promo-4',
    code: 'HOLIDAYVIP',
    discountType: 'fixed',
    discountValue: 75,
    description: '$75 Off Multi-Day Adventure & Overnight Packages',
    isPermanent: false,
    expiresAt: '2026-12-31',
    minSpend: 300,
    isActive: true,
  },
];

const DEFAULT_MEDIA_GALLERY: MediaItem[] = [
  {
    id: 'media-1',
    title: 'Passport Nanny On-Call Care',
    url: '/assets/aistudio/Screenshot_2026-10-26_at_11.51.47_PM_dc5d1ced.png',
    category: 'passport_travel',
    caption: 'Luxury travel childcare and 24/7 peaceful on-call service.',
    createdAt: '2026-10-26',
  },
  {
    id: 'media-2',
    title: 'Ken’nyzhae & IncrediBeingz Joy',
    url: '/assets/aistudio/T47GYQIQZI3O77PQ3A5YN3ML_e5f6454f.webp',
    category: 'childcare',
    caption: 'Safe, attentive, educational childcare experiences.',
    createdAt: '2026-10-25',
  },
  {
    id: 'media-3',
    title: 'Adventure Day Park Exploration',
    url: '/assets/aistudio/p3.png',
    category: 'adventures',
    caption: 'Making memories, one sunny outdoor adventure at a time.',
    createdAt: '2026-10-24',
  },
  {
    id: 'media-4',
    title: 'Neat & Clean Travel-Ready Braids',
    url: '/assets/aistudio/p2.png',
    category: 'hair_locs',
    caption: 'Gentle protective braiding and scalp nourishment for kids & adults.',
    createdAt: '2026-10-23',
  },
];

// Pre-seeded realistic bookings for client portal & admin testing
const DEFAULT_BOOKINGS: BookingRecord[] = [
  {
    id: 'bkg-101',
    confirmationCode: 'PN-PARIS9',
    serviceId: 'passport-travel-nanny',
    serviceTitle: 'Passport Nanny (Travel Childcare)',
    clientName: 'The Jenkins Family (Sarah & Marcus)',
    clientPhone: '305-555-0199',
    clientEmail: 'sarah.jenkins@gmail.com',
    serviceDate: '2026-11-04',
    startTime: '07:30 AM',
    hours: 14,
    childrenCount: 2,
    childrenDetails: 'Leo (Age 4, peanut allergy - EpiPen in carry-on) & Maya (Age 7, loves drawing).',
    locationAddress: 'Miami International Airport (MIA) -> Paris Charles de Gaulle (CDG)',
    specialRequests: 'Need accompaniment through TSA, in-flight sensory play, and hotel bedtime settling in Paris.',
    estimatedTotal: 560,
    requiredDeposit: 140,
    depositPaid: true,
    finalPaid: false,
    status: 'confirmed',
    createdAt: '2026-10-26T14:30:00Z',
    flightDetails: {
      airline: 'Air France',
      flightNumber: 'AF095',
      departureCity: 'Miami (MIA)',
      destinationCity: 'Paris (CDG)',
      terminal: 'Terminal J, Gate 14',
      hotelName: 'The Westin Paris - Vendôme',
    },
    liveUpdates: [
      {
        id: 'u1',
        time: 'Oct 26, 3:00 PM',
        message: 'Flight itinerary confirmed with Nana Ken’nyzhae. Carry-on sensory kits prepped!',
        type: 'checkin',
      },
      {
        id: 'u2',
        time: 'Oct 26, 4:15 PM',
        message: 'Pre-flight meet & allergy checklist completed with Marcus.',
        type: 'milestone',
      },
    ],
  },
  {
    id: 'bkg-102',
    confirmationCode: 'PN-KID882',
    serviceId: 'nanny-services',
    serviceTitle: 'Nanny Services (Weekend Overnight)',
    clientName: 'The Carter Family (Elena)',
    clientPhone: '305-555-0144',
    clientEmail: 'elena.carter@outlook.com',
    serviceDate: '2026-10-31',
    startTime: '04:00 PM',
    hours: 8,
    childrenCount: 1,
    childrenDetails: 'Noah (Age 5, loves dinosaur bedtime stories).',
    locationAddress: 'Brickell Bay Drive, Miami FL',
    specialRequests: 'Halloween costume supervision and healthy dinner prep.',
    estimatedTotal: 240,
    requiredDeposit: 60,
    depositPaid: true,
    finalPaid: true,
    status: 'in_progress',
    createdAt: '2026-10-25T11:00:00Z',
    liveUpdates: [
      {
        id: 'u3',
        time: 'Today, 4:00 PM',
        message: 'Nana arrived safely! Noah is excited for reading and puzzles.',
        type: 'checkin',
      },
      {
        id: 'u4',
        time: 'Today, 5:30 PM',
        message: 'Healthy dinner eaten happily. Preparing dinosaur craft activity!',
        type: 'milestone',
      },
    ],
  },
  {
    id: 'bkg-103',
    confirmationCode: 'PN-BRAID3',
    serviceId: 'kids-freestyle-braids',
    serviceTitle: 'Kids Freestyle Braids with Beads',
    clientName: 'The Davis Family (Tanya)',
    clientPhone: '305-555-0182',
    clientEmail: 'tanya.davis@yahoo.com',
    serviceDate: '2026-11-08',
    startTime: '10:00 AM',
    hours: 3,
    childrenCount: 1,
    childrenDetails: 'Zuri (Age 8, gentle scalp).',
    locationAddress: 'Family Residence, Fort Lauderdale FL',
    specialRequests: 'Gold and pastel beads requested for travel vacation style.',
    estimatedTotal: 100,
    requiredDeposit: 25,
    depositPaid: true,
    finalPaid: false,
    status: 'confirmed',
    createdAt: '2026-10-24T09:15:00Z',
  },
];

// Helper to seed calendar days
function generateInitialCalendar(): Record<string, CalendarDayStatus> {
  const result: Record<string, CalendarDayStatus> = {};
  const today = new Date();

  // Populate 60 days from today
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();

    // Default distribution:
    // Tuesdays & Thursdays: Travel Flights or Limited
    // Sundays/Mondays/Wednesdays/Fridays/Saturdays: Available
    if (i === 1 || i === 2) {
      result[dateStr] = {
        date: dateStr,
        status: 'available',
        note: 'Full 24/7 On-Call & Babysitting Open',
      };
    } else if (i >= 8 && i <= 10) {
      result[dateStr] = {
        date: dateStr,
        status: 'flight',
        note: 'Passport Nanny Flight: MIA -> Paris (Jenkins Family)',
      };
    } else if (i === 5 || i === 14 || i === 21) {
      result[dateStr] = {
        date: dateStr,
        status: 'limited',
        note: 'Morning slots open; afternoon booked for school pickup',
      };
    } else if (i === 18) {
      result[dateStr] = {
        date: dateStr,
        status: 'booked',
        note: 'Private All-Day Family Event',
      };
    } else {
      result[dateStr] = {
        date: dateStr,
        status: 'available',
        note: 'Open for In-Home Care, Hair Appointments & Travel',
      };
    }
  }

  return result;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Site Copy
  const [siteCopy, setSiteCopy] = useState<SiteCopyConfig>(() => {
    try {
      const saved = localStorage.getItem('passport_nana_copy');
      return saved ? JSON.parse(saved) : DEFAULT_SITE_COPY;
    } catch {
      return DEFAULT_SITE_COPY;
    }
  });

  // Theme Colors
  const [themeColors, setThemeColors] = useState<ThemeColorsConfig>(() => {
    try {
      const saved = localStorage.getItem('passport_nana_theme_colors');
      return saved ? JSON.parse(saved) : DEFAULT_THEME_COLORS;
    } catch {
      return DEFAULT_THEME_COLORS;
    }
  });

  // Calendar
  const [calendarAvailability, setCalendarAvailability] = useState<Record<string, CalendarDayStatus>>(() => {
    try {
      const saved = localStorage.getItem('passport_nana_calendar');
      return saved ? JSON.parse(saved) : generateInitialCalendar();
    } catch {
      return generateInitialCalendar();
    }
  });

  // Bookings
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('passport_nana_bookings');
      return saved ? JSON.parse(saved) : DEFAULT_BOOKINGS;
    } catch {
      return DEFAULT_BOOKINGS;
    }
  });

  // Promotions
  const [promotions, setPromotions] = useState<PromotionItem[]>(() => {
    try {
      const saved = localStorage.getItem('passport_nana_promotions');
      return saved ? JSON.parse(saved) : DEFAULT_PROMOTIONS;
    } catch {
      return DEFAULT_PROMOTIONS;
    }
  });

  // Media
  const [mediaGallery, setMediaGallery] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('passport_nana_media');
      return saved ? JSON.parse(saved) : DEFAULT_MEDIA_GALLERY;
    } catch {
      return DEFAULT_MEDIA_GALLERY;
    }
  });

  // Pricing
  const [pricingRates, setPricingRates] = useState<PricingRatesConfig>(() => {
    try {
      const saved = localStorage.getItem('passport_nana_pricing');
      return saved ? JSON.parse(saved) : DEFAULT_PRICING_RATES;
    } catch {
      return DEFAULT_PRICING_RATES;
    }
  });

  // Admin Auth
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('passport_nana_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Synchronize to localStorage
  useEffect(() => {
    localStorage.setItem('passport_nana_copy', JSON.stringify(siteCopy));
  }, [siteCopy]);

  useEffect(() => {
    localStorage.setItem('passport_nana_theme_colors', JSON.stringify(themeColors));
    // Apply dynamic CSS variables to document root for real-time live theme updating
    const root = document.documentElement;
    root.style.setProperty('--pn-dark-bg', themeColors.darkBg);
    root.style.setProperty('--pn-dark-card', themeColors.darkCard);
    root.style.setProperty('--pn-dark-gold', themeColors.darkAccentGold);
    root.style.setProperty('--pn-light-bg', themeColors.lightBg);
    root.style.setProperty('--pn-light-card', themeColors.lightCard);
    root.style.setProperty('--pn-light-gold', themeColors.lightAccentGold);
  }, [themeColors]);

  useEffect(() => {
    localStorage.setItem('passport_nana_calendar', JSON.stringify(calendarAvailability));
  }, [calendarAvailability]);

  useEffect(() => {
    localStorage.setItem('passport_nana_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('passport_nana_promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('passport_nana_media', JSON.stringify(mediaGallery));
  }, [mediaGallery]);

  useEffect(() => {
    localStorage.setItem('passport_nana_pricing', JSON.stringify(pricingRates));
  }, [pricingRates]);

  const updateSiteCopy = (newCopy: Partial<SiteCopyConfig>) => {
    setSiteCopy((prev) => ({ ...prev, ...newCopy }));
  };

  const updateThemeColors = (newColors: Partial<ThemeColorsConfig>) => {
    setThemeColors((prev) => ({ ...prev, ...newColors }));
  };

  const resetThemeColors = () => {
    setThemeColors(DEFAULT_THEME_COLORS);
  };

  const updateDayAvailability = (dateStr: string, status: CalendarDayStatus['status'], note?: string) => {
    setCalendarAvailability((prev) => ({
      ...prev,
      [dateStr]: {
        date: dateStr,
        status,
        note: note || (status === 'available' ? 'Open for booking' : status === 'flight' ? 'Travel Nanny In Transit' : 'Reserved'),
      },
    }));
  };

  const getAvailabilityForDate = (dateStr: string): CalendarDayStatus => {
    if (calendarAvailability[dateStr]) {
      return calendarAvailability[dateStr];
    }
    return {
      date: dateStr,
      status: 'available',
      note: 'Available for care appointment',
    };
  };

  const addBooking = (
    bookingInput: Omit<BookingRecord, 'id' | 'createdAt' | 'status' | 'depositPaid' | 'finalPaid'>
  ): BookingRecord => {
    const newRecord: BookingRecord = {
      ...bookingInput,
      id: `pn-bkg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      depositPaid: true,
      finalPaid: false,
      liveUpdates: [
        {
          id: `upd-${Date.now()}`,
          time: 'Just Now',
          message: `Booking received & confirmed with Passport Nana! Reference: ${bookingInput.confirmationCode}`,
          type: 'milestone',
        },
      ],
    };

    setBookings((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status, finalPaid: status === 'completed' ? true : b.finalPaid } : b))
    );
  };

  const updateBookingFlight = (id: string, flightDetails: BookingRecord['flightDetails']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, flightDetails: { ...b.flightDetails, ...flightDetails } } : b))
    );
  };

  const addLiveUpdate = (
    bookingId: string,
    message: string,
    type: 'checkin' | 'photo' | 'flight' | 'milestone'
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const updates = b.liveUpdates || [];
        return {
          ...b,
          liveUpdates: [
            ...updates,
            {
              id: `live-${Date.now()}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              message,
              type,
            },
          ],
        };
      })
    );
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const addPromotion = (promo: Omit<PromotionItem, 'id'>) => {
    const newPromo: PromotionItem = {
      ...promo,
      id: `promo-${Date.now()}`,
      code: promo.code.trim().toUpperCase(),
    };
    setPromotions((prev) => [newPromo, ...prev]);
  };

  const updatePromotion = (id: string, updated: Partial<PromotionItem>) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated, code: (updated.code || p.code).toUpperCase() } : p))
    );
  };

  const deletePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  const applyPromoCode = (
    code: string,
    currentTotal: number
  ): { valid: boolean; discountAmount: number; message: string; promo?: PromotionItem } => {
    const cleanCode = code.trim().toUpperCase();
    const promo = promotions.find((p) => p.code === cleanCode && p.isActive);

    if (!promo) {
      return { valid: false, discountAmount: 0, message: 'Invalid or inactive promo code.' };
    }

    if (promo.expiresAt) {
      const exp = new Date(promo.expiresAt);
      if (exp < new Date()) {
        return { valid: false, discountAmount: 0, message: 'This promo code has expired.' };
      }
    }

    if (promo.minSpend && currentTotal < promo.minSpend) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Minimum spend of $${promo.minSpend} required for code ${cleanCode}.`,
      };
    }

    let discount = 0;
    if (promo.discountType === 'percentage') {
      discount = Math.round((currentTotal * promo.discountValue) / 100);
    } else {
      discount = Math.min(promo.discountValue, currentTotal);
    }

    return {
      valid: true,
      discountAmount: discount,
      message: `Success! ${promo.description} applied (-$${discount})`,
      promo,
    };
  };

  const addMediaItem = (item: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const newItem: MediaItem = {
      ...item,
      id: `media-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMediaGallery((prev) => [newItem, ...prev]);
  };

  const deleteMediaItem = (id: string) => {
    setMediaGallery((prev) => prev.filter((m) => m.id !== id));
  };

  const updatePricingRates = (newRates: Partial<PricingRatesConfig>) => {
    setPricingRates((prev) => ({ ...prev, ...newRates }));
  };

  const adminLogin = (pin: string): boolean => {
    // Default PIN: 'nana2026' or '2026'
    if (pin.trim() === 'nana2026' || pin.trim() === '2026' || pin.trim().toLowerCase() === 'admin') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('passport_nana_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('passport_nana_admin_auth');
  };

  return (
    <BusinessContext.Provider
      value={{
        siteCopy,
        updateSiteCopy,
        themeColors,
        updateThemeColors,
        resetThemeColors,
        calendarAvailability,
        updateDayAvailability,
        getAvailabilityForDate,
        bookings,
        addBooking,
        updateBookingStatus,
        updateBookingFlight,
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
