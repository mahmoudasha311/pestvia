import { business } from '@/shared/config/business';
import { contact, contactLinks } from '@/shared/config/contact';
import { legalConfig } from '@/shared/config/legal';
import { BrandLogo } from '@/shared/ui/brand-logo';
import { layoutContent as content } from '../content/layout.content';

export function Footer() {
  return (
    <footer className="bg-darker text-white pt-16 pb-12 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="md:col-span-5">
            <BrandLogo footer />
            <p className="text-xs text-muted leading-relaxed max-w-sm">
              {content.footerDescription}
            </p>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-xs font-mono text-accent mb-4 tracking-wider">
              {content.footerNavTitle}
            </h2>
            <ul className="text-xs text-muted space-y-2.5">
              {content.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <h2 className="text-xs font-mono text-accent mb-4 tracking-wider">
              {content.coverageTitle}
            </h2>
            <ul className="text-xs text-muted space-y-2.5">
              {business.areas.map((area) => (
                <li key={area.id}>{area.name}</li>
              ))}
            </ul>
            {business.address.visible && (
              <p className="text-xs text-muted mt-5">{business.address.street}</p>
            )}
          </div>
          <div className="md:col-span-3">
            <h2 className="text-xs font-mono text-accent mb-4 tracking-wider">
              {content.contactTitle}
            </h2>
            <p className="text-xs text-muted mb-2">{content.supportLabel}</p>
            <a href={contactLinks.phone} className="block text-lg font-mono font-bold mb-2">
              <bdi dir="ltr">{contact.phone.local}</bdi>
            </a>
            <a
              href={contactLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent"
            >
              {content.whatsapp}
            </a>
            {contact.email.enabled && (
              <a href={`mailto:${contact.email.address}`} className="block text-sm mt-2" dir="ltr">
                {contact.email.address}
              </a>
            )}
            {business.hours.confirmed && (
              <p className="text-xs text-muted mt-4 leading-relaxed">
                {business.hours.display}
                <br />
                {business.hours.closedDisplay}
              </p>
            )}
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-muted gap-4">
          <p>{content.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs">
            {legalConfig.linksEnabled && (
              <>
                <a href="/privacy" className="hover:text-accent">
                  {content.privacy}
                </a>
                <a href="/terms" className="hover:text-accent">
                  {content.terms}
                </a>
              </>
            )}
            {contact.socials.map((social) => (
              <a
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
