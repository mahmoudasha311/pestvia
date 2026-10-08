import { legalPages } from '../content/legal.content';
export function LegalPage({ page }: { page: keyof typeof legalPages }) {
  const content = legalPages[page];
  return (
    <article className="min-h-[70svh] max-w-4xl mx-auto px-6 pt-40 pb-24">
      <h1 className="text-4xl font-display font-black mb-8">{content.title}</h1>
      <p className="text-muted text-lg">{content.body}</p>
    </article>
  );
}
