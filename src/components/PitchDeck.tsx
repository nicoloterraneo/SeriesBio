import { useRef, useState } from 'react';
import type { StartupProfileData } from '../types';
import { monthLabel } from '../lib/format';
import { SectionHead } from './Common';
import { Icon } from './Icon';
import { sectionDomId } from './SectionNav';

const Wave = () => (
  <svg className="wave" viewBox="0 0 800 220" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 220V150C80 120 120 190 200 170C300 145 340 60 440 90C540 120 560 70 650 40C720 18 760 10 800 0V220Z" fill="rgba(10,10,70,.28)" />
  </svg>
);

interface Props {
  data: StartupProfileData;
  onOpenDeck: () => void;
}

export function PitchDeck({ data, onOpenDeck }: Props) {
  const { slides } = data.deck;
  const [cur, setCur] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const go = (n: number) => setCur((n + slides.length) % slides.length);
  const brand = (
    <div className="brand"><i aria-hidden="true">{data.company.initials}</i>{data.company.name}</div>
  );

  return (
    <section className="card section" id={sectionDomId('deck')} aria-label="Pitch deck">
      <SectionHead icon="deck" title="Pitch deck" sub={`Updated ${monthLabel(data.deck.updated)}`} />
      <div
        ref={frame}
        className="deck-frame"
        tabIndex={0}
        aria-label="Pitch deck viewer. Use left and right arrow keys to change slide."
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
        }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className={`slide${s.kind === 'title' ? ' title' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${i + 1} of ${slides.length}`}
            data-active={i === cur ? '' : undefined}
            aria-hidden={i === cur ? undefined : true}
          >
            <Wave />
            {s.kind === 'title' && <div className="dots" aria-hidden="true" />}
            {brand}
            {s.kind === 'title' ? (
              <h4>{s.title}</h4>
            ) : (
              <div className="stack">
                <div className="eyebrow">{s.eyebrow}</div>
                <h4>{s.title}</h4>
                {s.kind === 'text' && <p className="body">{s.body}</p>}
                {s.kind === 'stats' && (
                  <div className="stats">
                    {s.stats.map(([v, l]) => (
                      <div key={l}><b className="num">{v}</b><span>{l}</span></div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <button
          className="icon-btn"
          type="button"
          aria-label="Full screen"
          onClick={() => frame.current?.requestFullscreen?.()}
          style={{ position: 'absolute', right: 14, bottom: 14, zIndex: 3, background: 'rgba(255,255,255,.14)', borderColor: 'rgba(255,255,255,.3)', color: '#fff' }}
        >
          <Icon name="maximize" />
        </button>
      </div>

      <div className="deck-ctrl">
        <div className="deck-dots">
          {slides.map((_, i) => (
            <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} aria-current={i === cur} onClick={() => go(i)} />
          ))}
        </div>
        <div className="deck-btns">
          <span className="num">{cur + 1} / {slides.length}</span>
          <button className="icon-btn" type="button" aria-label="Previous slide" onClick={() => go(cur - 1)}><Icon name="left" /></button>
          <button className="icon-btn" type="button" aria-label="Next slide" onClick={() => go(cur + 1)}><Icon name="right" /></button>
          <button className="btn" type="button" onClick={onOpenDeck}><Icon name="external" size="sm" />Open full deck</button>
        </div>
      </div>
    </section>
  );
}
