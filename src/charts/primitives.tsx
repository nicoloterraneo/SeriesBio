import type { PillarKey } from '../types';

const TAU = Math.PI * 2;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** Gradient defs shared by every chart. Render once inside the profile root. */
export function ChartDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sp-grad-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset=".6" stopColor="#7b6af2" />
          <stop offset="1" stopColor="#a07df7" />
        </linearGradient>
        <linearGradient id="sp-grad-gauge-v" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7f8bff" />
          <stop offset="1" stopColor="#b48cff" />
        </linearGradient>
        <linearGradient id="sp-grad-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6d5ff0" stopOpacity=".28" />
          <stop offset="1" stopColor="#6d5ff0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sp-grad-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f46e5" stopOpacity=".30" />
          <stop offset="1" stopColor="#a07df7" stopOpacity=".30" />
        </linearGradient>
        <linearGradient id="sp-grad-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#9b7bf5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ radar */
export interface RadarItem {
  key: PillarKey;
  name: string;
  lines: [string, string];
  score: number;
}

export function Radar({ items, overall, onSelect }: { items: RadarItem[]; overall: number; onSelect: (k: PillarKey) => void }) {
  const W = 460, H = 392, cx = W / 2, cy = 198, R = 124, n = items.length;
  const ang = (i: number) => -Math.PI / 2 + (i * TAU) / n;
  const pt = (i: number, r: number): [number, number] => [cx + Math.cos(ang(i)) * r, cy + Math.sin(ang(i)) * r];
  const poly = (r: number) => items.map((_, i) => pt(i, r).join(',')).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Score profile across five pillars, overall ${overall} out of 100`}>
      {[0.25, 0.5, 0.75, 1].map((k) => (
        <polygon
          key={k}
          points={poly(R * k)}
          fill={k === 1 ? 'var(--surface)' : 'none'}
          fillOpacity=".6"
          stroke="var(--border-strong)"
          strokeWidth="1"
          strokeDasharray={k < 1 ? '2 4' : undefined}
        />
      ))}
      {items.map((_, i) => {
        const p = pt(i, R);
        return <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="var(--border)" />;
      })}
      <polygon
        points={items.map((it, i) => pt(i, (R * it.score) / 100).join(',')).join(' ')}
        fill="url(#sp-grad-fill)"
        stroke="url(#sp-grad-stroke)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {items.map((it, i) => {
        const p = pt(i, (R * it.score) / 100);
        return <circle key={it.key} cx={p[0]} cy={p[1]} r="5" fill="#fff" stroke="#5b4fe6" strokeWidth="2.5" />;
      })}
      <text className="big" x={cx} y={cy + 10} textAnchor="middle">{overall}</text>
      <text className="of" x={cx} y={cy + 32} textAnchor="middle">/ 100</text>
      {items.map((it, i) => {
        const a = ang(i), c = Math.cos(a), s = Math.sin(a);
        const p = pt(i, R + 18);
        const anchor = Math.abs(c) < 0.25 ? 'middle' : c > 0 ? 'start' : 'end';
        const lh = 14;
        // Top label sits above its point, bottom labels below, side labels centred on it.
        const y0 = s < -0.5 ? p[1] - lh * (it.lines.length + 1) + 8 : s > 0.5 ? p[1] + 10 : p[1] - lh * (it.lines.length / 2) + 2;
        return (
          <g
            key={it.key}
            className="radar-hit"
            tabIndex={0}
            role="button"
            aria-label={`${it.name} ${it.score} out of 100`}
            onClick={() => onSelect(it.key)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(it.key);
              }
            }}
          >
            {it.lines.map((ln, k) => (
              <text key={k} className="lbl" x={p[0]} y={y0 + k * lh + 11} textAnchor={anchor}>{ln}</text>
            ))}
            <text className="val" x={p[0]} y={y0 + it.lines.length * lh + 11} textAnchor={anchor}>{it.score}%</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ gauge */
export function Gauge({ score }: { score: number }) {
  const cx = 56, cy = 54, r = 41, a0 = 135, sweep = 270;
  const P = (deg: number): [number, number] => {
    const d = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(d), cy + r * Math.sin(d)];
  };
  const arc = (d1: number, d2: number) => {
    const s = P(d1), e = P(d2), large = d2 - d1 > 180 ? 1 : 0;
    return `M${r1(s[0])} ${r1(s[1])} A${r} ${r} 0 ${large} 1 ${r1(e[0])} ${r1(e[1])}`;
  };
  const end = a0 + (sweep * Math.max(score, 1)) / 100;
  return (
    <svg viewBox="0 0 112 100" width="112" height="100" aria-hidden="true">
      <path className="gauge-track" d={arc(a0, a0 + sweep)} fill="none" strokeWidth="9" strokeLinecap="round" />
      <path d={arc(a0, end)} fill="none" stroke="url(#sp-grad-gauge-v)" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------- ring */
export function Ring({ score }: { score: number }) {
  const r = 14, c = 2 * Math.PI * r, d = (c * score) / 100;
  return (
    <svg className="ring" viewBox="0 0 34 34" aria-hidden="true">
      <circle cx="17" cy="17" r={r} fill="none" stroke="var(--brand-100)" strokeWidth="4" />
      <circle cx="17" cy="17" r={r} fill="none" stroke="url(#sp-grad-stroke)" strokeWidth="4" strokeLinecap="round"
        strokeDasharray={`${r1(d)} ${r1(c)}`} transform="rotate(-90 17 17)" />
    </svg>
  );
}

/* -------------------------------------------------------------- sparkline */
export function Sparkline({ values, w = 120, h = 36 }: { values: number[]; w?: number; h?: number }) {
  const min = Math.min(...values), max = Math.max(...values), pad = 4, last = values.length - 1;
  const x = (i: number) => pad + (i * (w - pad * 2)) / last;
  const y = (v: number) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${r1(x(i))} ${r1(y(v))}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
      <path d={`${d} L${r1(x(last))} ${h} L${x(0)} ${h} Z`} fill="url(#sp-grad-area)" />
      <path d={d} fill="none" stroke="url(#sp-grad-line)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={r1(x(last))} cy={r1(y(values[last]))} r="3.5" fill="#6d5ff0" stroke="var(--surface)" strokeWidth="2" />
    </svg>
  );
}

/* ----------------------------------------------------------- market circles */
export function MarketCircles({ tam, sam, som }: { tam: number; sam: number; som: number }) {
  const R = 92, base = 188, cx = 100;
  const circle = (v: number, fill: string, op: number) => {
    const rr = R * Math.sqrt(v / tam);
    return <circle cx={cx} cy={base - rr} r={r1(rr)} fill={fill} fillOpacity={op} stroke={fill} strokeOpacity=".5" />;
  };
  return (
    <svg viewBox="0 0 200 192" width="200" height="192" role="img" aria-label="Nested circles: TAM, SAM and SOM, drawn to area scale">
      {circle(tam, '#c0c4fb', 0.38)}
      {circle(sam, '#7b74ef', 0.5)}
      {circle(som, '#4a3fcf', 1)}
    </svg>
  );
}
