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
              className={`relative max-w-sm rounded-3xl overflow-hidden border-2 shadow-2xl transition-all ${
                isDark
                  ? 'border-[#d4af37]/60 bg-[#041226] shadow-black/50'
                  : 'border-[#d4af37]/50 bg-white shadow-xl shadow-amber-900/5'
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
                    ? 'from-[#041226] via-transparent to-transparent opacity-90'
                    : 'from-[#04142b]/90 via-transparent to-transparent'
                }`}
              />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <div className="inline-block bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#041226] text-[11px] font-bold px-3 py-1 rounded-full shadow-md mb-1">
                  Founder & Care Director
                </div>
                <h3 className="text-xl font-black text-white font-display">Ken'nyzhae Nathaniel</h3>
                <p className="text-xs text-[#f3d078]">"Your Favorite Nanny" • Master Loctician</p>
              </div>
            </div>
          </div>

          {/* Right Founder Story & Guarantees */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-2">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
                  isDark
                    ? 'bg-[#071c38]/90 border-[#d4af37]/40 text-[#f3d078]'
                    : 'bg-white border-[#d4af37]/40 text-[#04142b] shadow-sm'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-[#dfb75c]" /> Passion, Safety & Dedication
              </div>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight ${
                  isDark ? 'text-white' : 'text-[#04142b]'
                }`}
              >
                Meet Your Family's Favorite Partner in Care
              </h2>
            </div>

            <p
              className={`text-base sm:text-lg leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-[#334155]'
              }`}
            >
              Founded by <strong>Ken'nyzhae Nathaniel</strong>, Kweenz Dream was born from a deep conviction: every child deserves attentive, joyful, and emotionally enriching care, whether at home, at school dismissal, on long flights, or in the styling chair.
            </p>

            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-[#475569]'
              }`}
            >
              As both an experienced childcare specialist and a master loctician, Ken'nyzhae brings a uniquely gentle, patient touch. Parents rely on her 24/7 on-call dependability, knowing their children's safety, homework, healthy routines, and natural hair are nurtured with unmatched excellence.
            </p>

            {/* Credential Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                  isDark
                    ? 'bg-[#061833]/85 border-[#d4af37]/25'
                    : 'bg-white border-[#d4af37]/35 shadow-sm'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-[#dfb75c] shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#04142b]'}`}>
                    CPR & First-Aid Prepared
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                    Trained for rapid, calm emergency response and child safety.
                  </p>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                  isDark
                    ? 'bg-[#061833]/85 border-[#d4af37]/25'
                    : 'bg-white border-[#d4af37]/35 shadow-sm'
                }`}
              >
                <Award className="w-5 h-5 text-[#dfb75c] shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#04142b]'}`}>
                    Passport Travel Ready
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                    Experienced in airport transit, airline gate navigation, and resort care.
                  </p>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                  isDark
                    ? 'bg-[#061833]/85 border-[#d4af37]/25'
                    : 'bg-white border-[#d4af37]/35 shadow-sm'
                }`}
              >
                <Heart className="w-5 h-5 text-[#dfb75c] shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#04142b]'}`}>
                    Tender-Head Hair Care
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                    Zero painful tension for kids' locs, retwists, and protective braids.
                  </p>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-colors ${
                  isDark
                    ? 'bg-[#061833]/85 border-[#d4af37]/25'
                    : 'bg-white border-[#d4af37]/35 shadow-sm'
                }`}
              >
                <Star className="w-5 h-5 text-[#dfb75c] shrink-0 mt-0.5" />
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#04142b]'}`}>
                    24/7 On-Call Flexibility
                  </h4>
                  <p className={`text-[11px] ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                    Ready when you need emergency babysitting or last-minute coverage.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact callout */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Schedule A Free Meet & Greet
              </button>

              <a
                href="tel:3054096788"
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-[#071c38] hover:bg-[#0c2a52] text-[#f3d078] border-[#d4af37]/40'
                    : 'bg-[#faf8f5] hover:bg-[#f1ebe0] text-[#04142b] border-[#d4af37]/40'
                }`}
              >
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>Call Directly: (305) 409-6788</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
