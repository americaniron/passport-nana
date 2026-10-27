import React from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37] ${
        isDark
          ? 'bg-[#071c38] hover:bg-[#0c2b52] text-[#f3d078] border border-[#d4af37]/40 shadow-sm'
          : 'bg-[#faf8f5] hover:bg-[#f3eee4] text-[#041226] border border-[#d4af37]/50 shadow-sm'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45 text-[#f3d078]" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 text-[#041226]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
