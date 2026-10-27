import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { PassportNanaLogo } from './PassportNanaLogo.tsx';
import { auth, db } from '../lib/firebase.ts';
import { updatePassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
    updateMediaItem,
    deleteMediaItem,
    restoreDefaultMedia,
    pricingRates,
    updatePricingRates,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
  } = useBusiness();

  // Auth PIN state & methods
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('info@fixmyiron.com');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [authMode, setAuthMode] = useState<'pin_quick' | 'email_pass' | 'google'>('pin_quick');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'bookings' | 'calendar' | 'theme' | 'copy' | 'promotions' | 'media' | 'pricing' | 'security'
  >('bookings');

  // Password & Security Management
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Custom PIN Management
  const [newCustomPin, setNewCustomPin] = useState('');
  const [confirmCustomPin, setConfirmCustomPin] = useState('');
  const [pinStatusMsg, setPinStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  // Edit / Replace Existing Media state
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [editMediaTitle, setEditMediaTitle] = useState('');
  const [editMediaUrl, setEditMediaUrl] = useState('');
  const [editMediaCategory, setEditMediaCategory] = useState<
    'childcare' | 'passport_travel' | 'hair_locs' | 'adventures' | 'branding'
  >('childcare');
  const [editMediaCaption, setEditMediaCaption] = useState('');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'site_slots' | 'service_cards' | 'custom'>('all');
  const [showAddMediaForm, setShowAddMediaForm] = useState(false);

  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  const handleLogin = async (e?: React.FormEvent, overrideMode?: 'pin_quick' | 'email_pass' | 'google') => {
    if (e) e.preventDefault();
    setIsSubmittingAuth(true);
    setAuthError('');
    try {
      const mode = overrideMode || authMode;
      let res;
      if (mode === 'email_pass') {
        res = await adminLogin(pinInput, ownerEmail, ownerPassword);
      } else if (mode === 'google') {
        res = await adminLogin(pinInput);
      } else {
        res = await adminLogin(
          pinInput,
          ownerEmail && ownerPassword ? ownerEmail : undefined,
          ownerPassword || undefined
        );
      }
      if (res.success) {
        setAuthError('');
        setPinInput('');
      } else {
        setAuthError(res.error || 'Authentication failed. Please check your PIN.');
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setAuthError(errObj?.message || 'Authentication error occurred.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleSaveCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSiteCopy(copyForm);
    showNotice('Site copy saved to Cloud Firestore!');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatusMsg(null);
    if (newPassword.length < 6) {
      setPasswordStatusMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatusMsg({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }
    setIsUpdatingPassword(true);
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setPasswordStatusMsg({
          type: 'success',
          text: 'Owner account password was successfully updated in Firebase Authentication!',
        });
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const email = ownerEmail || 'info@fixmyiron.com';
        await sendPasswordResetEmail(auth, email);
        setPasswordStatusMsg({
          type: 'success',
          text: `Password reset link sent to ${email}! Open the link in your email to choose your new password.`,
        });
      }
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string };
      if (fbErr?.code === 'auth/requires-recent-login') {
        const email = auth.currentUser?.email || ownerEmail || 'info@fixmyiron.com';
        await sendPasswordResetEmail(auth, email);
        setPasswordStatusMsg({
          type: 'success',
          text: `For security, changing password directly requires recent sign-in. A secure password reset link has been emailed to ${email}!`,
        });
      } else {
        setPasswordStatusMsg({
          type: 'error',
          text: fbErr?.message || 'Failed to update password. Try sending a password reset email below.',
        });
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSendResetEmail = async () => {
    setPasswordStatusMsg(null);
    try {
      const email = auth.currentUser?.email || ownerEmail || 'info@fixmyiron.com';
      await sendPasswordResetEmail(auth, email);
      setPasswordStatusMsg({
        type: 'success',
        text: `Secure password reset link sent to ${email}! Check your inbox.`,
      });
    } catch (err: unknown) {
      const fbErr = err as { message?: string };
      setPasswordStatusMsg({
        type: 'error',
        text: fbErr?.message || 'Failed to send password reset email.',
      });
    }
  };

  const handleUpdateCustomPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinStatusMsg(null);
    const trimmed = newCustomPin.trim();
    if (trimmed.length < 4) {
      setPinStatusMsg({ type: 'error', text: 'Security PIN must be at least 4 characters.' });
      return;
    }
    if (trimmed !== confirmCustomPin.trim()) {
      setPinStatusMsg({ type: 'error', text: 'PIN and confirmation do not match.' });
      return;
    }
    try {
      localStorage.setItem('pn_owner_pin', trimmed);
      if (auth.currentUser) {
        await setDoc(
          doc(db, 'admins', auth.currentUser.uid),
          {
            uid: auth.currentUser.uid,
            email: (auth.currentUser.email || 'info@fixmyiron.com').slice(0, 150),
            role: 'owner',
            pinPasscode: trimmed,
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );
      }
      setPinStatusMsg({
        type: 'success',
        text: `Owner Security PIN changed to "${trimmed}"! Use this new PIN the next time you unlock the Owner Hub.`,
      });
      setNewCustomPin('');
      setConfirmCustomPin('');
    } catch (err: unknown) {
      const fbErr = err as { message?: string };
      setPinStatusMsg({
        type: 'error',
        text: fbErr?.message || 'Failed to update PIN in database.',
      });
    }
  };

  const handleResetPinToDefault = () => {
    localStorage.removeItem('pn_owner_pin');
    setPinStatusMsg({
      type: 'success',
      text: 'Security PIN reset to the factory default: "nana2026".',
    });
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

  const compressImageToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result !== 'string') {
          reject(new Error('Failed to read file'));
          return;
        }
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(result);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          resolve(compressed);
        };
        img.onerror = () => resolve(result);
        img.src = result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleUploadImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedUrl = await compressImageToDataUrl(file);
        setNewMediaUrl(compressedUrl);
      } catch {
        // Ignore read error
      }
    }
  };

  const handleUploadReplaceImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedUrl = await compressImageToDataUrl(file);
        setEditMediaUrl(compressedUrl);
      } catch {
        // Ignore read error
      }
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
    setShowAddMediaForm(false);
    showNotice('New photo added to Gallery & live website!');
  };

  const handleStartEditMedia = (item: {
    id: string;
    title: string;
    url: string;
    category: 'childcare' | 'passport_travel' | 'hair_locs' | 'adventures' | 'branding';
    caption?: string;
  }) => {
    setEditingMediaId(item.id);
    setEditMediaTitle(item.title);
    setEditMediaUrl(item.url);
    setEditMediaCategory(item.category);
    setEditMediaCaption(item.caption || '');
  };

  const handleSaveEditedMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMediaId || !editMediaUrl.trim()) return;

    await updateMediaItem(editingMediaId, {
      title: editMediaTitle.trim() || 'Passport Nana Image',
      url: editMediaUrl.trim(),
      category: editMediaCategory,
      caption: editMediaCaption.trim(),
    });

    setEditingMediaId(null);
    showNotice('Image replaced & updated across the live website!');
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
          <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-3 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>

            <h4 className="font-serif font-black text-2xl mb-1 text-[#d4af37]">Owner & Business Hub Authentication</h4>
            <p className="text-xs opacity-80 mb-4 max-w-md">
              Enter Ken’nyzhae's security PIN (<span className="font-mono text-[#d4af37] font-bold">nana2026</span>) to access site copy, calendar, bookings, and live theme controls.
            </p>

            {/* Cloudflare Domain Notice Badge */}
            <div
              className={`w-full p-3 mb-4 rounded-xl text-left border text-xs ${
                isDark ? 'bg-[#071d3a] border-[#d4af37]/30 text-slate-300' : 'bg-amber-50/80 border-[#d4af37]/40 text-[#04142b]'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-[#d4af37] mb-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Cloudflare & Domain Authentication Notice</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                Current Domain: <strong className="font-mono text-[#d4af37]">{typeof window !== 'undefined' ? window.location.hostname : 'localhost'}</strong>.
                If Google Sign-In displays an <code className="bg-black/30 px-1 py-0.5 rounded text-amber-300">auth/unauthorized-domain</code> error on Cloudflare, use <strong>Owner Email & Password</strong> below—it works on every domain without OAuth restrictions.
              </p>
            </div>

            {/* Auth Mode Tabs */}
            <div className="w-full flex border-b border-[#d4af37]/20 mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAuthMode('pin_quick')}
                className={`flex-1 py-2 text-center border-b-2 transition-all cursor-pointer ${
                  authMode === 'pin_quick'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                1. Quick PIN Unlock
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('email_pass')}
                className={`flex-1 py-2 text-center border-b-2 transition-all cursor-pointer ${
                  authMode === 'email_pass'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                2. Owner Email & Password
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('google')}
                className={`flex-1 py-2 text-center border-b-2 transition-all cursor-pointer ${
                  authMode === 'google'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                3. Google Account
              </button>
            </div>

            <form onSubmit={(e) => handleLogin(e)} className="w-full space-y-3.5 text-left">
              {/* PIN Input (Always Required) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-1">
                  Owner Security PIN *
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter Owner PIN (nana2026)"
                  className={`w-full px-4 py-2.5 rounded-xl border text-center font-mono text-base tracking-widest focus:outline-none focus:ring-2 focus:ring-[#d4af37] ${
                    isDark ? 'bg-[#061833] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                  autoFocus
                />
              </div>

              {/* Mode 2: Email & Password for Cloudflare */}
              {authMode === 'email_pass' && (
                <div className="space-y-3 pt-1 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold opacity-90 mb-1">
                      Owner Email Address
                    </label>
                    <input
                      type="email"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="info@fixmyiron.com"
                      className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#d4af37] ${
                        isDark ? 'bg-[#061833] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold opacity-90 mb-1">
                      Password (min 6 chars)
                    </label>
                    <input
                      type="password"
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="Enter password (creates account automatically if new)"
                      className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#d4af37] ${
                        isDark ? 'bg-[#061833] border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Mode 3: Google Note */}
              {authMode === 'google' && (
                <div
                  className={`p-3 rounded-xl border text-xs ${
                    isDark ? 'bg-[#061833] border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <p>
                    Clicking unlock will open the Google popup. If Cloudflare blocks the popup or displays <code className="text-amber-400 font-mono">auth/unauthorized-domain</code>, switch to the <strong>Owner Email & Password</strong> tab above.
                  </p>
                </div>
              )}

              {/* Error Message Display */}
              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium space-y-1 text-left">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Authentication Notice</span>
                  </div>
                  <p className="leading-relaxed">{authError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingAuth || !pinInput}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#aa8214] text-[#041226] font-black text-sm shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Unlock className="w-4 h-4" />
                <span>{isSubmittingAuth ? 'Verifying & Unlocking...' : 'Unlock Owner Hub Now'}</span>
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

              <button
                onClick={() => setActiveTab('security')}
                className={`py-3 px-3.5 font-bold text-xs sm:text-sm border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'security'
                    ? 'border-[#d4af37] text-[#d4af37]'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <KeyRound className="w-4 h-4 text-[#d4af37]" />
                <span>Security & Passwords</span>
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
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-serif font-black text-lg text-[#d4af37]">
                        Website Photos & Media Gallery Manager
                      </h4>
                      <p className="text-xs opacity-75">
                        Add new photos, replace any existing website banner or service card photo, or delete images in real time.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMediaId(null);
                          setShowAddMediaForm((prev) => !prev);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-bold text-xs flex items-center gap-1.5 shadow hover:scale-105 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{showAddMediaForm ? 'Hide Add Photo Form' : 'Add New Photo'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await restoreDefaultMedia();
                          setEditingMediaId(null);
                          showNotice('All default website images have been restored!');
                        }}
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isDark
                            ? 'border-[#d4af37]/30 text-slate-200 hover:bg-white/5'
                            : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Restore any deleted or replaced default images back to factory original"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Restore Defaults</span>
                      </button>
                    </div>
                  </div>

                  {/* REPLACE / EDIT EXISTING IMAGE MODAL/PANEL */}
                  {editingMediaId && (
                    <form
                      onSubmit={handleSaveEditedMedia}
                      className={`p-5 rounded-2xl border-2 border-[#d4af37] shadow-2xl space-y-4 animate-in fade-in ${
                        isDark ? 'bg-[#071d3a]' : 'bg-amber-50/90'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-[#d4af37]/30 pb-3">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-[#d4af37]" />
                          <h5 className="font-bold text-sm text-[#d4af37]">
                            Replace or Edit Image: <span className="text-white">{editMediaTitle}</span>
                          </h5>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingMediaId(null)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-300 hover:bg-white/10"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start text-xs">
                        {/* Current / New Preview */}
                        <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-xl bg-black/30 border border-[#d4af37]/30">
                          <span className="text-[10px] uppercase font-bold text-[#d4af37] mb-2">
                            Live Replacement Preview
                          </span>
                          {editMediaUrl ? (
                            <img
                              src={editMediaUrl}
                              alt="Replacement preview"
                              className="w-full h-36 object-cover rounded-xl border border-[#d4af37]/50 shadow-md"
                            />
                          ) : (
                            <div className="w-full h-36 flex items-center justify-center text-slate-400">
                              No image selected
                            </div>
                          )}
                          <span className="text-[10px] opacity-60 mt-1.5 font-mono">
                            Slot ID: {editingMediaId}
                          </span>
                        </div>

                        {/* Replacement Inputs */}
                        <div className="sm:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block font-bold text-[#d4af37] mb-1">
                              Option 1: Upload Replacement Photo from Your Device
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleUploadReplaceImageFile}
                              className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#d4af37] file:text-[#041226] hover:file:bg-[#f3d078] cursor-pointer"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block font-semibold mb-1">
                              Option 2: Or Paste Replacement Image URL
                            </label>
                            <input
                              type="text"
                              value={editMediaUrl}
                              onChange={(e) => setEditMediaUrl(e.target.value)}
                              placeholder="https://... or /assets/..."
                              className={`w-full px-3 py-2 rounded-xl border ${
                                isDark ? 'bg-[#040f1f] border-white/20 text-white' : 'bg-white border-slate-300'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block font-semibold mb-1">Title / Label:</label>
                            <input
                              type="text"
                              value={editMediaTitle}
                              onChange={(e) => setEditMediaTitle(e.target.value)}
                              className={`w-full px-3 py-2 rounded-xl border ${
                                isDark ? 'bg-[#040f1f] border-white/20 text-white' : 'bg-white border-slate-300'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block font-semibold mb-1">Category:</label>
                            <select
                              value={editMediaCategory}
                              onChange={(e) =>
                                setEditMediaCategory(
                                  e.target.value as
                                    | 'childcare'
                                    | 'passport_travel'
                                    | 'hair_locs'
                                    | 'adventures'
                                    | 'branding'
                                )
                              }
                              className={`w-full px-3 py-2 rounded-xl border ${
                                isDark ? 'bg-[#040f1f] border-white/20 text-white' : 'bg-white border-slate-300'
                              }`}
                            >
                              <option value="childcare">Childcare & Nanny</option>
                              <option value="passport_travel">Passport Travel Nanny</option>
                              <option value="hair_locs">Locs & Braids</option>
                              <option value="adventures">Adventure Days</option>
                              <option value="branding">Branding</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block font-semibold mb-1">Caption / Placement Description:</label>
                            <input
                              type="text"
                              value={editMediaCaption}
                              onChange={(e) => setEditMediaCaption(e.target.value)}
                              className={`w-full px-3 py-2 rounded-xl border ${
                                isDark ? 'bg-[#040f1f] border-white/20 text-white' : 'bg-white border-slate-300'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#d4af37]/20">
                        <button
                          type="button"
                          onClick={() => setEditingMediaId(null)}
                          className="px-4 py-2 rounded-xl border border-white/20 text-xs font-bold hover:bg-white/10 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#aa8214] text-[#041226] font-black text-xs flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Replacement Image</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ADD NEW MEDIA FORM (Collapsible or Open) */}
                  {showAddMediaForm && (
                    <form
                      onSubmit={handleCreateMedia}
                      className={`p-4 rounded-2xl border animate-in fade-in ${
                        isDark ? 'bg-[#061833] border-[#d4af37]/40' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-sm text-[#d4af37]">Add New Photo to Website Gallery</h5>
                        <button
                          type="button"
                          onClick={() => setShowAddMediaForm(false)}
                          className="text-xs opacity-70 hover:opacity-100"
                        >
                          Close
                        </button>
                      </div>
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
                                e.target.value as
                                  | 'childcare'
                                  | 'passport_travel'
                                  | 'hair_locs'
                                  | 'adventures'
                                  | 'branding'
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
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition-all disabled:opacity-40 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Publish New Photo</span>
                      </button>
                    </form>
                  )}

                  {/* Filter Tabs for Existing Website Images */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
                    {[
                      { id: 'all', label: `All Active Images (${mediaGallery.length})` },
                      {
                        id: 'site_slots',
                        label: `Section Banners & Portraits (${mediaGallery.filter((m) => m.id.startsWith('site_')).length})`,
                      },
                      {
                        id: 'service_cards',
                        label: `Service Card Images (${mediaGallery.filter((m) => m.id.startsWith('service_')).length})`,
                      },
                      {
                        id: 'custom',
                        label: `Custom Gallery Uploads (${mediaGallery.filter((m) => !m.id.startsWith('site_') && !m.id.startsWith('service_')).length})`,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() =>
                          setMediaFilter(tab.id as 'all' | 'site_slots' | 'service_cards' | 'custom')
                        }
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          mediaFilter === tab.id
                            ? 'bg-[#d4af37] text-[#041226] shadow'
                            : isDark
                            ? 'bg-[#061833] text-slate-300 hover:bg-white/10 border border-white/10'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Gallery Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {mediaGallery
                      .filter((m) => {
                        if (mediaFilter === 'site_slots') return m.id.startsWith('site_');
                        if (mediaFilter === 'service_cards') return m.id.startsWith('service_');
                        if (mediaFilter === 'custom')
                          return !m.id.startsWith('site_') && !m.id.startsWith('service_');
                        return true;
                      })
                      .map((m) => {
                        const isBeingEdited = editingMediaId === m.id;
                        const slotTypeLabel = m.id.startsWith('site_')
                          ? 'Website Section Banner'
                          : m.id.startsWith('service_')
                          ? 'Service Card Photo'
                          : 'Custom Gallery Photo';

                        return (
                          <div
                            key={m.id}
                            className={`rounded-2xl border overflow-hidden group relative flex flex-col transition-all ${
                              isBeingEdited
                                ? 'border-2 border-[#d4af37] ring-2 ring-[#d4af37]/40'
                                : isDark
                                ? 'bg-[#061833] border-white/10 hover:border-[#d4af37]/50'
                                : 'bg-white border-slate-200 hover:border-[#d4af37]'
                            }`}
                          >
                            <div className="h-44 w-full overflow-hidden relative bg-black/40">
                              <img
                                src={m.url}
                                alt={m.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#041226]/85 backdrop-blur-md border border-[#d4af37]/40 text-[10px] font-bold text-[#f3d078]">
                                {slotTypeLabel}
                              </div>
                            </div>

                            <div className="p-3.5 text-xs flex-1 flex flex-col justify-between space-y-3">
                              <div>
                                <span className="font-bold text-sm line-clamp-1">{m.title}</span>
                                <span className="text-[10px] uppercase font-bold text-[#d4af37] block mt-0.5">
                                  {m.category.replace('_', ' ')}
                                </span>
                                {m.caption && (
                                  <p className="text-[11px] opacity-75 line-clamp-2 mt-1">{m.caption}</p>
                                )}
                              </div>

                              {/* Action Buttons: Replace / Edit & Delete */}
                              <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditMedia(m)}
                                  className="flex-1 py-2 px-2.5 rounded-xl bg-[#d4af37]/20 hover:bg-[#d4af37] text-[#f3d078] hover:text-[#041226] border border-[#d4af37]/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                  title="Replace this photo or edit its details"
                                >
                                  <FileEdit className="w-3.5 h-3.5" />
                                  <span>Replace / Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    await deleteMediaItem(m.id);
                                    if (editingMediaId === m.id) setEditingMediaId(null);
                                    showNotice(`Removed "${m.title}" from the website.`);
                                  }}
                                  className="py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                                  title="Delete / remove this image from the website"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
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

              {/* TAB 8: SECURITY & PASSWORDS */}
              {activeTab === 'security' && (
                <div className="space-y-8 max-w-2xl">
                  {/* Header */}
                  <div>
                    <h3 className="text-xl font-serif font-black text-[#d4af37] flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-[#d4af37]" />
                      <span>Owner Account Security & Password Controls</span>
                    </h3>
                    <p className="text-xs opacity-80 mt-1">
                      Manage your Firebase authentication password, change your Owner Security PIN, or request password recovery links.
                    </p>
                  </div>

                  {/* Section 1: Change Account Password */}
                  <div
                    className={`p-6 rounded-2xl border space-y-4 ${
                      isDark ? 'bg-[#061833] border-[#d4af37]/30' : 'bg-[#faf8f5] border-[#d4af37]/35'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#d4af37]" />
                      <h4 className="font-bold text-sm uppercase tracking-wider text-[#d4af37]">
                        1. Change Owner Account Password (Firebase Auth)
                      </h4>
                    </div>
                    <p className="text-xs opacity-80">
                      Update the password used to sign in with your owner email (<strong>{auth.currentUser?.email || ownerEmail || 'info@fixmyiron.com'}</strong>).
                    </p>

                    {passwordStatusMsg && (
                      <div
                        className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                          passwordStatusMsg.type === 'success'
                            ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                            : 'bg-rose-500/15 border border-rose-500/40 text-rose-400'
                        }`}
                      >
                        {passwordStatusMsg.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0" />
                        )}
                        <span>{passwordStatusMsg.text}</span>
                      </div>
                    )}

                    <form onSubmit={handleUpdatePassword} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">New Password (minimum 6 characters)</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new strong password"
                          className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#d4af37] ${
                            isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#d4af37] ${
                            isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={isUpdatingPassword || !newPassword}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-bold text-xs flex items-center gap-2 shadow hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{isUpdatingPassword ? 'Saving Password...' : 'Save New Password'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSendResetEmail}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isDark
                              ? 'border-[#d4af37]/40 text-slate-200 hover:bg-white/5'
                              : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>Send Password Reset Email</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Section 2: Change Owner Security PIN */}
                  <div
                    className={`p-6 rounded-2xl border space-y-4 ${
                      isDark ? 'bg-[#061833] border-[#d4af37]/30' : 'bg-[#faf8f5] border-[#d4af37]/35'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#d4af37]" />
                      <h4 className="font-bold text-sm uppercase tracking-wider text-[#d4af37]">
                        2. Customize Owner Security PIN Passcode
                      </h4>
                    </div>
                    <p className="text-xs opacity-80">
                      Current Default PIN: <strong className="font-mono text-[#d4af37]">nana2026</strong>. You can change this to your own private passcode (e.g. 4–12 letters or numbers).
                    </p>

                    {pinStatusMsg && (
                      <div
                        className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                          pinStatusMsg.type === 'success'
                            ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                            : 'bg-rose-500/15 border border-rose-500/40 text-rose-400'
                        }`}
                      >
                        {pinStatusMsg.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0" />
                        )}
                        <span>{pinStatusMsg.text}</span>
                      </div>
                    )}

                    <form onSubmit={handleUpdateCustomPin} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">New Security PIN (e.g. 4 to 12 chars)</label>
                        <input
                          type="password"
                          value={newCustomPin}
                          onChange={(e) => setNewCustomPin(e.target.value)}
                          placeholder="Enter your new secret PIN"
                          className={`w-full px-3 py-2 rounded-xl border text-xs font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#d4af37] ${
                            isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Confirm New Security PIN</label>
                        <input
                          type="password"
                          value={confirmCustomPin}
                          onChange={(e) => setConfirmCustomPin(e.target.value)}
                          placeholder="Re-enter your new secret PIN"
                          className={`w-full px-3 py-2 rounded-xl border text-xs font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#d4af37] ${
                            isDark ? 'bg-[#040f1f] border-white/15 text-white' : 'bg-white border-slate-300'
                          }`}
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          type="submit"
                          disabled={!newCustomPin}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-bold text-xs flex items-center gap-2 shadow hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Update Security PIN</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleResetPinToDefault}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isDark
                              ? 'border-white/15 text-slate-300 hover:bg-white/5'
                              : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset to Default (nana2026)</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Section 3: Active Authentication Details */}
                  <div
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isDark ? 'bg-[#040f1f] border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-[#d4af37] uppercase tracking-wider text-[11px]">
                      Active Session & Security Profile
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="opacity-70">Authenticated User: </span>
                        <strong>{auth.currentUser?.email || ownerEmail || 'Owner (PIN Authenticated)'}</strong>
                      </div>
                      <div>
                        <span className="opacity-70">Sign-In Provider: </span>
                        <strong>{auth.currentUser?.providerData?.[0]?.providerId || 'Security PIN / Email'}</strong>
                      </div>
                      <div>
                        <span className="opacity-70">Owner Permissions: </span>
                        <strong className="text-emerald-400">Full Business & Site Admin</strong>
                      </div>
                      <div>
                        <span className="opacity-70">Database: </span>
                        <strong>Cloud Firestore Connected</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
