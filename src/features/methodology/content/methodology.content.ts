// interface MethodologyStep {
//   title: string;
//   description: string;
// }

// export const methodologyContent = {
//   eyebrow: '// بروتوكول بيستفيا الرباعي',
//   title: 'كيف نقضي على الآفات علمياً؟',
//   // TODO(content): unverified claim — microbiology-based process guarantees pests never return.
//   description:
//     'عملية ممنهجة مبنية على علم الأحياء الدقيقة وسلوكيات المستعمرات لضمان عدم عودتها نهائياً.',
// };

// export const methodologySteps: readonly MethodologyStep[] = [
//   // TODO(content): unverified claim — thermal/frequency scanning locates concealed breeding sites.
//   {
//     title: 'المسح الطيفي',
//     description:
//       'فحص المنشأة بأجهزة كشف حرارية وترددية لتحديد البؤر الخفية وأعشاش التكاثر خلف الجدران.',
//   },
//   // TODO(content): unverified claim — genetic containment and targeted pheromones inhibit reproduction and isolate colonies.
//   {
//     title: 'التطويق الجيني',
//     description:
//       'استخدام فرمونات بيولوجية مستهدفة تثبط جهاز التكاثر وتعزل مجتمع الحشرات عن مصادر الغذاء.',
//   },
//   // TODO(content): unverified claim — nano treatment sterilizes and eliminates all associated bacteria and residue.
//   {
//     title: 'التطهير النانوي',
//     description:
//       'معالجة ميكرونية شاملة تعقم وتزيل أي بقايا أو بكتيريا ميكروبية مصاحبة للآفات السابقة.',
//   },
//   // TODO(content): unverified claim — cloud-connected sensors notify support of new pest approaches.
//   {
//     title: 'الدرع المستمر',
//     description:
//       'تثبيت أجهزة مراقبة ذكية تدعم الاتصال السحابي لإشعار فريق الدعم عند رصد أي اقتراب جديد.',
//   },
// ];

interface MethodologyStep {
  title: string;
  description: string;
}

export const methodologyContent = {
  eyebrow: '// منهجية العمل',
  title: 'من التشخيص إلى الوقاية.',
  description:
    'نتبع خطوات واضحة تبدأ بفهم طبيعة الإصابة، وتمر باختيار المعالجة المناسبة، وصولًا إلى إرشادات تساعد على الحد من تكرار المشكلة.',
};

export const methodologySteps: readonly MethodologyStep[] = [
  {
    title: 'الفحص والتقييم',
    description: 'نحدد نوع الإصابة ومصادرها، ونقيّم طبيعة المكان والعوامل المساعدة على انتشارها.',
  },
  {
    title: 'تحديد خطة المكافحة',
    description:
      'نختار أساليب المعالجة المناسبة وفقًا لنوع الحشرات ودرجة الإصابة واحتياجات المكان.',
  },
  {
    title: 'تنفيذ المعالجة',
    description: 'ننفذ إجراءات المكافحة بعناية، مع الالتزام بتعليمات الاستخدام والسلامة.',
  },
  {
    title: 'الوقاية والمتابعة',
    description: 'نقدم إرشادات وقائية، ونحدد الحاجة إلى زيارات متابعة حسب طبيعة الإصابة والخدمة.',
  },
];
