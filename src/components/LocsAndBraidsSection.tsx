import React from 'react';
import {
  Scissors,
  Sparkles,
  Droplets,
  Wind,
  CheckCircle2,
  Calendar,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

interface LocsAndBraidsSectionProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenHairAdvisor: () => void;
}

export const LocsAndBraidsSection: React.FC<LocsAndBraidsSectionProps> = ({
  onOpenBooking,
  onOpenHairAdvisor,
}) => {
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
    <section id="hair-locs" className="py-20 bg-[#0d0221] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-950/80 border border-pink-400/30 text-pink-300 text-xs font-semibold uppercase tracking-wider">
            <Scissors className="w-3.5 h-3.5" /> Gentle Kids & Adult Loctician
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display">
            Crown Care: Locks, Retwists & Freestyle Braids
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Precision root work, crisp parting grids, and nurturing scalp health. We believe in gentle hands, healthy follicles, and lasting style.
          </p>
        </div>

        {/* Real Client Showcase & Photo Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="group relative rounded-2xl overflow-hidden border border-purple-500/40 shadow-xl bg-purple-950">
              <img
                src="/assets/aistudio/ZTZXKCZ3HHQ7UEDL7JIJ475M_54c67c2a.webp"
                alt="Client Locs Parting & Clean Grid Work"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[11px] font-bold text-cyan-300 bg-purple-950/90 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
                  Precision Parting Grid
                </span>
                <p className="text-xs text-white font-semibold mt-1">Immaculate scalp lines & palm retwist</p>
              </div>
            </div>

            <div className="group relative rounded-2xl overflow-hidden border border-purple-500/40 shadow-xl bg-purple-950">
              <img
                src="/assets/aistudio/PSMWGZA2JPS7CFRDUK5AHEIW_0a7cd65a.webp"
                alt="Close-up of Locs Retwist & Healthy Scalp"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[11px] font-bold text-pink-300 bg-purple-950/90 px-2.5 py-0.5 rounded-full border border-pink-400/30">
                  Healthy Root Density
                </span>
                <p className="text-xs text-white font-semibold mt-1">Hydrated scalp & zero-tension technique</p>
              </div>
            </div>
          </div>

          {/* Right description & Service packages */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                The Signature 5-Step Loc Restoration
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Every loc session with Ken'nyzhae is an all-inclusive wellness ritual. Unlike rush salons, your hair receives meticulous cleansing, deep botanical scalp hydration, and gentle palm rolling so your retwist lasts longer without breakage.
              </p>
            </div>

            {/* Step list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {steps.map((st) => {
                const Icon = st.icon;
                return (
                  <div key={st.num} className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-cyan-400">{st.num}</span>
                      <Icon className="w-3.5 h-3.5 text-pink-400" />
                      <span className="text-xs font-bold text-white line-clamp-1">{st.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{st.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Pricing Summary & Consultation CTA */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-cyan-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400">Wash, Retwist & Style</div>
                <div className="text-xl font-black text-cyan-300">Starts at $50.00</div>
                <div className="text-[11px] text-slate-400">Final price determined by loc length/condition</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenHairAdvisor}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-cyan-300 text-xs font-bold border border-purple-500/40"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Loc Diagnostic</span>
                </button>

                <button
                  onClick={() => onOpenBooking('locks-wash-retwist-style')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Locs ($50+)</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>Looking for Freestyle Braids? <strong className="text-white">$100 flat (6 hrs)</strong></span>
              <span>•</span>
              <button
                onClick={() => onOpenBooking('hair-consultation')}
                className="text-cyan-300 hover:underline font-semibold"
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
