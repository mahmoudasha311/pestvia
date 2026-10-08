'use client';

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

// Registration is isolated from server execution and shared by all animation islands.
if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP);

let scrollPlugin: Promise<void> | undefined;
/** Keep below-fold scroll machinery out of the critical animation bundle. */
export function loadScrollTrigger(): Promise<void> {
  return (scrollPlugin ??= import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
    gsap.registerPlugin(ScrollTrigger);
  }));
}
export { gsap, useGSAP };
