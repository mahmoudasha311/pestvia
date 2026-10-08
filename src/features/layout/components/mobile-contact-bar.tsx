import { contactLinks } from '@/shared/config/contact';
import { Icon } from '@/shared/ui/icons';
import { layoutContent as content } from '../content/layout.content';

export function MobileContactBar() {
  return (
    <nav
      aria-label={content.contactTitle}
      className="mobile-contact-bar fixed bottom-0 inset-x-0 z-30 glass-nav grid grid-cols-2 gap-3 px-4 pt-3 md:hidden"
    >
      <a
        href={contactLinks.phone}
        className="flex items-center justify-center gap-2 rounded-full border border-accent/40 text-accent py-3 text-sm font-bold"
      >
        <Icon name="phone" className="w-4 h-4" />
        {content.call}
      </a>
      <a
        href={contactLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-full bg-accentBrand text-dark py-3 text-sm font-bold"
      >
        <Icon name="message" className="w-4 h-4" />
        {content.whatsapp}
      </a>
    </nav>
  );
}
