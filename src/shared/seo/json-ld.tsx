import { business } from '@/shared/config/business';
import { contact } from '@/shared/config/contact';
import { seo } from '@/shared/config/seo';

export function StructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': `${business.domain}/#organization`,
        name: business.name,
        alternateName: business.latinName,
        url: business.domain,
        logo: `${business.domain}/brand/pestvia-logo.png`,
        telephone: contact.phone.international,
        sameAs: contact.socials.map((social) => social.url),
        ...(contact.email.enabled ? { email: contact.email.address } : {}),
        address: {
          '@type': 'PostalAddress',
          streetAddress: business.address.street,
          addressCountry: business.countryCode,
        },
        areaServed: business.areas.map((area) => ({
          '@type': 'AdministrativeArea',
          name: area.name,
          containedInPlace: { '@type': 'Country', name: area.countryCode },
        })),
        ...(business.hours.confirmed
          ? {
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: business.hours.days.map((day) => `https://schema.org/${day}`),
                opens: business.hours.opens,
                closes: business.hours.closes,
              },
            }
          : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${business.domain}/#website`,
        url: business.domain,
        name: seo.siteName,
        inLanguage: 'ar-EG',
        publisher: { '@id': `${business.domain}/#organization` },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
