import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { PassportNannyBanner } from './components/PassportNannyBanner.tsx';
import { LocsAndBraidsSection } from './components/LocsAndBraidsSection.tsx';
import { PricingCalculator } from './components/PricingCalculator.tsx';
import { AdventureMapSection } from './components/AdventureMapSection.tsx';
import { AboutFounder } from './components/AboutFounder.tsx';
import { TestimonialsSection } from './components/TestimonialsSection.tsx';
import { Footer } from './components/Footer.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { AIChatModal } from './components/AIChatModal.tsx';
import { HairCareAdvisorModal } from './components/HairCareAdvisorModal.tsx';
import { useTheme } from './context/ThemeContext.tsx';
import { MessageSquare, Sparkles, Phone, Calendar } from 'lucide-react';

export default function App() {
  const { isDark } = useTheme();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string | undefined>();
  const [activeHours, setActiveHours] = useState<number | undefined>();
  const [activeChildrenCount, setActiveChildrenCount] = useState<number | undefined>();

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

        <AdventureMapSection onOpenBooking={handleOpenBooking} />

        <AboutFounder onOpenBooking={() => handleOpenBooking('meet-n-greet')} />

        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={handleOpenBooking}
        onOpenChat={() => setChatOpen(true)}
      />

      {/* Sticky Quick-Action Bar for Floating SMS & AI Concierge */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        {/* Floating Text Us Button (matching original website screenshot) */}
        <a
          href="sms:3054096788"
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

      {/* Booking Appointment Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialServiceId={activeServiceId}
        initialHours={activeHours}
        initialChildrenCount={activeChildrenCount}
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
