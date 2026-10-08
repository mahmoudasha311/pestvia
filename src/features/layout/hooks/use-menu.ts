'use client';

import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { gsap, useGSAP } from '@/shared/lib/gsap';

/** Keeps focus and scroll ownership local, including interrupted curtain transitions. */
export function useMenu() {
  const [phase, setPhase] = useState<'closed' | 'open' | 'closing'>('closed');
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pendingAnchor = useRef<string | null>(null);
  const visible = phase !== 'closed';

  useGSAP(
    () => {
      if (!panel.current || phase === 'closed') return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (phase === 'open') {
        gsap.fromTo(
          panel.current,
          { yPercent: -100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: reduced ? 0 : 0.6,
            ease: 'power4.out',
          },
        );
        gsap.fromTo(
          panel.current.querySelectorAll('.curtain-link'),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: reduced ? 0 : 0.5,
            stagger: reduced ? 0 : 0.08,
            delay: reduced ? 0 : 0.2,
            ease: 'power3.out',
          },
        );
      } else {
        gsap.to(panel.current, {
          yPercent: -100,
          opacity: 0,
          duration: reduced ? 0 : 0.5,
          ease: 'power4.in',
          onComplete: () => setPhase('closed'),
        });
      }
    },
    { scope: panel, dependencies: [phase], revertOnUpdate: true },
  );

  useEffect(() => {
    if (!visible || !panel.current) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollY = window.scrollY;
    const bodyStyle = document.body.getAttribute('style');
    const site = document.getElementById('site-content');
    const wasInert = site?.inert ?? false;
    if (site) site.inert = true;
    // Fixed-body locking prevents touch scrolling, but Chromium composites desktop
    // WebGL content above backdrop blur in that mode. Keep the template's desktop lock.
    if (window.matchMedia('(max-width: 767px), (pointer: coarse)').matches) {
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    }
    document.body.style.overflow = 'hidden';
    const focusables = () =>
      [
        trigger.current,
        ...Array.from(
          panel.current?.querySelectorAll<HTMLElement>(
            'a[href],button:not([disabled]),[tabindex="0"]',
          ) ?? [],
        ),
      ].filter((el): el is HTMLElement => Boolean(el));
    const frame = requestAnimationFrame(() => focusables()[1]?.focus({ preventScroll: true }));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setPhase('closing');
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      if (event.target !== trigger.current && !panel.current?.contains(event.target))
        focusables()[1]?.focus({ preventScroll: true });
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocus);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocus);
      if (site) site.inert = wasInert;
      if (bodyStyle === null) document.body.removeAttribute('style');
      else document.body.setAttribute('style', bodyStyle);
      window.scrollTo({ top: scrollY, behavior: 'instant' });
      previousFocus?.focus({ preventScroll: true });
      const anchor = pendingAnchor.current;
      pendingAnchor.current = null;
      if (anchor) {
        history.pushState(null, '', anchor);
        document.getElementById(anchor.slice(1))?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'instant'
            : 'smooth',
        });
      }
    };
  }, [visible]);

  const onLinkClick = (event: MouseEvent<HTMLDivElement>) => {
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin === location.origin && url.pathname === location.pathname && url.hash) {
      event.preventDefault();
      pendingAnchor.current = url.hash;
    }
    setPhase('closing');
  };

  return {
    panel,
    trigger,
    phase,
    visible,
    onLinkClick,
    toggle: () => setPhase(phase === 'open' ? 'closing' : 'open'),
  };
}
