import React from 'react';
import { Star, Quote, Heart, CheckCircle2 } from 'lucide-react';
import { SectionBackgroundVideo } from './SectionBackgroundVideo.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

export const TestimonialsSection: React.FC = () => {
  const { isDark } = useTheme();

  const reviews = [
    {
      name: 'Elena & Marcus R.',
      role: 'Parents of 2 (Ages 3 & 6)',
      location: 'San Francisco, CA (Hayes Valley)',
      service: 'On-Call Babysitter & School Pickup',
      rating: 5,
      comment:
        'When my husband and I had unexpected late meetings, Ken’nyzhae was at our door within the hour. She picked up our kids from school, helped with phonics homework, made healthy dinner, and had them peacefully tucked into bed by 8:30 PM. Complete lifesaver.',
    },
    {
      name: 'Dr. Soraya T.',
      role: 'Mother & Traveling Surgeon',
      location: 'San Francisco to Paris (Travel)',
      service: 'Passport Nanny (International Flight)',
      rating: 5,
      comment:
        'Booking Passport Nanny was the best investment of our year. Traveling international with a 14-month-old infant seemed terrifying, but Nana managed security lines, stroller check, in-flight naps, and entertainment with effortless grace. We actually arrived rested!',
    },
    {
      name: 'Kendra W.',
      role: 'Mom of 8-year-old Jaylen',
      location: 'Tampa, FL',
      service: 'Locks: Wash, Retwist & Style',
      rating: 5,
      comment:
        'My son is extremely tender-headed and used to dread getting his locs done. Nana has magic hands—her palm rolling technique didn’t hurt him once, his parting grid was crisp and clean, and his scalp smelled wonderful. He won’t let anyone else touch his hair now.',
    },
    {
      name: 'David & Alicia B.',
      role: 'Pet Parents',
      location: 'San Francisco, CA',
      service: '24-HR On-Call Pet Nanny',
      rating: 5,
      comment:
        'Nana took our lab Buster on the 5:00 AM sunrise beach walk and sent photo updates every few hours. Knowing he was having the time of his life made our weekend away completely stress-free. 10/10 recommendation!',
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden transition-colors duration-300">
      {/* Looping Section Background Video: 5-Star Reviews, Celebration Sparkles & Rising Stars */}
      <SectionBackgroundVideo
        videoUrl="/videos/testimonials.mp4"
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
            <Heart className="w-3.5 h-3.5 text-[#dfb75c]" /> Real Parent Experiences
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-black font-display ${
              isDark ? 'text-white' : 'text-[#04142b]'
            }`}
          >
            Loved By Families Across the Nation
          </h2>
          <p className={`text-base sm:text-lg ${isDark ? 'text-slate-300' : 'text-[#334155]'}`}>
            Hear why parents and guardians call Ken’nyzhae "Nana" and their family's indispensable secret weapon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                isDark
                  ? 'bg-[#061833]/90 border-[#d4af37]/30 hover:border-[#dfb75c] text-slate-200'
                  : 'bg-white/95 border-[#d4af37]/35 hover:border-[#b8860b] text-[#04142b] shadow-amber-900/5'
              }`}
            >
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#dfb75c]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#dfb75c]" />
                    ))}
                  </div>
                  <Quote
                    className={`w-5 h-5 ${
                      isDark ? 'text-[#d4af37]/40' : 'text-[#d4af37]/40'
                    }`}
                  />
                </div>

                <p
                  className={`text-xs sm:text-sm leading-relaxed italic ${
                    isDark ? 'text-slate-200' : 'text-[#334155]'
                  }`}
                >
                  "{rev.comment}"
                </p>
              </div>

              <div
                className={`pt-4 border-t text-left space-y-1 ${
                  isDark ? 'border-[#d4af37]/20' : 'border-[#d4af37]/20'
                }`}
              >
                <div
                  className={`text-sm font-bold flex items-center gap-1.5 ${
                    isDark ? 'text-white' : 'text-[#04142b]'
                  }`}
                >
                  <span>{rev.name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb75c]" />
                </div>
                <div className="text-[11px] text-[#dfb75c] font-semibold">{rev.role}</div>
                <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {rev.location}
                </div>
                <div className="text-[10px] text-[#dfb75c] font-medium">
                  {rev.service}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
