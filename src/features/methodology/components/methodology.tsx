import { methodologyContent as content, methodologySteps } from '../content/methodology.content';

export function Methodology() {
  return (
    <section
      id="methodology"
      aria-labelledby="methodology-title"
      data-reveal
      className="py-28 px-6 md:px-12 relative bg-dark"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-accent text-xs font-mono font-bold tracking-widest uppercase">
            {content.eyebrow}
          </span>
          <h2
            id="methodology-title"
            className="text-4xl md:text-5xl font-black text-white mt-2 mb-4 font-display"
          >
            {content.title}
          </h2>
          <p className="text-muted text-sm md:text-base">{content.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {methodologySteps.map((step, index) => (
            <article key={step.title} className="glass-card p-6 rounded-2xl relative">
              <span
                aria-hidden="true"
                className="text-4xl font-black text-white/10 font-mono absolute top-4 right-4"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div
                aria-hidden="true"
                className="w-3 h-3 rounded-full bg-accent mb-6 shadow-glow  ms-auto "
              />
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
