import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plane, CheckCircle2, Clock, Ban, Sparkles } from 'lucide-react';
import { AvailabilityStatus } from '../types/business.ts';

interface OwnerAvailabilityCalendarProps {
  onSelectDate?: (dateStr: string) => void;
  selectedDate?: string;
  isInteractive?: boolean;
  compact?: boolean;
}

export const OwnerAvailabilityCalendar: React.FC<OwnerAvailabilityCalendarProps> = ({
  onSelectDate,
  selectedDate,
  isInteractive = true,
  compact = false,
}) => {
  const { isDark } = useTheme();
  const { calendarAvailability, getAvailabilityForDate } = useBusiness();

  // Current viewed month state
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Status badge styling helper
  const getStatusStyles = (status: AvailabilityStatus, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-gradient-to-r from-[#d4af37] to-[#aa8214] text-[#041226] font-bold shadow-lg shadow-[#d4af37]/30 ring-2 ring-white scale-105';
    }

    switch (status) {
      case 'available':
        return isDark
          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/50 hover:border-emerald-400'
          : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100';
      case 'limited':
        return isDark
          ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:bg-amber-900/50 hover:border-amber-400'
          : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100';
      case 'flight':
        return isDark
          ? 'bg-sky-950/50 text-sky-300 border border-sky-500/40 hover:bg-sky-900/60 hover:border-sky-400'
          : 'bg-sky-50 text-sky-800 border border-sky-300 hover:bg-sky-100';
      case 'booked':
      default:
        return isDark
          ? 'bg-slate-900/60 text-slate-500 border border-slate-800 cursor-not-allowed opacity-60'
          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60';
    }
  };

  const getStatusDot = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available':
        return <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_6px_rgba(52,211,153,0.8)]" />;
      case 'limited':
        return <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shadow-[0_0_6px_rgba(251,191,36,0.8)]" />;
      case 'flight':
        return <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block shadow-[0_0_6px_rgba(56,189,248,0.8)]" />;
      case 'booked':
      default:
        return <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />;
    }
  };

  // Find active note for selected date or hover
  const activeDayInfo = selectedDate ? getAvailabilityForDate(selectedDate) : null;

  return (
    <div
      className={`rounded-2xl transition-all duration-300 border ${
        compact ? 'p-3 text-xs' : 'p-4 sm:p-5'
      } ${
        isDark
          ? 'bg-[#061833]/90 border-[#d4af37]/30 shadow-xl shadow-black/40'
          : 'bg-white/95 border-[#d4af37]/30 shadow-lg shadow-amber-950/5'
      }`}
    >
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-black text-sm sm:text-base tracking-wide flex items-center gap-1.5">
              <span>{monthNames[month]} {year}</span>
              <span className="text-xs text-[#d4af37] font-sans font-semibold">Nana's Live Schedule</span>
            </h4>
            <p className="text-[11px] opacity-70">Tap an open date to reserve your care slot</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Previous month"
            className={`p-1.5 rounded-lg border transition-all ${
              isDark
                ? 'border-white/10 hover:border-[#d4af37]/50 hover:bg-white/5 text-slate-200'
                : 'border-slate-200 hover:border-[#d4af37]/50 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className={`p-1.5 rounded-lg border transition-all ${
              isDark
                ? 'border-white/10 hover:border-[#d4af37]/50 hover:bg-white/5 text-slate-200'
                : 'border-slate-200 hover:border-[#d4af37]/50 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3 text-[10px] sm:text-[11px]">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-emerald-400">Available</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-semibold text-amber-400">Limited Slots</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-sky-500/10 border border-sky-500/20">
          <Plane className="w-2.5 h-2.5 text-sky-400" />
          <span className="font-semibold text-sky-400">Flight Nanny</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20">
          <span className="w-2 h-2 rounded-full bg-rose-400" />
          <span className="font-semibold text-rose-400">Booked / Off</span>
        </div>
      </div>

      {/* Weekdays Row */}
      <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] sm:text-xs opacity-60 mb-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {/* Leading empty cells */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square opacity-0 pointer-events-none" />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const dayStatus = getAvailabilityForDate(dateStr);
          const isSelected = selectedDate === dateStr;
          const isAvailable = dayStatus.status === 'available' || dayStatus.status === 'limited';
          const isPast = new Date(dateStr) < new Date(new Date().toDateString());

          return (
            <button
              key={dateStr}
              type="button"
              disabled={!isInteractive || !isAvailable || isPast}
              onClick={() => {
                if (onSelectDate && isAvailable && !isPast) {
                  onSelectDate(dateStr);
                }
              }}
              title={`${dateStr}: ${dayStatus.status.toUpperCase()} - ${dayStatus.note || ''}`}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all duration-200 text-xs sm:text-sm font-semibold ${
                getStatusStyles(dayStatus.status, isSelected)
              } ${isPast ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              <span>{dayNum}</span>
              <div className="flex items-center gap-0.5 mt-0.5">
                {dayStatus.status === 'flight' ? (
                  <Plane className={`w-2.5 h-2.5 ${isSelected ? 'text-[#041226]' : 'text-sky-400'}`} />
                ) : (
                  !isSelected && getStatusDot(dayStatus.status)
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Status Bar */}
      {selectedDate && (
        <div
          className={`mt-3.5 p-2.5 rounded-xl flex items-center justify-between text-xs border ${
            isDark
              ? 'bg-[#041021] border-[#d4af37]/30 text-slate-200'
              : 'bg-amber-50/70 border-[#d4af37]/30 text-[#04142b]'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-bold text-[#d4af37]">Selected Date: {selectedDate}</span>
              <p className="text-[11px] opacity-80">{activeDayInfo?.note || 'Nana is ready and available for your family.'}</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#d4af37] text-[#041226]">
            {activeDayInfo?.status || 'Available'}
          </span>
        </div>
      )}
    </div>
  );
};
