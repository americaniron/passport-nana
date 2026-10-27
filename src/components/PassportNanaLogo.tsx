import React from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

interface PassportNanaLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

export const PassportNanaLogo: React.FC<PassportNanaLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  const { isDark } = useTheme();

  // Dimensions based on size
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  // High-fidelity kid-friendly golden wings & passport emblem SVG
  const LogoIcon = (
    <div className={`relative ${iconSizes[size]} flex-shrink-0 group cursor-pointer transition-transform duration-300 hover:scale-105`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_10px_rgba(212,175,55,0.45)]"
      >
        <defs>
          <linearGradient id="pnGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcedaa" />
            <stop offset="35%" stopColor="#d4af37" />
            <stop offset="70%" stopColor="#f3d078" />
            <stop offset="100%" stopColor="#aa8214" />
          </linearGradient>
          <linearGradient id="pnNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0c234b" />
            <stop offset="100%" stopColor="#030d1d" />
          </linearGradient>
          <radialGradient id="pnGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd868" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Circular Ring with Golden Beads */}
        <circle cx="60" cy="60" r="54" stroke="url(#pnGoldGrad)" strokeWidth="2.5" strokeDasharray="3 2" opacity="0.6" />
        <circle cx="60" cy="60" r="50" fill="url(#pnNavyGrad)" stroke="url(#pnGoldGrad)" strokeWidth="2.5" />

        {/* Golden Angel/Travel Wings (Left & Right) */}
        {/* Left Wing */}
        <g className="transition-transform duration-500 group-hover:-translate-x-0.5">
          <path
            d="M52 58 C45 42, 28 36, 14 42 C18 52, 24 64, 48 68 Z"
            fill="url(#pnGoldGrad)"
            opacity="0.95"
          />
          <path
            d="M48 68 C36 68, 22 70, 18 80 C26 84, 38 82, 50 74 Z"
            fill="url(#pnGoldGrad)"
            opacity="0.8"
          />
          <path
            d="M50 74 C42 80, 28 88, 26 94 C34 96, 44 90, 52 82 Z"
            fill="url(#pnGoldGrad)"
            opacity="0.65"
          />
        </g>

        {/* Right Wing */}
        <g className="transition-transform duration-500 group-hover:translate-x-0.5">
          <path
            d="M68 58 C75 42, 92 36, 106 42 C102 52, 96 64, 72 68 Z"
            fill="url(#pnGoldGrad)"
            opacity="0.95"
          />
          <path
            d="M72 68 C84 68, 98 70, 102 80 C94 84, 82 82, 70 74 Z"
            fill="url(#pnGoldGrad)"
            opacity="0.8"
          />
          <path
            d="M70 74 C78 80, 92 88, 94 94 C86 96, 76 90, 68 82 Z"
            fill="url(#pnGoldGrad)"
            opacity="0.65"
          />
        </g>

        {/* Golden Passport Emblem / Globe */}
        <circle cx="60" cy="62" r="22" fill="#041226" stroke="url(#pnGoldGrad)" strokeWidth="2.5" />
        
        {/* Globe Meridian Lines & Latitude */}
        <ellipse cx="60" cy="62" rx="10" ry="21" stroke="url(#pnGoldGrad)" strokeWidth="1" opacity="0.4" fill="none" />
        <line x1="38" y1="62" x2="82" y2="62" stroke="url(#pnGoldGrad)" strokeWidth="1" opacity="0.4" />
        <line x1="42" y1="52" x2="78" y2="52" stroke="url(#pnGoldGrad)" strokeWidth="0.8" opacity="0.3" />
        <line x1="42" y1="72" x2="78" y2="72" stroke="url(#pnGoldGrad)" strokeWidth="0.8" opacity="0.3" />

        {/* Kid-Friendly Smiling Care Character / Gentle Heart Emblem in the Center */}
        {/* Adorable caring mother & child / cheerful shining mascot */}
        <g>
          {/* Gentle Loving Heart Center with Sparkle */}
          <path
            d="M60 74 C60 74, 49 67, 49 59 C49 54, 53 50, 58 52 C59.5 52.6, 60 54, 60 54 C60 54, 60.5 52.6, 62 52 C67 50, 71 54, 71 59 C71 67, 60 74, 60 74 Z"
            fill="url(#pnGoldGrad)"
          />
          {/* Cheerful Friendly Smile Eyes & Little Smile */}
          <circle cx="56" cy="58" r="1.3" fill="#041226" />
          <circle cx="64" cy="58" r="1.3" fill="#041226" />
          <path d="M57.5 62 C58.5 64, 61.5 64, 62.5 62" stroke="#041226" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Little Crown / Star of Safety on Top */}
        <path
          d="M52 35 L56 41 L60 33 L64 41 L68 35 L66 43 L54 43 Z"
          fill="url(#pnGoldGrad)"
          stroke="#041226"
          strokeWidth="0.8"
        />

        {/* Tiny golden sparkles around crown */}
        <circle cx="48" cy="33" r="1.5" fill="#fcedaa" />
        <circle cx="72" cy="33" r="1.5" fill="#fcedaa" />
        <circle cx="60" cy="27" r="1.8" fill="#fcedaa" />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{LogoIcon}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {LogoIcon}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight font-serif ${titleSizes[size]} ${
              isDark ? 'text-white' : 'text-[#04142b]'
            }`}
          >
            Passport{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd868] via-[#d4af37] to-[#aa8214] font-black">
              Nana
            </span>
          </span>
          <span className="inline-block text-xs text-[#d4af37] transform translate-y-[-2px] animate-pulse">✨</span>
        </div>
        {showTagline && (
          <div className="flex items-center gap-1">
            <span
              className={`font-bold tracking-wider uppercase ${subtitleSizes[size]} ${
                isDark ? 'text-[#d4af37]' : 'text-[#8c6d1f]'
              }`}
            >
              Luxury Care That Travels!
            </span>
            <span className="text-[10px] text-[#d4af37]">✈️</span>
          </div>
        )}
      </div>
    </div>
  );
};
