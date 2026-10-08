import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

// Mechanical layout/format conversion only: reuse the supplied logo without redrawing it.
const destination = 'artifacts/brand-review';
await mkdir(destination, { recursive: true });
const logo = await sharp('public/brand/pestvia-logo.png').trim().png().toBuffer();
const centered = await sharp(logo)
  .resize({ width: 850, height: 340, fit: 'inside' })
  .png()
  .toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#070709' } })
  .composite([{ input: centered, gravity: 'centre' }])
  .png()
  .toFile(`${destination}/opengraph-image.png`);
for (const size of [32, 48, 180, 192, 512]) {
  const inset = await sharp(logo)
    .resize({ width: Math.round(size * 0.88), height: Math.round(size * 0.8), fit: 'inside' })
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#070709' } })
    .composite([{ input: inset, gravity: 'centre' }])
    .png()
    .toFile(`${destination}/icon-${size}.png`);
}
// A small deterministic noise tile replaces animated SVG turbulence on low-power contexts.
let seed = 18731;
const pixels = Buffer.alloc(128 * 128 * 3);
for (let index = 0; index < pixels.length; index += 3) {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  const value = seed >>> 24;
  pixels[index] = value;
  pixels[index + 1] = value;
  pixels[index + 2] = value;
}
await sharp(pixels, { raw: { width: 128, height: 128, channels: 3 } })
  .greyscale()
  .png({ palette: true, colours: 32, dither: 0, compressionLevel: 9 })
  .toFile('public/brand/grain.png');
await writeFile(
  `${destination}/README.md`,
  'Drafts for owner approval. OG is 1200×630. Icons preserve the complete supplied logo; fine text will be small at favicon size. These files are not wired into live metadata until approved.\n',
);
console.log('Created draft brand previews and mobile grain tile.');
