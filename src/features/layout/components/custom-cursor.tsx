'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/shared/lib/gsap';

export function CustomCursor() {
  const cursor = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        '(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          const element = cursor.current;
          if (!element) return;
          const x = gsap.quickTo(element, 'x', { duration: 0.12, ease: 'power2.out' });
          const y = gsap.quickTo(element, 'y', { duration: 0.12, ease: 'power2.out' });
          const onMove = (event: MouseEvent) => {
            x(event.clientX);
            y(event.clientY);
            element.style.visibility = 'visible';
            const expanded =
              event.target instanceof Element &&
              Boolean(event.target.closest('a,button,.glass-card,input,select'));
            element.classList.toggle('expanded', expanded);
          };
          const onLeave = () => {
            element.style.visibility = 'hidden';
          };
          window.addEventListener('mousemove', onMove, { passive: true });
          document.documentElement.addEventListener('mouseleave', onLeave);
          return () => {
            window.removeEventListener('mousemove', onMove);
            document.documentElement.removeEventListener('mouseleave', onLeave);
          };
        },
      );
      return () => media.revert();
    },
    { scope: cursor },
  );
  return (
    <div
      ref={cursor}
      aria-hidden="true"
      className="custom-cursor-follower hidden md:block"
      style={{ visibility: 'hidden' }}
    />
  );
}
