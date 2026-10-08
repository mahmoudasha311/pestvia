export const business = {
  name: 'بيستفيا',
  latinName: 'PESTVIA',
  logoAlt: 'PESTVIA — حماية بلا حدود',
  homeLabel: 'بيستفيا — الرئيسية',
  domain: 'https://pestvia.net',
  countryCode: 'EG',
  locale: 'ar_EG',
  timezone: 'Africa/Cairo',
  address: { street: 'شارع جامعة الدول', visible: true },
  hours: {
    confirmed: true,
    opens: '10:00',
    closes: '18:00',
    days: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    display: 'السبت إلى الخميس، ١٠ صباحًا – ٦ مساءً',
    closedDisplay: 'الجمعة إجازة',
  },
  areas: [
    { id: 'cairo', name: 'القاهرة', countryCode: 'EG' },
    { id: 'giza', name: 'الجيزة', countryCode: 'EG' },
  ],
} as const;

export type AreaId = (typeof business.areas)[number]['id'];
