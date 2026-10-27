export type AvailabilityStatus = 'available' | 'limited' | 'flight' | 'booked';

export interface CalendarDayStatus {
  date: string; // YYYY-MM-DD
  status: AvailabilityStatus;
  note?: string;
  timeSlots?: string[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface BookingRecord {
  id: string;
  confirmationCode: string;
  serviceId: string;
  serviceTitle: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceDate: string;
  startTime: string;
  hours: number;
  childrenCount: number;
  childrenDetails?: string;
  locationAddress: string;
  specialRequests?: string;
  estimatedTotal: number;
  requiredDeposit: number;
  depositPaid: boolean;
  finalPaid: boolean;
  status: BookingStatus;
  createdAt: string;
  flightDetails?: {
    airline?: string;
    flightNumber?: string;
    departureCity?: string;
    destinationCity?: string;
    terminal?: string;
    hotelName?: string;
  };
  liveUpdates?: {
    id: string;
    time: string;
    message: string;
    type: 'checkin' | 'photo' | 'flight' | 'milestone';
  }[];
}

export interface PromotionItem {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  description: string;
  isPermanent: boolean;
  expiresAt?: string;
  minSpend?: number;
  applicableServices?: string[]; // empty means all
  isActive: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  category: 'childcare' | 'passport_travel' | 'hair_locs' | 'adventures' | 'branding';
  caption?: string;
  createdAt: string;
}

export interface SiteCopyConfig {
  heroTagline: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutHeadline: string;
  aboutBio: string;
  founderName: string;
  businessPhone: string;
  businessEmail: string;
  emergencyLine: string;
  serviceHubs: string;
  announcementBanner: string;
  showAnnouncement: boolean;
}

export interface ThemeColorsConfig {
  darkBg: string;
  darkCard: string;
  darkAccentGold: string;
  darkText: string;
  lightBg: string;
  lightCard: string;
  lightAccentGold: string;
  lightText: string;
}

export interface PricingRatesConfig {
  nannyHourly: number;
  passportTravelHourly: number;
  schoolPickupRate: number;
  adventureDayHourly: number;
  petNannyHourly: number;
  braidsBase: number;
  locRetwistBase: number;
  additionalChildRate: number;
  standardMinHours: number;
}
