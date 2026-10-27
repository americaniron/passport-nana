import React from 'react';
import { Star, Quote, Heart, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
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
    <section className="py-20 bg-[#0d0221] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-pink-400" /> Real Parent Experiences
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display">
            Loved By Families Across the Nation
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Hear why parents and guardians call Ken’nyzhae "Nana" and their family's indispensable secret weapon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#14062f] border border-purple-500/30 hover:border-cyan-400/40 transition-all flex flex-col justify-between space-y-4 shadow-xl"
            >
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-purple-400/40" />
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-purple-500/20 text-left space-y-1">
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{rev.name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-[11px] text-pink-300 font-semibold">{rev.role}</div>
                <div className="text-[10px] text-slate-400">{rev.location}</div>
                <div className="text-[10px] text-cyan-400 font-medium">{rev.service}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
