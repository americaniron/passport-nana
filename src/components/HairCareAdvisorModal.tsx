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
import { useTheme } from '../context/ThemeContext.tsx';

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
  const { isDark } = useTheme();
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
      <div
        className={`relative w-full max-w-2xl my-8 rounded-3xl border-2 p-6 sm:p-8 shadow-2xl transition-all ${
          isDark
            ? 'bg-[#041226] border-[#d4af37]/60 text-white'
            : 'bg-white border-[#d4af37]/50 text-[#04142b]'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-full border transition-all cursor-pointer ${
            isDark
              ? 'bg-[#071c38] text-slate-300 hover:text-white border-[#d4af37]/30'
              : 'bg-slate-100 text-[#04142b] hover:bg-slate-200 border-slate-300'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#dfb75c] text-xs font-bold uppercase tracking-wider">
            <Scissors className="w-3.5 h-3.5" /> AI Loc & Crown Advisor
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-display">
            Personalized Loc & Scalp Diagnostic
          </h3>
          <p className="text-xs sm:text-sm opacity-85">
            Tell us about your hair texture, loc maturity, and scalp condition to receive tailored maintenance guidance and appointment prep tips.
          </p>
        </div>

        {adviceResult ? (
          <div className="mt-6 space-y-6 text-left">
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-[#061833] border-[#d4af37]/35' : 'bg-[#faf8f5] border-[#d4af37]/35'
              }`}
            >
              <div className="flex items-center gap-2 text-[#dfb75c] font-bold text-sm">
                <Sparkles className="w-4 h-4 text-[#dfb75c]" />
                <span>Loctician Care Assessment</span>
              </div>
              <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line opacity-90">
                {adviceResult}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAdviceResult(null)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                  isDark
                    ? 'bg-[#071c38] hover:bg-[#0c2a52] text-slate-300 border-[#d4af37]/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#04142b] border-slate-300'
                }`}
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
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    isDark
                      ? 'bg-[#071c38] text-[#dfb75c] border-[#d4af37]/40'
                      : 'bg-[#faf8f5] text-[#04142b] border-[#d4af37]/40'
                  }`}
                >
                  Book $25 Consultation
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBooking('locks-wash-retwist-style');
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
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
                <label className="block text-xs font-bold mb-1 opacity-90">Hair Type</label>
                <select
                  value={hairType}
                  onChange={(e) => setHairType(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] ${
                    isDark
                      ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                      : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                  }`}
                >
                  <option value="4C (Tight Coils)">4C (Tight Coils)</option>
                  <option value="4B (Z-pattern Coils)">4B (Z-pattern Coils)</option>
                  <option value="4A (Loose Coils)">4A (Loose Coils)</option>
                  <option value="3B / 3C (Curly)">3B / 3C (Curly)</option>
                  <option value="Fine / Sensitive Scalp">Fine / Sensitive Scalp</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Loc Maturity / Style Stage
                </label>
                <select
                  value={locStage}
                  onChange={(e) => setLocStage(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] ${
                    isDark
                      ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                      : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                  }`}
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
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Current Scalp State
                </label>
                <select
                  value={scalpCondition}
                  onChange={(e) => setScalpCondition(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] ${
                    isDark
                      ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                      : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                  }`}
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
                <label className="block text-xs font-bold mb-1 opacity-90">
                  Desired Style or Goal
                </label>
                <select
                  value={desiredService}
                  onChange={(e) => setDesiredService(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] ${
                    isDark
                      ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                      : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                  }`}
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
              <label className="block text-xs font-bold mb-1 opacity-90">
                Any specific questions or concerns? (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Length is past shoulders; had starter coils 6 months ago; want gentle tension."
                className={`w-full px-3 py-2 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-[#d4af37] ${
                  isDark
                    ? 'bg-[#061833] border-[#d4af37]/35 text-white'
                    : 'bg-[#faf8f5] border-[#d4af37]/35 text-[#04142b]'
                }`}
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                  isDark
                    ? 'bg-[#071c38] hover:bg-[#0c2a52] text-slate-300 border-[#d4af37]/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#04142b] border-slate-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3d078] to-[#c59b27] hover:brightness-105 text-[#041226] font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#041226]" />
                    <span>Analyzing Crown...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#041226]" />
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
