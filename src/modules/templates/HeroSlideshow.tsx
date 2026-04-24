'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Props = {
  images: string[];
  fallback: string;
  intervalMs?: number;
  className?: string;
};

export default function HeroSlideshow({
  images,
  fallback,
  intervalMs = 5000,
  className,
}: Props) {
  const slides = images.length > 0 ? images : [fallback];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousSrc, setPreviousSrc] = useState<string | null>(null);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => {
        const next = (i + 1) % slides.length;
        setPreviousSrc(slides[i]);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [slides, intervalMs]);

  const currentSrc = slides[currentIndex];

  return (
    <div className={`relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-white/20 bg-primary-900/40 ${className ?? 'h-[520px]'}`}>
      {previousSrc && previousSrc !== currentSrc && (
        <div
          key={`prev-${previousSrc}-${currentIndex}`}
          className="absolute inset-0 hero-spin-out"
        >
          <Image
            src={previousSrc}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      )}

      <div
        key={`curr-${currentSrc}-${currentIndex}`}
        className="absolute inset-0 hero-spin-in"
      >
        <Image
          src={currentSrc}
          alt="Featured"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority={currentIndex === 0}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-20 pointer-events-none" />

      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`block h-1.5 rounded-full transition-all duration-500 ${
                i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
