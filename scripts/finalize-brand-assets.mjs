import { copyFile, readFile, writeFile } from 'node:fs/promises';
// These exact drafts were approved by the owner; no visual modifications here.
const draft = 'artifacts/brand-review';
for (const [source, target] of [
  ['opengraph-image.png', 'opengraph-image.png'],
  ['icon-32.png', 'icon.png'],
  ['icon-180.png', 'apple-icon.png'],
  ['icon-192.png', 'icon1.png'],
  ['icon-512.png', 'icon2.png'],
])
  await copyFile(`${draft}/${source}`, `src/app/${target}`);
const frames = await Promise.all([32, 48].map((size) => readFile(`${draft}/icon-${size}.png`)));
const header = Buffer.alloc(6 + frames.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach((frame, index) => {
  const start = 6 + index * 16;
  header[start] = [32, 48][index];
  header[start + 1] = [32, 48][index];
  header.writeUInt16LE(1, start + 4);
  header.writeUInt16LE(32, start + 6);
  header.writeUInt32LE(frame.length, start + 8);
  header.writeUInt32LE(offset, start + 12);
  offset += frame.length;
});
await writeFile('src/app/favicon.ico', Buffer.concat([header, ...frames]));
await writeFile('src/app/opengraph-image.alt.txt', 'PESTVIA — بيستفيا');
console.log('Approved metadata assets installed.');
