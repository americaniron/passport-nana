import React, { useState, useEffect } from 'react';
import { SERVICES } from '../data/services.ts';
import { BookingRequest } from '../types/index.ts';
import {
  calculateServicePrice,
  formatCurrency,
  generateBookingReference,
  validateBookingForm,
} from '../utils/pricing.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { useBusiness } from '../context/BusinessContext.tsx';
import { OwnerAvailabilityCalendar } from './OwnerAvailabilityCalendar.tsx';
import { PassportNanaLogo } from './PassportNanaLogo.tsx';
import {
  X,
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Download,
  AlertCircle,
  FileText,
  Sparkles,
  Heart,
  Tag,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialHours?: number;
  initialChildrenCount?: number;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  initialHours,
  initialChildrenCount,
}) => {
  const { isDark } = useTheme();
  const {
    currentUser,
    careProfile,
    siteCopy,
    addBooking,
    applyPromoCode,
    getAvailabilityForDate,
    registerWithEmail,
    signInWithEmail,
  } = useBusiness();

  const [serviceId, setServiceId] = useState<string>(initialServiceId || 'nanny-services');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [accountPassword, setAccountPassword] = useState<string>('');
  const [isExistingAccount, setIsExistingAccount] = useState<boolean>(false);
  const [serviceDate, setServiceDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('09:00 AM');
  const [hours, setHours] = useState<number>(initialHours || 4);
  const [childrenCount, setChildrenCount] = useState<number>(initialChildrenCount || 1);
  const [childrenDetails, setChildrenDetails] = useState<string>('');
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRequest | null>(null);

  // Calendar visibility toggle
  const [showCalendar, setShowCalendar] = useState<boolean>(true);

  // Promo code support
  const [promoInput, setPromoInput] = useState<string>('');
  const [promoMessage, setPromoMessage] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>('');

  useEffect(() => {
    if (initialServiceId) setServiceId(initialServiceId);
    if (initialHours) setHours(initialHours);
    if (initialChildrenCount) setChildrenCount(initialChildrenCount);
  }, [initialServiceId, initialHours, initialChildrenCount]);

  useEffect(() => {
    if (careProfile) {
      if (!clientName && careProfile.parentName) setClientName(careProfile.parentName);
      if (!clientPhone && careProfile.phone) setClientPhone(careProfile.phone);
      if (!clientEmail && careProfile.email) setClientEmail(careProfile.email);
      if (!locationAddress && careProfile.homeAddress) setLocationAddress(careProfile.homeAddress);
      if (!specialRequests && careProfile.childrenDetails) setSpecialRequests(careProfile.childrenDetails);
    } else if (currentUser) {
      if (!clientName && currentUser.displayName) setClientName(currentUser.displayName);
      if (!clientEmail && currentUser.email) setClientEmail(currentUser.email);
    }
  }, [careProfile, currentUser]);

  if (!isOpen) return null;

  const currentService =
    SERVICES.find((s) => s.id === serviceId) || SERVICES[0];

  const minHours = currentService.minHours || 4;
  const isHourly = currentService.priceType === 'hourly';

  const rawPricing = calculateServicePrice({
    basePrice: currentService.basePrice,
    priceType: currentService.priceType,
    hours: isHourly ? hours : currentService.defaultDurationHours || 4,
    minHours,
    childrenCount,
    additionalChildRate: currentService.additionalChildRate || 0,
  });

  // Calculate final discounted total
  const finalTotal = Math.max(0, rawPricing.total - promoDiscount);
  const finalDeposit = Math.min(rawPricing.deposit, finalTotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const result = applyPromoCode(promoInput.trim(), rawPricing.total);
    if (result.valid) {
      setPromoDiscount(result.discountAmount);
      setAppliedPromoCode(promoInput.trim().toUpperCase());
      setPromoMessage(result.message);
    } else {
      setPromoDiscount(0);
      setAppliedPromoCode('');
      setPromoMessage(result.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationResult = validateBookingForm({
      clientName,
      clientPhone,
      clientEmail,
      serviceDate,
      startTime,
      hours: isHourly ? hours : minHours,
      minHours,
    });

    if (!validationResult.valid) {
      setFormErrors(validationResult.errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    const refCode = generateBookingReference();

    try {
      if (!currentUser && accountPassword.trim()) {
        if (isExistingAccount) {
          await signInWithEmail(clientEmail, accountPassword);
        } else {
          await registerWithEmail(clientName, clientPhone, clientEmail, accountPassword);
        }
      }

      const savedRecord = await addBooking({
        confirmationCode: refCode,
        serviceId: currentService.id,
        serviceTitle: currentService.title,
        clientName,
        clientPhone,
        clientEmail,
        serviceDate,
        startTime,
        hours: isHourly ? hours : currentService.defaultDurationHours || 4,
        childrenCount,
        childrenDetails: childrenDetails || specialRequests,
        locationAddress: locationAddress || 'Family Residence / Hotel / Airport Location',
        specialRequests: `${specialRequests}${appliedPromoCode ? ` [Promo: ${appliedPromoCode} (-$${promoDiscount})]` : ''}`,
        estimatedTotal: finalTotal,
        requiredDeposit: finalDeposit,
      });

      setConfirmedBooking({
        id: savedRecord.id,
        serviceId: savedRecord.serviceId,
        serviceTitle: savedRecord.serviceTitle,
        clientName: savedRecord.clientName,
        clientPhone: savedRecord.clientPhone,
        clientEmail: savedRecord.clientEmail,
        serviceDate: savedRecord.serviceDate,
        startTime: savedRecord.startTime,
        hours: savedRecord.hours,
        childrenCount: savedRecord.childrenCount,
        childrenDetails: savedRecord.childrenDetails || '',
        locationAddress: savedRecord.locationAddress,
        specialRequests: savedRecord.specialRequests,
        estimatedTotal: savedRecord.estimatedTotal,
        requiredDeposit: savedRecord.requiredDeposit,
        status: 'confirmed',
        createdAt: savedRecord.createdAt,
        confirmationCode: savedRecord.confirmationCode,
      });
    } catch (err) {
      setFormErrors({
        clientName: err instanceof Error ? err.message : 'Unable to save booking. Please enter a portal password or sign in.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCalendar = () => {
    if (!confirmedBooking) return;

    // Create standard .ics calendar invite
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Passport Nana//Appointment//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:Passport Nana: ${confirmedBooking.serviceTitle}
DESCRIPTION:Care appointment with Ken'nyzhae Nathaniel ("Passport Nana")\\nRef Code: ${confirmedBooking.confirmationCode}\\nPhone: ${siteCopy.businessPhone}
LOCATION:${confirmedBooking.locationAddress}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `passport-nana-appointment-${confirmedBooking.confirmationCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedDayStatus = serviceDate ? getAvailabilityForDate(serviceDate) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-3xl my-6 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all border-2 ${
          isDark
            ? 'bg-[#041226] border-[#d4af37]/60 text-white shadow-black/80'
            : 'bg-white border-[#d4af37]/50 text-[#04142b] shadow-amber-950/20'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-full border transition-all cursor-pointer ${
            isDark
              ? 'bg-[#071c38] text-slate-300 hover:text-white border-[#d4af37]/35'
              : 'bg-[#faf8f5] text-[#04142b] hover:bg-[#f1ebe0] border-[#d4af37]/35'
          }`}
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Confirmation State matching Deposit & Payment cards from reference image */
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] flex items-center justify-center text-[#041226] shadow-lg shadow-amber-500/25">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#dfb75c]">
                Booking Confirmed • Luxury Care That Travels!
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display">
                You're Scheduled with Passport Nana!
              </h3>
              <p className="text-sm opacity-90 max-w-lg mx-auto">
                Thank you for securing your booking. Ken’nyzhae will contact you at{' '}
                <strong className="text-[#dfb75c]">{confirmedBooking.clientPhone}</strong> to
                finalize your session details.
              </p>
            </div>

            {/* Reference Badge */}
            <div
              className={`p-5 rounded-2xl border-2 max-w-md mx-auto space-y-2 text-left ${
                isDark ? 'bg-[#061833] border-[#d4af37]/50' : 'bg-[#faf8f5] border-[#d4af37]/45'
              }`}
            >
              <div className="text-xs uppercase font-bold text-[#dfb75c]">Booking Reference</div>
              <div className="text-2xl font-black font-mono text-[#dfb75c] tracking-wider">
                {confirmedBooking.confirmationCode}
              </div>
              <div className="text-xs pt-2 border-t border-[#d4af37]/20 flex justify-between">
                <span>Date & Time:</span>
                <span className="font-bold">
                  {confirmedBooking.serviceDate} at {confirmedBooking.startTime}
                </span>
              </div>
              <div className="text-xs flex justify-between">
                <span>Service:</span>
                <span className="font-bold text-[#dfb75c]">{confirmedBooking.serviceTitle}</span>
              </div>
              <div className="text-xs flex justify-between">
                <span>Estimated Total:</span>
                <span className="font-bold text-[#dfb75c]">
                  {formatCurrency(confirmedBooking.estimatedTotal)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadCalendar}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs border ${
                  isDark
                    ? 'bg-[#071c38] hover:bg-[#0c2a52] text-white border-[#d4af37]/40'
                    : 'bg-[#faf8f5] hover:bg-[#f1ebe0] text-[#04142b] border-[#d4af37]/40'
                }`}
              >
                <Download className="w-4 h-4 text-[#dfb75c]" />
                <span>Save to Calendar (.ics)</span>
              </button>

              <a
                href={`sms:${siteCopy.businessPhone.replace(/\D/g, '')}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] font-bold text-xs shadow-md"
              >
                <Phone className="w-4 h-4" />
                <span>Text Nana Now ({siteCopy.businessPhone})</span>
              </a>

              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  onClose();
                }}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs border ${
                  isDark
                    ? 'bg-[#041226] hover:bg-[#071c38] text-slate-300 border-[#d4af37]/30'
                    : 'bg-white hover:bg-slate-50 text-[#04142b] border-slate-300'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#dfb75c]">
                  Reservation & Care Request
                </span>
                <span className="text-xs text-[#d4af37]">✨</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-serif tracking-tight flex items-center gap-2">
                <span>Book Nana Now</span>
              </h3>
              <p className="text-xs sm:text-sm opacity-85">
                24/7 on-call dispatch & travel accompaniment. Select your date on Nana's live schedule below.
              </p>
            </div>

            {/* Service & Rate Preview Strip */}
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                isDark ? 'bg-[#061833] border-[#d4af37]/35' : 'bg-[#faf8f5] border-[#d4af37]/35'
              }`}
            >
              <div className="w-full sm:w-2/3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#dfb75c] mb-1">
                  Selected Service
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setServiceId(newId);
                    const s = SERVICES.find((item) => item.id === newId);
                    if (s?.minHours && hours < s.minHours) {
                      setHours(s.minHours);
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] font-semibold ${
                    isDark
                      ? 'bg-[#041226] border-[#d4af37]/40 text-white'
                      : 'bg-white border-[#d4af37]/40 text-[#04142b]'
                  }`}
                >
                  {SERVICES.map((s) => (
                    <option
                      key={s.id}
                      value={s.id}
                      className={isDark ? 'bg-[#041226] text-white' : 'bg-white text-[#04142b]'}
                    >
                      {s.title} — {s.durationLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-left sm:text-right w-full sm:w-auto">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">
                  Estimate / Slot Deposit
                </div>
                <div className="text-lg font-black text-[#dfb75c]">
                  {formatCurrency(finalTotal)}{' '}
                  {promoDiscount > 0 && (
                    <span className="text-xs text-emerald-400 font-bold block">
                      (-{formatCurrency(promoDiscount)} Promo Applied!)
                    </span>
                  )}
                  <span className="text-xs font-normal opacity-80 block">
                    ({formatCurrency(finalDeposit)} deposit)
                  </span>
                </div>
              </div>
            </div>

            {/* OWNER AVAILABILITY CALENDAR DISPLAY - DIRECT REQUIREMENT #5 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#d4af37]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
                    Nana's Live Availability Calendar
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="text-xs font-semibold text-[#d4af37] hover:underline flex items-center gap-1"
                >
                  <span>{showCalendar ? 'Collapse Calendar' : 'Expand Calendar'}</span>
                  {showCalendar ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showCalendar && (
                <div className="mt-1">
                  <OwnerAvailabilityCalendar
                    selectedDate={serviceDate}
                    onSelectDate={(selected) => {
                      setServiceDate(selected);
                      if (formErrors.serviceDate) {
                        setFormErrors((prev) => ({ ...prev, serviceDate: '' }));
                      }
                    }}
                    compact={true}
                  />
                </div>
              )}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Parent / Client Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Alexis Johnson"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] ${
                      isDark
                        ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                        : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                    }`}
                  />
                </div>
                {formErrors.clientName && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.clientName}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Phone Number (for instant text updates) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. 305-409-6788"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] ${
                      isDark
                        ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                        : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                    }`}
                  />
                </div>
                {formErrors.clientPhone && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.clientPhone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. alexis@example.com"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] ${
                      isDark
                        ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                        : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                    }`}
                  />
                </div>
                {formErrors.clientEmail && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.clientEmail}</p>
                )}
              </div>

              {/* Client Portal Password for Non-Google Users */}
              {!currentUser && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold opacity-90">
                      {isExistingAccount ? 'Your Portal Password' : 'Create Portal Password (No Google required)'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsExistingAccount(!isExistingAccount)}
                      className="text-[10px] font-bold text-[#d4af37] hover:underline cursor-pointer"
                    >
                      {isExistingAccount ? 'New Client? Create Account' : 'Have an account? Sign In'}
                    </button>
                  </div>
                  <input
                    type="password"
                    value={accountPassword}
                    onChange={(e) => setAccountPassword(e.target.value)}
                    placeholder={
                      isExistingAccount
                        ? 'Enter your existing password'
                        : '6+ chars (or leave blank to use Google Sign-In)'
                    }
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] ${
                      isDark
                        ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                        : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                    }`}
                  />
                </div>
              )}

              {/* Service Date Input */}
              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Service Date * (or click on calendar above)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] ${
                      isDark
                        ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                        : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                    }`}
                  />
                </div>
                {formErrors.serviceDate && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.serviceDate}</p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Preferred Start Time *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] ${
                      isDark
                        ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                        : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                    }`}
                  >
                    <option value="07:00 AM">07:00 AM (Early Morning Care)</option>
                    <option value="09:00 AM">09:00 AM (Morning Care)</option>
                    <option value="12:00 PM">12:00 PM (Midday)</option>
                    <option value="03:00 PM">03:00 PM (School Dismissal Pickup)</option>
                    <option value="05:00 PM">05:00 PM (Evening / Dinner)</option>
                    <option value="07:00 PM">07:00 PM (Date Night / Bedtime)</option>
                    <option value="10:00 PM">10:00 PM (Overnight Support)</option>
                    <option value="Flight Departure / Travel Check-In">Flight Departure / Travel Check-In</option>
                    <option value="On-Call Immediate">On-Call Immediate (ASAP)</option>
                  </select>
                </div>
              </div>

              {/* Hours (if hourly) */}
              {isHourly && (
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-90">
                    Duration (Min {minHours} hrs) *
                  </label>
                  <select
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value, 10))}
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] font-semibold ${
                      isDark
                        ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                        : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                    }`}
                  >
                    {[4, 5, 6, 7, 8, 10, 12, 16, 24].map((h) => (
                      <option key={h} value={h}>
                        {h} Hours {h === minHours ? `(Minimum)` : ''}
                      </option>
                    ))}
                  </select>
                  {formErrors.hours && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.hours}</p>
                  )}
                </div>
              )}

              {/* Children Count (if child care) */}
              {currentService.category !== 'hair' && currentService.category !== 'pet' && (
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-90">
                    Number of Children
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(parseInt(e.target.value, 10))}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] ${
                        isDark
                          ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                          : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                      }`}
                    >
                      <option value="1">1 Child</option>
                      <option value="2">2 Children (+$5/hr)</option>
                      <option value="3">3 Children (+$10/hr)</option>
                      <option value="4">4+ Children (+$15/hr)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Address / Location */}
            <div>
              <label className="block text-xs font-bold mb-1 opacity-90">
                Location Address / Hotel / Airport Gate
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="e.g. 120 Ocean Drive, Miami FL or Airport Flight # / Hotel Room"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] ${
                    isDark
                      ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                      : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                  }`}
                />
              </div>
            </div>

            {/* Promo Code Input Strip */}
            <div
              className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-center gap-2 ${
                isDark ? 'bg-[#061833]/60 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#d4af37]">
                <Tag className="w-4 h-4" />
                <span>Promo Code:</span>
              </div>
              <div className="flex-1 flex gap-2 w-full">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="e.g. PASSPORT50, WELCOME20, MEETFREE"
                  className={`flex-1 px-3 py-1.5 rounded-xl border text-xs uppercase font-mono ${
                    isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3.5 py-1.5 rounded-xl bg-[#d4af37] text-[#041226] font-bold text-xs hover:scale-105 transition-all"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <span
                  className={`text-xs font-semibold ${
                    promoDiscount > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {promoMessage}
                </span>
              )}
            </div>

            {/* Children details / special notes */}
            <div>
              <label className="block text-xs font-bold mb-1 opacity-90">
                Children Details, Routines, Allergies or Hair Length Notes
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Maya (age 4) has a peanut allergy; need bedtime routine completed by 8:30 PM. Or loc length mid-back for retwist."
                className={`w-full px-3 py-2 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] ${
                  isDark
                    ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                    : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                }`}
              />
            </div>

            {/* Submission CTA - REQUIREMENT #6: "Book Nana Now" */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs opacity-80 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#dfb75c]" />
                <span>Zero hassle • Instant scheduling with Nana Ken’nyzhae</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                    isDark
                      ? 'bg-[#071c38] hover:bg-[#0c2a52] text-slate-300 border-[#d4af37]/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-[#04142b] border-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] font-black text-sm shadow-lg shadow-amber-500/25 disabled:opacity-50 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  {isSubmitting ? 'Confirming...' : 'Book Nana Now'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
