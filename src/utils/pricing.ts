/**
 * Pure business logic for Passport Nana pricing, deposits, and validations.
 */

export interface PricingInput {
  basePrice: number;
  priceType: 'hourly' | 'flat' | 'deposit' | 'free';
  hours?: number;
  minHours?: number;
  childrenCount?: number;
  additionalChildRate?: number;
}

export interface PricingResult {
  total: number;
  deposit: number;
  effectiveHours: number;
  ratePerHour: number;
  breakdown: {
    baseRate: number;
    extraChildFeePerHour: number;
    hoursCharged: number;
  };
}

export function calculateServicePrice(input: PricingInput): PricingResult {
  const {
    basePrice,
    priceType,
    hours = 4,
    minHours = 0,
    childrenCount = 1,
    additionalChildRate = 0,
  } = input;

  if (priceType === 'free') {
    return {
      total: 0,
      deposit: 0,
      effectiveHours: hours,
      ratePerHour: 0,
      breakdown: {
        baseRate: 0,
        extraChildFeePerHour: 0,
        hoursCharged: 0,
      },
    };
  }

  if (priceType === 'deposit') {
    return {
      total: basePrice,
      deposit: basePrice,
      effectiveHours: hours,
      ratePerHour: basePrice,
      breakdown: {
        baseRate: basePrice,
        extraChildFeePerHour: 0,
        hoursCharged: 1,
      },
    };
  }

  if (priceType === 'flat') {
    // For flat rate services like Freestyle Braids ($100) or Hair Retwist ($50 starting)
    const deposit = Math.min(25, basePrice);
    return {
      total: basePrice,
      deposit,
      effectiveHours: hours,
      ratePerHour: basePrice,
      breakdown: {
        baseRate: basePrice,
        extraChildFeePerHour: 0,
        hoursCharged: 1,
      },
    };
  }

  // Hourly calculation (Nanny, Babysitter, Adventure Day, etc.)
  const effectiveHours = Math.max(hours, minHours);
  const extraChildren = Math.max(0, childrenCount - 1);
  const extraFeePerHour = extraChildren * additionalChildRate;
  const ratePerHour = basePrice + extraFeePerHour;
  const total = ratePerHour * effectiveHours;
  // Standard deposit is 25% to secure on-call time slot, minimum $25
  const deposit = Math.max(25, Math.round(total * 0.25));

  return {
    total,
    deposit,
    effectiveHours,
    ratePerHour,
    breakdown: {
      baseRate: basePrice,
      extraChildFeePerHour: extraFeePerHour,
      hoursCharged: effectiveHours,
    },
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function generateBookingReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'PN-';
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export function validateBookingForm(data: {
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  serviceDate?: string;
  startTime?: string;
  hours?: number;
  minHours?: number;
  childrenCount?: number;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.clientName || data.clientName.trim().length < 2) {
    errors.clientName = 'Please enter your full name.';
  }

  const phoneDigits = (data.clientPhone || '').replace(/\D/g, '');
  if (!data.clientPhone || phoneDigits.length < 10) {
    errors.clientPhone = 'Please enter a valid 10-digit phone number.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.clientEmail || !emailRegex.test(data.clientEmail)) {
    errors.clientEmail = 'Please provide a valid email address.';
  }

  if (!data.serviceDate) {
    errors.serviceDate = 'Please select a service date.';
  }

  if (!data.startTime) {
    errors.startTime = 'Please select a preferred start time.';
  }

  if (data.hours !== undefined && data.minHours !== undefined && data.hours < data.minHours) {
    errors.hours = `This service requires a minimum of ${data.minHours} hours.`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
