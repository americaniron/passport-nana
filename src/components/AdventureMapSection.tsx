import React, { useState } from 'react';
import { CURATED_BAY_AREA_ADVENTURES } from '../data/services.ts';
import { GroundedPlace } from '../types/index.ts';
import {
  MapPin,
  Compass,
  Search,
  ExternalLink,
  Sparkles,
  Star,
  CheckCircle2,
  Navigation,
  Loader2,
  Calendar,
} from 'lucide-react';

interface AdventureMapSectionProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const AdventureMapSection: React.FC<AdventureMapSectionProps> = ({
  onOpenBooking,
}) => {
  const [selectedHub, setSelectedHub] = useState<'sf' | 'tampa' | 'travel'>('sf');
  const [searchLocation, setSearchLocation] = useState<string>('San Francisco Civic Center & Golden Gate Park');
  const [searchQuery, setSearchQuery] = useState<string>('Kid-friendly parks, interactive science centers, and family adventure spots');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [groundedResults, setGroundedResults] = useState<{
    text: string;
    places: GroundedPlace[];
  } | null>(null);

  const handleSearchGrounding = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: searchLocation,
          query: searchQuery,
          latLng:
            selectedHub === 'sf'
              ? { latitude: 37.7793, longitude: -122.4192 }
              : selectedHub === 'tampa'
              ? { latitude: 27.9506, longitude: -82.4572 }
              : undefined,
        }),
      });

      const data = await response.json();
      setGroundedResults({
        text: data.text || 'Found family-friendly destinations using live Google Maps grounding:',
        places: data.places || [],
      });
    } catch (err) {
      console.error('Failed to search maps grounding:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="adventures" className="py-20 bg-[#0d0221] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" /> Service Area & Maps Grounded Exploration
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display">
            Local Service Hubs & Adventure Days
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Based in the San Francisco Bay Area and Tampa FL, with 24/7 on-call dispatch and worldwide travel care. Explore safe, enriching adventure destinations verified via live Google Maps data.
          </p>
        </div>

        {/* Territory Switcher Tabs */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => {
              setSelectedHub('sf');
              setSearchLocation('San Francisco Civic Center & Golden Gate Park');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              selectedHub === 'sf'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105'
                : 'bg-purple-950/60 text-slate-300 hover:text-white border border-purple-500/30'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>SF Bay Area (Primary Hub)</span>
          </button>

          <button
            onClick={() => {
              setSelectedHub('tampa');
              setSearchLocation('Tampa, Florida Riverwalk & Bay');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              selectedHub === 'tampa'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105'
                : 'bg-purple-950/60 text-slate-300 hover:text-white border border-purple-500/30'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Tampa Bay, FL</span>
          </button>

          <button
            onClick={() => {
              setSelectedHub('travel');
              setSearchLocation('Worldwide Travel Destinations');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              selectedHub === 'travel'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105'
                : 'bg-purple-950/60 text-slate-300 hover:text-white border border-purple-500/30'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Passport Travel</span>
          </button>
        </div>

        {/* Map Context & Static Visual Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Territory Details */}
          <div className="lg:col-span-5 rounded-3xl bg-[#14062f] border border-cyan-400/30 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400/30 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>24/7 Rapid On-Call Dispatch</span>
              </div>

              <h3 className="text-2xl font-black text-white font-display">
                {selectedHub === 'sf'
                  ? 'San Francisco & Bay Area Coverage'
                  : selectedHub === 'tampa'
                  ? 'Tampa & Central Florida Coverage'
                  : 'Global Passport Nanny Flights'}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedHub === 'sf'
                  ? 'Serving families across Opera Plaza, Civic Center, Hayes Valley, Mid-Market, Pacific Heights, Mission Bay, and surrounding Bay Area cities with immediate on-call babysitting, after-school pick-up, and adventure days.'
                  : selectedHub === 'tampa'
                  ? 'Providing full nanny services, overnight babysitting, beach adventure walks for pets, and children hair care across Tampa, St. Petersburg, and Clearwater.'
                  : 'Door-to-door domestic flights and international travel accompaniment. Covering airports, cruise departures, and overseas vacation destinations.'}
              </p>

              <div className="p-4 rounded-2xl bg-purple-950/60 border border-purple-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Direct Emergency Line:</span>
                  <a href="tel:3054096788" className="font-bold text-cyan-300 hover:underline">
                    (305) 409-6788
                  </a>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Response Time:</span>
                  <span className="font-bold text-emerald-400">Under 15 Mins Response</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Adventure Chaperone:</span>
                  <span className="font-bold text-pink-300">Door-to-Door Escort</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenBooking('adventure-day')}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Book An Adventure Day ($32/hr)</span>
            </button>
          </div>

          {/* Curated Interactive Adventure Places */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Featured Adventure Spots (Bay Area)</span>
              </h4>
              <span className="text-xs text-slate-400">Curated by Nana</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CURATED_BAY_AREA_ADVENTURES.slice(0, 4).map((spot, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-[#14062f]/80 border border-purple-500/30 hover:border-cyan-400/50 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {spot.title}
                      </h5>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full shrink-0">
                        <Star className="w-3 h-3 fill-amber-300" />
                        {spot.rating}
                      </span>
                    </div>
                    <p className="text-[11px] text-cyan-400 font-medium">{spot.category}</p>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {spot.description}
                    </p>
                    <p className="text-[11px] text-pink-300 italic">
                      ❤️ Why kids love it: {spot.whyKidsLoveIt}
                    </p>
                  </div>

                  <a
                    href={spot.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-white transition-colors pt-2 border-t border-purple-500/20"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Gemini Google Maps Grounding Tool Box */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-950 to-cyan-950/80 border border-cyan-400/40 p-6 sm:p-8 text-left shadow-2xl space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Gemini 3.8 Flash • Maps Grounding</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-display">
              Live Google Maps Grounded Adventure Finder
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Need fresh ideas for your child's specific neighborhood or vacation destination? Our AI queries real Google Maps places with verified addresses and links.
            </p>
          </div>

          <form onSubmit={handleSearchGrounding} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5">
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Location or Neighborhood
              </label>
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="e.g. San Francisco Hayes Valley, Tampa FL, Orlando"
                className="w-full px-4 py-2.5 rounded-xl bg-purple-950/90 border border-purple-500/40 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="md:col-span-5">
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Activity Preference
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Hands-on art studio, outdoor splash park, toddler play"
                className="w-full px-4 py-2.5 rounded-xl bg-purple-950/90 border border-purple-500/40 text-white text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Find Spots</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Display */}
          {groundedResults && (
            <div className="mt-6 pt-6 border-t border-purple-500/30 space-y-4">
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {groundedResults.text}
              </p>

              {groundedResults.places.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {groundedResults.places.map((place, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-purple-950/60 border border-cyan-400/30 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold text-white line-clamp-1">
                          {place.title}
                        </h5>
                        {place.address && (
                          <p className="text-[11px] text-slate-400 flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{place.address}</span>
                          </p>
                        )}
                        {place.description && (
                          <p className="text-xs text-slate-300 line-clamp-2">
                            {place.description}
                          </p>
                        )}
                      </div>

                      {place.uri ? (
                        <a
                          href={place.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-white pt-2 border-t border-purple-500/20"
                        >
                          <span>Open in Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
