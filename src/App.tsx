import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { PassportNannyBanner } from './components/PassportNannyBanner.tsx';
import { LocsAndBraidsSection } from './components/LocsAndBraidsSection.tsx';
import { PricingCalculator } from './components/PricingCalculator.tsx';
import { OwnerAvailabilityCalendar } from './components/OwnerAvailabilityCalendar.tsx';
import { AdventureMapSection } from './components/AdventureMapSection.tsx';
import { AboutFounder } from './components/AboutFounder.tsx';
import { TestimonialsSection } from './components/TestimonialsSection.tsx';
import { Footer } from './components/Footer.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { ClientPortalModal } from './components/ClientPortalModal.tsx';
import { AdminDashboardModal } from './components/AdminDashboardModal.tsx';
import { AIChatModal } from './components/AIChatModal.tsx';
import { HairCareAdvisorModal } from './components/HairCareAdvisorModal.tsx';
import { useTheme } from './context/ThemeContext.tsx';
import { useBusiness } from './context/BusinessContext.tsx';
import { MessageSquare, Sparkles, Phone, Calendar, Plane, Shield } from 'lucide-react';

export default function App() {
  const { isDark } = useTheme();
  const { siteCopy } = useBusiness();

  // Booking Modal
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string | undefined>();
  const [activeHours, setActiveHours] = useState<number | undefined>();
  const [activeChildrenCount, setActiveChildrenCount] = useState<number | undefined>();

  // Modals
  const [clientPortalOpen, setClientPortalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [hairAdvisorOpen, setHairAdvisorOpen] = useState(false);

  const handleOpenBooking = (serviceId?: string) => {
    setActiveServiceId(serviceId);
    setActiveHours(undefined);
    setActiveChildrenCount(undefined);
    setBookingOpen(true);
  };

  const handleOpenBookingWithDetails = (details: {
    serviceId: string;
    hours: number;
    childrenCount: number;
  }) => {
    setActiveServiceId(details.serviceId);
    setActiveHours(details.hours);
    setActiveChildrenCount(details.childrenCount);
    setBookingOpen(true);
  };

  const handleScrollToCalculator = () => {
    const el = document.getElementById('calculator');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-[#d4af37] selection:text-[#041226] transition-colors duration-300 ${
        isDark ? 'bg-[#030d1e] text-slate-100' : 'bg-[#faf8f5] text-[#04142b]'
      }`}
    >
      {/* Navigation */}
      <Navbar
        onOpenBooking={handleOpenBooking}
        onOpenChat={() => setChatOpen(true)}
        onOpenHairAdvisor={() => setHairAdvisorOpen(true)}
        onOpenClientPortal={() => setClientPortalOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onOpenBooking={handleOpenBooking}
          onOpenChat={() => setChatOpen(true)}
          onOpenHairAdvisor={() => setHairAdvisorOpen(true)}
        />

        <ServicesSection
          onOpenBooking={handleOpenBooking}
          onOpenCalculator={handleScrollToCalculator}
        />

        <PassportNannyBanner onOpenBooking={handleOpenBooking} />

        <LocsAndBraidsSection
          onOpenBooking={handleOpenBooking}
          onOpenHairAdvisor={() => setHairAdvisorOpen(true)}
        />

        <PricingCalculator
          onOpenBookingWithDetails={handleOpenBookingWithDetails}
        />

        {/* Section: Live Owner Availability Calendar on Main Page */}
        <section
          id="availability"
          className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-b transition-colors relative overflow-hidden ${
            isDark
              ? 'bg-[#030c1c] border-[#d4af37]/20 text-white'
              : 'bg-white border-[#d4af37]/20 text-[#04142b]'
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border bg-[#d4af37]/15 border-[#d4af37]/40 text-[#d4af37]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Live Owner Availability & Travel Flight Calendar</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight mb-2">
                Plan Your Care Around Nana's Open Slots
              </h2>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                Whether you need local on-call care, airport departure coverage, or full-day flight accompaniment, Nana's live calendar keeps you informed in real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <OwnerAvailabilityCalendar
                  onSelectDate={(date) => {
                    handleOpenBooking();
                  }}
                  compact={false}
                />
              </div>

              <div
                className={`lg:col-span-4 p-6 rounded-3xl border flex flex-col justify-between space-y-5 ${
                  isDark ? 'bg-[#061833] border-[#d4af37]/35 shadow-xl' : 'bg-[#faf8f5] border-[#d4af37]/35 shadow-lg'
                }`}
              >
                <div>
                  <h4 className="font-serif font-black text-lg text-[#d4af37] mb-2">
                    How Nana's Availability Works
                  </h4>
                  <ul className="text-xs space-y-2.5 opacity-90">
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
                      <span><strong>Available:</strong> Open for all 24/7 on-call babysitting, meet-n-greets, and local styling.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-400 mt-1 flex-shrink-0" />
                      <span><strong>Flight Accompaniment:</strong> Nana is currently accompanying a traveling family on domestic or international flights.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
                      <span><strong>Limited Slots:</strong> Partial hours remaining (e.g. morning open, afternoon school pickup booked).</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-2">
                  <button
                    onClick={() => handleOpenBooking()}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#aa8214] text-[#041226] font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-[#041226]" />
                    <span>Book Nana Now</span>
                  </button>

                  <button
                    onClick={() => setClientPortalOpen(true)}
                    className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isDark ? 'border-white/20 text-slate-200 hover:bg-white/5' : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Plane className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Existing Family? Open Client VIP Portal</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AdventureMapSection onOpenBooking={handleOpenBooking} />

        <AboutFounder onOpenBooking={() => handleOpenBooking('meet-n-greet')} />

        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={handleOpenBooking}
        onOpenChat={() => setChatOpen(true)}
      />

      {/* Sticky Quick-Action Bar for Floating Actions */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        {/* Floating VIP Client Portal Shortcut */}
        <button
          onClick={() => setClientPortalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all border ${
            isDark
              ? 'bg-[#061833] text-[#d4af37] hover:bg-[#0c2a52] border-[#d4af37]/40 shadow-black/40'
              : 'bg-white text-[#04142b] hover:bg-[#f8f5ee] border-[#d4af37]/40 shadow-amber-900/10'
          }`}
          title="Open VIP Client Care & Flight Portal"
        >
          <Plane className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="hidden sm:inline">VIP Portal</span>
        </button>

        {/* Floating Text Us Button */}
        <a
          href={`sms:${siteCopy.businessPhone.replace(/\D/g, '')}`}
          className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all border ${
            isDark
              ? 'bg-[#071c38] text-white hover:bg-[#0c2a52] border-[#d4af37]/40 shadow-black/40'
              : 'bg-white text-[#04142b] hover:bg-[#f8f5ee] border-[#d4af37]/40 shadow-amber-900/10'
          }`}
          title="Text Ken'nyzhae directly"
        >
          <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Text us</span>
        </a>

        {/* Floating AI Concierge Launcher */}
        <button
          onClick={() => setChatOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] text-[#041226] font-extrabold text-xs sm:text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all border border-[#f5d77f]/60"
          title="Chat with Nana's AI Care Concierge"
          aria-label="Open AI Concierge Chat"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#041226] animate-spin" style={{ animationDuration: '8s' }} />
          <span className="hidden sm:inline">Ask Nana AI</span>
          <span className="sm:hidden font-bold">AI</span>
        </button>
      </div>

      {/* Booking Appointment Modal with Availability Calendar */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialServiceId={activeServiceId}
        initialHours={activeHours}
        initialChildrenCount={activeChildrenCount}
      />

      {/* Client Care & Flight Portal Modal */}
      <ClientPortalModal
        isOpen={clientPortalOpen}
        onClose={() => setClientPortalOpen(false)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Admin / Owner Dashboard Modal with Auth */}
      <AdminDashboardModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />

      {/* Multi-turn AI Concierge Chat Modal */}
      <AIChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onOpenBooking={handleOpenBooking}
      />

      {/* Hair Care & Loc Consultation Advisor Modal */}
      <HairCareAdvisorModal
        isOpen={hairAdvisorOpen}
        onClose={() => setHairAdvisorOpen(false)}
        onOpenBooking={handleOpenBooking}
      />
    </div>
  );
}
