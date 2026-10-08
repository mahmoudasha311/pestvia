'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useHeroAnimation } from '../hooks/use-hero-animation';

export function HeroAnimation({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useHeroAnimation(scope);
  return (
    <div
      ref={scope}
      className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center"
    >
      {children}
    </div>
  );
}
