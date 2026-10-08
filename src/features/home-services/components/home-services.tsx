import { Icon } from '@/shared/ui/icons';
import { serviceCards, servicesContent as content } from '../content/services.content';
import { MoveLeftIcon, MoveRightIcon } from 'lucide-react';

const iconStyles = {
  default:
    'bg-accent/10 border border-accent/20 text-accent group-hover:bg-accent group-hover:text-dark',
  featured: 'bg-accent text-dark',
  brand:
    'bg-accentBrand/10 border border-accentBrand/20 text-accent group-hover:bg-accentDeep group-hover:text-white',
};

export function HomeServices() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      data-reveal
      className="py-28 px-6 md:px-12 relative bg-darker border-t border-white/5"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-accent text-xs font-mono font-bold tracking-widest uppercase block mb-2">
              {content.eyebrow}
            </span>
            <h2
              id="services-title"
              className="text-4xl md:text-6xl font-black text-white font-display"
            >
              {content.title[0]}
              <br />
              <span className="stroke-text">{content.title[1]}</span>
            </h2>
          </div>
          <p className="text-muted max-w-md text-sm md:text-base leading-relaxed">
            {content.introduction}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceCards.map((card) => (
            <article
              key={card.id}
              className={`glass-card p-8 rounded-3xl relative overflow-hidden group transition-all duration-500 hover:-translate-y-2 ${card.variant === 'featured' ? 'border-accent/30 bg-gradient-to-b from-accent/5 to-transparent' : ''}`}
            >
              {card.badge && (
                <div className="absolute top-4 left-4 bg-accent text-dark text-xs font-black px-2.5 py-1 rounded-full font-mono">
                  {card.badge}
                </div>
              )}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 ${iconStyles[card.variant]}`}
              >
                <Icon name={card.icon} className="w-6 h-6" />
              </div>
              <span
                className={`text-xs font-mono mb-2 block ${card.variant === 'featured' ? 'text-accent' : 'text-muted'}`}
              >
                {card.id}
              </span>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-accent transition-colors">
                {card.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6">{card.description}</p>
              <ul className="text-xs text-gray-400 space-y-2 mb-6 border-t border-white/5 pt-4">
                {card.points.map((point) => (
                  <li key={point} className="flex items-center gap-2">
                    <span aria-hidden="true" className="text-accent">
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <a
                href="#booking"
                className={`text-xs font-bold flex items-center gap-2 group-hover:text-accent ${card.variant === 'featured' ? 'text-accent' : 'text-white'}`}
              >
                <span>{card.linkLabel}</span>
                <span aria-hidden="true" className="rotate-180">
                  <MoveRightIcon className="w-3 h-3" />
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
