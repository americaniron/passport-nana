import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { PassportNanaLogo } from './PassportNanaLogo.tsx';
import {
  X,
  Lock,
  Unlock,
  KeyRound,
  Calendar,
  DollarSign,
  Palette,
  Image as ImageIcon,
  FileEdit,
  Tag,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  Plane,
  Clock,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  RefreshCw,
  LogOut,
  Upload,
} from 'lucide-react';
import { AvailabilityStatus, BookingStatus } from '../types/business.ts';
import { formatCurrency } from '../utils/pricing.ts';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isDark } = useTheme();
  const {
    siteCopy,
    updateSiteCopy,
    themeColors,
    updateThemeColors,
    resetThemeColors,
    calendarAvailability,
    updateDayAvailability,
    bookings,
    updateBookingStatus,
    addLiveUpdate,
    deleteBooking,
    promotions,
    addPromotion,
    deletePromotion,
    mediaGallery,
    addMediaItem,
    deleteMediaItem,
    pricingRates,
    updatePricingRates,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
  } = useBusiness();

  // Auth PIN state
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'bookings' | 'calendar' | 'theme' | 'copy' | 'promotions' | 'media' | 'pricing'
  >('bookings');

  // Booking search & filter
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [selectedBookingForUpdate, setSelectedBookingForUpdate] = useState<string | null>(null);
  const [newCheckInMessage, setNewCheckInMessage] = useState('');

  // Calendar editing state
  const [selectedDateToEdit, setSelectedDateToEdit] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedStatusToSet, setSelectedStatusToSet] = useState<AvailabilityStatus>('available');
  const [selectedNoteToSet, setSelectedNoteToSet] = useState('');

  // Copy editing local state
  const [copyForm, setCopyForm] = useState(siteCopy);

  // Theme colors local state
  const [themeForm, setThemeForm] = useState(themeColors);

  // Pricing local state
  const [pricingForm, setPricingForm] = useState(pricingRates);

  // New Promotion form state
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'fixed' | 'percentage'>('fixed');
  const [newPromoValue, setNewPromoValue] = useState<number>(25);
  const [newPromoDesc, setNewPromoDesc] = useState('');
  const [newPromoMinSpend, setNewPromoMinSpend] = useState<number>(0);
  const [newPromoPermanent, setNewPromoPermanent] = useState(true);
  const [newPromoExpiry, setNewPromoExpiry] = useState('');

  // New Media form state
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState<
    'childcare' | 'passport_travel' | 'hair_locs' | 'adventures' | 'branding'
  >('childcare');
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const ok = await adminLogin(pinInput);
    if (ok) {
      setAuthError('');
      setPinInput('');
    } else {
      setAuthError('Invalid owner PIN or authentication cancelled.');
    }
  };

  const handleSaveCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteCopy(copyForm);
    showNotice('Site copy saved to Cloud Firestore!');
  };

  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateThemeColors(themeForm);
    showNotice('Visual theme colors saved to Cloud Firestore!');
  };

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePricingRates(pricingForm);
    showNotice('Pricing and rates saved to Cloud Firestore!');
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    await addPromotion({
      code: newPromoCode.trim(),
      discountType: newPromoType,
      discountValue: Number(newPromoValue),
      description: newPromoDesc || `${newPromoType === 'fixed' ? '$' : ''}${newPromoValue}${newPromoType === 'percentage' ? '%' : ''} Off`,
      isPermanent: newPromoPermanent,
      expiresAt: newPromoPermanent ? undefined : newPromoExpiry,
      minSpend: Number(newPromoMinSpend) || 0,
      isActive: true,
    });

    setNewPromoCode('');
    setNewPromoDesc('');
    showNotice('New promotion code published!');
  };

  const handleUploadImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewMediaUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaUrl) return;

    await addMediaItem({
      title: newMediaTitle || 'Passport Nana Gallery Item',
      url: newMediaUrl,
      category: newMediaCategory,
      caption: newMediaCaption,
    });

    setNewMediaTitle('');
    setNewMediaUrl('');
    setNewMediaCaption('');
    showNotice('New media item uploaded to Cloud Gallery!');
  };

  const handleSetCalendarDate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDayAvailability(selectedDateToEdit, selectedStatusToSet, selectedNoteToSet);
    showNotice(`Availability saved for ${selectedDateToEdit} (${selectedStatusToSet.toUpperCase()})`);
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter === 'all' || b.status === bookingFilter;
    const matchesSearch =
      !bookingSearch ||
      b.clientName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.confirmationCode.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.clientPhone.includes(bookingSearch);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-5xl max-h-[94vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-colors ${
          isDark
            ? 'bg-[#041226] border-[#d4af37]/40 text-slate-100 shadow-black/80'
            : 'bg-[#faf8f5] border-[#d4af37]/40 text-[#04142b] shadow-amber-950/20'
        }`}
      >
        {/* Top Header */}
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
                <span>Owner & Admin Control Hub</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#d4af37] text-[#041226]">
                  Ken’nyzhae Nathan
                </span>
              </h3>
              <p className="text-xs opacity-70">Live site customization, calendar, bookings, promos & media</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={adminLogout}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 flex items-center gap-1.5 transition-colors"
                title="Log out of admin session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close admin modal"
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Save Notification Banner */}
        {saveSuccessNotice && (
          <div className="bg-emerald-500 text-slate-950 px-4 py-2 font-bold text-xs flex items-center justify-between shadow-md animate-in slide-in-from-top">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveSuccessNotice}</span>
            </div>
            <button onClick={() => setSaveSuccessNotice(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Auth Screen if not logged in */}
        {!isAdminAuthenticated ? (
          <div className="flex-1 p-6 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-4 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>

            <h4 className="font-serif font-black text-2xl mb-2 text-[#d4af37]">Owner Authentication</h4>
            <p className="text-xs opacity-80 mb-6">
              Enter Ken’nyzhae's security PIN to access site settings, booking management, and live color themes.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter Owner Security PIN"
                  className={`w-full px-4 py-3 rounded-2xl border text-center font-mono text-base tracking-widest focus:outline-none focus:ring-2 focus:ring-[#d4af37] ${
                    isDark ? 'bg-[#061833] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                  autoFocus
                />
                {authError && <p className="text-xs text-rose-400 font-semibold mt-2">{authError}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#aa8214] text-[#041226] font-black text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Sign In & Unlock Owner Hub</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <>
            {/* Tabs Navigation */}
            <div
              className={`flex border-b px-4 overflow-x-auto ${
                isDark ? 'bg-[#05152c] border-white/10' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-3 px-3.5 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'bookings'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customer Bookings ({bookings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className={`py-3 px-3.5 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'calendar'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Calendar & Availability</span>
              </button>

              <button
                onClick={() => setActiveTab('theme')}
                className={`py-3 px-3.5 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'theme'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Visual Theme Colors</span>
              </button>

              <button
                onClick={() => setActiveTab('copy')}
                className={`py-3 px-3.5 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'copy'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <FileEdit className="w-4 h-4" />
                <span>Site Copy & Info</span>
              </button>

              <button
                onClick={() => setActiveTab('promotions')}
                className={`py-3 px-3.5 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'promotions'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Promotions ({promotions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('media')}
                className={`py-3 px-3.5 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'media'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Media Gallery ({mediaGallery.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('pricing')}
                className={`py-3 px-3.5 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'pricing'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Pricing & Rates</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
              {/* TAB 1: CUSTOMER BOOKINGS */}
              {activeTab === 'bookings' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-serif font-black text-lg text-[#d4af37]">Customer Reservations</h4>
                      <p className="text-xs opacity-75">
                        Manage all customer care bookings, update active statuses, or post live check-ins.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        placeholder="Search client or code..."
                        className={`px-3 py-1.5 rounded-xl border text-xs ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                      <select
                        value={bookingFilter}
                        onChange={(e) => setBookingFilter(e.target.value)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Bookings List */}
                  <div className="space-y-4">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((b) => (
                        <div
                          key={b.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isDark
                              ? 'bg-[#061833] border-white/10 hover:border-[#d4af37]/40'
                              : 'bg-white border-slate-200 hover:border-[#d4af37]/40'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-base text-[#d4af37]">{b.clientName}</span>
                                <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/20 opacity-80">
                                  {b.confirmationCode}
                                </span>
                              </div>
                              <span className="text-xs opacity-75">{b.serviceTitle}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                                  b.status === 'completed'
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : b.status === 'in_progress'
                                    ? 'bg-sky-500/20 text-sky-400'
                                    : 'bg-amber-500/20 text-amber-400'
                                }`}
                              >
                                {b.status.replace('_', ' ')}
                              </span>

                              <select
                                value={b.status}
                                onChange={(e) => {
                                  updateBookingStatus(b.id, e.target.value as BookingStatus);
                                  showNotice(`Updated booking ${b.confirmationCode} to ${e.target.value}`);
                                }}
                                className={`text-xs px-2 py-1 rounded-lg border font-semibold ${
                                  isDark ? 'bg-[#040f1f] border-white/20 text-white' : 'bg-slate-100 border-slate-300'
                                }`}
                              >
                                <option value="pending">Set Pending</option>
                                <option value="confirmed">Set Confirmed</option>
                                <option value="in_progress">Set In Progress</option>
                                <option value="completed">Set Completed</option>
                                <option value="cancelled">Set Cancelled</option>
                              </select>

                              <button
                                onClick={() => {
                                  if (confirm(`Delete booking ${b.confirmationCode}?`)) {
                                    deleteBooking(b.id);
                                    showNotice('Booking removed');
                                  }
                                }}
                                className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                                title="Delete booking"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-3 text-xs opacity-90">
                            <div>
                              <strong className="block text-[#d4af37]">Schedule:</strong>
                              <span>{b.serviceDate} at {b.startTime} ({b.hours} hrs)</span>
                            </div>
                            <div>
                              <strong className="block text-[#d4af37]">Contact & Location:</strong>
                              <span>{b.clientPhone} • {b.locationAddress}</span>
                            </div>
                            <div>
                              <strong className="block text-[#d4af37]">Pricing & Deposit:</strong>
                              <span>
                                Total: {formatCurrency(b.estimatedTotal)} (Deposit {formatCurrency(b.requiredDeposit)} {b.depositPaid ? 'Paid' : 'Unpaid'})
                              </span>
                            </div>
                          </div>

                          {/* Post Live Check-In Form */}
                          <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Post live update to client portal (e.g. Arrived safely, reading books)..."
                              value={selectedBookingForUpdate === b.id ? newCheckInMessage : ''}
                              onFocus={() => setSelectedBookingForUpdate(b.id)}
                              onChange={(e) => {
                                setSelectedBookingForUpdate(b.id);
                                setNewCheckInMessage(e.target.value);
                              }}
                              className={`flex-1 px-3 py-1.5 rounded-lg border text-xs ${
                                isDark ? 'bg-[#040f1f] border-white/10 text-white' : 'bg-slate-50 border-slate-300'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newCheckInMessage.trim()) {
                                  addLiveUpdate(b.id, newCheckInMessage.trim(), 'checkin');
                                  setNewCheckInMessage('');
                                  showNotice('Check-in posted to client portal live timeline!');
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#d4af37] text-[#041226] hover:scale-105 transition-all"
                            >
                              Post Check-in
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 opacity-70 text-xs">No bookings matching filter.</div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: CALENDAR & AVAILABILITY */}
              {activeTab === 'calendar' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif font-black text-lg text-[#d4af37]">
                      Owner Availability & Flight Schedule Manager
                    </h4>
                    <p className="text-xs opacity-75">
                      Select any date to update your availability status. This schedule is displayed live to families booking care.
                    </p>
                  </div>

                  {/* Form to update a date */}
                  <form
                    onSubmit={handleSetCalendarDate}
                    className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-[#061833] border-white/10' : 'bg-white border-slate-200'
                    }`}
                  >
                    <h5 className="font-bold text-sm text-[#d4af37] mb-3">Update Date Availability</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                      <div>
                        <label className="block font-semibold mb-1">Target Date:</label>
                        <input
                          type="date"
                          value={selectedDateToEdit}
                          onChange={(e) => setSelectedDateToEdit(e.target.value)}
                          className={`w-full px-3 py-2 rounded-xl border ${
                            isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Status:</label>
                        <select
                          value={selectedStatusToSet}
                          onChange={(e) => setSelectedStatusToSet(e.target.value as AvailabilityStatus)}
                          className={`w-full px-3 py-2 rounded-xl border ${
                            isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                          }`}
                        >
                          <option value="available">🟢 Available (Open for All Care)</option>
                          <option value="limited">🟡 Limited Slots (Morning/Afternoon Only)</option>
                          <option value="flight">✈️ Flight / Travel Nanny (In Transit)</option>
                          <option value="booked">🔴 Booked / Off Duty</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Schedule Note (Public):</label>
                        <input
                          type="text"
                          value={selectedNoteToSet}
                          onChange={(e) => setSelectedNoteToSet(e.target.value)}
                          placeholder="e.g. Flight MIA -> LHR, or Full Day 24/7 Open"
                          className={`w-full px-3 py-2 rounded-xl border ${
                            isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Day Availability</span>
                    </button>
                  </form>

                  {/* Calendar Days Quick Overview */}
                  <div
                    className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-[#061833] border-white/10' : 'bg-white border-slate-200'
                    }`}
                  >
                    <h5 className="font-bold text-sm mb-3">Next 14 Days at a Glance:</h5>
                    <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-xs">
                      {Object.values(calendarAvailability)
                        .slice(0, 14)
                        .map((day) => (
                          <div
                            key={day.date}
                            onClick={() => {
                              setSelectedDateToEdit(day.date);
                              setSelectedStatusToSet(day.status);
                              setSelectedNoteToSet(day.note || '');
                            }}
                            className={`p-2.5 rounded-xl border cursor-pointer hover:scale-105 transition-all ${
                              day.status === 'available'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : day.status === 'limited'
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                : day.status === 'flight'
                                ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            }`}
                          >
                            <span className="font-bold block">{day.date.slice(5)}</span>
                            <span className="text-[10px] uppercase font-black block mt-0.5">{day.status}</span>
                            <span className="text-[9px] opacity-75 truncate block mt-0.5">{day.note}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: VISUAL THEME COLORS */}
              {activeTab === 'theme' && (
                <form onSubmit={handleSaveTheme} className="space-y-6">
                  <div>
                    <h4 className="font-serif font-black text-lg text-[#d4af37]">
                      Live Visual Theme & Color Palette
                    </h4>
                    <p className="text-xs opacity-75">
                      Adjust the color codes for both Dark Mode and Light Mode. All updates are applied immediately across the site.
                    </p>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold opacity-70">Quick Presets:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setThemeForm({
                          darkBg: '#041226',
                          darkCard: '#071c38',
                          darkAccentGold: '#d4af37',
                          darkText: '#f8fafc',
                          lightBg: '#faf8f5',
                          lightCard: '#ffffff',
                          lightAccentGold: '#c59b27',
                          lightText: '#04142b',
                        })
                      }
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30"
                    >
                      Reference: Royal Midnight Navy & Metallic Gold
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setThemeForm({
                          darkBg: '#0b162c',
                          darkCard: '#132347',
                          darkAccentGold: '#f0c040',
                          darkText: '#ffffff',
                          lightBg: '#fbf9f4',
                          lightCard: '#ffffff',
                          lightAccentGold: '#d4af37',
                          lightText: '#091529',
                        })
                      }
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/10 text-slate-300 border border-white/20"
                    >
                      Sapphire & Champagne Gold
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Dark Theme Colors */}
                    <div
                      className={`p-4 rounded-2xl border ${
                        isDark ? 'bg-[#061833] border-white/10' : 'bg-white border-slate-200'
                      }`}
                    >
                      <h5 className="font-bold text-sm mb-3 flex items-center gap-2 text-[#d4af37]">
                        <span>Dark Theme Palette</span>
                        <span className="w-3 h-3 rounded-full bg-[#041226] border border-[#d4af37]" />
                      </h5>
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block font-semibold mb-1">Dark Background Color:</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={themeForm.darkBg}
                              onChange={(e) => setThemeForm({ ...themeForm, darkBg: e.target.value })}
                              className="w-8 h-8 rounded border border-white/20 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={themeForm.darkBg}
                              onChange={(e) => setThemeForm({ ...themeForm, darkBg: e.target.value })}
                              className={`flex-1 px-3 py-1.5 rounded-lg border font-mono ${
                                isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-slate-50 border-slate-300'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">Dark Card / Surface Color:</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={themeForm.darkCard}
                              onChange={(e) => setThemeForm({ ...themeForm, darkCard: e.target.value })}
                              className="w-8 h-8 rounded border border-white/20 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={themeForm.darkCard}
                              onChange={(e) => setThemeForm({ ...themeForm, darkCard: e.target.value })}
                              className={`flex-1 px-3 py-1.5 rounded-lg border font-mono ${
                                isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-slate-50 border-slate-300'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">Metallic Gold Accent:</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={themeForm.darkAccentGold}
                              onChange={(e) => setThemeForm({ ...themeForm, darkAccentGold: e.target.value })}
                              className="w-8 h-8 rounded border border-white/20 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={themeForm.darkAccentGold}
                              onChange={(e) => setThemeForm({ ...themeForm, darkAccentGold: e.target.value })}
                              className={`flex-1 px-3 py-1.5 rounded-lg border font-mono ${
                                isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-slate-50 border-slate-300'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Light Theme Colors */}
                    <div
                      className={`p-4 rounded-2xl border ${
                        isDark ? 'bg-[#061833] border-white/10' : 'bg-white border-slate-200'
                      }`}
                    >
                      <h5 className="font-bold text-sm mb-3 flex items-center gap-2 text-[#d4af37]">
                        <span>Light Theme Palette</span>
                        <span className="w-3 h-3 rounded-full bg-[#faf8f5] border border-[#d4af37]" />
                      </h5>
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block font-semibold mb-1">Light Background (Marble/Alabaster):</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={themeForm.lightBg}
                              onChange={(e) => setThemeForm({ ...themeForm, lightBg: e.target.value })}
                              className="w-8 h-8 rounded border border-slate-300 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={themeForm.lightBg}
                              onChange={(e) => setThemeForm({ ...themeForm, lightBg: e.target.value })}
                              className={`flex-1 px-3 py-1.5 rounded-lg border font-mono ${
                                isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-slate-50 border-slate-300'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">Light Card Surface:</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={themeForm.lightCard}
                              onChange={(e) => setThemeForm({ ...themeForm, lightCard: e.target.value })}
                              className="w-8 h-8 rounded border border-slate-300 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={themeForm.lightCard}
                              onChange={(e) => setThemeForm({ ...themeForm, lightCard: e.target.value })}
                              className={`flex-1 px-3 py-1.5 rounded-lg border font-mono ${
                                isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-slate-50 border-slate-300'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">Light Theme Gold Accent:</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={themeForm.lightAccentGold}
                              onChange={(e) => setThemeForm({ ...themeForm, lightAccentGold: e.target.value })}
                              className="w-8 h-8 rounded border border-slate-300 cursor-pointer bg-transparent"
                            />
                            <input
                              type="text"
                              value={themeForm.lightAccentGold}
                              onChange={(e) => setThemeForm({ ...themeForm, lightAccentGold: e.target.value })}
                              className={`flex-1 px-3 py-1.5 rounded-lg border font-mono ${
                                isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-slate-50 border-slate-300'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-black text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>Apply Colors Live</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetThemeColors();
                        showNotice('Theme colors reset to default.');
                      }}
                      className="px-4 py-2.5 rounded-xl border border-white/20 text-xs font-semibold hover:bg-white/5"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: SITE COPY & BUSINESS INFO */}
              {activeTab === 'copy' && (
                <form onSubmit={handleSaveCopy} className="space-y-5">
                  <div>
                    <h4 className="font-serif font-black text-lg text-[#d4af37]">
                      Site Copy & Business Information
                    </h4>
                    <p className="text-xs opacity-75">
                      Update headlines, bio, phone numbers, and emergency lines.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Top Announcement Banner:</label>
                      <input
                        type="text"
                        value={copyForm.announcementBanner}
                        onChange={(e) => setCopyForm({ ...copyForm, announcementBanner: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Hero Tagline:</label>
                      <input
                        type="text"
                        value={copyForm.heroTagline}
                        onChange={(e) => setCopyForm({ ...copyForm, heroTagline: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1">Hero Headline:</label>
                      <input
                        type="text"
                        value={copyForm.heroTitle}
                        onChange={(e) => setCopyForm({ ...copyForm, heroTitle: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1">Hero Subtitle:</label>
                      <textarea
                        rows={2}
                        value={copyForm.heroSubtitle}
                        onChange={(e) => setCopyForm({ ...copyForm, heroSubtitle: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1">Founder Biography:</label>
                      <textarea
                        rows={3}
                        value={copyForm.aboutBio}
                        onChange={(e) => setCopyForm({ ...copyForm, aboutBio: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Business Phone:</label>
                      <input
                        type="text"
                        value={copyForm.businessPhone}
                        onChange={(e) => setCopyForm({ ...copyForm, businessPhone: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">24/7 Emergency Line:</label>
                      <input
                        type="text"
                        value={copyForm.emergencyLine}
                        onChange={(e) => setCopyForm({ ...copyForm, emergencyLine: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1">Service Hubs & Cities:</label>
                      <input
                        type="text"
                        value={copyForm.serviceHubs}
                        onChange={(e) => setCopyForm({ ...copyForm, serviceHubs: e.target.value })}
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-black text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Copy Changes</span>
                  </button>
                </form>
              )}

              {/* TAB 5: PROMOTIONS & DISCOUNT CODES */}
              {activeTab === 'promotions' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif font-black text-lg text-[#d4af37]">
                      Promotions & Discount Codes
                    </h4>
                    <p className="text-xs opacity-75">
                      Create temporary or permanent promotion codes that customers can apply during booking.
                    </p>
                  </div>

                  {/* Create New Promo Form */}
                  <form
                    onSubmit={handleCreatePromo}
                    className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-[#061833] border-white/10' : 'bg-white border-slate-200'
                    }`}
                  >
                    <h5 className="font-bold text-sm text-[#d4af37] mb-3">Create New Promo Code</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                      <div>
                        <label className="block font-semibold mb-1">Code (e.g. SUMMER50):</label>
                        <input
                          type="text"
                          value={newPromoCode}
                          onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                          placeholder="PROMOCODE"
                          className={`w-full px-3 py-2 rounded-xl border uppercase font-mono font-bold ${
                            isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Discount Type & Value:</label>
                        <div className="flex gap-2">
                          <select
                            value={newPromoType}
                            onChange={(e) => setNewPromoType(e.target.value as 'fixed' | 'percentage')}
                            className={`px-2 py-2 rounded-xl border ${
                              isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                            }`}
                          >
                            <option value="fixed">$ Flat</option>
                            <option value="percentage">% Percent</option>
                          </select>
                          <input
                            type="number"
                            value={newPromoValue}
                            onChange={(e) => setNewPromoValue(Number(e.target.value))}
                            className={`flex-1 px-3 py-2 rounded-xl border ${
                              isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Minimum Spend ($):</label>
                        <input
                          type="number"
                          value={newPromoMinSpend}
                          onChange={(e) => setNewPromoMinSpend(Number(e.target.value))}
                          placeholder="0 for none"
                          className={`w-full px-3 py-2 rounded-xl border ${
                            isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold mb-1">Description / Benefit:</label>
                        <input
                          type="text"
                          value={newPromoDesc}
                          onChange={(e) => setNewPromoDesc(e.target.value)}
                          placeholder="e.g. $50 off travel flight accompaniment"
                          className={`w-full px-3 py-2 rounded-xl border ${
                            isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Validity:</label>
                        <div className="flex items-center gap-2 mt-2">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newPromoPermanent}
                              onChange={(e) => setNewPromoPermanent(e.target.checked)}
                              className="rounded text-[#d4af37]"
                            />
                            <span>Permanent Code</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Promotion</span>
                    </button>
                  </form>

                  {/* Existing Promotions List */}
                  <div className="space-y-3">
                    <h5 className="font-bold text-sm">Active Promotion Codes ({promotions.length})</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {promotions.map((p) => (
                        <div
                          key={p.id}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                            isDark ? 'bg-[#061833] border-white/10' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono font-black text-sm px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40">
                                {p.code}
                              </span>
                              <span className="text-[10px] font-bold uppercase opacity-70">
                                {p.isPermanent ? 'Permanent' : `Expires ${p.expiresAt}`}
                              </span>
                            </div>
                            <p className="font-semibold">{p.description}</p>
                            {p.minSpend ? (
                              <p className="text-[10px] opacity-70">Min Spend: ${p.minSpend}</p>
                            ) : null}
                          </div>

                          <button
                            onClick={() => {
                              deletePromotion(p.id);
                              showNotice(`Deleted promo code ${p.code}`);
                            }}
                            className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                            title="Delete promo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: MEDIA GALLERY UPLOADER */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif font-black text-lg text-[#d4af37]">
                      Media & Photo Gallery Manager
                    </h4>
                    <p className="text-xs opacity-75">
                      Upload or link new photos to show on the website cards, stories, and service gallery.
                    </p>
                  </div>

                  {/* Add Media Form */}
                  <form
                    onSubmit={handleCreateMedia}
                    className={`p-4 rounded-2xl border ${
                      isDark ? 'bg-[#061833] border-white/10' : 'bg-white border-slate-200'
                    }`}
                  >
                    <h5 className="font-bold text-sm text-[#d4af37] mb-3">Add New Photo / Media</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                      <div>
                        <label className="block font-semibold mb-1">Title:</label>
                        <input
                          type="text"
                          value={newMediaTitle}
                          onChange={(e) => setNewMediaTitle(e.target.value)}
                          placeholder="e.g. Safe Flight Accompaniment"
                          className={`w-full px-3 py-2 rounded-xl border ${
                            isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Category:</label>
                        <select
                          value={newMediaCategory}
                          onChange={(e) =>
                            setNewMediaCategory(
                              e.target.value as 'childcare' | 'passport_travel' | 'hair_locs' | 'adventures' | 'branding'
                            )
                          }
                          className={`w-full px-3 py-2 rounded-xl border ${
                            isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                          }`}
                        >
                          <option value="childcare">Childcare & Nanny</option>
                          <option value="passport_travel">Passport Travel Nanny</option>
                          <option value="hair_locs">Locs & Braids</option>
                          <option value="adventures">Adventure Days</option>
                          <option value="branding">Branding</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Upload Photo from Device:</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadImageFile}
                          className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#d4af37] file:text-[#041226] hover:file:bg-[#aa8214] cursor-pointer"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold mb-1">Or Image URL:</label>
                        <input
                          type="text"
                          value={newMediaUrl}
                          onChange={(e) => setNewMediaUrl(e.target.value)}
                          placeholder="https://... or /assets/..."
                          className={`w-full px-3 py-2 rounded-xl border ${
                            isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Caption:</label>
                        <input
                          type="text"
                          value={newMediaCaption}
                          onChange={(e) => setNewMediaCaption(e.target.value)}
                          placeholder="Short story or context..."
                          className={`w-full px-3 py-2 rounded-xl border ${
                            isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>
                    </div>

                    {newMediaUrl && (
                      <div className="mb-3">
                        <span className="text-[10px] opacity-70 block mb-1">Preview:</span>
                        <img
                          src={newMediaUrl}
                          alt="Upload preview"
                          className="h-24 w-36 object-cover rounded-xl border border-[#d4af37]/40 shadow-sm"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!newMediaUrl}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all disabled:opacity-40"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Add to Gallery</span>
                    </button>
                  </form>

                  {/* Gallery Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {mediaGallery.map((m) => (
                      <div
                        key={m.id}
                        className={`rounded-2xl border overflow-hidden group relative flex flex-col ${
                          isDark ? 'bg-[#061833] border-white/10' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="h-32 w-full overflow-hidden relative">
                          <img
                            src={m.url}
                            alt={m.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={() => {
                              deleteMediaItem(m.id);
                              showNotice('Media item removed');
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                            title="Delete image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-2.5 text-xs flex-1 flex flex-col justify-between">
                          <div>
                            <span className="font-bold line-clamp-1">{m.title}</span>
                            <span className="text-[10px] uppercase font-bold text-[#d4af37] block mt-0.5">
                              {m.category.replace('_', ' ')}
                            </span>
                            {m.caption && <p className="text-[10px] opacity-70 line-clamp-2 mt-1">{m.caption}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: PRICING & RATES */}
              {activeTab === 'pricing' && (
                <form onSubmit={handleSavePricing} className="space-y-5">
                  <div>
                    <h4 className="font-serif font-black text-lg text-[#d4af37]">
                      Pricing & Service Rates Configuration
                    </h4>
                    <p className="text-xs opacity-75">
                      Adjust base hourly and flat rates. Changes immediately update the live pricing calculator and booking modals.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Standard Nanny Hourly ($/hr):</label>
                      <input
                        type="number"
                        value={pricingForm.nannyHourly}
                        onChange={(e) => setPricingForm({ ...pricingForm, nannyHourly: Number(e.target.value) })}
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Passport Travel Nanny Hourly ($/hr):</label>
                      <input
                        type="number"
                        value={pricingForm.passportTravelHourly}
                        onChange={(e) =>
                          setPricingForm({ ...pricingForm, passportTravelHourly: Number(e.target.value) })
                        }
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">School Pickup Base ($):</label>
                      <input
                        type="number"
                        value={pricingForm.schoolPickupRate}
                        onChange={(e) => setPricingForm({ ...pricingForm, schoolPickupRate: Number(e.target.value) })}
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Adventure Day Hourly ($/hr):</label>
                      <input
                        type="number"
                        value={pricingForm.adventureDayHourly}
                        onChange={(e) => setPricingForm({ ...pricingForm, adventureDayHourly: Number(e.target.value) })}
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Pet Nanny Hourly ($/hr):</label>
                      <input
                        type="number"
                        value={pricingForm.petNannyHourly}
                        onChange={(e) => setPricingForm({ ...pricingForm, petNannyHourly: Number(e.target.value) })}
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Additional Child Surcharge ($/hr):</label>
                      <input
                        type="number"
                        value={pricingForm.additionalChildRate}
                        onChange={(e) =>
                          setPricingForm({ ...pricingForm, additionalChildRate: Number(e.target.value) })
                        }
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-black text-xs flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Pricing Rates</span>
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
