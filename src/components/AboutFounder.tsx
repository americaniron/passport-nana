import React from 'react';
import { Heart, ShieldCheck, Award, Star, Phone } from 'lucide-react';
import { SectionBackgroundVideo } from './SectionBackgroundVideo.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface AboutFounderProps {
  onOpenBooking: () => void;
}

export const AboutFounder: React.FC<AboutFounderProps> = ({ onOpenBooking }) => {
  const { isDark } = useTheme();

  return (
    <section id="about" className="py-20 relative overflow-hidden transition-colors duration-300">
      {/* Looping Section Background Video: Warm familial embrace & loving care ripples */}
      <SectionBackgroundVideo
        videoUrl="/videos/about-founder.mp4"
        opacityDark="opacity-30"
        opacityLight="opacity-20"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Art & Portrait */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div
              className={`relative max-w-sm rounded-3xl overflow-hidden border shadow-2xl transition-all ${
                isDark
                  ? 'border-cyan-400/40 bg-purple-950 shadow-purple-950/50'
                  : 'border-purple-300 bg-white shadow-xl shadow-purple-100'
              }`}
            >
              <img
                src="/assets/aistudio/LYZRLDMS4X5O44JOOXY3YY7K_5185ff1e.webp"
                alt="Ken'nyzhae Nathaniel with Kweenz Dream Little Ones"
                className="w-full h-auto object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  isDark
                    ? 'from-slate-950 via-transparent to-transparent opacity-85'
                    : 'from-slate-900/80 via-transparent to-transparent'
                }`}
              />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <div className="inline-block bg-purple-900/90 text-cyan-300 text-[11px] font-bold px-3 py-1 rounded-full border border-cyan-400/30 mb-1">
                  Founder & Care Director
                </div>
                <h3 className="text-xl font-black text-white font-display">Ken'nyzhae Nathaniel</h3>
                <p className="text-xs text-slate-200">"Your Favorite Nanny" • Master Loctician</p>
              </div>
            </div>
          </div>

          {/* Right Founder Story & Guarantees */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-2">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
                  isDark
                    ? 'bg-purple-950/80 border-purple-400/30 text-purple-300'
                    : 'bg-purple-100 border-purple-300 text-purple-900'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-pink-400" /> Passion, Safety & Dedication
              </div>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}
              >
                Meet Your Family's Favorite Partner in Care
              </h2>
            </div>

            <p
              className={`text-base sm:text-lg leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Founded by <strong>Ken'nyzhae Nathaniel</strong>, Kweenz Dream was born from a deep conviction: every child deserves attentive, joyful, and emotionally enriching care, whether at home, at school dismissal, on long flights, or in the styling chair.
            </p>

            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              As both an experienced childcare specialist and a master loctician, Ken'nyzhae brings a uniquely gentle, patient touch. Parents rely on her 24/7 on-call dependability, knowing their children's safety, homework, healthy routines, and natural hair are nurtured with unmatched excellence.
            </p>

            {/* Credential Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                  isDark
                    ? 'bg-purple-950/40 border-purple-500/20'
                    : 'bg-white/80 border-purple-200 shadow-sm'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    CPR & First-Aid Prepared
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Trained for rapid, calm emergency response and child safety.
                  </p>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                  isDark
                    ? 'bg-purple-950/40 border-purple-500/20'
                    : 'bg-white/80 border-purple-200 shadow-sm'
                }`}
              >
                <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Passport Travel Ready
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Experienced in airport transit, airline gate navigation, and resort care.
                  </p>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                  isDark
                    ? 'bg-purple-950/40 border-purple-500/20'
                    : 'bg-white/80 border-purple-200 shadow-sm'
                }`}
              >
                <Heart className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Tender-Head Hair Care
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Zero painful tension for kids' locs, retwists, and protective braids.
                  </p>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                  isDark
                    ? 'bg-purple-950/40 border-purple-500/20'
                    : 'bg-white/80 border-purple-200 shadow-sm'
                }`}
              >
                <Star className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    24/7 On-Call Flexibility
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Ready when you need emergency babysitting or last-minute coverage.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact callout */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Schedule A Free Meet & Greet
              </button>

              <a
                href="tel:3054096788"
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-purple-900/60 hover:bg-purple-800 text-white border-purple-500/40'
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-950 border-purple-300'
                }`}
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Call Directly: (305) 409-6788</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
