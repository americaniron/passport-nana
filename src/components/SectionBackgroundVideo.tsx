import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

interface SectionBackgroundVideoProps {
  videoUrl: string;
  posterImage?: string;
  opacityDark?: string; // e.g. "opacity-30"
  opacityLight?: string; // e.g. "opacity-20"
}

export const SectionBackgroundVideo: React.FC<SectionBackgroundVideoProps> = ({
  videoUrl,
  posterImage,
  opacityDark = 'opacity-30',
  opacityLight = 'opacity-20',
}) => {
  const { isDark } = useTheme();
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: video remains ready
      });
    }
  }, [videoUrl]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0 select-none">
      {!hasError ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          preload="auto"
          poster={posterImage}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isDark ? opacityDark : opacityLight
          }`}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : null}

      {/* Atmospheric Theme-aware Gradient Overlay for Optimal Text Contrast */}
      {/* Dark Theme: Deep Royal Midnight Navy gradient overlay */}
      {/* Light Theme: Alabaster Pearl & Warm Marble gradient overlay */}
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark
            ? 'bg-gradient-to-b from-[#030d1e]/85 via-[#061833]/70 to-[#030d1e]/92'
            : 'bg-gradient-to-b from-[#faf8f5]/85 via-[#f5f2eb]/75 to-[#faf8f5]/92'
        }`}
      />
    </div>
  );
};
