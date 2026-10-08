// import type { ServiceCardContent } from '../types';

// export const servicesContent = {
//   eyebrow: '// التخصصات والخدمات الميدانية',
//   title: ['بروتوكولات متخصصة', 'لكافة التهديدات'],
//   // TODO(content): unverified claim — protection without odors or disruption to daily activity.
//   introduction:
//     'منشآت الضيافة الفاخرة، المستودعات الغذائية الكبرى، والفلل السكنية تتطلب حماية دون روائح كيميائية أو تعطيل للنشاط اليومي.',
// };

// export const serviceCards: readonly ServiceCardContent[] = [
//   {
//     id: 'PROTO-01',
//     title: 'تطويق القوارض الذكي',
//     icon: 'shield',
//     variant: 'default',
//     // TODO(content): unverified claim — infrared traps, encoded biological bait, reproductive interruption, no environmental contamination or dangerous residue.
//     description:
//       'مصائد استشعار بالأشعة تحت الحمراء مع طعوم بيولوجية مشفرة تقطع دورات التكاثر دون تلوث بيئي أو بقايا خطرة.',
//     // TODO(content): unverified claim — structural-path blocking and weekly thermal reporting.
//     points: ['حجب المسارات الإنشائية المعقدة', 'تقارير حرارية رقمية أسبوعية'],
//     linkLabel: 'طلب تفاصيل البروتوكول',
//   },
//   {
//     id: 'PROTO-02',
//     title: 'الإبادة الميكرونية الزاحفة',
//     icon: 'flask',
//     variant: 'featured',
//     // TODO(content): unverified claim — this service is the most requested.
//     badge: 'الأكثر طلباً',
//     // TODO(content): unverified claim — nano spray, child/pet safety, penetration and immediate elimination of cockroaches and bedbugs.
//     description:
//       'توزيع رذاذ نانوي ميكروني آمن على الأطفال والحيوانات، يخترق أدق الشقوق ويقضي على الصراصير وحشرات الفراش فوراً.',
//     // TODO(content): unverified claim — no odor and no need to vacate the home.
//     points: ['بدون رائحة أو الحاجة لمغادرة المنزل'],
//     linkLabel: 'طلب تفاصيل المعالجة',
//   },
//   {
//     id: 'PROTO-03',
//     title: 'العزل البيولوجي للمنشآت',
//     icon: 'globe',
//     variant: 'brand',
//     // TODO(content): unverified claim — biological protective perimeter for factories, warehouses and restaurants.
//     description: 'إنشاء محيط واقٍ متكامل للمصانع، المستودعات، والمطاعم الراقية.',
//     // TODO(content): unverified claim — high-efficiency perimeter and periodic sensor monitoring.
//     points: ['حزام حماية خارجي عالي الكفاءة', 'متابعة تقنية دورية عبر الحساسات'],
//     linkLabel: 'حلول المنشآت والشركات',
//   },
// ];

import type { ServiceCardContent } from '../types';

export const servicesContent = {
  eyebrow: '// خدماتنا',
  title: ['حلول متخصصة', 'لكل مساحة'],
  introduction:
    'من المنازل إلى المنشآت التجارية، نقدم حلولًا مدروسة لمكافحة الحشرات والقوارض، تراعي طبيعة المكان ونوع الإصابة، مع الاهتمام بالمعالجة والوقاية.',
};

export const serviceCards: readonly ServiceCardContent[] = [
  {
    id: '01',
    title: 'مكافحة الحشرات',
    icon: 'shield',
    variant: 'default',
    description:
      'حلول متخصصة للتعامل مع الحشرات الزاحفة والطائرة، من الصراصير وبق الفراش إلى النمل والناموس، وفقًا لطبيعة كل إصابة.',
    points: ['تحديد مصادر الإصابة', 'معالجات مناسبة لكل حالة'],
    linkLabel: 'اطلب الخدمة',
  },
  {
    id: '02',
    title: 'مكافحة القوارض',
    icon: 'flask',
    variant: 'featured',
    description:
      'برامج لمكافحة الفئران والجرذان، تبدأ بتحديد أماكن نشاطها ومسارات دخولها، ثم اختيار وسائل المكافحة والوقاية المناسبة.',
    points: ['تحديد نقاط الدخول', 'الحد من تكرار الإصابة'],
    linkLabel: 'اطلب الخدمة',
  },
  {
    id: '03',
    title: 'مكافحة الزواحف',
    icon: 'globe',
    variant: 'brand',
    description:
      'حلول للتعامل مع الزواحف غير المرغوب فيها، مع التركيز على تحديد أماكن وجودها والعوامل التي تساعد على دخولها إلى المكان.',
    points: ['تقييم مصادر الخطر', 'إرشادات وقائية للمكان'],
    linkLabel: 'اطلب الخدمة',
  },
];
