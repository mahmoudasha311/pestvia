// import { business } from '@/shared/config/business';

// export const layoutContent = {
//   menuLabel: 'القائمة',
//   toggleMenu: 'تبديل القائمة',
//   navigationLabel: 'التنقل الرئيسي',
//   menuTitle: '[ فهرس التنقل والتوجيه ]',
//   platform: `${business.latinName} PLATFORM © 2026`,
//   whatsapp: 'تواصل عبر واتساب',
//   call: 'اتصل بنا',
//   addressTitle: 'العنوان',
//   contactTitle: 'التواصل المباشر',
//   hoursTitle: 'مواعيد العمل',
//   coverageTitle: 'نطاق الخدمة',
//   footerNavTitle: 'التنقل السريع',
//   supportLabel: 'التواصل والاستفسارات:',
//   privacy: 'سياسة الخصوصية',
//   terms: 'الشروط والأحكام',
//   copyright: `© 2026 ${business.latinName}. جميع الحقوق محفوظة.`,
//   // TODO(content): unverified claim — global standard, biological/environmentally friendly solutions and advanced digital technology.
//   footerDescription:
//     'المعيار العالمي لحماية المساحات والمنشآت من الآفات عبر الحلول الحيوية الصديقة للبيئة والتقنيات الرقمية المتقدمة لعام 2026.',
//   links: [
//     { href: '/#hero', label: 'الرئيسية', curtain: '٠١ / الرئيسية', english: 'HOME' },
//     {
//       href: '/#services',
//       label: 'خدماتنا',
//       curtain: '٠٢ / بروتوكولات الحماية',
//       english: 'SERVICES',
//     },
//     {
//       href: '/#methodology',
//       label: 'البروتوكول',
//       curtain: '٠٣ / هندسة الوقاية',
//       english: 'TECH SPECS',
//     },
//     {
//       href: '/#booking',
//       label: 'طلب معاينة',
//       curtain: '٠٤ / الاستشارة والاتصال',
//       english: 'CONTACT',
//     },
//   ],
// };

import { business } from '@/shared/config/business';

export const layoutContent = {
  menuLabel: 'القائمة',
  toggleMenu: 'فتح وإغلاق القائمة',
  navigationLabel: 'القائمة الرئيسية',
  menuTitle: 'استكشف Pestvia',
  platform: `${business.latinName.toUpperCase()} © 2026`,

  whatsapp: 'تواصل عبر واتساب',
  call: 'اتصل بنا',

  addressTitle: 'موقعنا',
  contactTitle: 'تواصل معنا',
  hoursTitle: 'مواعيد العمل',
  coverageTitle: 'مناطق الخدمة',
  footerNavTitle: 'روابط سريعة',
  supportLabel: 'للحجز والاستفسارات:',

  privacy: 'سياسة الخصوصية',
  terms: 'الشروط والأحكام',
  copyright: `© 2026 ${business.latinName}. جميع الحقوق محفوظة.`,

  footerDescription:
    'Pestvia — جيل جديد من الحماية. نقدم حلولًا متخصصة لمكافحة الحشرات والقوارض والزواحف في المنازل والمنشآت، تبدأ بفهم طبيعة الإصابة وتمتد إلى المعالجة والوقاية للحد من تكرارها.',

  links: [
    {
      href: '/',
      label: 'الرئيسية',
      curtain: '٠١ / الرئيسية',
      english: 'HOME',
    },
    {
      href: '/services',
      label: 'خدماتنا',
      curtain: '٠٢ / خدماتنا',
      english: 'SERVICES',
    },
    {
      href: '/about',
      label: 'عن Pestvia',
      curtain: '٠٣ / عن Pestvia',
      english: 'ABOUT US',
    },
    {
      href: '/pests',
      label: 'دليل الآفات',
      curtain: '٠٤ / دليل الآفات',
      english: 'PEST GUIDE',
    },
    {
      href: '/contact',
      label: 'تواصل معنا',
      curtain: '٠٥ / تواصل معنا',
      english: 'CONTACT',
    },
  ],
};
