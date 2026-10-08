import type { HeroStat } from '../types';

export const heroContent = {
  // TODO(content): unverified claim — next-generation biological protection and AI/nano capabilities.

  badge: 'حلول متخصصة لمكافحة الحشرات',
  technology: 'PEST CONTROL',

  // TODO(content): unverified claim — superior protection without chemical traces.
  headline: ['جيل جديد  ', 'من الحماية'],
  // TODO(content): unverified claim — organic frequency barriers, replacement of pesticides and 100% sustainable safety.
  description:
    'نقدم حلولًا متخصصة لمكافحة الحشرات في المنازل والمنشآت، تبدأ بفهم أسباب انتشارها، وتمتد إلى المعالجة الدقيقة والوقاية للحد من عودتها.',
  bookingLabel: 'طلب معاينة',
  methodologyLabel: 'استكشف بروتوكول العمل',
  scrollLabel: 'انتقل للاستكشاف',
};

// TODO(content): replace placeholder stats — zero emissions, 3,850+ properties, 100% guarantee and 24/7 monitoring are unverified.
export const heroStats = [
  { label: 'بدون رائحة' },
  { label: 'معالجة متخصصة' },
  { label: 'حلول للمنازل والمنشآت' },
  { label: 'إرشادات وقائية' },
] as const;
