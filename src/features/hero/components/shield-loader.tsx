'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Shield = dynamic(() => import('./shield').then((module) => module.Shield), { ssr: false });

export function ShieldLoader() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(
      '(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const cancel = () => {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) clearTimeout(timer);
    };
    const schedule = () => {
      cancel();
      if (!media.matches) {
        setReady(false);
        return;
      }
      if ('requestIdleCallback' in window)
        idle = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      else timer = setTimeout(() => setReady(true), 300);
    };
    schedule();
    media.addEventListener('change', schedule);
    return () => {
      cancel();
      media.removeEventListener('change', schedule);
    };
  }, []);
  return ready ? <Shield /> : null;
}
