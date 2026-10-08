/** Accept Egyptian mobile formats and store a single E.164 representation. */
export function normalizeEgyptianMobile(value: string): string {
  const digits = value
    .replace(/[٠-٩۰-۹]/g, (digit) => {
      const code = digit.charCodeAt(0);
      return String(code >= 0x06f0 ? code - 0x06f0 : code - 0x0660);
    })
    .replace(/[\s()\-]/g, '');
  if (!/^(?:01[0125]\d{8}|\+201[0125]\d{8})$/.test(digits))
    throw new Error('INVALID_EGYPTIAN_MOBILE');
  return digits.startsWith('+20') ? digits : `+20${digits.slice(1)}`;
}

export function localEgyptianMobile(value: string): string {
  return `0${normalizeEgyptianMobile(value).slice(3)}`;
}
