import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { useBusiness } from '../context/BusinessContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { PassportNanaLogo } from './PassportNanaLogo.tsx';
import {
  X,
  Plane,
  Clock,
  Calendar,
  ShieldCheck,
  Phone,
  MapPin,
  CheckCircle2,
  FileText,
  Download,
  Send,
  Heart,
  Baby,
  LogOut,
  LogIn,
  Save,
  Plus,
  Edit3,
  Ban,
} from 'lucide-react';
import { LiveUpdateRecord } from '../types/business.ts';
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
  const {
    currentUser,
    isAuthReady,
    signInWithGoogle,
    signOutUser,
    bookings,
    bookingsLoading,
    careProfile,
    saveCareProfile,
    siteCopy,
    addLiveUpdate,
    updateBookingFlight,
    updateBookingClientNotes,
  } = useBusiness();

  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<
    'itinerary' | 'live_feed' | 'children_profile' | 'invoices'
  >('itinerary');

  // Real-time liveUpdates from Firestore subcollection
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdateRecord[]>([]);
  const [clientMessage, setClientMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Flight Manifest editor state
  const [editingFlight, setEditingFlight] = useState(false);
  const [flightAirline, setFlightAirline] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [flightDeparture, setFlightDeparture] = useState('');
  const [flightDestination, setFlightDestination] = useState('');
  const [flightTerminal, setFlightTerminal] = useState('');
  const [hotelName, setHotelName] = useState('');

  // Booking Location / Notes editor state
  const [editingNotes, setEditingNotes] = useState(false);
  const [editLocation, setEditLocation] = useState('');
  const [editSpecialRequests, setEditSpecialRequests] = useState('');
  const [editChildrenDetails, setEditChildrenDetails] = useState('');

  // Care Profile Form State
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [pediatricianInfo, setPediatricianInfo] = useState('');
  const [childrenDetails, setChildrenDetails] = useState('');
  const [allergiesAndMedical, setAllergiesAndMedical] = useState('');
  const [dailyRoutines, setDailyRoutines] = useState('');
  const [petCareDetails, setPetCareDetails] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [portalNotice, setPortalNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setPortalNotice(msg);
    setTimeout(() => setPortalNotice(null), 3500);
  };

  // Keep selectedBookingId synced with real user bookings
  useEffect(() => {
    if (bookings.length > 0) {
      if (!selectedBookingId || !bookings.some((b) => b.id === selectedBookingId)) {
        setSelectedBookingId(bookings[0].id);
      }
    } else {
      setSelectedBookingId('');
    }
  }, [bookings, selectedBookingId]);

  const currentBooking = bookings.find((b) => b.id === selectedBookingId) || null;

  // Sync flight & notes form fields when currentBooking changes
  useEffect(() => {
    if (currentBooking) {
      setFlightAirline(currentBooking.flightDetails?.airline || '');
      setFlightNumber(currentBooking.flightDetails?.flightNumber || '');
      setFlightDeparture(currentBooking.flightDetails?.departureCity || '');
      setFlightDestination(currentBooking.flightDetails?.destinationCity || '');
      setFlightTerminal(currentBooking.flightDetails?.terminal || '');
      setHotelName(currentBooking.flightDetails?.hotelName || '');
      setEditLocation(currentBooking.locationAddress || '');
      setEditSpecialRequests(currentBooking.specialRequests || '');
      setEditChildrenDetails(currentBooking.childrenDetails || '');
    }
  }, [currentBooking]);

  // Sync CareProfile form state from Firestore careProfile or currentUser
  useEffect(() => {
    if (careProfile) {
      setParentName(careProfile.parentName || '');
      setPhone(careProfile.phone || '');
      setEmail(careProfile.email || '');
      setHomeAddress(careProfile.homeAddress || '');
      setEmergencyContactName(careProfile.emergencyContactName || '');
      setEmergencyContactPhone(careProfile.emergencyContactPhone || '');
      setPediatricianInfo(careProfile.pediatricianInfo || '');
      setChildrenDetails(careProfile.childrenDetails || '');
      setAllergiesAndMedical(careProfile.allergiesAndMedical || '');
      setDailyRoutines(careProfile.dailyRoutines || '');
      setPetCareDetails(careProfile.petCareDetails || '');
    } else if (currentUser) {
      setParentName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
    }
  }, [careProfile, currentUser]);

  // Subscribe to real-time liveUpdates subcollection for the selected booking
  useEffect(() => {
    if (!isOpen || !currentUser || !currentBooking) {
      setLiveUpdates([]);
      return;
    }

    const path = `bookings/${currentBooking.id}/liveUpdates`;
    const unsub = onSnapshot(
      collection(db, 'bookings', currentBooking.id, 'liveUpdates'),
      (snap) => {
        const list: LiveUpdateRecord[] = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            bookingId: d.bookingId,
            authorUid: d.authorUid,
            authorName: d.authorName,
            authorRole: d.authorRole,
            message: d.message,
            type: d.type,
            timeLabel: d.timeLabel,
            createdAt: d.createdAt,
          });
        });
        list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        setLiveUpdates(list);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, path);
      }
    );

    return () => unsub();
  }, [isOpen, currentUser, currentBooking?.id]);

  if (!isOpen) return null;

  const handleSaveFlightManifest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBooking) return;
    await updateBookingFlight(currentBooking.id, {
      airline: flightAirline.trim(),
      flightNumber: flightNumber.trim(),
      departureCity: flightDeparture.trim(),
      destinationCity: flightDestination.trim(),
      terminal: flightTerminal.trim(),
      hotelName: hotelName.trim(),
    });
    await addLiveUpdate(
      currentBooking.id,
      `Updated Flight Manifest: ${flightAirline} ${flightNumber} (${flightDeparture} -> ${flightDestination})`,
      'flight',
      'client'
    );
    setEditingFlight(false);
    showNotice('Flight & Travel Manifest saved to your reservation.');
  };

  const handleSaveBookingNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBooking) return;
    await updateBookingClientNotes(currentBooking.id, {
      locationAddress: editLocation.trim(),
      specialRequests: editSpecialRequests.trim(),
      childrenDetails: editChildrenDetails.trim(),
    });
    setEditingNotes(false);
    showNotice('Care address and instructions updated.');
  };

  const handleCancelBooking = async () => {
    if (!currentBooking) return;
    await updateBookingClientNotes(currentBooking.id, {
      status: 'cancelled',
    });
    await addLiveUpdate(
      currentBooking.id,
      'Reservation cancelled by client via VIP Portal.',
      'milestone',
      'client'
    );
    showNotice('Reservation status updated to Cancelled.');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientMessage.trim() || !currentBooking || sendingMessage) return;

    setSendingMessage(true);
    try {
      await addLiveUpdate(currentBooking.id, clientMessage.trim(), 'message', 'client');
      setClientMessage('');
      showNotice('Message delivered to Nana’s live care log.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSaveCareProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim()) return;
    setSavingProfile(true);
    try {
      await saveCareProfile({
        parentName: parentName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        homeAddress: homeAddress.trim(),
        emergencyContactName: emergencyContactName.trim(),
        emergencyContactPhone: emergencyContactPhone.trim(),
        pediatricianInfo: pediatricianInfo.trim(),
        childrenDetails: childrenDetails.trim(),
        allergiesAndMedical: allergiesAndMedical.trim(),
        dailyRoutines: dailyRoutines.trim(),
        petCareDetails: petCareDetails.trim(),
      });
      showNotice('Your Family & Child Care Dossier has been securely saved.');
    } finally {
      setSavingProfile(false);
    }
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

  const handleDownloadInvoiceReceipt = () => {
    if (!currentBooking) return;
    const balance = currentBooking.finalPaid
      ? 0
      : currentBooking.depositPaid
      ? Math.max(0, currentBooking.estimatedTotal - currentBooking.requiredDeposit)
      : currentBooking.estimatedTotal;

    const receiptHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Passport Nana Invoice - ${currentBooking.confirmationCode}</title>
  <style>
    body { font-family: Georgia, serif; color: #04142b; padding: 40px; max-width: 720px; margin: 0 auto; }
    .header { border-bottom: 2px solid #d4af37; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 26px; font-weight: bold; color: #041226; }
    .gold { color: #b8860b; font-weight: bold; }
    .box { background: #faf8f5; border: 1px solid #d4af37; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .total { font-size: 18px; font-weight: bold; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">Passport Nana</div>
      <div class="gold">Luxury Care That Travels! • Ken'nyzhae Nathaniel</div>
      <div>Phone: ${siteCopy.businessPhone} • Email: ${siteCopy.businessEmail}</div>
    </div>
    <div style="text-align: right;">
      <div><strong>Invoice #:</strong> INV-${currentBooking.confirmationCode}</div>
      <div><strong>Date:</strong> ${currentBooking.serviceDate}</div>
      <div><strong>Status:</strong> ${currentBooking.status.toUpperCase()}</div>
    </div>
  </div>
  <div class="box">
    <div><strong>Client:</strong> ${currentBooking.clientName}</div>
    <div><strong>Phone:</strong> ${currentBooking.clientPhone}</div>
    <div><strong>Email:</strong> ${currentBooking.clientEmail}</div>
    <div><strong>Care Location:</strong> ${currentBooking.locationAddress}</div>
  </div>
  <div class="box">
    <div class="row"><span>Service</span><span><strong>${currentBooking.serviceTitle}</strong></span></div>
    <div class="row"><span>Scheduled Date & Time</span><span>${currentBooking.serviceDate} at ${currentBooking.startTime}</span></div>
    <div class="row"><span>Duration & Children</span><span>${currentBooking.hours} hrs • ${currentBooking.childrenCount} Child(ren)</span></div>
    <div class="row"><span>Total Service Estimate</span><span>${formatCurrency(currentBooking.estimatedTotal)}</span></div>
    <div class="row"><span>Required Slot Deposit (${currentBooking.depositPaid ? 'Confirmed' : 'Pending'})</span><span>${formatCurrency(currentBooking.requiredDeposit)}</span></div>
    <div class="row total"><span>Remaining Balance Due</span><span>${formatCurrency(balance)}</span></div>
  </div>
  <p style="font-size: 12px; color: #64748b; text-align: center;">Thank you for trusting Passport Nana with your family's care.</p>
</body>
</html>`;

    const blob = new Blob([receiptHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Passport-Nana-Invoice-${currentBooking.confirmationCode}.html`);
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
                  Live Cloud Sync
                </span>
              </h3>
              <p className="text-xs opacity-70">
                Manage your reservations, flight manifests, family care profile & live check-ins
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                onClick={signOutUser}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Sign out of Client Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close portal"
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {portalNotice && (
          <div className="bg-emerald-500 text-slate-950 px-5 py-2 font-bold text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{portalNotice}</span>
            </div>
            <button onClick={() => setPortalNotice(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Authentication Gate if not signed in */}
        {!isAuthReady ? (
          <div className="flex-1 p-12 flex items-center justify-center text-sm opacity-75">
            Verifying secure session...
          </div>
        ) : !currentUser ? (
          <div className="flex-1 p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="font-serif font-black text-2xl text-[#d4af37]">
                Family Client Sign-In
              </h4>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                Sign in with your Google account to view your active bookings, update flight accompaniment manifests, manage your children’s private care & allergy profile, and message Nana Ken’nyzhae in real time.
              </p>
            </div>
            <button
              onClick={signInWithGoogle}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#aa8214] text-[#041226] font-black text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>
            <div className="pt-4 border-t border-white/10 w-full text-xs opacity-75 flex items-center justify-between">
              <span>Need to schedule your first session?</span>
              <button
                onClick={() => {
                  onClose();
                  onOpenBooking();
                }}
                className="font-bold text-[#d4af37] hover:underline cursor-pointer"
              >
                Book Nana Now →
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Client Account & Reservation Selector Bar */}
            <div
              className={`px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b ${
                isDark ? 'bg-[#030d1d] border-white/5' : 'bg-[#f4efe6] border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
                <span className="font-bold opacity-70 flex-shrink-0">
                  Signed in as {currentUser.displayName || currentUser.email}:
                </span>
                {bookings.length > 0 ? (
                  bookings.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBookingId(b.id)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex-shrink-0 border cursor-pointer ${
                        selectedBookingId === b.id
                          ? 'bg-[#d4af37] text-[#041226] border-[#d4af37] shadow-sm font-black'
                          : isDark
                          ? 'bg-white/5 text-slate-300 border-white/10 hover:border-[#d4af37]/50'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-[#d4af37]/50'
                      }`}
                    >
                      {b.serviceDate} • {b.confirmationCode}
                    </button>
                  ))
                ) : (
                  <span className="opacity-60 italic">No bookings yet</span>
                )}
              </div>

              <div className="flex items-center gap-3">
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
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'itinerary'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>My Bookings & Flight Manifest ({bookings.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('live_feed')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors relative cursor-pointer ${
                  activeTab === 'live_feed'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Live Care Log & Messages ({liveUpdates.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('children_profile')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'children_profile'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Baby className="w-4 h-4" />
                <span>Family & Child Care Dossier</span>
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`py-3 px-4 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'invoices'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Invoices & Statements</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
              {/* TAB 3: FAMILY & CHILD CARE DOSSIER (Always accessible even before first booking) */}
              {activeTab === 'children_profile' ? (
                <form onSubmit={handleSaveCareProfile} className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-serif font-black text-lg text-[#d4af37] flex items-center gap-2">
                        <Heart className="w-4 h-4 fill-[#d4af37]" />
                        <span>Family, Child & Pet Care Dossier</span>
                      </h4>
                      <p className="text-xs opacity-75">
                        Stored privately in your encrypted client profile so Nana has your routines, allergies, and emergency contacts ready for every session.
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-black text-xs flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingProfile ? 'Saving...' : 'Save Care Dossier'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold mb-1">Parent / Guardian Full Name *</label>
                      <input
                        type="text"
                        required
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="Your full name"
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Primary Phone Number *</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 305-555-0199"
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Primary Home / Hotel Address</label>
                      <input
                        type="text"
                        value={homeAddress}
                        onChange={(e) => setHomeAddress(e.target.value)}
                        placeholder="Street address, city, state"
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Emergency Contact Name & Relation</label>
                      <input
                        type="text"
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        placeholder="Secondary contact person"
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Emergency Contact Phone</label>
                      <input
                        type="tel"
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        placeholder="Emergency phone number"
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1">Pediatrician / Preferred Medical Facility</label>
                      <input
                        type="text"
                        value={pediatricianInfo}
                        onChange={(e) => setPediatricianInfo(e.target.value)}
                        placeholder="Doctor name, clinic address, and phone"
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1">Children Names, Ages & Interests</label>
                      <textarea
                        rows={2}
                        value={childrenDetails}
                        onChange={(e) => setChildrenDetails(e.target.value)}
                        placeholder="List each child's name, age, favorite books, activities, or comfort items"
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1 text-amber-400">
                        Allergies, Medical Conditions & Dietary Restrictions
                      </label>
                      <textarea
                        rows={2}
                        value={allergiesAndMedical}
                        onChange={(e) => setAllergiesAndMedical(e.target.value)}
                        placeholder="Food allergies, medication schedules, EpiPen location, or sensory sensitivities"
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1">Nap, Meal & Bedtime Routines</label>
                      <textarea
                        rows={2}
                        value={dailyRoutines}
                        onChange={(e) => setDailyRoutines(e.target.value)}
                        placeholder="Preferred meal times, nap schedule, bedtime rituals, screen-time rules"
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1">Pet Nanny Instructions (If Applicable)</label>
                      <textarea
                        rows={2}
                        value={petCareDetails}
                        onChange={(e) => setPetCareDetails(e.target.value)}
                        placeholder="Pet names, breed, feeding schedule, walk routines, and veterinarian contact"
                        className={`w-full px-3 py-2 rounded-xl border ${
                          isDark ? 'bg-[#061833] border-white/15 text-white' : 'bg-white border-slate-300'
                        }`}
                      />
                    </div>
                  </div>
                </form>
              ) : bookingsLoading ? (
                <div className="text-center py-12 text-xs opacity-75">
                  Loading your reservations...
                </div>
              ) : !currentBooking ? (
                /* Empty state when user has 0 bookings */
                <div className="text-center py-12 max-w-md mx-auto space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mx-auto">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif font-black text-xl text-[#d4af37]">
                    No Reservations Found Yet
                  </h4>
                  <p className="text-xs opacity-80 leading-relaxed">
                    You don’t have any active or past bookings under <strong>{currentUser.email}</strong> yet. Schedule your first nanny, travel accompaniment, or hair care appointment now, or fill out your Family Care Dossier in the tab above.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenBooking();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#aa8214] text-[#041226] font-black text-xs shadow-lg hover:scale-105 transition-all cursor-pointer"
                    >
                      Book Nana Now
                    </button>
                    <button
                      onClick={() => setActiveTab('children_profile')}
                      className="px-4 py-2.5 rounded-xl border border-[#d4af37]/40 text-[#d4af37] font-bold text-xs hover:bg-[#d4af37]/10 transition-all cursor-pointer"
                    >
                      Complete Family Care Dossier
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* TAB 1: ITINERARY & FLIGHT MANIFEST */}
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
                            <span className="text-xs font-mono opacity-75">
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

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={handleDownloadCalendar}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                              isDark
                                ? 'border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10'
                                : 'border-[#d4af37] text-[#04142b] hover:bg-amber-50'
                            }`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Save .ics Calendar</span>
                          </button>

                          {currentBooking.status !== 'cancelled' && currentBooking.status !== 'completed' && (
                            <button
                              onClick={handleCancelBooking}
                              className="px-3 py-2 rounded-xl text-xs font-bold border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 flex items-center gap-1 cursor-pointer"
                            >
                              <Ban className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Flight & Travel Manifest Card (View + Live Edit) */}
                      <div
                        className={`p-5 rounded-2xl border ${
                          isDark ? 'bg-[#061833] border-sky-500/30' : 'bg-sky-50/70 border-sky-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-sky-400">
                            <Plane className="w-5 h-5" />
                            <h5 className="font-serif font-black text-sm uppercase tracking-wider">
                              Passport Nanny Flight & Travel Manifest
                            </h5>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditingFlight(!editingFlight)}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{editingFlight ? 'Cancel Edit' : 'Update Flight Details'}</span>
                          </button>
                        </div>

                        {editingFlight ? (
                          <form onSubmit={handleSaveFlightManifest} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <label className="block font-semibold mb-1">Airline:</label>
                              <input
                                type="text"
                                value={flightAirline}
                                onChange={(e) => setFlightAirline(e.target.value)}
                                placeholder="e.g. Delta, American, Air France"
                                className={`w-full px-3 py-2 rounded-xl border ${
                                  isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block font-semibold mb-1">Flight Number:</label>
                              <input
                                type="text"
                                value={flightNumber}
                                onChange={(e) => setFlightNumber(e.target.value)}
                                placeholder="e.g. DL402"
                                className={`w-full px-3 py-2 rounded-xl border ${
                                  isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block font-semibold mb-1">Terminal / Gate:</label>
                              <input
                                type="text"
                                value={flightTerminal}
                                onChange={(e) => setFlightTerminal(e.target.value)}
                                placeholder="e.g. Terminal South, Gate B12"
                                className={`w-full px-3 py-2 rounded-xl border ${
                                  isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block font-semibold mb-1">Departure Airport / City:</label>
                              <input
                                type="text"
                                value={flightDeparture}
                                onChange={(e) => setFlightDeparture(e.target.value)}
                                placeholder="e.g. Miami (MIA)"
                                className={`w-full px-3 py-2 rounded-xl border ${
                                  isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block font-semibold mb-1">Destination Airport / City:</label>
                              <input
                                type="text"
                                value={flightDestination}
                                onChange={(e) => setFlightDestination(e.target.value)}
                                placeholder="e.g. London (LHR)"
                                className={`w-full px-3 py-2 rounded-xl border ${
                                  isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                                }`}
                              />
                            </div>
                            <div>
                              <label className="block font-semibold mb-1">Destination Hotel / Resort:</label>
                              <input
                                type="text"
                                value={hotelName}
                                onChange={(e) => setHotelName(e.target.value)}
                                placeholder="Hotel name & room/reservation"
                                className={`w-full px-3 py-2 rounded-xl border ${
                                  isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                                }`}
                              />
                            </div>
                            <div className="sm:col-span-3 flex justify-end pt-1">
                              <button
                                type="submit"
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-black text-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Save Flight Manifest</span>
                              </button>
                            </div>
                          </form>
                        ) : currentBooking.flightDetails?.airline || currentBooking.flightDetails?.flightNumber ? (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                            <div className="p-3 rounded-xl bg-black/10 border border-black/5">
                              <span className="opacity-60 block">Airline & Flight:</span>
                              <span className="font-bold text-sm">
                                {currentBooking.flightDetails.airline} {currentBooking.flightDetails.flightNumber}
                              </span>
                              <span className="block opacity-80 mt-1">
                                {currentBooking.flightDetails.terminal || 'Terminal TBD'}
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-black/10 border border-black/5">
                              <span className="opacity-60 block">Route:</span>
                              <span className="font-bold text-sm">
                                {currentBooking.flightDetails.departureCity || 'Origin'} ➔{' '}
                                {currentBooking.flightDetails.destinationCity || 'Destination'}
                              </span>
                              <span className="block opacity-80 mt-1">Travel Accompaniment Registered</span>
                            </div>
                            <div className="p-3 rounded-xl bg-black/10 border border-black/5">
                              <span className="opacity-60 block">Hotel / Lodging:</span>
                              <span className="font-bold text-sm">
                                {currentBooking.flightDetails.hotelName || 'Not specified'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs opacity-75">
                            Travelling with Nana? Click <strong>Update Flight Details</strong> above to attach your airline, flight number, departure gate, and destination hotel to this booking.
                          </p>
                        )}
                      </div>

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
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-sm flex items-center gap-1.5 text-[#d4af37]">
                              <MapPin className="w-4 h-4" />
                              <span>Location & Care Instructions</span>
                            </h5>
                            <button
                              type="button"
                              onClick={() => setEditingNotes(!editingNotes)}
                              className="text-xs text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{editingNotes ? 'Cancel' : 'Edit'}</span>
                            </button>
                          </div>

                          {editingNotes ? (
                            <form onSubmit={handleSaveBookingNotes} className="space-y-2.5">
                              <div>
                                <label className="block font-semibold mb-0.5">Location Address:</label>
                                <input
                                  type="text"
                                  value={editLocation}
                                  onChange={(e) => setEditLocation(e.target.value)}
                                  className={`w-full px-2.5 py-1.5 rounded-lg border ${
                                    isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-slate-50 border-slate-300'
                                  }`}
                                />
                              </div>
                              <div>
                                <label className="block font-semibold mb-0.5">Special Requests / Notes:</label>
                                <textarea
                                  rows={2}
                                  value={editSpecialRequests}
                                  onChange={(e) => setEditSpecialRequests(e.target.value)}
                                  className={`w-full px-2.5 py-1.5 rounded-lg border ${
                                    isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-slate-50 border-slate-300'
                                  }`}
                                />
                              </div>
                              <button
                                type="submit"
                                className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-[#041226] font-bold text-xs cursor-pointer"
                              >
                                Save Changes
                              </button>
                            </form>
                          ) : (
                            <>
                              <p className="font-medium">{currentBooking.locationAddress}</p>
                              {currentBooking.specialRequests && (
                                <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                                  <strong>Notes:</strong> {currentBooking.specialRequests}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: LIVE CARE ACTIVITY LOG & REAL-TIME MESSAGING */}
                  {activeTab === 'live_feed' && (
                    <div className="space-y-5">
                      <div>
                        <h4 className="font-serif font-black text-lg text-[#d4af37] flex items-center gap-2">
                          <span>Real-Time Care Timeline & Direct Nana Messaging</span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        </h4>
                        <p className="text-xs opacity-75">
                          Live check-ins from Ken’nyzhae and your direct messages for booking{' '}
                          <strong>{currentBooking.confirmationCode}</strong>.
                        </p>
                      </div>

                      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#d4af37]/30">
                        {liveUpdates.length > 0 ? (
                          liveUpdates.map((update) => (
                            <div key={update.id} className="relative">
                              <div
                                className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 border-[#041226] ${
                                  update.authorRole === 'nana' ? 'bg-emerald-400' : 'bg-[#d4af37]'
                                }`}
                              />
                              <div
                                className={`p-3.5 rounded-2xl border text-xs ${
                                  isDark ? 'bg-[#061833] border-white/10' : 'bg-white border-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1 opacity-80">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                        update.authorRole === 'nana'
                                          ? 'bg-emerald-500/20 text-emerald-300'
                                          : 'bg-[#d4af37]/20 text-[#d4af37]'
                                      }`}
                                    >
                                      {update.authorName}
                                    </span>
                                    <span className="text-[10px] uppercase opacity-70">{update.type}</span>
                                  </div>
                                  <span>{update.timeLabel}</span>
                                </div>
                                <p className="font-medium text-sm leading-relaxed">{update.message}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs opacity-70 italic">
                            No updates posted yet. Send a message below to start the log.
                          </p>
                        )}
                      </div>

                      {/* Send Direct Parent Note */}
                      <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-white/10">
                        <label className="block text-xs font-bold mb-1.5">
                          Send Direct Message or Routine Note to Nana Ken’nyzhae:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={clientMessage}
                            onChange={(e) => setClientMessage(e.target.value)}
                            placeholder="Write a message or update for Nana..."
                            className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#d4af37] ${
                              isDark
                                ? 'bg-[#040f1f] border-white/15 text-white'
                                : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                          <button
                            type="submit"
                            disabled={sendingMessage || !clientMessage.trim()}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{sendingMessage ? 'Sending...' : 'Send'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* TAB 4: INVOICES & STATEMENTS */}
                  {activeTab === 'invoices' && (
                    <div className="space-y-4">
                      <h4 className="font-serif font-black text-lg text-[#d4af37]">
                        Invoices & Payment Statements
                      </h4>

                      <div
                        className={`p-5 rounded-2xl border ${
                          isDark ? 'bg-[#061833] border-[#d4af37]/30' : 'bg-white border-[#d4af37]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div>
                            <span className="text-xs opacity-70">
                              Invoice ID: INV-{currentBooking.confirmationCode}
                            </span>
                            <h5 className="font-bold text-base">{currentBooking.serviceTitle}</h5>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            {currentBooking.finalPaid
                              ? 'Paid in Full'
                              : currentBooking.depositPaid
                              ? 'Deposit Confirmed'
                              : 'Deposit Pending'}
                          </span>
                        </div>

                        <div className="py-3 space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="opacity-70">
                              Total Service Estimate ({currentBooking.hours} hrs):
                            </span>
                            <span className="font-bold">{formatCurrency(currentBooking.estimatedTotal)}</span>
                          </div>
                          <div className="flex justify-between text-emerald-400 font-semibold">
                            <span>Required Slot Deposit:</span>
                            <span>{formatCurrency(currentBooking.requiredDeposit)}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-black text-[#d4af37]">
                            <span>Remaining Balance:</span>
                            <span>
                              {currentBooking.finalPaid
                                ? '$0.00 (Settled)'
                                : currentBooking.depositPaid
                                ? formatCurrency(
                                    Math.max(0, currentBooking.estimatedTotal - currentBooking.requiredDeposit)
                                  )
                                : formatCurrency(currentBooking.estimatedTotal)}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {!currentBooking.depositPaid && (
                              <button
                                onClick={async () => {
                                  await updateBookingClientNotes(currentBooking.id, {
                                    depositPaid: true,
                                  });
                                  await addLiveUpdate(
                                    currentBooking.id,
                                    `Client marked deposit (${formatCurrency(currentBooking.requiredDeposit)}) as sent.`,
                                    'milestone',
                                    'client'
                                  );
                                  showNotice('Deposit payment confirmation recorded.');
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 cursor-pointer"
                              >
                                Mark Deposit Sent
                              </button>
                            )}
                          </div>

                          <button
                            onClick={handleDownloadInvoiceReceipt}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 hover:bg-[#d4af37]/30 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Official Invoice Statement</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* Footer Bar */}
        <div
          className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-[#05152c] border-[#d4af37]/20' : 'bg-white border-[#d4af37]/20'
          }`}
        >
          <div className="flex items-center gap-1.5 opacity-80">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>24/7 Verified Childcare • Encrypted Cloud Portal • {siteCopy.businessPhone}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenBooking();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#aa8214] text-[#041226] font-black shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Book Nana Now
          </button>
        </div>
      </div>
    </div>
  );
};
