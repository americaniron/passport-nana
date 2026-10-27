import React, { useState } from 'react';
import { Phone, MessageSquare, Calendar, Sparkles, Menu, X, Shield, Clock } from 'lucide-react';

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

  return (
    <header className="sticky top-0 z-40 bg-[#0b021a]/90 backdrop-blur-md border-b border-cyan-500/20 text-white transition-all">
      {/* Top emergency & on-call bar */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-cyan-900 text-xs py-1.5 px-4 text-center border-b border-cyan-400/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-cyan-200">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 animate-pulse">
              <Clock className="w-3 h-3 mr-1" /> 24-HOURS ON-CALL
            </span>
            <span className="font-medium text-slate-200">
              San Francisco Bay Area • Tampa FL • Worldwide Travel
            </span>
          </div>
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <a
              href="tel:3054096788"
              className="flex items-center gap-1 font-semibold text-white hover:text-cyan-300 transition-colors"
            >
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>Call: (305) 409-6788</span>
            </a>
            <span className="hidden md:inline text-purple-400">|</span>
            <a
              href="sms:3054096788"
              className="hidden md:flex items-center gap-1 text-cyan-300 hover:text-white transition-colors"
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-600 to-fuchsia-600 p-0.5 shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#12042b] rounded-[14px] flex items-center justify-center overflow-hidden">
                <span className="text-2xl font-brand font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-300 to-purple-300">
                  KD
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-white font-brand group-hover:text-cyan-300 transition-colors">
                  Kweenz Dream
                </span>
                <span className="text-xl">💭</span>
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                Childcare • Passport Nanny • Locs
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-200">
            <a href="#services" className="hover:text-cyan-300 transition-colors">
              Services
            </a>
            <a href="#passport-nanny" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
              <span>Passport Nanny</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-400/40">VIP</span>
            </a>
            <a href="#hair-locs" className="hover:text-cyan-300 transition-colors">
              Locks & Braids
            </a>
            <a href="#adventures" className="hover:text-cyan-300 transition-colors">
              Adventures & Maps
            </a>
            <a href="#calculator" className="hover:text-cyan-300 transition-colors">
              Price Estimator
            </a>
            <a href="#about" className="hover:text-cyan-300 transition-colors">
              Meet Nana
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-900/60 hover:bg-purple-800/80 text-cyan-300 border border-purple-500/40 shadow-sm transition-all hover:scale-105"
              aria-label="Open AI Concierge Chat"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>AI Concierge</span>
            </button>

            <button
              onClick={() => onOpenBooking()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onOpenBooking()}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-400 text-slate-950"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-purple-900/40 text-slate-200 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#100326] border-b border-purple-500/30 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-base font-medium text-slate-200">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-purple-950/60 hover:text-cyan-300"
            >
              Services Catalog
            </a>
            <a
              href="#passport-nanny"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-purple-950/60 hover:text-cyan-300"
            >
              Passport Nanny (Travel)
            </a>
            <a
              href="#hair-locs"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-purple-950/60 hover:text-cyan-300"
            >
              Locks & Braids Artistry
            </a>
            <a
              href="#adventures"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-purple-950/60 hover:text-cyan-300"
            >
              Adventures & Google Maps
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-purple-950/60 hover:text-cyan-300"
            >
              Interactive Price Calculator
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-purple-950/60 hover:text-cyan-300"
            >
              About Ken'nyzhae Nathaniel
            </a>
          </div>

          <div className="pt-3 border-t border-purple-500/20 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-900/60 text-cyan-300 border border-purple-500/40 text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Concierge</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenHairAdvisor();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-cyan-950/60 text-cyan-200 border border-cyan-500/40 text-xs font-semibold"
            >
              <span>Hair Advisor</span>
            </button>
          </div>

          <div className="pt-2">
            <a
              href="tel:3054096788"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-bold text-sm"
            >
              <Phone className="w-4 h-4 text-cyan-300" />
              <span>Direct Call: (305) 409-6788</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
