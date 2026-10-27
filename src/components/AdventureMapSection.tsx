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
import { SectionBackgroundVideo } from './SectionBackgroundVideo.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface AdventureMapSectionProps {
  onOpenBooking: (serviceId?: string) => void;
}

export const AdventureMapSection: React.FC<AdventureMapSectionProps> = ({
  onOpenBooking,
}) => {
  const { isDark } = useTheme();
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
    <section id="adventures" className="py-20 relative overflow-hidden transition-colors duration-300">
      {/* Looping Section Background Video: Sunny outdoor park adventure & kids running on grass */}
      <SectionBackgroundVideo
        videoUrl="/videos/adventure-map.mp4"
        opacityDark="opacity-30"
        opacityLight="opacity-20"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${
              isDark
                ? 'bg-cyan-950/80 border-cyan-400/30 text-cyan-300'
                : 'bg-cyan-100 border-cyan-300 text-cyan-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Service Area & Maps Grounded Exploration
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-black font-display ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}
          >
            Local Service Hubs & Adventure Days
          </h2>
          <p className={isDark ? 'text-base sm:text-lg text-slate-300' : 'text-base sm:text-lg text-slate-700 font-medium'}>
            Based in the San Francisco Bay Area and Tampa FL, with 24/7 on-call dispatch and worldwide travel care. Explore safe, enriching adventure destinations verified via live Google Maps data.
          </p>
        </div>

        {/* Territory Switcher Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-3 mb-10">
          <button
            onClick={() => {
              setSelectedHub('sf');
              setSearchLocation('San Francisco Civic Center & Golden Gate Park');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              selectedHub === 'sf'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105'
                : isDark
                ? 'bg-purple-950/60 text-slate-300 hover:text-white border border-purple-500/30'
                : 'bg-white text-slate-700 hover:text-purple-950 border border-purple-200 shadow-sm'
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              selectedHub === 'tampa'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105'
                : isDark
                ? 'bg-purple-950/60 text-slate-300 hover:text-white border border-purple-500/30'
                : 'bg-white text-slate-700 hover:text-purple-950 border border-purple-200 shadow-sm'
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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              selectedHub === 'travel'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-105'
                : isDark
                ? 'bg-purple-950/60 text-slate-300 hover:text-white border border-purple-500/30'
                : 'bg-white text-slate-700 hover:text-purple-950 border border-purple-200 shadow-sm'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Passport Travel</span>
          </button>
        </div>

        {/* Map Context & Static Visual Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Territory Details */}
          <div
            className={`lg:col-span-5 rounded-3xl border p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl text-left transition-colors ${
              isDark
                ? 'bg-[#14062f] border-cyan-400/30 text-white'
                : 'bg-white/95 border-purple-300 text-slate-900'
            }`}
          >
            <div className="space-y-4">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
                  isDark
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-400/30'
                    : 'bg-cyan-100 text-cyan-900 border-cyan-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
                <span>24/7 Rapid On-Call Dispatch</span>
              </div>

              <h3 className="text-2xl font-black font-display">
                {selectedHub === 'sf'
                  ? 'San Francisco & Bay Area Coverage'
                  : selectedHub === 'tampa'
                  ? 'Tampa & Central Florida Coverage'
                  : 'Global Passport Nanny Flights'}
              </h3>

              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {selectedHub === 'sf'
                  ? 'Serving families across Opera Plaza, Civic Center, Hayes Valley, Mid-Market, Pacific Heights, Mission Bay, and surrounding Bay Area cities with immediate on-call babysitting, after-school pick-up, and adventure days.'
                  : selectedHub === 'tampa'
                  ? 'Providing full nanny services, overnight babysitting, beach adventure walks for pets, and children hair care across Tampa, St. Petersburg, and Clearwater.'
                  : 'Door-to-door domestic flights and international travel accompaniment. Covering airports, cruise departures, and overseas vacation destinations.'}
              </p>

              <div
                className={`p-4 rounded-2xl border space-y-2 text-xs ${
                  isDark ? 'bg-purple-950/60 border-purple-500/30' : 'bg-purple-50 border-purple-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Direct Emergency Line:</span>
                  <a href="tel:3054096788" className="font-bold text-cyan-600 dark:text-cyan-300 hover:underline">
                    (305) 409-6788
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Response Time:</span>
                  <span className="font-bold text-emerald-500">Under 15 Mins Response</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Adventure Chaperone:</span>
                  <span className="font-bold text-pink-600 dark:text-pink-300">Door-to-Door Escort</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenBooking('adventure-day')}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Book An Adventure Day ($32/hr)</span>
            </button>
          </div>

          {/* Curated Interactive Adventure Places */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h4 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span>Featured Adventure Spots (Bay Area)</span>
              </h4>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Curated by Nana</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CURATED_BAY_AREA_ADVENTURES.slice(0, 4).map((spot, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 group ${
                    isDark
                      ? 'bg-[#14062f]/80 border-purple-500/30 hover:border-cyan-400/50'
                      : 'bg-white border-purple-200 hover:border-purple-400 shadow-sm'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h5
                        className={`text-sm font-bold transition-colors line-clamp-1 ${
                          isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-purple-700'
                        }`}
                      >
                        {spot.title}
                      </h5>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {spot.rating}
                      </span>
                    </div>
                    <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">{spot.category}</p>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {spot.description}
                    </p>
                    <p className="text-[11px] text-pink-600 dark:text-pink-300 italic">
                      ❤️ Why kids love it: {spot.whyKidsLoveIt}
                    </p>
                  </div>

                  <a
                    href={spot.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-300 hover:text-purple-600 dark:hover:text-white transition-colors pt-2 border-t border-purple-500/20"
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
        <div
          className={`rounded-3xl border p-6 sm:p-8 text-left shadow-2xl space-y-6 ${
            isDark
              ? 'bg-gradient-to-r from-purple-950/80 via-slate-950 to-cyan-950/80 border-cyan-400/40 text-white'
              : 'bg-gradient-to-r from-purple-50 via-white to-cyan-50 border-purple-300 text-slate-900'
          }`}
        >
          <div className="space-y-2">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${
                isDark
                  ? 'bg-cyan-950 border-cyan-400/30 text-cyan-300'
                  : 'bg-cyan-100 border-cyan-300 text-cyan-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Gemini 3.8 Flash • Maps Grounding</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display">
              Live Google Maps Grounded Adventure Finder
            </h3>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Need fresh ideas for your child's specific neighborhood or vacation destination? Our AI queries real Google Maps places with verified addresses and links.
            </p>
          </div>

          <form onSubmit={handleSearchGrounding} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5">
              <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Location or Neighborhood
              </label>
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="e.g. San Francisco Hayes Valley, Tampa FL, Orlando"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-cyan-400 ${
                  isDark
                    ? 'bg-purple-950/90 border-purple-500/40 text-white'
                    : 'bg-white border-purple-200 text-slate-900'
                }`}
              />
            </div>

            <div className="md:col-span-5">
              <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Activity Preference
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Hands-on art studio, outdoor splash park, toddler play"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-cyan-400 ${
                  isDark
                    ? 'bg-purple-950/90 border-purple-500/40 text-white'
                    : 'bg-white border-purple-200 text-slate-900'
                }`}
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all hover:scale-105 cursor-pointer"
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
              <p className={`text-sm leading-relaxed whitespace-pre-line ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {groundedResults.text}
              </p>

              {groundedResults.places.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {groundedResults.places.map((place, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border space-y-2 flex flex-col justify-between ${
                        isDark
                          ? 'bg-purple-950/60 border-cyan-400/30 text-white'
                          : 'bg-white border-purple-200 text-slate-900 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold line-clamp-1">
                          {place.title}
                        </h5>
                        {place.address && (
                          <p className={`text-[11px] flex items-start gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            <MapPin className="w-3 h-3 text-cyan-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{place.address}</span>
                          </p>
                        )}
                        {place.description && (
                          <p className={`text-xs line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {place.description}
                          </p>
                        )}
                      </div>

                      {place.uri ? (
                        <a
                          href={place.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-300 hover:underline pt-2 border-t border-purple-500/20"
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
