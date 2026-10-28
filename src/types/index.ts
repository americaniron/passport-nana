export type ServiceCategory =
  | 'all'
  | 'nanny'
  | 'babysitting'
  | 'passport'
  | 'hair'
  | 'pet'
  | 'adventure';

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ServiceCategory;
  priceType: 'hourly' | 'flat' | 'deposit' | 'free';
  basePrice: number;
  additionalChildRate?: number;
  minHours?: number;
  defaultDurationHours?: number;
  durationLabel: string;
  image: string;
  badge?: string;
  popular?: boolean;
  shortDesc: string;
  fullDesc: string;
  keyResponsibilities: string[];
  inclusions: string[];
  isHair?: boolean;
  isPassport?: boolean;
}

export interface BookingRequest {
  id?: string;
  serviceId: string;
  serviceTitle: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceDate: string;
  startTime: string;
  hours: number;
  childrenCount: number;
  childrenDetails: string;
  locationAddress: string;
  specialRequests?: string;
  hairLengthCondition?: string;
  estimatedTotal: number;
  requiredDeposit: number;
  status: 'confirmed' | 'pending';
  createdAt: string;
  confirmationCode: string;
}

export interface GroundedPlace {
  title: string;
  uri?: string;
  address?: string;
  description?: string;
  category?: string;
  rating?: number;
  reviewsCount?: number;
  image?: string;
  badge?: string;
  priceLevel?: string;
  openStatus?: string;
  kidHighlight?: string;
  parentTip?: string;
  coordinates?: { lat: number; lng: number };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: GroundedPlace[];
  quickActions?: { label: string; action: string }[];
}

export interface HairConsultationData {
  hairType: string;
  locStage: string;
  scalpCondition: string;
  desiredService: string;
  notes: string;
}
