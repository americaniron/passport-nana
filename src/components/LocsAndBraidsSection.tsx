import React from 'react';
import {
  Scissors,
  Sparkles,
  Droplets,
  Wind,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { SectionBackgroundVideo } from './SectionBackgroundVideo.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface LocsAndBraidsSectionProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenHairAdvisor: () => void;
}

export const LocsAndBraidsSection: React.FC<LocsAndBraidsSectionProps> = ({
  onOpenBooking,
  onOpenHairAdvisor,
}) => {
  const { isDark } = useTheme();

  const steps = [
    {
      num: '01',
      title: 'Clarifying Wash & Scalp Massage',
      desc: 'Deep clean wash to strip environmental debris, buildup, and lint, followed by an invigorating botanical scalp massage.',
      icon: Droplets,
    },
    {
      num: '02',
      title: 'Gentle Blow-Dry & Detangling',
      desc: 'Blow-drying with low heat to preserve hair cuticle integrity and prepare root beds for uniform sectioning.',
      icon: Wind,
    },
    {
      num: '03',
      title: 'Precision Parting & Palm Rolling',
      desc: 'Neat grid lines (square, brick, or diamond) with natural palm rolling retwist technique. Zero painful tension.',
      icon: Scissors,
    },
    {
      num: '04',
      title: 'Hooded Dryer Sealing & Scalp Oiling',
      desc: 'Clients relax under the dryer to fully lock and seal the retwist, concluding with a nourishing herbal scalp oil treatment.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="hair-locs" className="py-20 relative transition-colors duration-300">
      {/* Looping Section Background Video: Gentle hair care and crown styling */}
      <SectionBackgroundVideo
        videoUrl="/videos/hair-locs.mp4"
        opacityDark="opacity-30"
        opacityLight="opacity-20"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${
              isDark
                ? 'bg-[#071c38]/90 border-[#d4af37]/40 text-[#f3d078]'
                : 'bg-white border-[#d4af37]/40 text-[#04142b] shadow-sm'
            }`}
          >
            <Scissors className="w-3.5 h-3.5 text-[#d4af37]" /> Gentle Kids & Adult Loctician
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-black font-display ${
              isDark ? 'text-white' : 'text-[#04142b]'
            }`}
          >
            Crown Care: Locks, Retwists & Freestyle Braids
          </h2>
          <p className={isDark ? 'text-base sm:text-lg text-slate-300' : 'text-base sm:text-lg text-[#334155] font-medium'}>
            Clean. Neat. Confident. Travel-ready styles. Precision root work, crisp parting grids, and nurturing scalp health.
          </p>
        </div>

        {/* Real Client Showcase & Photo Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="group relative rounded-2xl overflow-hidden border-2 border-[#d4af37]/50 shadow-xl bg-[#041226]">
              <img
                src="/assets/aistudio/ZTZXKCZ3HHQ7UEDL7JIJ475M_54c67c2a.webp"
                alt="Client Locs Parting & Clean Grid Work"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#041226]/95 via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[11px] font-bold text-[#f3d078] bg-[#041226]/90 px-2.5 py-0.5 rounded-full border border-[#d4af37]/40">
                  Precision Parting Grid
                </span>
                <p className="text-xs text-white font-semibold mt-1">Immaculate scalp lines & palm retwist</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden border-2 border-[#d4af37]/50 shadow-xl bg-[#041226]">
              <img
                src="/assets/aistudio/PSMWGZA2JPS7CFRDUK5AHEIW_0a7cd65a.webp"
                alt="Close-up of Locs Retwist & Healthy Scalp"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#041226]/95 via-transparent to-transparent opacity-85" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[11px] font-bold text-[#f3d078] bg-[#041226]/90 px-2.5 py-0.5 rounded-full border border-[#d4af37]/40">
                  Healthy Root Density
                </span>
                <p className="text-xs text-white font-semibold mt-1">Hydrated scalp & zero-tension technique</p>
              </div>
            </div>
          </div>

          {/* Right description & Service packages */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-3">
              <h3
                className={`text-2xl sm:text-3xl font-black font-display ${
                  isDark ? 'text-white' : 'text-[#04142b]'
                }`}
              >
                The Signature 5-Step Loc Restoration
              </h3>
              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-[#334155] font-medium'
                }`}
              >
                Every loc session with Ken'nyzhae is an all-inclusive wellness ritual. Unlike rush salons, your hair receives meticulous cleansing, deep botanical scalp hydration, and gentle palm rolling so your retwist lasts longer without breakage.
              </p>
            </div>

            {/* Step list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {steps.map((st) => {
                const Icon = st.icon;
                return (
                  <div
                    key={st.num}
                    className={`p-3.5 rounded-xl border space-y-1 ${
                      isDark
                        ? 'bg-[#061833]/85 border-[#d4af37]/25 text-white'
                        : 'bg-white border-[#d4af37]/35 shadow-sm text-[#04142b]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#dfb75c]">{st.num}</span>
                      <Icon className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span className={`text-xs font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-[#04142b]'}`}>
                        {st.title}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quick Pricing Summary & Consultation CTA */}
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg ${
                isDark
                  ? 'bg-gradient-to-r from-[#071c38] to-[#0b274e] border-[#d4af37]/40 text-white'
                  : 'bg-gradient-to-r from-white to-[#faf7f0] border-[#d4af37]/45 text-[#04142b]'
              }`}
            >
              <div>
                <div className="text-xs text-slate-400">Wash, Retwist & Style</div>
                <div className="text-xl font-black text-[#dfb75c]">Starts at $50.00</div>
                <div className="text-[11px] text-slate-400">Final price determined by loc length/condition</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenHairAdvisor}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isDark
                      ? 'bg-[#071c38] hover:bg-[#0c2a52] text-[#f3d078] border-[#d4af37]/40'
                      : 'bg-white hover:bg-[#faf8f5] text-[#04142b] border-[#d4af37]/40 shadow-sm'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>AI Loc Diagnostic</span>
                </button>

                <button
                  onClick={() => onOpenBooking('locks-wash-retwist-style')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] text-xs font-bold shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Locs ($50+)</span>
                </button>
              </div>
            </div>

            <div className={`flex items-center gap-4 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span>
                Looking for Freestyle Braids?{' '}
                <strong className={isDark ? 'text-white' : 'text-[#04142b]'}>$100 flat (6 hrs)</strong>
              </span>
              <span>•</span>
              <button
                onClick={() => onOpenBooking('hair-consultation')}
                className="text-[#dfb75c] hover:underline font-semibold cursor-pointer"
              >
                Book $25 Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
