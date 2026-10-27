import React, { useState } from 'react';
import { Phone, MessageSquare, Calendar, Sparkles, Menu, X, Clock, Shield, UserCheck, Plane } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { useBusiness } from '../context/BusinessContext.tsx';
import { PassportNanaLogo } from './PassportNanaLogo.tsx';

interface NavbarProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenChat: () => void;
  onOpenHairAdvisor: () => void;
  onOpenClientPortal: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenChat,
  onOpenHairAdvisor,
  onOpenClientPortal,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark } = useTheme();
  const { siteCopy } = useBusiness();

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 border-b ${
        isDark
          ? 'bg-[#030d1e]/92 border-[#d4af37]/30 text-white'
          : 'bg-white/95 border-[#d4af37]/30 text-[#04142b] shadow-sm'
      }`}
    >
      {/* Top announcement & on-call bar */}
      <div
        className={`text-xs py-1.5 px-4 text-center transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-r from-[#020813] via-[#071c38] to-[#020813] text-[#f3d078] border-b border-[#d4af37]/20'
            : 'bg-gradient-to-r from-[#fbf9f5] via-[#ffffff] to-[#fbf9f5] text-[#04142b] border-b border-[#d4af37]/20'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                isDark
                  ? 'bg-[#d4af37]/20 text-[#f3d078] border-[#d4af37]/40 animate-pulse'
                  : 'bg-[#04142b] text-[#f3d078] border-[#04142b]'
              }`}
            >
              <Clock className="w-3 h-3 mr-1" /> 24-HOURS ON-CALL
            </span>
            <span
              className={`font-medium ${
                isDark ? 'text-slate-200' : 'text-[#04142b]'
              }`}
            >
              {siteCopy.announcementBanner || siteCopy.serviceHubs}
            </span>
          </div>
          <div className="flex items-center gap-3 mx-auto sm:mx-0">
            <a
              href={`tel:${siteCopy.businessPhone.replace(/\D/g, '')}`}
              className={`flex items-center gap-1 font-semibold transition-colors ${
                isDark ? 'text-white hover:text-[#f3d078]' : 'text-[#04142b] hover:text-[#b8860b]'
              }`}
            >
              <Phone className="w-3 h-3 text-[#d4af37]" />
              <span>Call: {siteCopy.businessPhone}</span>
            </a>
            <span className={isDark ? 'text-[#d4af37]/40' : 'text-[#d4af37]/50'}>|</span>
            <a
              href={`sms:${siteCopy.businessPhone.replace(/\D/g, '')}`}
              className={`hidden md:flex items-center gap-1 transition-colors ${
                isDark ? 'text-[#f3d078] hover:text-white' : 'text-[#b8860b] hover:text-[#04142b] font-semibold'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>Text Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo brand: Passport Nana */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center text-left cursor-pointer"
          >
            <PassportNanaLogo variant="full" size="md" />
          </button>

          {/* Desktop Nav Links */}
          <nav
            className={`hidden xl:flex items-center gap-6 text-sm font-semibold transition-colors ${
              isDark ? 'text-slate-200' : 'text-[#1e293b]'
            }`}
          >
            <a
              href="#services"
              className={isDark ? 'hover:text-[#f3d078] transition-colors' : 'hover:text-[#b8860b] transition-colors'}
            >
              Services
            </a>
            <a
              href="#passport-nanny"
              className={`flex items-center gap-1 transition-colors ${
                isDark ? 'hover:text-[#f3d078]' : 'hover:text-[#b8860b]'
              }`}
            >
              <span>Travel Nanny</span>
              <span className="text-[10px] bg-[#d4af37]/20 text-[#f3d078] px-1.5 py-0.5 rounded font-bold border border-[#d4af37]/40">
                VIP
              </span>
            </a>
            <a
              href="#hair-locs"
              className={isDark ? 'hover:text-[#f3d078] transition-colors' : 'hover:text-[#b8860b] transition-colors'}
            >
              Locks & Braids
            </a>
            <a
              href="#adventures"
              className={isDark ? 'hover:text-[#f3d078] transition-colors' : 'hover:text-[#b8860b] transition-colors'}
            >
              Adventures
            </a>
            <a
              href="#calculator"
              className={isDark ? 'hover:text-[#f3d078] transition-colors' : 'hover:text-[#b8860b] transition-colors'}
            >
              Price Estimator
            </a>
            <a
              href="#about"
              className={isDark ? 'hover:text-[#f3d078] transition-colors' : 'hover:text-[#b8860b] transition-colors'}
            >
              Meet Nana
            </a>
          </nav>

          {/* Action CTAs & Theme Toggle */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Dark/Light Theme Toggle */}
            <ThemeToggle />

            {/* Client Portal Button */}
            <button
              onClick={onOpenClientPortal}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border shadow-sm transition-all hover:scale-105 ${
                isDark
                  ? 'bg-[#061c38] hover:bg-[#0b284e] text-slate-100 border-[#d4af37]/40'
                  : 'bg-white hover:bg-[#fbf9f4] text-[#04142b] border-[#d4af37]/40'
              }`}
              title="Open Client Care & Flight Portal"
            >
              <Plane className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Client Portal</span>
            </button>

            {/* Admin Hub Button */}
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border shadow-sm transition-all hover:scale-105 ${
                isDark
                  ? 'bg-[#040f1f] hover:bg-[#08182f] text-slate-300 border-white/20'
                  : 'bg-slate-50 hover:bg-slate-100 text-[#04142b] border-slate-300'
              }`}
              title="Owner / Admin Controls"
            >
              <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Owner Hub</span>
            </button>

            {/* AI Concierge */}
            <button
              onClick={onOpenChat}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border shadow-sm transition-all hover:scale-105 ${
                isDark
                  ? 'bg-[#071c38] hover:bg-[#0c2b52] text-[#f3d078] border-[#d4af37]/40'
                  : 'bg-[#faf8f5] hover:bg-[#f1ebe0] text-[#04142b] border-[#d4af37]/40'
              }`}
              aria-label="Open AI Concierge Chat"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-spin" style={{ animationDuration: '8s' }} />
              <span>AI Concierge</span>
            </button>

            {/* Primary CTA - REQUIREMENT #6: "Book Nana Now" */}
            <button
              onClick={() => onOpenBooking()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#041226]" />
              <span>Book Nana Now</span>
            </button>
          </div>

          {/* Mobile menu toggle & Theme toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => onOpenBooking()}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226]"
            >
              Book Nana
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-[#071c38] border-[#d4af37]/30 text-slate-200 hover:text-white'
                  : 'bg-[#faf8f5] border-[#d4af37]/30 text-[#04142b]'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-b px-4 pt-3 pb-6 space-y-3 transition-colors ${
            isDark
              ? 'bg-[#041226] border-[#d4af37]/30 text-slate-200'
              : 'bg-white border-[#d4af37]/30 text-[#04142b]'
          }`}
        >
          <div className="flex flex-col space-y-2 text-base font-semibold">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-[#071c38] hover:text-[#f3d078]' : 'hover:bg-[#faf8f5] hover:text-[#b8860b]'
              }`}
            >
              Services Catalog
            </a>
            <a
              href="#passport-nanny"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-[#071c38] hover:text-[#f3d078]' : 'hover:bg-[#faf8f5] hover:text-[#b8860b]'
              }`}
            >
              Passport Travel Nanny
            </a>
            <a
              href="#hair-locs"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-[#071c38] hover:text-[#f3d078]' : 'hover:bg-[#faf8f5] hover:text-[#b8860b]'
              }`}
            >
              Locks & Braids Artistry
            </a>
            <a
              href="#adventures"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-[#071c38] hover:text-[#f3d078]' : 'hover:bg-[#faf8f5] hover:text-[#b8860b]'
              }`}
            >
              Adventures & Maps
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-[#071c38] hover:text-[#f3d078]' : 'hover:bg-[#faf8f5] hover:text-[#b8860b]'
              }`}
            >
              Price Calculator
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-lg ${
                isDark ? 'hover:bg-[#071c38] hover:text-[#f3d078]' : 'hover:bg-[#faf8f5] hover:text-[#b8860b]'
              }`}
            >
              Meet Ken'nyzhae Nathaniel
            </a>
          </div>

          <div className="pt-4 border-t border-[#d4af37]/20 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenClientPortal();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border bg-[#061833] text-[#d4af37] border-[#d4af37]/40"
            >
              <Plane className="w-4 h-4" />
              <span>Open Client VIP Portal</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-white/20 text-slate-300"
            >
              <Shield className="w-4 h-4 text-[#d4af37]" />
              <span>Owner & Admin Control Hub</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border ${
                isDark
                  ? 'bg-[#071c38] text-[#f3d078] border-[#d4af37]/40'
                  : 'bg-[#faf8f5] text-[#04142b] border-[#d4af37]/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>Ask AI Care Concierge</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 px-4 rounded-xl text-sm font-black bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] text-[#041226] shadow-lg flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Nana Now</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
