import React from 'react';
import { Plane, Compass, Shield, Luggage, Globe, Heart } from 'lucide-react';
import { SectionBackgroundVideo } from './SectionBackgroundVideo.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface PassportNannyBannerProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const PassportNannyBanner: React.FC<PassportNannyBannerProps> = ({
  onOpenBooking,
}) => {
  const { isDark } = useTheme();

  return (
    <section id="passport-nanny" className="py-20 relative overflow-hidden transition-colors duration-300">
      {/* Looping Section Background Video: Airplane flying high across the sky and flight path */}
      <SectionBackgroundVideo
        videoUrl="/videos/passport-travel.mp4"
        opacityDark="opacity-30"
        opacityLight="opacity-20"
      />

      {/* Decorative Golden Ambient Glow */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div
          className={`rounded-3xl border-2 p-8 sm:p-12 shadow-2xl relative overflow-hidden transition-colors ${
            isDark
              ? 'bg-gradient-to-br from-[#061a35]/95 via-[#030e22]/95 to-[#020914]/95 border-[#d4af37]/60 text-white'
              : 'bg-gradient-to-br from-white via-[#fcfbfa] to-[#faf7f0] border-[#d4af37]/50 text-[#04142b]'
          }`}
        >
          {/* Subtle gold ribbon top right matching reference image */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-[#d4af37] via-[#f3d078] to-[#c59b27] text-[#041226] text-xs font-black px-6 py-1.5 rounded-bl-2xl shadow-md uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-[#041226]" />
            <span>Luxury Care That Travels!</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual Gold Crest Artwork */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm rounded-2xl overflow-hidden border-2 border-[#d4af37]/70 shadow-2xl shadow-amber-500/20">
                <img
                  src="/assets/aistudio/T47GYQIQZI3O77PQ3A5YN3ML_e5f6454f.webp"
                  alt="Passport Nanny VIP Luxury Travel Childcare"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041226]/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="text-xs font-bold text-[#f3d078] uppercase tracking-widest bg-[#041226]/90 px-3.5 py-1.5 rounded-full border border-[#d4af37]/50 shadow-md">
                    Domestic & International Travel Care
                  </span>
                </div>
              </div>
            </div>

            {/* Content & Details */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#dfb75c] dark:text-[#f3d078] text-xs font-bold uppercase tracking-wider">
                  <Plane className="w-3.5 h-3.5" /> High-End Travel Childcare
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight">
                  The{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27]">
                    Passport Nanny
                  </span>{' '}
                  Experience
                </h2>
                <p className={isDark ? 'text-base sm:text-lg text-slate-300' : 'text-base sm:text-lg text-[#334155] font-medium'}>
                  Vacations, family reunions, destination weddings, and business trips without the overwhelm. Ken’nyzhae travels with your family door-to-door.
                </p>
              </div>

              {/* Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-2xl border space-y-1.5 ${
                    isDark
                      ? 'bg-[#071c38]/90 border-[#d4af37]/30 text-white'
                      : 'bg-white border-[#d4af37]/35 shadow-sm text-[#04142b]'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[#dfb75c] dark:text-[#f3d078] font-bold text-sm">
                    <Luggage className="w-4 h-4 text-[#d4af37]" />
                    <span>Airports & Flights</span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                    TSA line assistance, stroller handling, engaging in-flight play, snack distribution, and ears-popping comfort.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border space-y-1.5 ${
                    isDark
                      ? 'bg-[#071c38]/90 border-[#d4af37]/30 text-white'
                      : 'bg-white border-[#d4af37]/35 shadow-sm text-[#04142b]'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[#dfb75c] dark:text-[#f3d078] font-bold text-sm">
                    <Compass className="w-4 h-4 text-[#d4af37]" />
                    <span>Resorts & Excursions</span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                    Attentive poolside safety monitoring, beach sandcastle play, museum chaperoning, and daytime excursions.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border space-y-1.5 ${
                    isDark
                      ? 'bg-[#071c38]/90 border-[#d4af37]/30 text-white'
                      : 'bg-white border-[#d4af37]/35 shadow-sm text-[#04142b]'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[#dfb75c] dark:text-[#f3d078] font-bold text-sm">
                    <Globe className="w-4 h-4 text-[#d4af37]" />
                    <span>Time Zone Easing</span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                    Gentle routine adjustments, nap synchronization, and peaceful bedtime story wind-down in unfamiliar hotels.
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border space-y-1.5 ${
                    isDark
                      ? 'bg-[#071c38]/90 border-[#d4af37]/30 text-white'
                      : 'bg-white border-[#d4af37]/35 shadow-sm text-[#04142b]'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[#dfb75c] dark:text-[#f3d078] font-bold text-sm">
                    <Shield className="w-4 h-4 text-[#d4af37]" />
                    <span>Parents Night Out</span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                    Enjoy date nights, gala dinners, or private wedding receptions knowing your little ones are safely asleep with Nana.
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenBooking('passport-travel-nanny')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] font-bold text-sm shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Plane className="w-4 h-4 text-[#041226]" />
                  <span>Request Travel Consultation</span>
                </button>

                <button
                  onClick={() => onOpenBooking('multiple-days-deposit')}
                  className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm border transition-all cursor-pointer ${
                    isDark
                      ? 'bg-[#071c38] hover:bg-[#0c2a52] text-white border-[#d4af37]/40 shadow-sm'
                      : 'bg-white hover:bg-[#faf8f5] text-[#04142b] border-[#d4af37]/40 shadow-sm'
                  }`}
                >
                  <span>Multi-Day Calendar Deposit ($100)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
