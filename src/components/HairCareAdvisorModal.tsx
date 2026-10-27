import React, { useState } from 'react';
import {
  X,
  Scissors,
  Sparkles,
  CheckCircle2,
  Calendar,
  Loader2,
  Droplets,
  HelpCircle,
} from 'lucide-react';

interface HairCareAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (serviceId?: string) => void;
}

export const HairCareAdvisorModal: React.FC<HairCareAdvisorModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const [hairType, setHairType] = useState<string>('4C (Tight Coils)');
  const [locStage, setLocStage] = useState<string>('Budding / Teen (3-12 months)');
  const [scalpCondition, setScalpCondition] = useState<string>('Dry & needs moisture hydration');
  const [desiredService, setDesiredService] = useState<string>('Wash, Retwist & Style');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [adviceResult, setAdviceResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/care-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'hair',
          details: {
            hairType,
            locStage,
            scalpCondition,
            desiredService,
            notes,
          },
        }),
      });

      const data = await response.json();
      setAdviceResult(
        data.advice ||
          'For optimal loc health: Cleanse thoroughly every 2-3 weeks with residue-free clarifying shampoo. Sleep with a satin bonnet. Maintain lightweight moisture with natural rose water or jojoba oil. Schedule retwists every 4-6 weeks to avoid root thinning.'
      );
    } catch (err) {
      console.error('Advisor error:', err);
      setAdviceResult(
        'For optimal loc health: Cleanse thoroughly every 2-3 weeks with residue-free shampoo. Sleep with a satin bonnet or pillowcase. Maintain lightweight moisture with natural jojoba or rose water spray. Schedule retwists every 4-6 weeks to avoid over-manipulation.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-[#12042b] border border-cyan-400/40 p-6 sm:p-8 text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-purple-950 text-slate-300 hover:text-white hover:bg-purple-900 border border-purple-500/30 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950 border border-pink-400/30 text-pink-300 text-xs font-bold uppercase tracking-wider">
            <Scissors className="w-3.5 h-3.5" /> AI Loc & Crown Advisor
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
            Personalized Loc & Scalp Diagnostic
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Tell us about your hair texture, loc maturity, and scalp condition to receive tailored maintenance guidance and appointment prep tips.
          </p>
        </div>

        {adviceResult ? (
          <div className="mt-6 space-y-6 text-left">
            <div className="p-5 rounded-2xl bg-purple-950/70 border border-cyan-400/30 space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Loctician Care Assessment</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {adviceResult}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAdviceResult(null)}
                className="px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-slate-300 text-xs font-semibold border border-purple-500/30"
              >
                Change Inputs
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBooking('hair-consultation');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-cyan-300 text-xs font-bold border border-purple-500/40"
                >
                  Book $25 Consultation
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBooking('locks-wash-retwist-style');
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Wash & Retwist ($50+)</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerateAdvice} className="mt-6 space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Hair Type</label>
                <select
                  value={hairType}
                  onChange={(e) => setHairType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="4C (Tight Coils)">4C (Tight Coils)</option>
                  <option value="4B (Z-pattern Coils)">4B (Z-pattern Coils)</option>
                  <option value="4A (Loose Coils)">4A (Loose Coils)</option>
                  <option value="3B / 3C (Curly)">3B / 3C (Curly)</option>
                  <option value="Fine / Sensitive Scalp">Fine / Sensitive Scalp</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Loc Maturity / Style Stage
                </label>
                <select
                  value={locStage}
                  onChange={(e) => setLocStage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="Starter Locs (0-3 months)">Starter Locs (0-3 months)</option>
                  <option value="Budding / Teen (3-12 months)">
                    Budding / Teen (3-12 months)
                  </option>
                  <option value="Mature Locs (1+ years)">Mature Locs (1+ years)</option>
                  <option value="Considering Starting Locs">Considering Starting Locs</option>
                  <option value="Loose Natural Hair (for Braids)">
                    Loose Natural Hair (for Braids)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Current Scalp State
                </label>
                <select
                  value={scalpCondition}
                  onChange={(e) => setScalpCondition(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="Dry & needs moisture hydration">
                    Dry & needs moisture hydration
                  </option>
                  <option value="Normal / Healthy">Normal / Healthy</option>
                  <option value="Tender-headed / Sensitive to pull">
                    Tender-headed / Sensitive to pull
                  </option>
                  <option value="Buildup / Lint concerns">Buildup / Lint concerns</option>
                  <option value="Thinning at roots or edges">Thinning at roots or edges</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Desired Style or Goal
                </label>
                <select
                  value={desiredService}
                  onChange={(e) => setDesiredService(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="Wash, Retwist & Style">Wash, Retwist & Style ($50+)</option>
                  <option value="Freestyle Braids">Freestyle Braids ($100)</option>
                  <option value="Loc Repair / Root Tightening">
                    Loc Repair / Root Tightening
                  </option>
                  <option value="General Consultation">General Consultation ($25)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Any specific questions or concerns? (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Length is past shoulders; had starter coils 6 months ago; want gentle tension."
                className="w-full px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-500/40 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-slate-300 text-xs font-semibold border border-purple-500/30"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Crown...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Get Loctician Advice</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
