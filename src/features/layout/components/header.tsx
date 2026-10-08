import { business } from '@/shared/config/business';
import { contact, contactLinks } from '@/shared/config/contact';
import { BrandLogo } from '@/shared/ui/brand-logo';
import { Icon } from '@/shared/ui/icons';
import { layoutContent as content } from '../content/layout.content';
import { NavigationController } from './navigation-controller';

export function Header() {
  return (
    <NavigationController
      logo={<BrandLogo />}
      action={
        <div className="flex items-center justify-self-end gap-2">
          <a
            href={contactLinks.phone}
            aria-label={content.call}
            className="hidden lg:flex p-2 text-accent rounded-full hover:bg-white/5"
          >
            <Icon name="phone" className="w-4 h-4" />
            <span className="sr-only">{contact.phone.local}</span>
          </a>
          <a
            href={contactLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center px-3 sm:px-5 md:px-7 py-2.5 rounded-full overflow-hidden whitespace-nowrap text-xs md:text-sm font-bold text-dark bg-accentBrand transition-all duration-300 hover:bg-accentDeep hover:text-white hover:shadow-glow hover:scale-105 group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>{content.whatsapp}</span>
              <Icon
                name="arrow"
                className="hidden sm:block w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform"
              />
            </span>
          </a>
        </div>
      }
    >
      {/* Navigation */}
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center pt-16 pb-8 border-b border-white/10 gap-4">
        <span className="text-xs uppercase tracking-widest text-accent font-mono font-bold">
          {content.menuTitle}
        </span>
        <span className="text-xs text-muted font-mono">{content.platform}</span>
      </div>
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 py-10 my-auto items-center">
        <nav aria-label={content.navigationLabel} className="lg:col-span-8 flex flex-col gap-4">
          {content.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="curtain-link text-4xl md:text-7xl font-black text-white hover:text-accent transition-colors duration-300 flex items-center justify-between group"
            >
              <span>{link.curtain}</span>
              <span className="text-base text-muted font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                {link.english}
              </span>
            </a>
          ))}
        </nav>
        <div className="lg:col-span-4 flex flex-col gap-8 lg:border-r lg:border-white/10 lg:pr-12 text-muted">
          {business.address.visible && (
            <div>
              <h2 className="text-sm font-bold tracking-wider mb-2 font-mono text-accent">
                {content.addressTitle}
              </h2>
              <p className="text-sm leading-relaxed text-gray-300">{business.address.street}</p>
            </div>
          )}
          <div>
            <h2 className="text-sm font-bold tracking-wider mb-2 font-mono text-accent">
              {content.contactTitle}
            </h2>
            <a href={contactLinks.phone} className="block text-2xl font-black text-white font-mono">
              <bdi dir="ltr">{contact.phone.local}</bdi>
            </a>
            <a
              href={contactLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-accent text-sm font-bold mt-3"
            >
              {content.whatsapp}
            </a>
          </div>
          {business.hours.confirmed && (
            <div>
              <h2 className="text-sm font-bold tracking-wider mb-2 font-mono text-accent">
                {content.hoursTitle}
              </h2>
              <p className="text-sm">{business.hours.display}</p>
              <p className="text-xs mt-1">{business.hours.closedDisplay}</p>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-6xl mx-auto w-full pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between text-xs text-muted gap-4">
        <span>{content.copyright}</span>
        <span className="text-accent">{business.areas.map((area) => area.name).join(' / ')}</span>
      </div>
    </NavigationController>
  );
}
