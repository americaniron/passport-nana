import React, { useState } from 'react';
import { SERVICES } from '../data/services.ts';
import { calculateServicePrice, formatCurrency } from '../utils/pricing.ts';
import { Calculator, Users, Clock, Calendar, Check, ArrowRight } from 'lucide-react';
import { SectionBackgroundVideo } from './SectionBackgroundVideo.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface PricingCalculatorProps {
  onOpenBookingWithDetails: (details: {
    serviceId: string;
    hours: number;
    childrenCount: number;
  }) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  onOpenBookingWithDetails,
}) => {
  const { isDark } = useTheme();
  const [selectedServiceId, setSelectedServiceId] = useState<string>('nanny-services');
  const [hours, setHours] = useState<number>(4);
  const [childrenCount, setChildrenCount] = useState<number>(1);

  const selectedService =
    SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  const minHours = selectedService.minHours || 4;
  const isHourly = selectedService.priceType === 'hourly';

  const pricing = calculateServicePrice({
    basePrice: selectedService.basePrice,
    priceType: selectedService.priceType,
    hours: isHourly ? Math.max(hours, minHours) : selectedService.defaultDurationHours || 4,
    minHours,
    childrenCount,
    additionalChildRate: selectedService.additionalChildRate || 0,
  });

  return (
    <section id="calculator" className="py-20 relative transition-colors duration-300">
      {/* Looping Section Background Video: Schedule planning, routine & transparent rates */}
      <SectionBackgroundVideo
        videoUrl="/videos/pricing-calculator.mp4"
        opacityDark="opacity-30"
        opacityLight="opacity-20"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${
              isDark
                ? 'bg-cyan-950/80 border-cyan-400/30 text-cyan-300'
                : 'bg-purple-100 border-purple-300 text-purple-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> Transparent & Upfront Rates
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-black font-display ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            Interactive Rate & Care Estimator
          </h2>
          <p className={isDark ? 'text-base sm:text-lg text-slate-300' : 'text-base sm:text-lg text-slate-700 font-medium'}>
            No surprise invoices or hidden charges. Customize your hours, number of children, and care requirements for an instant breakdown.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div
          className={`max-w-4xl mx-auto rounded-3xl border p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-colors ${
            isDark
              ? 'bg-[#14062f] border-cyan-400/30 text-white'
              : 'bg-white/95 border-purple-300 text-slate-900'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Inputs */}
            <div className="md:col-span-7 space-y-6 text-left">
              {/* Service Select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-300">
                  Select Care or Hair Service
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setSelectedServiceId(newId);
                    const s = SERVICES.find((item) => item.id === newId);
                    if (s?.minHours && hours < s.minHours) {
                      setHours(s.minHours);
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border font-medium focus:outline-none focus:border-cyan-400 transition-colors ${
                    isDark
                      ? 'bg-purple-950/80 border-purple-500/40 text-white'
                      : 'bg-slate-50 border-purple-200 text-slate-900'
                  }`}
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id} className={isDark ? 'bg-purple-950 text-white' : 'bg-white text-slate-900'}>
                      {s.title} ({s.durationLabel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Hourly Slider (only if hourly) */}
              {isHourly && (
                <div
                  className={`space-y-3 p-4 rounded-2xl border ${
                    isDark ? 'bg-purple-950/40 border-purple-500/20' : 'bg-purple-50 border-purple-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <Clock className="w-4 h-4 text-cyan-500" />
                      <span>Duration (Hours)</span>
                    </label>
                    <span className="text-base font-black text-cyan-600 dark:text-cyan-300">
                      {hours} {hours === 1 ? 'Hour' : 'Hours'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={minHours}
                    max={16}
                    step={1}
                    value={hours}
                    onChange={(e) => setHours(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-500 cursor-pointer h-2 bg-purple-200 dark:bg-purple-900 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Min: {minHours} hrs requirement</span>
                    <span>Full day / 16 hrs max</span>
                  </div>
                </div>
              )}

              {/* Children Count (for child care services) */}
              {selectedService.category !== 'hair' && selectedService.category !== 'pet' && (
                <div
                  className={`space-y-3 p-4 rounded-2xl border ${
                    isDark ? 'bg-purple-950/40 border-purple-500/20' : 'bg-purple-50 border-purple-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <Users className="w-4 h-4 text-pink-500" />
                      <span>Number of Children</span>
                    </label>
                    <span className="text-base font-black text-pink-600 dark:text-pink-300">
                      {childrenCount} {childrenCount === 1 ? 'Child' : 'Children'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setChildrenCount(count)}
                        className={`py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                          childrenCount === count
                            ? 'bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-500/20'
                            : isDark
                            ? 'bg-purple-950/60 text-slate-300 hover:text-white border-purple-500/30'
                            : 'bg-white text-slate-700 hover:text-purple-900 border-purple-200'
                        }`}
                      >
                        {count} {count === 1 ? 'Child' : 'Kids'}
                      </button>
                    ))}
                  </div>
                  {childrenCount > 1 && selectedService.additionalChildRate ? (
                    <p className="text-[11px] text-pink-600 dark:text-pink-300">
                      +${selectedService.additionalChildRate}/hr for each additional child ({childrenCount - 1} extra child: +${(childrenCount - 1) * selectedService.additionalChildRate}/hr).
                    </p>
                  ) : null}
                </div>
              )}

              {/* Special Inclusions Summary */}
              <div className={`space-y-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>Includes live parent SMS check-ins & photo updates</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span>First-aid and emergency prepared caregiver</span>
                </div>
              </div>
            </div>

            {/* Right Summary Card */}
            <div
              className={`md:col-span-5 rounded-2xl border p-6 flex flex-col justify-between space-y-6 shadow-xl text-left ${
                isDark
                  ? 'bg-gradient-to-b from-purple-950 to-indigo-950 border-cyan-400/40 text-white'
                  : 'bg-gradient-to-b from-purple-100 to-indigo-100 border-purple-300 text-slate-900'
              }`}
            >
              <div className="space-y-4">
                <div className={`border-b pb-3 ${isDark ? 'border-purple-500/30' : 'border-purple-200'}`}>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    Estimate Summary
                  </span>
                  <h3 className="text-xl font-black font-display mt-0.5">
                    {selectedService.title}
                  </h3>
                </div>

                {/* Line items */}
                <div className={`space-y-2.5 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {isHourly && (
                    <>
                      <div className="flex justify-between">
                        <span>Base Rate:</span>
                        <span className="font-semibold">
                          {formatCurrency(pricing.breakdown.baseRate)}/hr
                        </span>
                      </div>
                      {pricing.breakdown.extraChildFeePerHour > 0 && (
                        <div className="flex justify-between text-pink-600 dark:text-pink-300">
                          <span>Additional Children Fee:</span>
                          <span className="font-semibold">
                            +{formatCurrency(pricing.breakdown.extraChildFeePerHour)}/hr
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Effective Hourly Rate:</span>
                        <span className="font-bold text-cyan-600 dark:text-cyan-300">
                          {formatCurrency(pricing.ratePerHour)}/hr
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Charged Duration:</span>
                        <span className="font-semibold">
                          {pricing.effectiveHours} Hours
                        </span>
                      </div>
                    </>
                  )}

                  {!isHourly && (
                    <div className="flex justify-between">
                      <span>Rate Type:</span>
                      <span className="font-semibold">
                        {selectedService.priceType === 'free'
                          ? '100% Free'
                          : selectedService.priceType === 'deposit'
                          ? 'Reservation Deposit'
                          : 'Flat Rate Starting Price'}
                      </span>
                    </div>
                  )}

                  <div className={`pt-3 border-t flex justify-between items-baseline ${isDark ? 'border-purple-500/30' : 'border-purple-200'}`}>
                    <span className="text-sm font-bold">Estimated Total:</span>
                    <span className="text-2xl font-black text-cyan-600 dark:text-cyan-300 font-display">
                      {formatCurrency(pricing.total)}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline text-xs text-slate-500 dark:text-slate-400">
                    <span>Required Slot Deposit:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-300">
                      {formatCurrency(pricing.deposit)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() =>
                  onOpenBookingWithDetails({
                    serviceId: selectedService.id,
                    hours: isHourly ? hours : selectedService.defaultDurationHours || 4,
                    childrenCount,
                  })
                }
                className="w-full py-3.5 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 text-slate-950 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-950" />
                <span>Reserve This Quote</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
