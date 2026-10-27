import React from 'react';
import { Plane, Compass, Shield, Luggage, Globe, CheckCircle2, ArrowRight } from 'lucide-react';

interface PassportNannyBannerProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const PassportNannyBanner: React.FC<PassportNannyBannerProps> = ({
  onOpenBooking,
}) => {
  return (
    <section id="passport-nanny" className="py-20 bg-gradient-to-b from-[#0b021a] via-[#0f0426] to-[#0b021a] relative overflow-hidden">
      {/* Decorative Golden Aurora */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-950/80 via-purple-950/60 to-slate-950/90 border border-amber-400/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle gold ribbon top right */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-600 text-slate-950 text-xs font-black px-6 py-1.5 rounded-bl-2xl shadow-md uppercase tracking-wider">
            Signature VIP Offering
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual Gold Crest Artwork */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl shadow-amber-500/15">
                <img
                  src="/assets/aistudio/T47GYQIQZI3O77PQ3A5YN3ML_e5f6454f.webp"
                  alt="Passport Nanny VIP Luxury Travel Childcare"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-widest bg-slate-950/80 px-3 py-1 rounded-full border border-amber-400/30">
                    Domestic & International Travel Care
                  </span>
                </div>
              </div>
            </div>

            {/* Content & Details */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Plane className="w-3.5 h-3.5" /> High-End Travel Childcare
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
                  The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300">Passport Nanny</span> Experience
                </h2>
                <p className="text-base sm:text-lg text-slate-300">
                  Vacations, family reunions, destination weddings, and business trips without the overwhelm. Ken’nyzhae travels with your family door-to-door.
                </p>
              </div>

              {/* Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <Luggage className="w-4 h-4 text-amber-400" />
                    <span>Airports & Flights</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    TSA line assistance, stroller handling, engaging in-flight play, snack distribution, and ears-popping comfort.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span>Resorts & Excursions</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Attentive poolside safety monitoring, beach sandcastle play, museum chaperoning, and daytime excursions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-pink-300 font-bold text-sm">
                    <Globe className="w-4 h-4 text-pink-400" />
                    <span>Time Zone Easing</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Gentle routine adjustments, nap synchronization, and peaceful bedtime story wind-down in unfamiliar hotels.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Parents Night Out</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Enjoy date nights, gala dinners, or private wedding receptions knowing your little ones are safely asleep with Nana.
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenBooking('passport-travel-nanny')}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <Plane className="w-4 h-4 text-slate-950" />
                  <span>Request Travel Consultation</span>
                </button>

                <button
                  onClick={() => onOpenBooking('multiple-days-deposit')}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-white font-semibold text-sm border border-purple-500/40 transition-all"
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
