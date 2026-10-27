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
                ? 'bg-[#071c38]/90 border-[#d4af37]/40 text-[#f3d078]'
                : 'bg-white border-[#d4af37]/40 text-[#04142b] shadow-sm'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-[#d4af37]" /> Transparent & Upfront Rates
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-black font-display ${
              isDark ? 'text-white' : 'text-[#04142b]'
            }`}
          >
            Interactive Rate & Care Estimator
          </h2>
          <p className={isDark ? 'text-base sm:text-lg text-slate-300' : 'text-base sm:text-lg text-[#334155] font-medium'}>
            No surprise invoices or hidden charges. Customize your hours, number of children, and care requirements for an instant breakdown.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div
          className={`max-w-4xl mx-auto rounded-3xl border-2 p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-colors ${
            isDark
              ? 'bg-[#061833]/95 border-[#d4af37]/50 text-white'
              : 'bg-white/95 border-[#d4af37]/45 text-[#04142b]'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Inputs */}
            <div className="md:col-span-7 space-y-6 text-left">
              {/* Service Select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#dfb75c]">
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
                  className={`w-full px-4 py-3 rounded-xl border font-medium focus:outline-none focus:border-[#d4af37] transition-colors ${
                    isDark
                      ? 'bg-[#041226] border-[#d4af37]/35 text-white'
                      : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                  }`}
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id} className={isDark ? 'bg-[#041226] text-white' : 'bg-white text-[#04142b]'}>
                      {s.title} ({s.durationLabel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Hourly Slider (only if hourly) */}
              {isHourly && (
                <div
                  className={`space-y-3 p-4 rounded-2xl border ${
                    isDark ? 'bg-[#041226]/80 border-[#d4af37]/25' : 'bg-[#faf8f5] border-[#d4af37]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-[#04142b]'}`}>
                      <Clock className="w-4 h-4 text-[#dfb75c]" />
                      <span>Duration (Hours)</span>
                    </label>
                    <span className="text-base font-black text-[#dfb75c]">
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
                    className="w-full accent-[#d4af37] cursor-pointer h-2 bg-[#0a2346] rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Min: {minHours} hrs requirement</span>
                    <span>Full day / 16 hrs max</span>
                  </div>
                </div>
              )}

              {/* Children Count (for child care services) */}
              {selectedService.category !== 'hair' && selectedService.category !== 'pet' && (
                <div
                  className={`space-y-3 p-4 rounded-2xl border ${
                    isDark ? 'bg-[#041226]/80 border-[#d4af37]/25' : 'bg-[#faf8f5] border-[#d4af37]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-[#04142b]'}`}>
                      <Users className="w-4 h-4 text-[#dfb75c]" />
                      <span>Number of Children</span>
                    </label>
                    <span className="text-base font-black text-[#dfb75c]">
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
                            ? 'bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] text-[#041226] border-[#d4af37] shadow-md shadow-amber-500/20'
                            : isDark
                            ? 'bg-[#071c38] text-slate-300 hover:text-white border-[#d4af37]/30'
                            : 'bg-white text-[#04142b] hover:text-[#b8860b] border-[#d4af37]/35'
                        }`}
                      >
                        {count} {count === 1 ? 'Child' : 'Kids'}
                      </button>
                    ))}
                  </div>
                  {childrenCount > 1 && selectedService.additionalChildRate ? (
                    <p className="text-[11px] text-[#dfb75c]">
                      +${selectedService.additionalChildRate}/hr for each additional child ({childrenCount - 1} extra child: +${(childrenCount - 1) * selectedService.additionalChildRate}/hr).
                    </p>
                  ) : null}
                </div>
              )}

              {/* Special Inclusions Summary */}
              <div className={`space-y-1 text-xs ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-[#dfb75c] shrink-0" />
                  <span>Includes live parent SMS check-ins & photo updates</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-[#dfb75c] shrink-0" />
                  <span>First-aid and emergency prepared caregiver</span>
                </div>
              </div>
            </div>

            {/* Right Summary Card */}
            <div
              className={`md:col-span-5 rounded-2xl border-2 p-6 flex flex-col justify-between space-y-6 shadow-xl text-left ${
                isDark
                  ? 'bg-gradient-to-b from-[#071c38] to-[#041226] border-[#d4af37]/50 text-white'
                  : 'bg-gradient-to-b from-white to-[#faf7f0] border-[#d4af37]/50 text-[#04142b]'
              }`}
            >
              <div className="space-y-4">
                <div className={`border-b pb-3 ${isDark ? 'border-[#d4af37]/25' : 'border-[#d4af37]/25'}`}>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#dfb75c]">
                    Estimate Summary
                  </span>
                  <h3 className="text-xl font-black font-display mt-0.5">
                    {selectedService.title}
                  </h3>
                </div>

                {/* Line items */}
                <div className={`space-y-2.5 text-xs ${isDark ? 'text-slate-200' : 'text-[#334155]'}`}>
                  {isHourly && (
                    <>
                      <div className="flex justify-between">
                        <span>Base Rate:</span>
                        <span className="font-semibold">
                          {formatCurrency(pricing.breakdown.baseRate)}/hr
                        </span>
                      </div>
                      {pricing.breakdown.extraChildFeePerHour > 0 && (
                        <div className="flex justify-between text-[#dfb75c]">
                          <span>Additional Children Fee:</span>
                          <span className="font-semibold">
                            +{formatCurrency(pricing.breakdown.extraChildFeePerHour)}/hr
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Effective Hourly Rate:</span>
                        <span className="font-bold text-[#dfb75c]">
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
                      <span>Standard Flat Package:</span>
                      <span className="font-semibold">
                        {formatCurrency(pricing.total)}
                      </span>
                    </div>
                  )}

                  {pricing.deposit > 0 && (
                    <div className="flex justify-between pt-2 border-t border-[#d4af37]/20 text-[#dfb75c] font-semibold">
                      <span>Booking Deposit Due:</span>
                      <span>{formatCurrency(pricing.deposit)}</span>
                    </div>
                  )}
                </div>

                {/* Grand Total */}
                <div
                  className={`pt-4 border-t ${
                    isDark ? 'border-[#d4af37]/30' : 'border-[#d4af37]/30'
                  }`}
                >
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Estimated Total
                  </div>
                  <div className="text-3xl font-black text-[#dfb75c]">
                    {pricing.total === 0 ? 'Free ($0.00)' : formatCurrency(pricing.total)}
                  </div>
                  {pricing.deposit > 0 && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Remaining balance payable after service completion.
                    </p>
                  )}
                </div>
              </div>

              {/* Book with this estimate */}
              <button
                onClick={() =>
                  onOpenBookingWithDetails({
                    serviceId: selectedService.id,
                    hours: isHourly ? hours : selectedService.defaultDurationHours || 4,
                    childrenCount,
                  })
                }
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] font-black text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#041226]" />
                <span>Book Nana Now (With This Estimate)</span>
                <ArrowRight className="w-4 h-4 text-[#041226]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
