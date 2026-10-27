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
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark
            ? 'bg-gradient-to-b from-[#0b021a]/80 via-[#0d0322]/65 to-[#0b021a]/90'
            : 'bg-gradient-to-b from-[#fcfaff]/85 via-[#f8f5ff]/70 to-[#fcfaff]/90'
        }`}
      />
    </div>
  );
};
