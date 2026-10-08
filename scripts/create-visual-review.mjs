import { mkdir, writeFile } from 'node:fs/promises';

const sections = [
  ['Mobile hero', 'mobile-hero'],
  ['Mobile navbar', 'mobile-navbar'],
  ['Mobile open menu', 'mobile-menu'],
  ['Mobile service cards', 'mobile-services'],
  ['Mobile booking', 'mobile-booking'],
  ['Mobile methodology', 'mobile-methodology'],
  ['Mobile footer', 'mobile-footer'],
  ['Desktop hero', 'desktop-hero'],
  ['Desktop open menu', 'desktop-menu'],
  ['Desktop services', 'desktop-services'],
  ['Desktop methodology', 'desktop-methodology'],
  ['Desktop booking', 'desktop-booking'],
  ['Desktop footer', 'desktop-footer'],
];
const html = `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>PESTVIA — visual comparison</title>
<style>
*{box-sizing:border-box}body{margin:0;padding:32px;background:#070709;color:#f5f5f7;font:16px/1.6 system-ui,sans-serif}main{max-width:1500px;margin:auto}h1{font-size:clamp(24px,4vw,44px)}h2{margin-top:60px}p{max-width:950px;color:#c4c4cb}a{color:#6fbd46}.pair{display:grid;grid-template-columns:1fr 1fr;gap:20px}figure{margin:0;background:#0f1015;border:1px solid #303039;border-radius:16px;overflow:hidden}figcaption{padding:12px 16px;color:#bfc5be}img{display:block;width:100%;height:auto}.mobile{max-width:820px}.notice{border-left:3px solid #6fbd46;padding:12px 20px;background:#0f1015}@media(max-width:650px){body{padding:16px}.pair{gap:8px}figcaption{font-size:13px;padding:8px}}
</style><main>
<h1>PESTVIA visual comparison</h1>
<p>Original template on the left; completed Next.js implementation on the right. Mobile: 390 × 844. Desktop: 1440 × 900. Captured in the in-app browser. Animated frames and scroll positions are not pixel synchronized.</p>
<p class="notice">Approved changes include neutral booking/WhatsApp wording, Egyptian contact details, a governorate select and consent note, mobile contact bar, and lighter mobile effects. Template claims and numbers remain placeholders awaiting content approval. See <a href="../docs/VERIFICATION.md">verification notes</a> for limitations, including the unresolved mobile performance target.</p>
${sections
  .map(
    ([label, name]) =>
      `<section><h2>${label}</h2><div class="pair ${name.startsWith('mobile') ? 'mobile' : ''}">${[
        ['visual-baseline', 'Before — original template'],
        ['visual-after', 'After — Next.js'],
      ]
        .map(
          ([folder, caption]) =>
            `<figure><figcaption>${caption}</figcaption><a href="${folder}/${name}.jpg"><img loading="lazy" src="${folder}/${name}.jpg" alt="${label}: ${caption}"></a></figure>`,
        )
        .join('')}</div></section>`,
  )
  .join('\n')}
</main></html>`;
await mkdir(new URL('../artifacts/', import.meta.url), { recursive: true });
await writeFile(new URL('../artifacts/visual-review.html', import.meta.url), html);
console.log('Created artifacts/visual-review.html');
