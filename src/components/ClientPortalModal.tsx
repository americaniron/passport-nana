import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { PassportNanaLogo } from './PassportNanaLogo.tsx';
import {
  X,
  Plane,
  Clock,
  Calendar,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Send,
  Sparkles,
  Heart,
  Baby,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { BookingRecord } from '../types/business.ts';
import { formatCurrency } from '../utils/pricing.ts';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (serviceId?: string) => void;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const { isDark } = useTheme();
  const { bookings, siteCopy, addLiveUpdate } = useBusiness();

  // Selected client booking
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    bookings[0]?.id || ''
  );

  // Active tab inside portal
  const [activeTab, setActiveTab] = useState<'itinerary' | 'live_feed' | 'children_profile' | 'invoices'>('itinerary');

  // Direct message draft
  const [clientMessage, setClientMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Search/Lookup by code
  const [searchCode, setSearchCode] = useState('');

  if (!isOpen) return null;

  const currentBooking =
    bookings.find((b) => b.id === selectedBookingId) ||
    bookings[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientMessage.trim() || !currentBooking) return;

    addLiveUpdate(
      currentBooking.id,
      `Parent Note: "${clientMessage.trim()}"`,
      'checkin'
    );
    setClientMessage('');
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
  };

  const handleDownloadCalendar = () => {
    if (!currentBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Passport Nana//Client Portal//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:Passport Nana: ${currentBooking.serviceTitle}
DESCRIPTION:Care appointment with Ken'nyzhae Nathaniel ("Passport Nana")\\nConfirmation: ${currentBooking.confirmationCode}\\nPhone: ${siteCopy.businessPhone}
LOCATION:${currentBooking.locationAddress}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `passport-nana-${currentBooking.confirmationCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-4xl max-h-[92vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-colors ${
          isDark
            ? 'bg-[#041226] border-[#d4af37]/40 text-slate-100 shadow-black/80'
            : 'bg-[#faf8f5] border-[#d4af37]/40 text-[#04142b] shadow-amber-950/20'
        }`}
      >
        {/* Top Header Bar */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-b ${
            isDark ? 'bg-[#061833] border-[#d4af37]/20' : 'bg-white border-[#d4af37]/20'
          }`}
        >
          <div className="flex items-center gap-3">
            <PassportNanaLogo variant="compact" size="sm" showTagline={false} />
            <div className="h-6 w-px bg-[#d4af37]/30" />
            <div>
              <h3 className="font-serif font-black text-base sm:text-lg tracking-wide flex items-center gap-2">
                <span>Client VIP Care Portal</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                  Passport Care
                </span>
              </h3>
              <p className="text-xs opacity-70">Live travel tracking, care manifests & direct Nana line</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close portal"
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client Switcher / Lookup Bar */}
        <div
          className={`px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b ${
            isDark ? 'bg-[#030d1d] border-white/5' : 'bg-[#f4efe6] border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <span className="font-bold opacity-60 flex-shrink-0">Switch Booking:</span>
            {bookings.slice(0, 4).map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBookingId(b.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex-shrink-0 border ${
                  selectedBookingId === b.id
                    ? 'bg-[#d4af37] text-[#041226] border-[#d4af37] shadow-sm font-black'
                    : isDark
                    ? 'bg-white/5 text-slate-300 border-white/10 hover:border-[#d4af37]/50'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#d4af37]/50'
                }`}
              >
                {b.clientName.split(' ')[0]} ({b.confirmationCode})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] opacity-70">24/7 Line:</span>
            <a
              href={`tel:${siteCopy.businessPhone.replace(/\D/g, '')}`}
              className="font-bold text-[#d4af37] hover:underline flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>{siteCopy.businessPhone}</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          className={`flex border-b px-5 overflow-x-auto ${
            isDark ? 'bg-[#05152c] border-white/10' : 'bg-slate-100/70 border-slate-200'
          }`}
        >
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'itinerary'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Itinerary & Flight Manifest</span>
          </button>
          <button
            onClick={() => setActiveTab('live_feed')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors relative ${
              activeTab === 'live_feed'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Live Care Activity Log</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          </button>
          <button
            onClick={() => setActiveTab('children_profile')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'children_profile'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <Baby className="w-4 h-4" />
            <span>Care Instructions & Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'invoices'
                ? 'border-[#d4af37] text-[#d4af37]'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Invoices & Payments</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
          {currentBooking ? (
            <>
              {/* Tab 1: Itinerary & Travel Manifest */}
              {activeTab === 'itinerary' && (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isDark
                        ? 'bg-gradient-to-r from-[#061e3d] to-[#041226] border-[#d4af37]/40'
                        : 'bg-gradient-to-r from-amber-50 to-white border-[#d4af37]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Status: {currentBooking.status.replace('_', ' ').toUpperCase()}</span>
                        </span>
                        <span className="text-xs font-mono opacity-60">
                          Ref: {currentBooking.confirmationCode}
                        </span>
                      </div>
                      <h4 className="font-serif font-black text-lg sm:text-xl text-[#d4af37]">
                        {currentBooking.serviceTitle}
                      </h4>
                      <p className="text-xs opacity-80 mt-0.5">
                        Client: {currentBooking.clientName} • Phone: {currentBooking.clientPhone}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadCalendar}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                          isDark
                            ? 'border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10'
                            : 'border-[#d4af37] text-[#04142b] hover:bg-amber-50'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save to Calendar (.ics)</span>
                      </button>

                      <button
                        onClick={() => {
                          onClose();
                          onOpenBooking(currentBooking.serviceId);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#aa8214] text-[#041226] shadow-md hover:scale-105 transition-all"
                      >
                        Book Nana Now
                      </button>
                    </div>
                  </div>

                  {/* Flight & Travel Details Card (if travel service) */}
                  {currentBooking.flightDetails && (
                    <div
                      className={`p-5 rounded-2xl border ${
                        isDark ? 'bg-[#061833] border-sky-500/30' : 'bg-sky-50/70 border-sky-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3 text-sky-400">
                        <Plane className="w-5 h-5" />
                        <h5 className="font-serif font-black text-sm uppercase tracking-wider text-inherit">
                          Passport Nanny Flight Manifest
                        </h5>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="p-3 rounded-xl bg-black/10 border border-black/5">
                          <span className="opacity-60 block">Airline & Flight:</span>
                          <span className="font-bold text-sm">
                            {currentBooking.flightDetails.airline} {currentBooking.flightDetails.flightNumber}
                          </span>
                          <span className="block opacity-80 mt-1">{currentBooking.flightDetails.terminal}</span>
                        </div>

                        <div className="p-3 rounded-xl bg-black/10 border border-black/5">
                          <span className="opacity-60 block">Route:</span>
                          <span className="font-bold text-sm">
                            {currentBooking.flightDetails.departureCity} ➔ {currentBooking.flightDetails.destinationCity}
                          </span>
                          <span className="block opacity-80 mt-1">In-Flight Accompaniment Active</span>
                        </div>

                        <div className="p-3 rounded-xl bg-black/10 border border-black/5">
                          <span className="opacity-60 block">Hotel / Destination:</span>
                          <span className="font-bold text-sm">
                            {currentBooking.flightDetails.hotelName || 'Private Accommodation'}
                          </span>
                          <span className="block opacity-80 mt-1">Evening routine coverage ready</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Date, Time & Location Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div
                      className={`p-4 rounded-2xl border ${
                        isDark ? 'bg-[#061833]/70 border-white/10' : 'bg-white border-slate-200'
                      }`}
                    >
                      <h5 className="font-bold text-sm mb-2 flex items-center gap-1.5 text-[#d4af37]">
                        <Clock className="w-4 h-4" />
                        <span>Schedule & Engagement</span>
                      </h5>
                      <div className="space-y-1.5 opacity-90">
                        <p><strong>Date:</strong> {currentBooking.serviceDate}</p>
                        <p><strong>Start Time:</strong> {currentBooking.startTime}</p>
                        <p><strong>Booked Hours:</strong> {currentBooking.hours} Hours</p>
                        <p><strong>Children:</strong> {currentBooking.childrenCount} Child(ren)</p>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-2xl border ${
                        isDark ? 'bg-[#061833]/70 border-white/10' : 'bg-white border-slate-200'
                      }`}
                    >
                      <h5 className="font-bold text-sm mb-2 flex items-center gap-1.5 text-[#d4af37]">
                        <MapPin className="w-4 h-4" />
                        <span>Location & Care Address</span>
                      </h5>
                      <p className="font-medium">{currentBooking.locationAddress}</p>
                      {currentBooking.specialRequests && (
                        <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                          <strong>Family Note:</strong> {currentBooking.specialRequests}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Live Care Activity Log */}
              {activeTab === 'live_feed' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif font-black text-lg text-[#d4af37] flex items-center gap-2">
                        <span>Real-Time Nana Check-In Timeline</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      </h4>
                      <p className="text-xs opacity-75">
                        Ken’nyzhae posts regular updates during every care session
                      </p>
                    </div>
                  </div>

                  {/* Timeline Stream */}
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#d4af37]/30">
                    {currentBooking.liveUpdates && currentBooking.liveUpdates.length > 0 ? (
                      currentBooking.liveUpdates.map((update) => (
                        <div key={update.id} className="relative">
                          <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#d4af37] border-2 border-[#041226]" />
                          <div
                            className={`p-3.5 rounded-2xl border text-xs ${
                              isDark ? 'bg-[#061833] border-white/10' : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1 opacity-70">
                              <span className="font-bold uppercase tracking-wider text-[10px] text-[#d4af37]">
                                {update.type.toUpperCase()}
                              </span>
                              <span>{update.time}</span>
                            </div>
                            <p className="font-medium text-sm leading-relaxed">{update.message}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs opacity-70 italic">No check-ins posted yet for this session.</p>
                    )}
                  </div>

                  {/* Send Direct Parent Note */}
                  <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-white/10">
                    <label className="block text-xs font-bold mb-1.5">
                      Send Instant Message or Routine Note to Nana Ken’nyzhae:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={clientMessage}
                        onChange={(e) => setClientMessage(e.target.value)}
                        placeholder="e.g. Leo had his afternoon snack early, bedtime shifted to 8:30pm..."
                        className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#d4af37] ${
                          isDark
                            ? 'bg-[#040f1f] border-white/15 text-white'
                            : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </div>
                    {messageSent && (
                      <p className="text-xs text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Note delivered directly to Nana's care log!
                      </p>
                    )}
                  </form>
                </div>
              )}

              {/* Tab 3: Care Instructions & Child Profile */}
              {activeTab === 'children_profile' && (
                <div className="space-y-4">
                  <h4 className="font-serif font-black text-lg text-[#d4af37]">
                    Little Ones & Pet Care Dossier
                  </h4>
                  <div
                    className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-[#061833] border-white/10' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3 text-[#d4af37]">
                      <Heart className="w-4 h-4 fill-[#d4af37]" />
                      <span className="font-bold text-xs uppercase tracking-wider">Registered Children / Pets</span>
                    </div>
                    <p className="text-sm font-semibold mb-2">
                      {currentBooking.childrenDetails || 'No specific details provided yet.'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs opacity-90 mt-4">
                      <div className="p-3 rounded-xl bg-black/10 border border-black/5">
                        <strong className="block text-[#d4af37] mb-1">Emergency Protocols</strong>
                        <p>CPR / First Aid certified. Immediate parental call followed by nearest pediatric emergency hospital.</p>
                      </div>
                      <div className="p-3 rounded-xl bg-black/10 border border-black/5">
                        <strong className="block text-[#d4af37] mb-1">Meal & Nutrition Prep</strong>
                        <p>Allergen-conscious kitchen routine. Peanut/dairy precautions rigorously followed.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Invoices & Payments */}
              {activeTab === 'invoices' && (
                <div className="space-y-4">
                  <h4 className="font-serif font-black text-lg text-[#d4af37]">
                    Invoices & Payment Transparency
                  </h4>

                  <div
                    className={`p-5 rounded-2xl border ${
                      isDark ? 'bg-[#061833] border-[#d4af37]/30' : 'bg-white border-[#d4af37]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div>
                        <span className="text-xs opacity-70">Invoice ID: INV-{currentBooking.confirmationCode}</span>
                        <h5 className="font-bold text-base">{currentBooking.serviceTitle}</h5>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        {currentBooking.finalPaid ? 'Paid in Full' : 'Deposit Secured'}
                      </span>
                    </div>

                    <div className="py-3 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="opacity-70">Total Service Estimate ({currentBooking.hours} hrs):</span>
                        <span className="font-bold">{formatCurrency(currentBooking.estimatedTotal)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>Required Deposit (Secured):</span>
                        <span>-{formatCurrency(currentBooking.requiredDeposit)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-black text-[#d4af37]">
                        <span>Remaining Balance:</span>
                        <span>
                          {currentBooking.finalPaid
                            ? '$0.00 (Settled)'
                            : formatCurrency(currentBooking.estimatedTotal - currentBooking.requiredDeposit)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] opacity-70">Accepted: Apple Pay, Zelle, CashApp, Credit Card</span>
                      <button
                        onClick={handleDownloadCalendar}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37]/30"
                      >
                        Download Statement
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm opacity-70">No booking record found.</p>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div
          className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-[#05152c] border-[#d4af37]/20' : 'bg-white border-[#d4af37]/20'
          }`}
        >
          <div className="flex items-center gap-1.5 opacity-80">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>24/7 Verified Childcare • CPR Certified • Traveling Worldwide</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenBooking();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#aa8214] text-[#041226] font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Book Nana Now
          </button>
        </div>
      </div>
    </div>
  );
};
