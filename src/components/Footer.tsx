import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, Clock, MapPin, Heart, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import { SectionBackgroundVideo } from './SectionBackgroundVideo.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface FooterProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenChat: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenChat }) => {
  const { isDark } = useTheme();
  const [emailInput, setEmailInput] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmailInput('');
    }, 2000);
  };

  return (
    <footer
      className={`border-t relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#020813] text-white border-[#d4af37]/30' : 'bg-[#041226] text-white border-[#d4af37]/30'
      }`}
    >
      {/* Looping Section Background Video: Gentle starlight & ambient night sky */}
      <SectionBackgroundVideo
        videoUrl="/videos/footer-stars.mp4"
        opacityDark="opacity-25"
        opacityLight="opacity-15"
      />
      {/* Top Banner section matching original site */}
      <div className="bg-gradient-to-r from-[#020813] via-[#071c38] to-[#020813] py-10 px-4 sm:px-6 lg:px-8 border-b border-[#d4af37]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#f3d078] uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#d4af37]" /> 24-HOURS ON-CALL!!!
            </span>
            <h3 className="text-2xl font-black font-display text-white">
              Need Childcare or Loc Care Right Now?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Ken'nyzhae is on-call day and night for emergency babysitting, last-minute flight travel, or school pickups.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:3054096788"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] font-black text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <Phone className="w-4 h-4 text-[#041226]" />
              <span>Call (305) 409-6788</span>
            </a>
            <a
              href="sms:3054096788"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#071c38] hover:bg-[#0c2a52] text-white font-bold text-sm border border-[#d4af37]/40 transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4 text-[#dfb75c]" />
              <span>Text Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 text-left">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black font-brand text-transparent bg-clip-text bg-gradient-to-r from-[#f3d078] via-[#dfb75c] to-[#c59b27]">
                Kweenz Dream
              </span>
              <span className="text-xl">💭</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Founded by Ken'nyzhae Nathaniel ("Nana", "Your Favorite Nanny"). Dedicated to joyful, certified childcare, VIP travel accompaniment, and nourishing loc retwisting.
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#dfb75c] shrink-0" />
                <span>San Francisco Bay Area • Tampa FL • Worldwide Travel</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#dfb75c] shrink-0" />
                <span>Phone: 305-409-6788 (24/7 On-Call)</span>
              </p>
            </div>
          </div>

          {/* Service Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#dfb75c]">
              Childcare
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onOpenBooking('nanny-services')}
                  className="hover:text-[#f3d078] transition-colors cursor-pointer"
                >
                  Nanny Services ($30/hr)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('on-call-babysitter')}
                  className="hover:text-[#f3d078] transition-colors cursor-pointer"
                >
                  On-Call Babysitter ($25/hr)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('school-pickup')}
                  className="hover:text-[#f3d078] transition-colors cursor-pointer"
                >
                  School Pickup Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('adventure-day')}
                  className="hover:text-[#f3d078] transition-colors cursor-pointer"
                >
                  Adventure Days ($32/hr)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('meet-n-greet')}
                  className="hover:text-[#f3d078] transition-colors font-semibold cursor-pointer"
                >
                  Free Meet-N-Greet ($0)
                </button>
              </li>
            </ul>
          </div>

          {/* Travel & Hair */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#dfb75c]">
              Specialties
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onOpenBooking('passport-travel-nanny')}
                  className="hover:text-[#f3d078] transition-colors cursor-pointer"
                >
                  Passport Nanny (Flights)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('locks-wash-retwist-style')}
                  className="hover:text-[#f3d078] transition-colors cursor-pointer"
                >
                  Locks: Wash, Retwist & Style
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('freestyle-braids')}
                  className="hover:text-[#f3d078] transition-colors cursor-pointer"
                >
                  Freestyle Braids ($100)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('hair-consultation')}
                  className="hover:text-[#f3d078] transition-colors cursor-pointer"
                >
                  Hair Consultation ($25)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenBooking('pet-nanny-24hr')}
                  className="hover:text-[#f3d078] transition-colors cursor-pointer"
                >
                  24-HR Pet Nanny ($120)
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Box (Your Favorite Nanny) matching original site */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#dfb75c]">
              Your Favorite Nanny VIP Club
            </h4>
            <p className="text-xs text-slate-300">
              Stay up to date with seasonal booking schedules, travel dates, and parenting tips.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-[#061833] border border-[#d4af37]/40 text-[#f3d078] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#dfb75c]" />
                <span>Thank you! You're subscribed to VIP updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-3 py-2 rounded-xl bg-[#061833] border border-[#d4af37]/40 text-white text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Protected and private. We never share family emails.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-10 mt-10 border-t border-[#d4af37]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          <p>© 2026 Kweenz Dream💭 • All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenChat}
              className="text-[#dfb75c] hover:text-white transition-colors flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#dfb75c]" />
              <span>Ask Nana AI Concierge</span>
            </button>
            <span>•</span>
            <a href="tel:3054096788" className="hover:text-white transition-colors">
              Call 305-409-6788
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
