import React, { useState } from 'react';
import { Phone, MessageSquare, Calendar, Sparkles, Menu, X, Clock } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface NavbarProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenChat: () => void;
  onOpenHairAdvisor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenChat,
  onOpenHairAdvisor,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md transition-colors duration-300 border-b ${
        isDark
          ? 'bg-[#030d1e]/90 border-[#d4af37]/30 text-white'
          : 'bg-white/92 border-[#d4af37]/30 text-[#04142b] shadow-sm'
      }`}
    >
      {/* Top emergency & on-call bar */}
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
              San Francisco Bay Area • Tampa FL • Worldwide Travel Nanny
            </span>
          </div>
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <a
              href="tel:3054096788"
              className={`flex items-center gap-1 font-semibold transition-colors ${
                isDark ? 'text-white hover:text-[#f3d078]' : 'text-[#04142b] hover:text-[#b8860b]'
              }`}
            >
              <Phone className="w-3 h-3 text-[#d4af37]" />
              <span>Call: (305) 409-6788</span>
            </a>
            <span className={isDark ? 'text-[#d4af37]/40' : 'text-[#d4af37]/50'}>|</span>
            <a
              href="sms:3054096788"
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
          {/* Logo brand */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#f3d078] to-[#aa7c11] p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div
                className={`w-full h-full rounded-[14px] flex items-center justify-center overflow-hidden transition-colors ${
                  isDark ? 'bg-[#041226]' : 'bg-white'
                }`}
              >
                <span className="text-xl font-brand font-black text-transparent bg-clip-text bg-gradient-to-tr from-[#d4af37] via-[#f3d078] to-[#aa7c11]">
                  KD
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span
                  className={`text-2xl font-black tracking-tight font-brand transition-colors ${
                    isDark ? 'text-white group-hover:text-[#f3d078]' : 'text-[#04142b] group-hover:text-[#b8860b]'
                  }`}
                >
                  Kweenz Dream
                </span>
                <span className="text-xl">💭</span>
              </div>
              <p
                className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isDark ? 'text-[#d4af37]' : 'text-[#b8860b]'
                }`}
              >
                Passport Nanny • Elite Care • Crown Locs
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav
            className={`hidden lg:flex items-center gap-7 text-sm font-semibold transition-colors ${
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
              <span>Passport Nanny</span>
              <span className="text-[10px] bg-[#d4af37]/20 text-[#f3d078] dark:text-[#f3d078] px-1.5 py-0.5 rounded font-bold border border-[#d4af37]/40">
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
              Adventures & Maps
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
          <div className="hidden sm:flex items-center gap-3">
            {/* Dark/Light Theme Toggle */}
            <ThemeToggle />

            <button
              onClick={onOpenChat}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border shadow-sm transition-all hover:scale-105 ${
                isDark
                  ? 'bg-[#071c38] hover:bg-[#0c2b52] text-[#f3d078] border-[#d4af37]/40'
                  : 'bg-[#faf8f5] hover:bg-[#f1ebe0] text-[#04142b] border-[#d4af37]/40'
              }`}
              aria-label="Open AI Concierge Chat"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-spin" style={{ animationDuration: '8s' }} />
              <span>AI Concierge</span>
            </button>

            <button
              onClick={() => onOpenBooking()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Calendar className="w-4 h-4 text-[#041226]" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile menu toggle & Theme toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => onOpenBooking()}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#d4af37] text-[#041226]"
            >
              Book
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
              Passport Nanny (Travel)
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
              Adventures & Google Maps
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
              About Ken'nyzhae Nathaniel
            </a>
          </div>

          <div className="pt-4 border-t border-[#d4af37]/20 flex flex-col gap-2.5">
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
                onOpenHairAdvisor();
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border ${
                isDark
                  ? 'bg-[#071c38] text-slate-200 border-[#d4af37]/30'
                  : 'bg-white text-[#04142b] border-[#d4af37]/30'
              }`}
            >
              <span>Loc & Hair Care Diagnostic</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] text-[#041226] shadow-lg flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
