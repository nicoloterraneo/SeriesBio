import type { StartupProfileData } from '../types';
import { MarketCircles } from '../charts/primitives';
import { money } from '../lib/format';
import { Badge, SectionHead } from './Common';
import { Icon } from './Icon';
import { sectionDomId } from './SectionNav';

export function Market({ data }: { data: StartupProfileData }) {
  const m = data.market;
  const rows = [
    { color: '#9a9cf6', key: 'TAM', val: m.tam, def: m.definitions.tam },
    { color: '#7b74ef', key: 'SAM', val: m.sam, def: m.definitions.sam },
    { color: '#4a3fcf', key: 'SOM', val: m.som, def: m.definitions.som }
  ];
  return (
    <section className="card section" id={sectionDomId('market')} aria-label="Market and competition">
      <SectionHead
        icon="target"
        title="Market & competition"
        sub="Circle areas are drawn to scale"
        right={<Badge tone="neutral" icon="trend">{m.cagr}% CAGR</Badge>}
      />
      <div className="market-grid">
        <MarketCircles tam={m.tam} sam={m.sam} som={m.som} />
        <div>
          <div className="market-legend">
            {rows.map((r) => (
              <div className="ml" key={r.key}>
                <i style={{ background: r.color }} />
                <div>
                  <b className="num">${r.val}B<span>{r.key}</span></b>
                  <p>{r.def}</p>
                </div>
              </div>
            ))}
          </div>
          <ul className="drivers">
            {m.drivers.map((t) => <li key={t}><Icon name="trend" size="sm" />{t}</li>)}
          </ul>
        </div>
      </div>

      <h3 className="subhead">Competitive landscape</h3>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr><th>Company</th><th>Stage</th><th className="r">Raised</th><th className="r">Headcount</th><th>Focus</th></tr>
          </thead>
          <tbody>
            {data.competitors.map((c) => (
              <tr key={c.name} className={c.self ? 'self' : ''}>
                <td>{c.name}</td>
                <td>{c.stage}</td>
                <td className="r num">{money(c.raised, 0)}</td>
                <td className="r num">{c.headcount}</td>
                <td>{c.focus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
