import { useRef, useState } from 'react';
import type { PillarKey, StartupProfileData } from '../types';
import { scoreBand, type Derived } from '../lib/derive';
import { dayLabel } from '../lib/format';
import { Gauge, Radar } from '../charts/primitives';
import { Icon } from './Icon';

interface Props {
  data: StartupProfileData;
  x: Derived;
  onOpenMethod: () => void;
  onRequestIntro: () => void;
}

/** Right-hand column: radar, pillar gauges, AI review, call to action. */
export function ScorePanel({ data, x, onOpenMethod, onRequestIntro }: Props) {
  const ev = data.evaluation;
  const [open, setOpen] = useState<Partial<Record<PillarKey, boolean>>>({});
  const refs = useRef<Partial<Record<PillarKey, HTMLButtonElement | null>>>({});

  const setPillar = (k: PillarKey, value?: boolean) => {
    setOpen((o) => ({ ...o, [k]: value ?? !o[k] }));
    // Wait for the expanded layout before scrolling it into view.
    requestAnimationFrame(() => refs.current[k]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
  };

  return (
    <aside className="aside" aria-label="AI evaluation">
      <section className="card score-card">
        <div className="score-head">
          <h2><Icon name="sparkles" />Overall score</h2>
          <button className="link-btn" type="button" onClick={onOpenMethod}>How it’s scored<Icon name="info" size="sm" /></button>
        </div>
        <div className="radar">
          <Radar items={ev.pillars} overall={x.overall} onSelect={(k) => setPillar(k, true)} />
        </div>
        <div className="score-meta">
          <span>Confidence: <b style={{ color: 'var(--ink)' }}>{ev.confidence}</b> · {ev.sources} sources</span>
          <span>Updated {dayLabel(ev.updated)}</span>
        </div>
      </section>

      <div className="pillars">
        {ev.pillars.map((p) => (
          <button
            key={p.key}
            ref={(el) => { refs.current[p.key] = el; }}
            className="pillar"
            type="button"
            aria-expanded={!!open[p.key]}
            onClick={() => setPillar(p.key)}
          >
            <div className="pillar-title">{p.name}</div>
            <div className="pillar-gauge">
              <Gauge score={p.score} />
              <div className="g num">{p.score}<small>%</small></div>
            </div>
            <div className="pillar-foot"><span>{scoreBand(p.score)}</span><span>Weight {x.weights[p.key]}%</span></div>
            <div className="pillar-more">
              <p>{p.blurb}</p>
              <ul>{p.evidence.map((e) => <li key={e}>{e}</li>)}</ul>
            </div>
          </button>
        ))}
      </div>

      <section className="card review">
        <h2><span className="glyph"><Icon name="sparkles" size="sm" /></span>AI review</h2>
        <p className="summary">{ev.summary}</p>
        <h3 className="good"><Icon name="check" size="sm" />What stands out</h3>
        <ul>{ev.strengths.map((s) => <li key={s}>{s}</li>)}</ul>
        <h3 className="warn"><Icon name="alert" size="sm" />Watch-outs</h3>
        <ul>{ev.risks.map((s) => <li key={s}>{s}</li>)}</ul>
        <p className="disclaimer">Generated from public filings, company-provided data and third-party signals. Informational only — not investment advice.</p>
      </section>

      <div className="cta-wrap">
        <button className="btn primary lg" type="button" onClick={onRequestIntro}>Request introduction</button>
      </div>
    </aside>
  );
}
