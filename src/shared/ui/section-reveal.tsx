'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { gsap, useGSAP, loadScrollTrigger } from '@/shared/lib/gsap';

/** Content arrives visible; only hydrated sections below the viewport are revealed. */
export function SectionReveal({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!scope.current) return;
      let disposed = false;
      let media: ReturnType<typeof gsap.matchMedia> | undefined;
      const start = () => {
        void loadScrollTrigger()
          .then(() => {
            if (disposed || !scope.current) return;
            media = gsap.matchMedia();
            media.add('(prefers-reduced-motion: no-preference)', () => {
              scope.current?.querySelectorAll<HTMLElement>('[data-reveal]').forEach((section) => {
                if (section.getBoundingClientRect().top < window.innerHeight) return;
                gsap.fromTo(
                  section,
                  { y: 35, opacity: 0 },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: section, start: 'top 85%', once: true },
                    clearProps: 'transform,opacity',
                  },
                );
              });
            });
          })
          .catch(() => {
            /* Optional motion cannot hide server-rendered content on load failure. */
          });
      };
      const idle =
        'requestIdleCallback' in window
          ? window.requestIdleCallback(start, { timeout: 2000 })
          : undefined;
      const timer = idle === undefined ? setTimeout(start, 300) : undefined;
      return () => {
        disposed = true;
        if (idle !== undefined) window.cancelIdleCallback(idle);
        if (timer !== undefined) clearTimeout(timer);
        media?.revert();
      };
    },
    { scope },
  );
  return <div ref={scope}>{children}</div>;
}
