export const contact = {
  phone: { local: '01131203245', international: '+201131203245' },
  whatsapp: {
    number: '201131203245',
    message: 'مرحبًا بيستفيا، أريد الاستفسار عن خدمة مكافحة الآفات وحجز معاينة.',
  },
  email: { address: 'info@pestvia.net', enabled: false },
  socials: [
    { name: 'Facebook', url: 'https://facebook.com/pestvia' },
    { name: 'Instagram', url: 'https://instagram.com/pestvia' },
  ],
} as const;

export const contactLinks = {
  phone: `tel:${contact.phone.international}`,
  whatsapp: `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(contact.whatsapp.message)}`,
};
