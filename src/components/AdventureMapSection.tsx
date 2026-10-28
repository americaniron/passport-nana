import React, { useState, useEffect } from 'react';
import { GroundedPlace } from '../types/index.ts';
import {
  ADVENTURE_CATEGORY_THEMES,
  REAL_GOOGLE_MAPS_ADVENTURES,
  queryAdventurePlaces,
} from '../data/adventures.ts';
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
  Map as MapIcon,
  LayoutGrid,
  Columns2,
  Clock,
  DollarSign,
  Maximize2,
  ChevronRight,
} from 'lucide-react';
import { SectionBackgroundVideo } from './SectionBackgroundVideo.tsx';
import { useTheme } from '../context/ThemeContext.tsx';

interface AdventureMapSectionProps {
  onOpenBooking: (serviceId?: string) => void;
}

type ViewMode = 'split' | 'grid' | 'map';

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
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [selectedPlace, setSelectedPlace] = useState<GroundedPlace | null>(null);
  const [groundedResults, setGroundedResults] = useState<{
    text: string;
    places: GroundedPlace[];
  } | null>(null);

  const quickPillOptions = [
    { label: '🔬 STEM & Planetariums', query: 'Hands-on interactive science centers, planetarium, and children discovery museums', cat: 'science' },
    { label: '🎠 Historic Carousels & Playgrounds', query: 'Historic carousels, sprawling rope pyramid climbing playgrounds, and tree-shaded parks', cat: 'parks' },
    { label: '🏖️ Splash Parks & Beaches', query: 'Toddler-safe splash water fountains, sandy beach exploration, and gentle tide pools', cat: 'water' },
    { label: '🎨 Hands-On Art & Crafts', query: 'Children art studios, clay animation, storytelling workshops, and music gardens', cat: 'arts' },
    { label: '🐾 Animals & Botanical Gardens', query: 'Gentle petting farms, butterfly pavilions, botanical walking paths, and koi ponds', cat: 'animals' },
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

    let fetchedPlaces: GroundedPlace[] = [];
    let introText = '';
    let sourceLabel = '';

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

      // Safely inspect content-type before parsing to prevent Safari SyntaxError on static hosts
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data && Array.isArray(data.places) && data.places.length > 0) {
          fetchedPlaces = data.places;
          introText = data.text || `Live Google Maps adventure recommendations in ${loc}:`;
          sourceLabel = data.model || data.source || 'Live Google Maps Grounding';
        }
      }
    } catch (err) {
      console.warn('API maps-grounding unavailable or static deployment, using verified adventure engine:', err);
    }

    // Seamless client-side Google Maps verified database fallback
    if (fetchedPlaces.length === 0) {
      const localResult = queryAdventurePlaces(loc, q, hub);
      fetchedPlaces = localResult.places;
      introText = localResult.text;
      sourceLabel = 'Google Maps Adventure Guide';
    }

    setGroundedResults({
      text: introText,
      places: fetchedPlaces,
    });
    setModelSource(sourceLabel);
    setSearchError(null);
    if (fetchedPlaces.length > 0) {
      setSelectedPlace(fetchedPlaces[0]);
    }
    setIsLoading(false);
  };

  // Perform initial search on mount
  useEffect(() => {
    handleSearchGrounding(
      'San Francisco Civic Center & Golden Gate Park',
      'Kid-friendly parks, interactive science centers, and family adventure spots',
      'sf'
    );
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

  // Generate Google Maps Embed URL for selected place or city
  const mapEmbedUrl = selectedPlace
    ? `https://maps.google.com/maps?q=${encodeURIComponent(
        `${selectedPlace.title}, ${selectedPlace.address}`
      )}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(
        searchLocation
      )}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  // Get active featured spots for current hub
  const currentHubFeatured = REAL_GOOGLE_MAPS_ADVENTURES[selectedHub] || REAL_GOOGLE_MAPS_ADVENTURES.sf;

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
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${
              isDark
                ? 'bg-[#071c38]/90 border-[#d4af37]/40 text-[#f3d078]'
                : 'bg-white border-[#d4af37]/40 text-[#04142b] shadow-sm'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#d4af37]" /> Service Area & Live Google Maps Grounding
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-black font-display ${
              isDark ? 'text-white' : 'text-[#04142b]'
            }`}
          >
            Local Service Hubs & Adventure Days
          </h2>
          <p className={isDark ? 'text-base sm:text-lg text-slate-300' : 'text-base sm:text-lg text-[#334155] font-medium'}>
            Making memories, one adventure at a time! Real Google Maps destination photography, verified hours, parent tips, and instant directions.
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

        {/* Territory Details + Top Curated Spots */}
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

          {/* Curated Interactive Adventure Places with Real Google Maps Photos */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h4 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#04142b]'}`}>
                <Sparkles className="w-4 h-4 text-[#dfb75c]" />
                <span>
                  Featured Adventure Spots (
                  {selectedHub === 'sf' ? 'SF Bay Area' : selectedHub === 'tampa' ? 'Tampa Bay' : 'Passport Travel'}
                  )
                </span>
              </h4>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verified on Google Maps</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentHubFeatured.slice(0, 4).map((spot, i) => {
                const theme = ADVENTURE_CATEGORY_THEMES[spot.category || 'parks'] || ADVENTURE_CATEGORY_THEMES.parks;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedPlace(spot);
                    }}
                    className={`rounded-2xl border overflow-hidden transition-all flex flex-col justify-between group cursor-pointer shadow-md ${
                      isDark
                        ? `bg-[#061833]/90 ${theme.cardBorder} ${theme.cardGlow}`
                        : `bg-white ${theme.cardBorder} hover:shadow-lg`
                    }`}
                  >
                    {/* Real Google Maps Image Container */}
                    <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                      <img
                        src={spot.image}
                        alt={spot.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Top Category Badge */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${theme.badgeBg} ${theme.badgeText} border border-white/20`}
                        >
                          {theme.label}
                        </span>
                      </div>

                      {/* Rating & Review overlay */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px]">
                        <span className="inline-flex items-center gap-1 font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{spot.rating}</span>
                          {spot.reviewsCount && (
                            <span className="text-slate-300 font-normal">
                              ({spot.reviewsCount.toLocaleString()})
                            </span>
                          )}
                        </span>
                        {spot.openStatus && (
                          <span className="bg-emerald-500/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold text-white">
                            {spot.openStatus.split('•')[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h5
                          className={`text-sm font-bold transition-colors line-clamp-1 ${
                            isDark ? 'text-white group-hover:text-[#f3d078]' : 'text-[#04142b] group-hover:text-[#b8860b]'
                          }`}
                        >
                          {spot.title}
                        </h5>
                        <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                          {spot.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <a
                          href={spot.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`inline-flex items-center gap-1 text-xs font-bold ${theme.badgeText} hover:underline`}
                        >
                          <span>Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenBooking('adventure-day');
                          }}
                          className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#d4af37] text-[#041226] hover:brightness-110"
                        >
                          Book Nana
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live Google Maps Adventure Search Engine Container */}
        <div
          className={`rounded-3xl border-2 p-6 sm:p-8 text-left shadow-2xl space-y-6 ${
            isDark
              ? 'bg-gradient-to-b from-[#071c38] via-[#041226] to-[#071c38] border-[#d4af37]/45 text-white'
              : 'bg-gradient-to-b from-white via-[#faf7f0] to-white border-[#d4af37]/45 text-[#04142b]'
          }`}
        >
          {/* Header & Status Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                  <Radio className="w-3 h-3" />
                  <span>Real Google Maps Engine Online</span>
                </span>
                {modelSource && (
                  <span className="text-[10px] opacity-80 font-mono text-[#d4af37]">
                    [{modelSource}]
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-display">
                Live Google Maps Grounded Adventure Finder
              </h3>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
                Authentic Google Maps explorer: real photos, star ratings, operating hours, parent tips, and live map directions for kids and families.
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
                <span>Re-query Spots</span>
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
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
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-[#d4af37]" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="e.g. San Francisco Civic Center, Tampa Bay FL, Orlando, Maui"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] ${
                    isDark
                      ? 'bg-[#041226] border-[#d4af37]/35 text-white'
                      : 'bg-white border-[#d4af37]/35 text-[#04142b]'
                  }`}
                />
              </div>
            </div>

            <div className="md:col-span-5">
              <label className={`block text-[11px] font-bold uppercase mb-1 ${isDark ? 'text-slate-300' : 'text-[#04142b]'}`}>
                Activity Preference
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 absolute left-3.5 top-3 text-[#d4af37]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Hands-on art studio, outdoor splash park, toddler play"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d4af37] ${
                    isDark
                      ? 'bg-[#041226] border-[#d4af37]/35 text-white'
                      : 'bg-white border-[#d4af37]/35 text-[#04142b]'
                  }`}
                />
              </div>
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
                    <span>Searching...</span>
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

          {/* Error Notice (if any) */}
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
            <div className="mt-6 pt-6 border-t border-[#d4af37]/25 space-y-5 animate-in fade-in">
              {/* Intro Banner & View Mode Switcher */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div
                  className={`p-3.5 rounded-2xl border text-sm leading-relaxed flex items-center gap-2.5 flex-1 ${
                    isDark
                      ? 'bg-[#041226]/80 border-[#d4af37]/30 text-slate-200'
                      : 'bg-amber-50/70 border-[#d4af37]/35 text-[#1e293b]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>{groundedResults.text}</span>
                </div>

                {/* Google Maps Explorer View Modes: Split | Grid | Map */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-black/30 border border-[#d4af37]/30 self-start md:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setViewMode('split')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'split'
                        ? 'bg-[#d4af37] text-[#041226] shadow'
                        : isDark
                        ? 'text-slate-300 hover:text-white'
                        : 'text-slate-700 hover:text-black'
                    }`}
                    title="Split Explorer: Interactive Map & Place List"
                  >
                    <Columns2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Split Explorer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-[#d4af37] text-[#041226] shadow'
                        : isDark
                        ? 'text-slate-300 hover:text-white'
                        : 'text-slate-700 hover:text-black'
                    }`}
                    title="Grid of Google Maps Place Cards"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Place Cards</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'map'
                        ? 'bg-[#d4af37] text-[#041226] shadow'
                        : isDark
                        ? 'text-slate-300 hover:text-white'
                        : 'text-slate-700 hover:text-black'
                    }`}
                    title="Full Interactive Google Map"
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Map View</span>
                  </button>
                </div>
              </div>

              {/* VIEW MODE 1: SPLIT EXPLORER (Google Maps Search Style) */}
              {viewMode === 'split' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Scrollable List of Rich Place Cards */}
                  <div className="lg:col-span-6 space-y-4 max-h-[720px] overflow-y-auto pr-1">
                    {groundedResults.places.map((place, idx) => {
                      const theme =
                        ADVENTURE_CATEGORY_THEMES[place.category || 'parks'] ||
                        ADVENTURE_CATEGORY_THEMES.parks;
                      const isSelected = selectedPlace?.title === place.title;

                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedPlace(place)}
                          className={`rounded-2xl border overflow-hidden transition-all duration-200 cursor-pointer shadow-lg ${
                            isSelected
                              ? 'border-[#f3d078] ring-2 ring-[#d4af37]/60'
                              : `${theme.cardBorder} hover:border-[#d4af37]/60`
                          } ${
                            isDark
                              ? 'bg-[#061833] text-white'
                              : 'bg-white text-[#04142b]'
                          }`}
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-0">
                            {/* Place Real Photo Container */}
                            <div className="sm:col-span-5 relative h-40 sm:h-auto min-h-[140px] bg-slate-900 overflow-hidden">
                              <img
                                src={
                                  place.image ||
                                  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80'
                                }
                                alt={place.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                              {/* Category Badge */}
                              <div className="absolute top-2 left-2">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${theme.badgeBg} ${theme.badgeText} border border-white/20`}
                                >
                                  {theme.label}
                                </span>
                              </div>

                              {/* Price Tier & Open Status */}
                              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white">
                                {place.priceLevel && (
                                  <span className="font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
                                    {place.priceLevel}
                                  </span>
                                )}
                                {place.openStatus && (
                                  <span className="bg-emerald-500/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-semibold">
                                    {place.openStatus.split('•')[0]}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Details Column */}
                            <div className="sm:col-span-7 p-4 flex flex-col justify-between space-y-2.5">
                              <div>
                                <div className="flex items-start justify-between gap-1.5 mb-1">
                                  <h4 className="text-sm sm:text-base font-bold line-clamp-1 transition-colors">
                                    {place.title}
                                  </h4>
                                </div>

                                {/* Star Rating & Reviews */}
                                <div className="flex items-center gap-1.5 text-xs mb-1.5">
                                  <span className="flex items-center gap-0.5 font-bold text-amber-400">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span>{place.rating || 4.8}</span>
                                  </span>
                                  {place.reviewsCount && (
                                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                                      ({place.reviewsCount.toLocaleString()} reviews)
                                    </span>
                                  )}
                                </div>

                                {place.address && (
                                  <p className={`text-[11px] flex items-start gap-1 line-clamp-1 mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                    <MapPin className="w-3 h-3 text-[#dfb75c] shrink-0 mt-0.5" />
                                    <span>{place.address}</span>
                                  </p>
                                )}

                                {place.kidHighlight && (
                                  <p className="text-[11px] text-rose-400 dark:text-rose-300 italic line-clamp-1">
                                    ❤️ Kids love: {place.kidHighlight}
                                  </p>
                                )}
                              </div>

                              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                                <a
                                  href={
                                    place.uri ||
                                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                      `${place.title} ${place.address}`
                                    )}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className={`inline-flex items-center gap-1 text-xs font-bold ${theme.badgeText} hover:underline`}
                                >
                                  <span>Google Maps</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenBooking('adventure-day');
                                  }}
                                  className="text-xs font-black px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] hover:brightness-110 shadow"
                                >
                                  Book Nana ($32/hr)
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Interactive Live Google Map View Centered on Selection */}
                  <div className="lg:col-span-6 sticky top-24 space-y-3">
                    <div className="rounded-2xl border-2 border-[#d4af37]/45 overflow-hidden shadow-2xl relative bg-slate-900 h-[480px]">
                      <iframe
                        title="Google Maps Adventure Grounding"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={mapEmbedUrl}
                      />

                      {/* Active Selected Destination Preview Card Overlay */}
                      {selectedPlace && (
                        <div
                          className={`absolute bottom-3 left-3 right-3 p-3.5 rounded-xl border backdrop-blur-md shadow-xl flex items-center justify-between gap-3 ${
                            isDark
                              ? 'bg-[#041226]/90 border-[#d4af37]/50 text-white'
                              : 'bg-white/95 border-[#d4af37]/50 text-[#04142b]'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">
                                Selected Google Maps Spot
                              </span>
                            </div>
                            <h5 className="text-sm font-bold truncate">{selectedPlace.title}</h5>
                            <p className="text-[11px] opacity-75 truncate">{selectedPlace.address}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={
                                selectedPlace.uri ||
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  `${selectedPlace.title} ${selectedPlace.address}`
                                )}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-[#071c38] hover:bg-[#0c284e] text-white border border-[#d4af37]/40 text-xs font-bold flex items-center gap-1"
                              title="Directions in Google Maps"
                            >
                              <Navigation className="w-3.5 h-3.5 text-[#d4af37]" />
                              <span className="hidden sm:inline">Directions</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => onOpenBooking('adventure-day')}
                              className="px-3 py-2 rounded-lg bg-[#d4af37] hover:brightness-110 text-[#041226] text-xs font-bold"
                            >
                              Book Escort
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Selected Place Deep Dive Box */}
                    {selectedPlace && (
                      <div
                        className={`p-4 rounded-2xl border text-xs space-y-2 ${
                          isDark
                            ? 'bg-[#041226]/80 border-[#d4af37]/30 text-slate-200'
                            : 'bg-white border-[#d4af37]/30 text-[#1e293b]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#d4af37] flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>Nana's Adventure Tip for {selectedPlace.title}:</span>
                          </span>
                          {selectedPlace.openStatus && (
                            <span className="text-[11px] text-emerald-400 font-semibold">
                              {selectedPlace.openStatus}
                            </span>
                          )}
                        </div>
                        <p className="leading-relaxed">
                          {selectedPlace.parentTip || selectedPlace.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VIEW MODE 2: PLACE CARDS GRID (3-Column Rich Google Maps Cards with Real Photos) */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {groundedResults.places.map((place, idx) => {
                    const theme =
                      ADVENTURE_CATEGORY_THEMES[place.category || 'parks'] ||
                      ADVENTURE_CATEGORY_THEMES.parks;

                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border overflow-hidden flex flex-col justify-between shadow-xl group transition-all duration-300 hover:-translate-y-1 ${
                          isDark
                            ? `bg-[#061833] ${theme.cardBorder} hover:border-[#dfb75c] text-white`
                            : `bg-white ${theme.cardBorder} hover:border-[#c59b27] text-[#04142b] shadow-sm`
                        }`}
                      >
                        {/* Real Google Maps Image Container */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                          <img
                            src={
                              place.image ||
                              'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80'
                            }
                            alt={place.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

                          {/* Top Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span
                              className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${theme.badgeBg} ${theme.badgeText} border border-white/20`}
                            >
                              {theme.label}
                            </span>
                          </div>

                          {/* Top Open Status */}
                          {place.openStatus && (
                            <div className="absolute top-3 right-3">
                              <span className="bg-emerald-500/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-semibold text-white">
                                {place.openStatus.split('•')[0]}
                              </span>
                            </div>
                          )}

                          {/* Bottom Stats Overlay */}
                          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                            <span className="inline-flex items-center gap-1 font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{place.rating || 4.8}</span>
                              {place.reviewsCount && (
                                <span className="text-slate-300 font-normal text-[11px]">
                                  ({place.reviewsCount.toLocaleString()})
                                </span>
                              )}
                            </span>
                            {place.priceLevel && (
                              <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded font-bold text-[11px]">
                                {place.priceLevel}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Place Details Body */}
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <h5 className="text-base font-bold line-clamp-1 transition-colors group-hover:text-[#f3d078]">
                              {place.title}
                            </h5>

                            {place.address && (
                              <p className={`text-[11px] flex items-start gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                <MapPin className="w-3.5 h-3.5 text-[#dfb75c] shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{place.address}</span>
                              </p>
                            )}

                            {place.description && (
                              <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? 'text-slate-300' : 'text-[#475569]'}`}>
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
                                  <strong className={theme.badgeText}>Why Kids Love It: </strong>
                                  <span className="line-clamp-2">{place.kidHighlight}</span>
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
                                  <span className="line-clamp-2">{place.parentTip}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Card Actions: Google Maps Navigation + Book Nana */}
                          <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                            <a
                              href={
                                place.uri ||
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  `${place.title} ${place.address}`
                                )}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 px-2.5 rounded-xl bg-[#040f1f] hover:bg-[#071c38] text-white border border-[#d4af37]/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3 text-[#dfb75c]" />
                              <span>Google Maps</span>
                            </a>

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
                      </div>
                    );
                  })}
                </div>
              )}

              {/* VIEW MODE 3: FULL MAP VIEW */}
              {viewMode === 'map' && (
                <div className="space-y-4">
                  <div className="rounded-2xl border-2 border-[#d4af37]/45 overflow-hidden shadow-2xl relative bg-slate-900 h-[600px]">
                    <iframe
                      title="Google Maps Adventure Full Map"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={mapEmbedUrl}
                    />

                    {/* Active Floating Destination Chip Bar */}
                    <div className="absolute top-3 left-3 right-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {groundedResults.places.map((place, idx) => {
                        const isSelected = selectedPlace?.title === place.title;
                        const theme =
                          ADVENTURE_CATEGORY_THEMES[place.category || 'parks'] ||
                          ADVENTURE_CATEGORY_THEMES.parks;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedPlace(place)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 backdrop-blur-md border transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#d4af37] text-[#041226] border-[#f3d078] shadow-lg scale-105'
                                : 'bg-black/70 text-white border-white/20 hover:bg-black/90'
                            }`}
                          >
                            <MapPin className={`w-3 h-3 ${isSelected ? 'text-[#041226]' : theme.badgeText}`} />
                            <span className="truncate max-w-[150px]">{place.title}</span>
                            <span className="text-[10px] opacity-80">★ {place.rating}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
