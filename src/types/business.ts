export type AvailabilityStatus = 'available' | 'limited' | 'flight' | 'booked';

export interface CalendarDayStatus {
  date: string; // YYYY-MM-DD
  status: AvailabilityStatus;
  note?: string;
  updatedAt?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface LiveUpdateRecord {
  id: string;
  bookingId: string;
  authorUid: string;
  authorName: string;
  authorRole: 'client' | 'nana';
  message: string;
  type: 'checkin' | 'photo' | 'flight' | 'milestone' | 'message';
  timeLabel: string;
  createdAt: string;
}

export interface BookingRecord {
  id: string;
  clientUid: string;
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
  updatedAt?: string;
  flightDetails?: {
    airline?: string;
    flightNumber?: string;
    departureCity?: string;
    destinationCity?: string;
    terminal?: string;
    hotelName?: string;
  };
  liveUpdates?: LiveUpdateRecord[];
}

export interface CareProfile {
  userId: string;
  parentName: string;
  phone: string;
  email: string;
  homeAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  pediatricianInfo: string;
  childrenDetails: string;
  allergiesAndMedical: string;
  dailyRoutines: string;
  petCareDetails: string;
  updatedAt: string;
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
  isActive: boolean;
  createdAt?: string;
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
