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
      className={`min-h-screen flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-300 ${
        isDark ? 'bg-[#0b021a] text-slate-100' : 'bg-[#faf8fd] text-slate-900'
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
          className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-xl hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all border border-slate-200"
          title="Text Ken'nyzhae directly"
        >
          <Phone className="w-3.5 h-3.5 text-purple-700" />
          <span>Text us</span>
        </a>

        {/* Floating AI Concierge Launcher */}
        <button
          onClick={() => setChatOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all border border-cyan-400/50"
          title="Chat with Nana's AI Care Concierge"
          aria-label="Open AI Concierge Chat"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '8s' }} />
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
