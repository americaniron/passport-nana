import React from 'react';
import { Heart, ShieldCheck, Award, Star, Phone, CheckCircle2 } from 'lucide-react';

interface AboutFounderProps {
  onOpenBooking: () => void;
}

export const AboutFounder: React.FC<AboutFounderProps> = ({ onOpenBooking }) => {
  return (
    <section id="about" className="py-20 bg-[#0b021a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Art & Portrait */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative max-w-sm rounded-3xl overflow-hidden border border-cyan-400/40 shadow-2xl bg-purple-950">
              <img
                src="/assets/aistudio/LYZRLDMS4X5O44JOOXY3YY7K_5185ff1e.webp"
                alt="Ken'nyzhae Nathaniel with Kweenz Dream Little Ones"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-75" />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <div className="inline-block bg-purple-900/90 text-cyan-300 text-[11px] font-bold px-3 py-1 rounded-full border border-cyan-400/30 mb-1">
                  Founder & Care Director
                </div>
                <h3 className="text-xl font-black text-white font-display">Ken'nyzhae Nathaniel</h3>
                <p className="text-xs text-slate-300">"Your Favorite Nanny" • Master Loctician</p>
              </div>
            </div>
          </div>

          {/* Right Founder Story & Guarantees */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 text-pink-400" /> Passion, Safety & Dedication
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
                Meet Your Family's Favorite Partner in Care
              </h2>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Founded by <strong>Ken'nyzhae Nathaniel</strong>, Kweenz Dream was born from a deep conviction: every child deserves attentive, joyful, and emotionally enriching care, whether at home, at school dismissal, on long flights, or in the styling chair.
            </p>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              As both an experienced childcare specialist and a master loctician, Ken'nyzhae brings a uniquely gentle, patient touch. Parents rely on her 24/7 on-call dependability, knowing their children's safety, homework, healthy routines, and natural hair are nurtured with unmatched excellence.
            </p>

            {/* Credential Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">CPR & First-Aid Prepared</h4>
                  <p className="text-[11px] text-slate-400">Trained for rapid, calm emergency response and child safety.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-start gap-3">
                <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Passport Travel Ready</h4>
                  <p className="text-[11px] text-slate-400">Experienced in airport transit, airline gate navigation, and resort care.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-start gap-3">
                <Heart className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Tender-Head Hair Care</h4>
                  <p className="text-[11px] text-slate-400">Zero painful tension for kids' locs, retwists, and protective braids.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-start gap-3">
                <Star className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">24/7 On-Call Flexibility</h4>
                  <p className="text-[11px] text-slate-400">Ready when you need emergency babysitting or last-minute coverage.</p>
                </div>
              </div>
            </div>

            {/* Contact callout */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
              >
                Schedule A Free Meet & Greet
              </button>

              <a
                href="tel:3054096788"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-white font-bold text-sm border border-purple-500/40 transition-all"
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
