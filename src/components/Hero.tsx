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
} from 'lucide-react';

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
  return (
    <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28 bg-[#0b021a]">
      {/* Background celestial glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & High-Value Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-900/80 to-cyan-950/80 border border-cyan-400/30 text-cyan-300 text-xs sm:text-sm font-semibold shadow-md shadow-cyan-900/20">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>24/7 On-Call Elite Childcare & Natural Hair Artistry</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Where Children Flourish &{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300">
                  Dreams Take Flight
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-cyan-300 font-brand flex items-center gap-2">
                <span>Kweenz Dream💭</span>
                <span className="text-slate-400 text-sm font-normal">
                  founded by Ken'nyzhae Nathaniel
                </span>
              </p>
            </div>

            {/* Core Specialties list as seen in original brand artwork */}
            <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/40 border border-purple-500/30 backdrop-blur-md">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs sm:text-sm font-bold text-slate-200">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>24/HR NANNY</span>
                </div>
                <div className="flex items-center gap-2 text-pink-300">
                  <Heart className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>BABYSITTER</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300">
                  <Plane className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>PASSPORT NANNY</span>
                </div>
                <div className="flex items-center gap-2 text-purple-300">
                  <Scissors className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>LOCS & BRAIDS</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ADVENTURE DAYS</span>
                </div>
                <div className="flex items-center gap-2 text-blue-300">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>24-HR PET NANNY</span>
                </div>
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              From on-call emergency babysitting and school pickups to worldwide travel nanny
              accompaniment and gentle master loc retwists—providing loving, patient, and
              certified professional care centered on your child's well-being.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2 pb-2">
              <button
                onClick={() => onOpenBooking()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-xl shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all text-sm sm:text-base"
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                <span>Book Appointment</span>
              </button>

              <button
                onClick={() => onOpenBooking('meet-n-greet')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-white bg-purple-900/80 hover:bg-purple-800 border border-purple-400/40 shadow-lg hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm"
              >
                <Heart className="w-4 h-4 text-pink-400" />
                <span>Free Meet-N-Greet ($0)</span>
              </button>

              <a
                href="tel:3054096788"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-cyan-200 bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-xs sm:text-sm hover:text-white transition-all"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Call 305-409-6788</span>
              </a>
            </div>

            {/* Trust checkmarks */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>CPR & First-Aid Ready</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 On-Call Availability</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>San Francisco, Tampa & Global</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Artwork & Feature Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Glow ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse" />

              {/* Card Container */}
              <div className="relative rounded-3xl bg-[#12042b] border border-cyan-400/30 overflow-hidden shadow-2xl">
                {/* Hero Illustration */}
                <div className="relative h-96 sm:h-[420px] overflow-hidden bg-gradient-to-b from-purple-900 to-indigo-950">
                  <img
                    src="/assets/aistudio/Q23I372NJNBIAIIBXHFFJO25_3eb64b95.webp"
                    alt="Kweenz Dream - Ken'nyzhae Nathaniel and Kweenz IncrediBeingz"
                    className="w-full h-full object-cover object-top scale-105 hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12042b] via-transparent to-transparent opacity-90" />

                  {/* On-Call Floating Badge */}
                  <div className="absolute top-4 left-4 bg-purple-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-400/40 flex items-center gap-2 shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      24-Hours On-Call!
                    </span>
                  </div>

                  {/* Passport Nanny Floating Badge */}
                  <div className="absolute top-4 right-4 bg-amber-950/90 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/40 flex items-center gap-1.5 shadow-lg">
                    <Plane className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-bold text-amber-200">Passport Ready</span>
                  </div>
                </div>

                {/* Card Info Box */}
                <div className="p-6 space-y-4 bg-gradient-to-b from-[#12042b] to-[#0d0221]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-white font-display">
                        Ken'nyzhae Nathaniel
                      </h2>
                      <p className="text-xs text-cyan-400 font-semibold">
                        "Your Favorite Nanny" • Founder & Lead Loctician
                      </p>
                    </div>
                    <button
                      onClick={onOpenChat}
                      className="p-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-cyan-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                      title="Ask AI Concierge"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Ask Nana AI</span>
                    </button>
                  </div>

                  {/* Quick interactive shortcuts */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onOpenBooking('nanny-services')}
                      className="text-left p-3 rounded-xl bg-purple-900/30 hover:bg-purple-900/60 border border-purple-500/20 transition-all group"
                    >
                      <div className="text-[11px] text-slate-400">Childcare</div>
                      <div className="text-sm font-bold text-white group-hover:text-cyan-300 flex items-center justify-between">
                        <span>Nanny Care</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:translate-x-1" />
                      </div>
                      <div className="text-[11px] font-semibold text-cyan-300">From $30/hr</div>
                    </button>

                    <button
                      onClick={() => onOpenBooking('locks-wash-retwist-style')}
                      className="text-left p-3 rounded-xl bg-purple-900/30 hover:bg-purple-900/60 border border-purple-500/20 transition-all group"
                    >
                      <div className="text-[11px] text-slate-400">Hair Studio</div>
                      <div className="text-sm font-bold text-white group-hover:text-cyan-300 flex items-center justify-between">
                        <span>Locs Retwist</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:translate-x-1" />
                      </div>
                      <div className="text-[11px] font-semibold text-pink-300">From $50</div>
                    </button>
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
