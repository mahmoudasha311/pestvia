'use client';

import type { RefObject } from 'react';
import { gsap, useGSAP } from '@/shared/lib/gsap';

/** Transform-only entrance keeps the server-rendered hero readable throughout hydration. */
export function useHeroAnimation(scope: RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.hero-stagger',
          { y: 40 },
          {
            y: 0,
            duration: 1.1,
            stagger: 0.12,
            delay: 0.2,
            ease: 'power3.out',
            clearProps: 'transform',
          },
        );
      });
      return () => media.revert();
    },
    { scope },
  );
}
