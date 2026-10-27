import React from 'react';
import {
  Phone,
  Calendar,
  Sparkles,
  ShieldCheck,
  Heart,
  Plane,
  Scissors,
  CheckCircle2,
  Clock,
  ArrowRight,
  Star,
} from 'lucide-react';
import { SectionBackgroundVideo } from './SectionBackgroundVideo.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface HeroProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenChat: () => void;
  onOpenHairAdvisor: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onOpenChat,
  onOpenHairAdvisor,
}) => {
  const { isDark } = useTheme();

  return (
    <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28 transition-colors duration-300">
      {/* Looping Section Background Video: Dreamy celestial clouds & stars */}
      <SectionBackgroundVideo
        videoUrl="/videos/hero-clouds.mp4"
        opacityDark="opacity-35"
        opacityLight="opacity-25"
      />

      {/* Atmospheric Royal Navy & Metallic Gold Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0a2548]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#071c38]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top pill badge */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold shadow-md ${
                isDark
                  ? 'bg-[#071c38]/90 border-[#d4af37]/40 text-[#f3d078]'
                  : 'bg-white/95 border-[#d4af37]/50 text-[#04142b] shadow-sm'
              }`}
            >
              <span className="flex h-2 w-2 rounded-full bg-[#d4af37] animate-ping" />
              <span>24/7 On-Call Elite Childcare • Passport Nanny • Loc Artistry</span>
            </div>

            <div className="space-y-2">
              <h1
                className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight ${
                  isDark ? 'text-white' : 'text-[#04142b]'
                }`}
              >
                Where Children Flourish &{' '}
                <span
                  className={
                    isDark
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#f7df94] via-[#dfb75c] to-[#aa7c11]'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#8c6508]'
                  }
                >
                  Dreams Take Flight
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-[#dfb75c] font-brand flex items-center gap-2">
                <span>Kweenz Dream💭</span>
                <span className={isDark ? 'text-slate-300 text-sm font-normal' : 'text-slate-600 text-sm font-normal'}>
                  founded by Ken'nyzhae Nathaniel ("Your Favorite Nanny")
                </span>
              </p>
            </div>

            {/* Core Specialties list matching the 9 branded card offerings */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-md shadow-lg transition-colors ${
                isDark
                  ? 'bg-[#061833]/85 border-[#d4af37]/35 text-slate-100'
                  : 'bg-white/90 border-[#d4af37]/40 text-[#04142b] shadow-xl shadow-amber-900/5'
              }`}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs sm:text-sm font-bold">
                <div className="flex items-center gap-2 text-[#dfb75c] dark:text-[#f3d078]">
                  <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>24/HR ON-CALL</span>
                </div>
                <div className="flex items-center gap-2 text-[#dfb75c] dark:text-[#f3d078]">
                  <Heart className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>BABYSITTING</span>
                </div>
                <div className="flex items-center gap-2 text-[#dfb75c] dark:text-[#f3d078]">
                  <Plane className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>PASSPORT NANNY</span>
                </div>
                <div className="flex items-center gap-2 text-[#dfb75c] dark:text-[#f3d078]">
                  <Scissors className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>LOCS & BRAIDS</span>
                </div>
                <div className="flex items-center gap-2 text-[#dfb75c] dark:text-[#f3d078]">
                  <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>ADVENTURE DAYS</span>
                </div>
                <div className="flex items-center gap-2 text-[#dfb75c] dark:text-[#f3d078]">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>24-HR PET NANNY</span>
                </div>
              </div>
            </div>

            <p
              className={`text-base sm:text-lg leading-relaxed max-w-2xl ${
                isDark ? 'text-slate-300' : 'text-[#334155] font-medium'
              }`}
            >
              From on-call emergency babysitting and school pickups to worldwide travel nanny companionship and crown loc maintenance.
              Experience luxury, attentive care that brings complete peace of mind.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenBooking()}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Calendar className="w-5 h-5 text-[#041226]" />
                <span>Book Appointment</span>
              </button>

              <button
                onClick={onOpenChat}
                className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base border transition-all hover:scale-105 active:scale-95 ${
                  isDark
                    ? 'bg-[#071c38] hover:bg-[#0c2b52] text-[#f3d078] border-[#d4af37]/40 shadow-lg shadow-black/40'
                    : 'bg-[#faf8f5] hover:bg-[#f1ebe0] text-[#04142b] border-[#d4af37]/50 shadow-md'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span>Ask AI Concierge</span>
              </button>

              <a
                href="tel:3054096788"
                className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base border transition-all hover:scale-105 active:scale-95 ${
                  isDark
                    ? 'bg-[#041226] hover:bg-[#071c38] text-white border-[#d4af37]/30'
                    : 'bg-white hover:bg-slate-50 text-[#04142b] border-[#d4af37]/40'
                }`}
              >
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>Call 24/7</span>
              </a>
            </div>

            {/* Quick trust metrics */}
            <div
              className={`pt-4 border-t flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold ${
                isDark ? 'border-[#d4af37]/20 text-slate-300' : 'border-[#d4af37]/25 text-[#475569]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#dfb75c]" />
                <span>CPR / First Aid Trained</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#dfb75c]" />
                <span>Background Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#dfb75c]" />
                <span>Worldwide Travel Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Art & Passport Nanny Medallion */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-md w-full">
              {/* Outer Golden Glow & Double Frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#aa7c11] rounded-3xl blur-md opacity-40 group-hover:opacity-60 transition duration-700" />

              <div
                className={`relative rounded-3xl overflow-hidden border-2 border-[#d4af37]/60 shadow-2xl ${
                  isDark ? 'bg-[#041226]' : 'bg-white'
                }`}
              >
                {/* Hero Feature Image */}
                <div className="relative h-96 overflow-hidden">
                  <img
                    src="/assets/aistudio/T3Y66BS3HKS4D42K6PD7LESR_901339d2.webp"
                    alt="Kweenz Dream Happy Children and Incredibeingz Flying High"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${
                      isDark
                        ? 'from-[#041226] via-[#041226]/40 to-transparent'
                        : 'from-[#04142b]/90 via-[#04142b]/30 to-transparent'
                    }`}
                  />

                  {/* Top VIP Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-[#041226] text-xs font-black px-3.5 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-[#041226]" />
                    <span>Luxury Care That Travels!</span>
                  </div>

                  {/* Bottom Image Overlay Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#041226]/85 backdrop-blur-md border border-[#d4af37]/40 text-white text-left shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#f3d078] uppercase tracking-wider">
                          Passport Nanny & Babysitting
                        </p>
                        <h4 className="text-base font-bold text-white">Ken'nyzhae Nathaniel</h4>
                      </div>
                      <button
                        onClick={() => onOpenBooking('meet-n-greet')}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#041226] text-xs font-bold hover:brightness-110 transition-all"
                      >
                        Free Meet & Greet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
