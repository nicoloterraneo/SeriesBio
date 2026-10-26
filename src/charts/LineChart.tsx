import { useCallback, useEffect, useRef, useState } from 'react';

export interface LinePoint {
  label: string;
  value: number;
}

interface Props {
  data: LinePoint[];
  fmt: (v: number) => string;
  axisFmt: (v: number) => string;
  annotations?: { index: number; label: string }[];
  ariaLabel: string;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

function niceStep(raw: number) {
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

/** Area/line chart with hover, touch and keyboard (←/→) inspection. Re-lays out on resize. */
export function LineChart({ data, fmt, axisFmt, annotations = [], ariaLabel }: Props) {
  const [host, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const lastIdx = data.length - 1;

  const W = Math.max(width, 280);
  const H = W < 520 ? 220 : 280;
  const m = { l: 46, r: 18, t: 20, b: 30 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const max = Math.max(...data.map((d) => d.value));
  const step = niceStep((max * 1.08) / 4);
  const top = Math.ceil((max * 1.08) / step) * step;
  const X = (i: number) => m.l + (i * iw) / lastIdx;
  const Y = (v: number) => m.t + ih - (v / top) * ih;

  const idxFrom = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * W;
      return Math.max(0, Math.min(lastIdx, Math.round(((x - m.l) / iw) * lastIdx)));
    },
    [W, iw, lastIdx, m.l]
  );

  const ticks: number[] = [];
  for (let v = 0; v <= top + 1e-9; v += step) ticks.push(v);
  const every = W < 520 ? 4 : 3;
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${r1(X(i))} ${r1(Y(d.value))}`).join(' ');
  const area = `${line} L${X(lastIdx)} ${Y(0)} L${X(0)} ${Y(0)} Z`;

  const a = active;
  const cur = a != null ? data[a] : null;
  const prev = a != null && a > 0 ? data[a - 1] : null;
  const mom = cur && prev ? (cur.value / prev.value - 1) * 100 : null;
  const tipX = a != null ? Math.max(70, Math.min(W - 70, X(a))) : 0;

  return (
    <div ref={host} className="chart-wrap">
      {width > 0 && (
        <>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            height={H}
            tabIndex={0}
            role="img"
            aria-label={`${ariaLabel}. Use left and right arrow keys to inspect each point.`}
            onPointerMove={(e) => setActive(idxFrom(e))}
            onPointerDown={(e) => setActive(idxFrom(e))}
            onPointerLeave={() => setActive(null)}
            onBlur={() => setActive(null)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') { e.preventDefault(); setActive(Math.max(0, (a ?? lastIdx) - 1)); }
              if (e.key === 'ArrowRight') { e.preventDefault(); setActive(Math.min(lastIdx, (a ?? lastIdx) + 1)); }
              if (e.key === 'Escape') setActive(null);
            }}
          >
            {ticks.map((v) => (
              <g key={v}>
                <line x1={m.l} x2={W - m.r} y1={Y(v)} y2={Y(v)} stroke="var(--border)" strokeDasharray={v ? '3 5' : undefined} />
                <text x={m.l - 10} y={Y(v) + 4} textAnchor="end" className="num">{axisFmt(v)}</text>
              </g>
            ))}
            {data.map((d, i) =>
              i % every === lastIdx % every ? (
                <text key={i} x={X(i)} y={H - 8} textAnchor="middle">{d.label}</text>
              ) : null
            )}
            {annotations.map((an) => {
              const x = X(an.index), right = x > W - 150;
              return (
                <g key={an.index}>
                  <line x1={x} x2={x} y1={m.t - 4} y2={Y(0)} stroke="var(--brand-400)" strokeDasharray="4 4" />
                  <text x={x + (right ? -6 : 6)} y={m.t + 6} textAnchor={right ? 'end' : 'start'} style={{ fill: 'var(--brand-700)', fontWeight: 600 }}>
                    {an.label}
                  </text>
                </g>
              );
            })}
            <path d={area} fill="url(#sp-grad-area)" />
            <path d={line} fill="none" stroke="url(#sp-grad-line)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {a != null && (
              <g>
                <line x1={X(a)} x2={X(a)} y1={m.t} y2={Y(0)} stroke="var(--brand-500)" strokeWidth="1" />
                <circle cx={X(a)} cy={Y(data[a].value)} r="6" fill="#6d5ff0" stroke="var(--surface)" strokeWidth="2.5" />
              </g>
            )}
            {(a == null || a === lastIdx) && (
              <circle cx={X(lastIdx)} cy={Y(data[lastIdx].value)} r="5" fill="#6d5ff0" stroke="var(--surface)" strokeWidth="2.5" />
            )}
          </svg>
          <div className="chart-tip" role="status" style={{ opacity: cur ? 1 : 0, left: tipX, top: a != null ? Y(data[a].value) - 14 : 0 }}>
            {cur && (
              <>
                <span>{cur.label}</span>
                <b className="num">{fmt(cur.value)}</b>
                {mom != null && <span className="num">{mom >= 0 ? '+' : ''}{r1(mom)}% vs prior month</span>}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
