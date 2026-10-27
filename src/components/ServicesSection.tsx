import React, { useState } from 'react';
import { SERVICES, SERVICE_CATEGORIES } from '../data/services.ts';
import { ServiceCategory, ServiceItem } from '../types/index.ts';
import {
  Calendar,
  Clock,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  X,
  Star,
} from 'lucide-react';
import { formatCurrency } from '../utils/pricing.ts';
import { SectionBackgroundVideo } from './SectionBackgroundVideo.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface ServicesSectionProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenCalculator: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenBooking,
  onOpenCalculator,
}) => {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [selectedServiceForModal, setSelectedServiceForModal] =
    useState<ServiceItem | null>(null);

  const filteredServices =
    activeCategory === 'all'
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeCategory);

  return (
    <section id="services" className="py-20 relative transition-colors duration-300">
      {/* Looping Section Background Video: Children learning, colorful toys & cheerful play */}
      <SectionBackgroundVideo
        videoUrl="/videos/services-childcare.mp4"
        opacityDark="opacity-30"
        opacityLight="opacity-20"
      />

      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-[#d4af37]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${
              isDark
                ? 'bg-[#071c38]/90 border-[#d4af37]/40 text-[#f3d078]'
                : 'bg-white border-[#d4af37]/40 text-[#04142b] shadow-sm'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> Comprehensive Care & Hair Artistry
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-black font-display ${
              isDark ? 'text-white' : 'text-[#04142b]'
            }`}
          >
            Curated Services Built With Love
          </h2>
          <p className={isDark ? 'text-base sm:text-lg text-slate-300' : 'text-base sm:text-lg text-[#334155] font-medium'}>
            Tailored childcare routines, safe travel companionship, on-call emergency babysitting,
            and gentle master loc retwisting. Choose a service to reserve your session.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {SERVICE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as ServiceCategory)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] text-[#041226] shadow-lg shadow-amber-500/25 scale-105'
                    : isDark
                    ? 'bg-[#061833]/70 text-slate-300 hover:text-white hover:bg-[#0c2a52] border border-[#d4af37]/30'
                    : 'bg-white text-[#04142b] hover:text-[#b8860b] hover:bg-[#faf8f5] border border-[#d4af37]/40 shadow-sm'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`group rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col shadow-xl hover:-translate-y-1.5 ${
                isDark
                  ? 'bg-[#061833]/90 border-[#d4af37]/35 hover:border-[#dfb75c] hover:shadow-amber-500/15'
                  : 'bg-white/95 border-[#d4af37]/40 hover:border-[#c59b27] hover:shadow-amber-500/20'
              }`}
            >
              {/* Service Card Image */}
              <div className="relative h-56 overflow-hidden bg-[#041226]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-85 ${
                    isDark ? 'from-[#061833]' : 'from-[#04142b]/90'
                  }`}
                />

                {/* Badge if available */}
                {service.badge && (
                  <div className="absolute top-3 left-3 bg-[#041226]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#d4af37]/50 text-[11px] font-bold text-[#f3d078]">
                    {service.badge}
                  </div>
                )}

                {/* Duration indicator */}
                <div className="absolute bottom-3 right-3 bg-[#041226]/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#d4af37]/30 text-[11px] font-medium text-slate-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#dfb75c]" />
                  <span>{service.durationLabel}</span>
                </div>
              </div>

              {/* Service Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-2">
                  <h3
                    className={`text-xl font-bold transition-colors ${
                      isDark ? 'text-white group-hover:text-[#f3d078]' : 'text-[#04142b] group-hover:text-[#b8860b]'
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p className={`text-xs font-semibold ${isDark ? 'text-[#dfb75c]' : 'text-[#b8860b]'}`}>
                    {service.subtitle}
                  </p>
                  <p
                    className={`text-sm line-clamp-3 leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-[#475569]'
                    }`}
                  >
                    {service.shortDesc}
                  </p>
                </div>

                {/* Key inclusions checklist */}
                <div
                  className={`space-y-1.5 pt-2 border-t text-xs ${
                    isDark
                      ? 'border-[#d4af37]/20 text-slate-300'
                      : 'border-[#d4af37]/20 text-[#334155]'
                  }`}
                >
                  {service.inclusions.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#dfb75c] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing & Booking Actions */}
                <div
                  className={`pt-4 border-t flex items-center justify-between gap-3 ${
                    isDark ? 'border-[#d4af37]/20' : 'border-[#d4af37]/20'
                  }`}
                >
                  <div>
                    <div className="text-[11px] uppercase font-semibold text-slate-400">Rate</div>
                    <div className={`text-lg font-black ${isDark ? 'text-[#f3d078]' : 'text-[#04142b]'}`}>
                      {service.priceType === 'free'
                        ? 'Free ($0.00)'
                        : service.priceType === 'deposit'
                        ? `${formatCurrency(service.basePrice)} Deposit`
                        : service.priceType === 'hourly'
                        ? `${formatCurrency(service.basePrice)}/hr`
                        : `From ${formatCurrency(service.basePrice)}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedServiceForModal(service)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isDark
                          ? 'bg-[#071c38] text-slate-300 hover:text-white border-[#d4af37]/30 hover:border-[#d4af37]'
                          : 'bg-[#faf8f5] text-[#04142b] border-[#d4af37]/40 hover:border-[#b8860b]'
                      }`}
                      title="View Details & Requirements"
                      aria-label="View Details"
                    >
                      <Info className="w-4 h-4 text-[#dfb75c]" />
                    </button>

                    <button
                      onClick={() => onOpenBooking(service.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Nana Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Quick Calculator Banner */}
        <div
          className={`mt-16 p-6 sm:p-8 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl transition-colors ${
            isDark
              ? 'bg-gradient-to-r from-[#071c38] via-[#0b274e] to-[#071c38] border-[#d4af37]/40 text-white'
              : 'bg-gradient-to-r from-white via-[#faf7f0] to-white border-[#d4af37]/50 text-[#04142b]'
          }`}
        >
          <div className="space-y-1 text-center sm:text-left">
            <h3
              className={`text-xl sm:text-2xl font-bold font-display ${
                isDark ? 'text-white' : 'text-[#04142b]'
              }`}
            >
              Need a personalized childcare or travel rate estimate?
            </h3>
            <p className={isDark ? 'text-sm text-slate-300' : 'text-sm text-[#475569] font-medium'}>
              Use our live interactive calculator to calculate transparent hourly rates, multiple
              children add-ons, and booking deposits.
            </p>
          </div>
          <button
            onClick={onOpenCalculator}
            className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] font-bold text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105 cursor-pointer"
          >
            <span>Open Price Calculator</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detailed Service Modal */}
      {selectedServiceForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div
            className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border p-6 sm:p-8 space-y-6 shadow-2xl text-left ${
              isDark
                ? 'bg-[#041226] border-[#d4af37]/50 text-white'
                : 'bg-white border-[#d4af37]/50 text-[#04142b]'
            }`}
          >
            <button
              onClick={() => setSelectedServiceForModal(null)}
              className={`absolute top-4 right-4 p-2 rounded-full border transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#071c38] text-slate-300 hover:text-white border-[#d4af37]/30'
                  : 'bg-slate-100 text-[#04142b] hover:bg-slate-200 border-slate-300'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#dfb75c]">
                {selectedServiceForModal.category.toUpperCase()} SERVICE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display">
                {selectedServiceForModal.title}
              </h3>
              <p className="text-sm font-semibold text-[#dfb75c]">
                {selectedServiceForModal.subtitle}
              </p>
            </div>

            <div
              className={`p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-4 ${
                isDark
                  ? 'bg-[#071c38] border-[#d4af37]/30'
                  : 'bg-[#faf8f5] border-[#d4af37]/40'
              }`}
            >
              <div>
                <div className="text-xs text-slate-400">Service Fee</div>
                <div className="text-xl font-black text-[#dfb75c]">
                  {selectedServiceForModal.priceType === 'free'
                    ? 'Free ($0.00)'
                    : selectedServiceForModal.priceType === 'deposit'
                    ? `${formatCurrency(selectedServiceForModal.basePrice)} Deposit`
                    : selectedServiceForModal.priceType === 'hourly'
                    ? `${formatCurrency(selectedServiceForModal.basePrice)}/hr`
                    : `From ${formatCurrency(selectedServiceForModal.basePrice)}`}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Session Window</div>
                <div className="text-sm font-bold">
                  {selectedServiceForModal.durationLabel}
                </div>
              </div>
              {selectedServiceForModal.additionalChildRate ? (
                <div>
                  <div className="text-xs text-slate-400">Extra Child Rate</div>
                  <div className="text-sm font-bold text-[#dfb75c]">
                    +${selectedServiceForModal.additionalChildRate}/hr each
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold text-[#dfb75c]">Service Overview</h4>
              <p className="text-sm leading-relaxed opacity-90">
                {selectedServiceForModal.fullDesc}
              </p>
            </div>

            {selectedServiceForModal.keyResponsibilities.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-base font-bold text-[#dfb75c]">
                  Key Inclusions & Responsibilities
                </h4>
                <div className="space-y-2">
                  {selectedServiceForModal.keyResponsibilities.map((resp, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <Check className="w-4 h-4 text-[#dfb75c] shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#d4af37]/20 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedServiceForModal(null)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold border cursor-pointer ${
                  isDark
                    ? 'bg-[#071c38] hover:bg-[#0c2a52] text-slate-300 border-[#d4af37]/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#04142b] border-slate-300'
                }`}
              >
                Close
              </button>
              <button
                onClick={() => {
                  const sId = selectedServiceForModal.id;
                  setSelectedServiceForModal(null);
                  onOpenBooking(sId);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] font-bold text-sm shadow-lg shadow-amber-500/25 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Nana Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
