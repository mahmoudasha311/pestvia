'use client';

import type { ReactNode } from 'react';
import { useMenu } from '../hooks/use-menu';
import { layoutContent } from '../content/layout.content';

export function NavigationController({
  logo,
  action,
  children,
}: {
  logo: ReactNode;
  action: ReactNode;
  children: ReactNode;
}) {
  const { trigger, panel, toggle, phase, visible, onLinkClick } = useMenu();
  return (
    <>
      <header className="fixed top-4 md:top-6 inset-x-0 mx-auto w-[92%] max-w-6xl z-50">
        <nav
          aria-label={layoutContent.navigationLabel}
          className="glass-nav rounded-full px-3 py-3 sm:px-5 md:px-8 md:py-3.5 grid grid-cols-[auto_minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2 items-center shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <button
              ref={trigger}
              onClick={toggle}
              type="button"
              aria-label={layoutContent.toggleMenu}
              aria-expanded={phase === 'open'}
              aria-controls="curtain-menu"
              className="group flex items-center gap-3 py-2 px-2 sm:px-3 rounded-full hover:bg-white/5 transition-colors"
            >
              <span
                aria-hidden="true"
                className={`w-6 h-5 flex flex-col justify-between items-center relative overflow-hidden ${phase === 'open' ? 'menu-open' : ''}`}
              >
                <span className="bar-1 w-6 h-[2px] bg-white rounded-full transition-transform duration-300 ease-out origin-center" />
                <span className="bar-middle w-4 h-[2px] bg-accent self-end rounded-full transition-all duration-300 ease-out" />
                <span className="bar-2 w-6 h-[2px] bg-white rounded-full transition-transform duration-300 ease-out origin-center" />
              </span>
              <span className="text-sm font-semibold tracking-wide text-white group-hover:text-accent transition-colors hidden sm:inline-block">
                {layoutContent.menuLabel}
              </span>
            </button>
          </div>
          {logo}
          {action}
        </nav>
      </header>
      <div
        ref={panel}
        id="curtain-menu"
        role="dialog"
        aria-modal={visible || undefined}
        aria-label={layoutContent.menuLabel}
        hidden={!visible}
        onClick={onLinkClick}
        className={`menu-curtain fixed inset-0 z-40 flex-col justify-between p-8 md:p-16 lg:p-24 overflow-y-auto ${visible ? 'flex' : 'hidden'}`}
      >
        {children}
      </div>
    </>
  );
}
