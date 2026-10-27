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
  const [serviceId, setServiceId] = useState<string>(initialServiceId || 'nanny-services');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
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

  useEffect(() => {
    if (initialServiceId) setServiceId(initialServiceId);
    if (initialHours) setHours(initialHours);
    if (initialChildrenCount) setChildrenCount(initialChildrenCount);
  }, [initialServiceId, initialHours, initialChildrenCount]);

  if (!isOpen) return null;

  const currentService =
    SERVICES.find((s) => s.id === serviceId) || SERVICES[0];

  const minHours = currentService.minHours || 4;
  const isHourly = currentService.priceType === 'hourly';

  const pricing = calculateServicePrice({
    basePrice: currentService.basePrice,
    priceType: currentService.priceType,
    hours: isHourly ? Math.max(hours, minHours) : currentService.defaultDurationHours || 4,
    minHours,
    childrenCount,
    additionalChildRate: currentService.additionalChildRate || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateBookingForm({
      clientName,
      clientPhone,
      clientEmail,
      serviceDate,
      startTime,
      hours: isHourly ? hours : undefined,
      minHours: isHourly ? minHours : undefined,
    });

    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    const refCode = generateBookingReference();
    const newBooking: BookingRequest = {
      serviceId: currentService.id,
      serviceTitle: currentService.title,
      clientName,
      clientPhone,
      clientEmail,
      serviceDate,
      startTime,
      hours: isHourly ? hours : currentService.defaultDurationHours || 4,
      childrenCount,
      childrenDetails,
      locationAddress: locationAddress || 'Family Home / On-Call Location',
      specialRequests,
      estimatedTotal: pricing.total,
      requiredDeposit: pricing.deposit,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      confirmationCode: refCode,
    };

    setTimeout(() => {
      setConfirmedBooking(newBooking);
      setIsSubmitting(false);
    }, 600);
  };

  const handleDownloadCalendar = () => {
    if (!confirmedBooking) return;

    // Create standard .ics calendar invite
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kweenz Dream//Appointment//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:Kweenz Dream: ${confirmedBooking.serviceTitle}
DESCRIPTION:Care appointment with Ken'nyzhae Nathaniel ("Passport Nanny")\\nRef Code: ${confirmedBooking.confirmationCode}\\nPhone: 305-409-6788
LOCATION:${confirmedBooking.locationAddress}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `kweenz-dream-appointment-${confirmedBooking.confirmationCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-3xl my-8 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all border ${
          isDark
            ? 'bg-[#12042b] border-cyan-400/40 text-white'
            : 'bg-white border-purple-200 text-slate-900 shadow-2xl shadow-purple-950/20'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-full border transition-all ${
            isDark
              ? 'bg-purple-950 text-slate-300 hover:text-white hover:bg-purple-900 border-purple-500/30'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border-slate-300'
          }`}
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Confirmation State */
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                Appointment Reserved
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                You're Scheduled with Nana!
              </h3>
              <p className="text-sm text-slate-300">
                Your booking request has been logged. Ken’nyzhae will text or call you at{' '}
                <strong className="text-cyan-300">{confirmedBooking.clientPhone}</strong> to
                confirm arrival details.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="p-4 rounded-2xl bg-purple-950/70 border border-cyan-400/40 max-w-md mx-auto space-y-2">
              <div className="text-xs uppercase font-bold text-slate-400">Booking Reference</div>
              <div className="text-2xl font-black font-mono text-cyan-300 tracking-wider">
                {confirmedBooking.confirmationCode}
              </div>
              <div className="text-xs text-slate-300 pt-1 border-t border-purple-500/30 flex justify-between">
                <span>Date & Time:</span>
                <span className="font-bold text-white">
                  {confirmedBooking.serviceDate} at {confirmedBooking.startTime}
                </span>
              </div>
              <div className="text-xs text-slate-300 flex justify-between">
                <span>Service:</span>
                <span className="font-bold text-pink-300">{confirmedBooking.serviceTitle}</span>
              </div>
              <div className="text-xs text-slate-300 flex justify-between">
                <span>Estimated Total:</span>
                <span className="font-bold text-cyan-300">
                  {formatCurrency(confirmedBooking.estimatedTotal)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadCalendar}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs border border-purple-500/40"
              >
                <Download className="w-4 h-4 text-cyan-300" />
                <span>Save to Calendar (.ics)</span>
              </button>

              <a
                href="sms:3054096788"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Text Nana Now (305-409-6788)</span>
              </a>

              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-slate-300 font-semibold text-xs border border-purple-500/30"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Reservation & Appointment
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                Book with Kweenz Dream💭
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                24/7 on-call dispatch. Submit your request and Nana will secure your time slot.
              </p>
            </div>

            {/* Service & Rate Preview Strip */}
            <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-2/3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-1">
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
                  className="w-full px-3 py-2 rounded-xl bg-[#0e0224] border border-purple-500/40 text-white text-sm focus:outline-none focus:border-cyan-400 font-semibold"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id} className="bg-purple-950 text-white">
                      {s.title} — {s.durationLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-left sm:text-right w-full sm:w-auto">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">
                  Estimate / Slot Deposit
                </div>
                <div className="text-lg font-black text-cyan-300">
                  {formatCurrency(pricing.total)}{' '}
                  <span className="text-xs font-normal text-slate-300">
                    ({formatCurrency(pricing.deposit)} deposit)
                  </span>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Parent / Client Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Alexis Johnson"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                {formErrors.clientName && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.clientName}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Phone Number (for instant text updates) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="e.g. 305-409-6788"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                {formErrors.clientPhone && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.clientPhone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. alexis@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                {formErrors.clientEmail && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.clientEmail}</p>
                )}
              </div>

              {/* Service Date */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Service Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
                {formErrors.serviceDate && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.serviceDate}</p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Preferred Start Time *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option value="07:00 AM">07:00 AM (Early Morning)</option>
                    <option value="09:00 AM">09:00 AM (Morning Care)</option>
                    <option value="12:00 PM">12:00 PM (Midday)</option>
                    <option value="03:00 PM">03:00 PM (School Dismissal)</option>
                    <option value="05:00 PM">05:00 PM (Evening / Dinner)</option>
                    <option value="07:00 PM">07:00 PM (Date Night / Bedtime)</option>
                    <option value="10:00 PM">10:00 PM (Overnight Support)</option>
                    <option value="On-Call Immediate">On-Call Immediate (ASAP)</option>
                  </select>
                </div>
              </div>

              {/* Hours (if hourly) */}
              {isHourly && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Duration (Min {minHours} hrs) *
                  </label>
                  <select
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-sm focus:outline-none focus:border-cyan-400 font-semibold"
                  >
                    {[4, 5, 6, 7, 8, 10, 12, 16].map((h) => (
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
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Number of Children
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(parseInt(e.target.value, 10))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-sm focus:outline-none focus:border-cyan-400"
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
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Location Address / Hotel / Airport Gate
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  placeholder="e.g. 120 Opera Plaza, San Francisco, CA or Hotel Room # / Airport flight #"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Children details / special notes */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Children Details, Routines, Allergies or Hair Length Notes
              </label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g. Maya (age 4) has a peanut allergy; need bedtime routine completed by 8:30 PM. Or loc length mid-back for retwist."
                className="w-full px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Submission CTA */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Zero hassle • Verified confirmation</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-slate-300 text-xs font-semibold border border-purple-500/30"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
