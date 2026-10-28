import React, { useState, useEffect } from 'react';
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
  Heart,
  Lightbulb,
  Radio,
  RefreshCw,
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
  const [searchError, setSearchError] = useState<string | null>(null);
  const [modelSource, setModelSource] = useState<string | null>(null);
  const [groundedResults, setGroundedResults] = useState<{
    text: string;
    places: GroundedPlace[];
  } | null>(null);

  const quickPillOptions = [
    { label: '🔬 Science & Planetariums', query: 'Hands-on interactive science centers, planetarium, and children discovery museums' },
    { label: '🎠 Historic Carousels & Playgrounds', query: 'Historic carousels, sprawling rope pyramid climbing playgrounds, and tree-shaded parks' },
    { label: '🏖️ Splash Parks & Beaches', query: 'Toddler-safe splash water fountains, sandy beach exploration, and gentle tide pools' },
    { label: '🎨 Hands-On Art & Crafts', query: 'Children art studios, clay animation, storytelling workshops, and music gardens' },
    { label: '🐾 Animals & Botanical Gardens', query: 'Gentle petting farms, butterfly pavilions, botanical walking paths, and koi ponds' },
  ];

  const handleSearchGrounding = async (
    overrideLoc?: string,
    overrideQuery?: string,
    overrideHub?: 'sf' | 'tampa' | 'travel'
  ) => {
    setIsLoading(true);
    setSearchError(null);

    const loc = overrideLoc !== undefined ? overrideLoc : searchLocation;
    const q = overrideQuery !== undefined ? overrideQuery : searchQuery;
    const hub = overrideHub !== undefined ? overrideHub : selectedHub;

    try {
      const response = await fetch('/api/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: loc,
          query: q,
          latLng:
            hub === 'sf'
              ? { latitude: 37.7793, longitude: -122.4192 }
              : hub === 'tampa'
              ? { latitude: 27.9506, longitude: -82.4572 }
              : undefined,
        }),
      });

      const data = await response.json();
      if (data && data.places && data.places.length > 0) {
        setGroundedResults({
          text: data.text || `Live Google Maps adventure recommendations in ${loc}:`,
          places: data.places,
        });
        setModelSource(data.model || data.source || 'gemini-live');
      } else if (data && data.text) {
        setGroundedResults({
          text: data.text,
          places: [],
        });
        setModelSource(data.model || data.source || 'gemini-live');
      } else {
        setSearchError('Could not retrieve spots. Please try again.');
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      console.error('Failed to search maps grounding:', err);
      setSearchError(errObj?.message || 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Perform initial search on mount so live adventure spots are immediately visible
  useEffect(() => {
    handleSearchGrounding('San Francisco Civic Center & Golden Gate Park', 'Kid-friendly parks, interactive science centers, and family adventure spots', 'sf');
  }, []);

  const handleSelectHub = (hub: 'sf' | 'tampa' | 'travel') => {
    setSelectedHub(hub);
    let newLoc = '';
    let newQuery = '';
    if (hub === 'sf') {
      newLoc = 'San Francisco Civic Center & Golden Gate Park';
      newQuery = 'Kid-friendly parks, interactive science centers, and family adventure spots';
    } else if (hub === 'tampa') {
      newLoc = 'Tampa Riverwalk & St. Petersburg, FL';
      newQuery = 'Family waterfront parks, hands-on aquarium, splash play, and beach excursions';
    } else {
      newLoc = 'Orlando & Travel Resort Destinations';
      newQuery = 'Theme park children rest zones, luxury hotel activities, and gentle kid adventures';
    }
    setSearchLocation(newLoc);
    setSearchQuery(newQuery);
    handleSearchGrounding(newLoc, newQuery, hub);
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
                ? 'bg-[#071c38]/90 border-[#d4af37]/40 text-[#f3d078]'
                : 'bg-white border-[#d4af37]/40 text-[#04142b] shadow-sm'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#d4af37]" /> Service Area & Maps Grounded Exploration
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-black font-display ${
              isDark ? 'text-white' : 'text-[#04142b]'
            }`}
          >
            Local Service Hubs & Adventure Days
          </h2>
          <p className={isDark ? 'text-base sm:text-lg text-slate-300' : 'text-base sm:text-lg text-[#334155] font-medium'}>
            Making memories, one adventure at a time! Based in the SF Bay Area and Tampa FL, with 24/7 on-call dispatch and worldwide travel care.
          </p>
        </div>

        {/* Territory Switcher Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-3 mb-10">
          <button
            onClick={() => handleSelectHub('sf')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              selectedHub === 'sf'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] text-[#041226] shadow-lg shadow-amber-500/20 scale-105'
                : isDark
                ? 'bg-[#071c38]/70 text-slate-300 hover:text-white border border-[#d4af37]/30'
                : 'bg-white text-[#04142b] hover:text-[#b8860b] border border-[#d4af37]/35 shadow-sm'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <span>SF Bay Area (Primary Hub)</span>
          </button>

          <button
            onClick={() => handleSelectHub('tampa')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              selectedHub === 'tampa'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] text-[#041226] shadow-lg shadow-amber-500/20 scale-105'
                : isDark
                ? 'bg-[#071c38]/70 text-slate-300 hover:text-white border border-[#d4af37]/30'
                : 'bg-white text-[#04142b] hover:text-[#b8860b] border border-[#d4af37]/35 shadow-sm'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <span>Tampa Bay, FL</span>
          </button>

          <button
            onClick={() => handleSelectHub('travel')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              selectedHub === 'travel'
                ? 'bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] text-[#041226] shadow-lg shadow-amber-500/20 scale-105'
                : isDark
                ? 'bg-[#071c38]/70 text-slate-300 hover:text-white border border-[#d4af37]/30'
                : 'bg-white text-[#04142b] hover:text-[#b8860b] border border-[#d4af37]/35 shadow-sm'
            }`}
          >
            <Navigation className="w-4 h-4 text-[#d4af37]" />
            <span>Passport Travel</span>
          </button>
        </div>

        {/* Map Context & Static Visual Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Territory Details */}
          <div
            className={`lg:col-span-5 rounded-3xl border-2 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl text-left transition-colors ${
              isDark
                ? 'bg-[#061833]/95 border-[#d4af37]/45 text-white'
                : 'bg-white/95 border-[#d4af37]/40 text-[#04142b]'
            }`}
          >
            <div className="space-y-4">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${
                  isDark
                    ? 'bg-[#041226] text-[#f3d078] border-[#d4af37]/40'
                    : 'bg-[#faf8f5] text-[#04142b] border-[#d4af37]/40'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#dfb75c]" />
                <span>24/7 Rapid On-Call Dispatch</span>
              </div>

              <h3 className="text-2xl font-black font-display">
                {selectedHub === 'sf'
                  ? 'San Francisco & Bay Area Coverage'
                  : selectedHub === 'tampa'
                  ? 'Tampa & Central Florida Coverage'
                  : 'Global Passport Nanny Flights'}
              </h3>

              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                {selectedHub === 'sf'
                  ? 'Serving families across Opera Plaza, Civic Center, Hayes Valley, Mid-Market, Pacific Heights, Mission Bay, and surrounding Bay Area cities with immediate on-call babysitting, after-school pick-up, and adventure days.'
                  : selectedHub === 'tampa'
                  ? 'Providing full nanny services, overnight babysitting, beach adventure walks for pets, and children hair care across Tampa, St. Petersburg, and Clearwater.'
                  : 'Door-to-door domestic flights and international travel accompaniment. Covering airports, cruise departures, and overseas vacation destinations.'}
              </p>

              <div
                className={`p-4 rounded-2xl border space-y-2 text-xs ${
                  isDark ? 'bg-[#041226]/80 border-[#d4af37]/25' : 'bg-[#faf8f5] border-[#d4af37]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Direct Emergency Line:</span>
                  <a href="tel:3054096788" className="font-bold text-[#dfb75c] hover:underline">
                    (305) 409-6788
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Response Time:</span>
                  <span className="font-bold text-emerald-500">Under 15 Mins Response</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Adventure Chaperone:</span>
                  <span className="font-bold text-[#dfb75c]">Door-to-Door Escort</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenBooking('adventure-day')}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] font-bold text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#041226]" />
              <span>Book An Adventure Day ($32/hr)</span>
            </button>
          </div>

          {/* Curated Interactive Adventure Places */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h4 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#04142b]'}`}>
                <Sparkles className="w-4 h-4 text-[#dfb75c]" />
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
                      ? 'bg-[#061833]/90 border-[#d4af37]/30 hover:border-[#dfb75c]'
                      : 'bg-white border-[#d4af37]/35 hover:border-[#b8860b] shadow-sm'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h5
                        className={`text-sm font-bold transition-colors line-clamp-1 ${
                          isDark ? 'text-white group-hover:text-[#f3d078]' : 'text-[#04142b] group-hover:text-[#b8860b]'
                        }`}
                      >
                        {spot.title}
                      </h5>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 dark:text-[#f3d078] bg-amber-400/10 dark:bg-[#041226] px-2 py-0.5 rounded-full shrink-0 border border-[#d4af37]/30">
                        <Star className="w-3 h-3 fill-[#dfb75c] text-[#dfb75c]" />
                        {spot.rating}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#dfb75c] font-semibold">{spot.category}</p>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                      {spot.description}
                    </p>
                    <p className="text-[11px] text-[#dfb75c] italic">
                      ❤️ Why kids love it: {spot.whyKidsLoveIt}
                    </p>
                  </div>

                  <a
                    href={spot.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#dfb75c] hover:underline pt-2 border-t border-[#d4af37]/20"
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
          className={`rounded-3xl border-2 p-6 sm:p-8 text-left shadow-2xl space-y-6 ${
            isDark
              ? 'bg-gradient-to-r from-[#071c38] via-[#041226] to-[#071c38] border-[#d4af37]/45 text-white'
              : 'bg-gradient-to-r from-white via-[#faf7f0] to-white border-[#d4af37]/45 text-[#04142b]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                  <Radio className="w-3 h-3" />
                  <span>Real Live Model Online</span>
                </span>
                {modelSource && (
                  <span className="text-[10px] opacity-75 font-mono text-[#d4af37]">
                    [{modelSource}]
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-display text-white">
                Live Google Maps Grounded Adventure Finder
              </h3>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                Ask our real AI model for live children adventure spots in any city or neighborhood. Every spot includes verified addresses, parent tips, and instant Google Maps directions.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSearchGrounding()}
                disabled={isLoading}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark
                    ? 'border-[#d4af37]/40 text-[#f3d078] hover:bg-white/10'
                    : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                }`}
                title="Refresh live AI suggestions"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Re-query Model</span>
              </button>
            </div>
          </div>

          {/* Quick Category Suggestion Pills */}
          <div className="space-y-1.5">
            <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-[#04142b]'}`}>
              Quick Activity Inspirations:
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {quickPillOptions.map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchQuery(pill.query);
                    handleSearchGrounding(searchLocation, pill.query);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                    searchQuery === pill.query
                      ? 'bg-[#d4af37] text-[#041226] border-[#d4af37] font-bold shadow'
                      : isDark
                      ? 'bg-[#040f1f] text-slate-300 hover:text-white border-white/15'
                      : 'bg-white text-slate-700 hover:text-slate-950 border-slate-300 shadow-sm'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchGrounding();
            }}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1"
          >
            <div className="md:col-span-5">
              <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-slate-300' : 'text-[#04142b]'}`}>
                Location or Neighborhood
              </label>
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="e.g. San Francisco Civic Center, Tampa Bay FL, Orlando, Maui"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] ${
                  isDark
                    ? 'bg-[#041226] border-[#d4af37]/35 text-white'
                    : 'bg-white border-[#d4af37]/35 text-[#04142b]'
                }`}
              />
            </div>

            <div className="md:col-span-5">
              <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-slate-300' : 'text-[#04142b]'}`}>
                Activity Preference
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Hands-on art studio, outdoor splash park, toddler play"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] ${
                  isDark
                    ? 'bg-[#041226] border-[#d4af37]/35 text-white'
                    : 'bg-white border-[#d4af37]/35 text-[#04142b]'
                }`}
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all hover:scale-105 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#041226]" />
                    <span>Querying AI...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 text-[#041226]" />
                    <span>Find Spots</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Notice if any */}
          {searchError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
              <span>{searchError}</span>
              <button
                type="button"
                onClick={() => handleSearchGrounding()}
                className="underline font-bold hover:text-white"
              >
                Retry
              </button>
            </div>
          )}

          {/* Results Display */}
          {groundedResults && (
            <div className="mt-6 pt-6 border-t border-[#d4af37]/25 space-y-4 animate-in fade-in">
              <div
                className={`p-4 rounded-2xl border text-sm leading-relaxed whitespace-pre-line ${
                  isDark
                    ? 'bg-[#041226]/80 border-[#d4af37]/30 text-slate-200'
                    : 'bg-amber-50/70 border-[#d4af37]/35 text-[#1e293b]'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-[#d4af37] mb-1">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>Nana's AI Adventure Recommendation</span>
                </div>
                <p>{groundedResults.text}</p>
              </div>

              {groundedResults.places.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {groundedResults.places.map((place, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 shadow-lg group transition-all duration-300 hover:-translate-y-1 ${
                        isDark
                          ? 'bg-[#061833] border-[#d4af37]/35 hover:border-[#dfb75c] text-white'
                          : 'bg-white border-[#d4af37]/35 hover:border-[#c59b27] text-[#04142b] shadow-sm'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Title and Category Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-base font-bold line-clamp-2 transition-colors group-hover:text-[#f3d078]">
                            {place.title}
                          </h5>
                        </div>

                        {place.category && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d4af37]/15 text-[#f3d078] border border-[#d4af37]/30">
                            {place.category}
                          </span>
                        )}

                        {place.address && (
                          <p className={`text-[11px] flex items-start gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            <MapPin className="w-3.5 h-3.5 text-[#dfb75c] shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{place.address}</span>
                          </p>
                        )}

                        {place.description && (
                          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                            {place.description}
                          </p>
                        )}

                        {/* Kid Highlight */}
                        {place.kidHighlight && (
                          <div
                            className={`p-2.5 rounded-xl border text-[11px] flex items-start gap-1.5 ${
                              isDark ? 'bg-[#040f1f] border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-[#dfb75c]">Why Kids Love It: </strong>
                              <span>{place.kidHighlight}</span>
                            </div>
                          </div>
                        )}

                        {/* Parent Tip */}
                        {place.parentTip && (
                          <div
                            className={`p-2.5 rounded-xl border text-[11px] flex items-start gap-1.5 ${
                              isDark ? 'bg-[#040f1f] border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <Lightbulb className="w-3.5 h-3.5 text-[#dfb75c] shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-[#dfb75c]">Parent Tip: </strong>
                              <span>{place.parentTip}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Actions: Google Maps Navigation + Book Nana */}
                      <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                        {place.uri ? (
                          <a
                            href={place.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-2.5 rounded-xl bg-[#040f1f] hover:bg-[#071c38] text-white border border-[#d4af37]/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3 text-[#dfb75c]" />
                            <span>Google Maps</span>
                          </a>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => onOpenBooking('adventure-day')}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] text-xs font-black flex items-center justify-center gap-1 hover:brightness-110 transition-all cursor-pointer shadow"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>Book Nana ($32/hr)</span>
                        </button>
                      </div>
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

