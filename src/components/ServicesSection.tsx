import React, { useState } from 'react';
import {
  SERVICES,
  SERVICE_CATEGORIES,
} from '../data/services.ts';
import { ServiceCategory, ServiceItem } from '../types/index.ts';
import {
  Calendar,
  Clock,
  Sparkles,
  Info,
  Check,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  X,
} from 'lucide-react';
import { formatCurrency } from '../utils/pricing.ts';

interface ServicesSectionProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenCalculator: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenBooking,
  onOpenCalculator,
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [selectedServiceForModal, setSelectedServiceForModal] =
    useState<ServiceItem | null>(null);

  const filteredServices =
    activeCategory === 'all'
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeCategory);

  return (
    <section id="services" className="py-20 bg-[#0d0221] relative">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-purple-700/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Comprehensive Care & Hair Artistry
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display">
            Curated Services Built With Love
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
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
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105'
                    : 'bg-purple-950/40 text-slate-300 hover:text-white hover:bg-purple-900/50 border border-purple-500/20'
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
              className="group rounded-3xl bg-[#14062f]/90 border border-purple-500/30 hover:border-cyan-400/50 transition-all duration-300 overflow-hidden flex flex-col shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1.5"
            >
              {/* Service Card Image */}
              <div className="relative h-56 overflow-hidden bg-purple-950">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14062f] via-transparent to-transparent opacity-80" />

                {/* Badge if available */}
                {service.badge && (
                  <div className="absolute top-3 left-3 bg-purple-950/90 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-400/40 text-[11px] font-bold text-cyan-300">
                    {service.badge}
                  </div>
                )}

                {/* Duration indicator */}
                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-purple-500/30 text-[11px] font-medium text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{service.durationLabel}</span>
                </div>
              </div>

              {/* Service Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-cyan-400">{service.subtitle}</p>
                  <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Key inclusions checklist */}
                <div className="space-y-1.5 pt-2 border-t border-purple-500/20 text-xs text-slate-300">
                  {service.inclusions.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing & Booking Actions */}
                <div className="pt-4 border-t border-purple-500/20 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase font-semibold text-slate-400">Rate</div>
                    <div className="text-lg font-black text-white">
                      {service.priceType === 'free'
                        ? 'Complimentary'
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
                      className="p-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/80 text-slate-300 hover:text-white border border-purple-500/30 transition-all text-xs font-semibold"
                      title="View details"
                    >
                      <Info className="w-4 h-4 text-cyan-400" />
                    </button>

                    <button
                      onClick={() => onOpenBooking(service.id)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Quick Calculator Banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-cyan-950/80 border border-cyan-400/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
              Need a personalized childcare or travel rate estimate?
            </h3>
            <p className="text-sm text-slate-300">
              Use our live interactive calculator to calculate transparent hourly rates, multiple
              children add-ons, and booking deposits.
            </p>
          </div>
          <button
            onClick={onOpenCalculator}
            className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <span>Open Price Calculator</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detailed Service Modal */}
      {selectedServiceForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#12042b] border border-cyan-400/40 p-6 sm:p-8 text-white space-y-6 shadow-2xl">
            <button
              onClick={() => setSelectedServiceForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-purple-950 text-slate-300 hover:text-white hover:bg-purple-900 border border-purple-500/30 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {selectedServiceForModal.category.toUpperCase()} SERVICE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-display">
                {selectedServiceForModal.title}
              </h3>
              <p className="text-sm font-semibold text-purple-300">
                {selectedServiceForModal.subtitle}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-xs text-slate-400">Service Fee</div>
                <div className="text-xl font-black text-cyan-300">
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
                <div className="text-sm font-bold text-white">
                  {selectedServiceForModal.durationLabel}
                </div>
              </div>
              {selectedServiceForModal.additionalChildRate ? (
                <div>
                  <div className="text-xs text-slate-400">Extra Child Rate</div>
                  <div className="text-sm font-bold text-pink-300">
                    +${selectedServiceForModal.additionalChildRate}/hr each
                  </div>
                </div>
              ) : null}
            </div>

            <div className="space-y-3">
              <h4 className="text-base font-bold text-cyan-300">Service Overview</h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedServiceForModal.fullDesc}
              </p>
            </div>

            {selectedServiceForModal.keyResponsibilities.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-base font-bold text-purple-300">
                  Key Inclusions & Responsibilities
                </h4>
                <div className="space-y-2">
                  {selectedServiceForModal.keyResponsibilities.map((resp, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-purple-500/20 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedServiceForModal(null)}
                className="px-5 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-slate-300 text-sm font-semibold border border-purple-500/30"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const sId = selectedServiceForModal.id;
                  setSelectedServiceForModal(null);
                  onOpenBooking(sId);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Service</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
