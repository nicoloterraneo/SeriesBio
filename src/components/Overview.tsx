import type { ReactNode } from 'react';
import type { StartupProfileData } from '../types';
import { BADGE, BENCH, rate, type BenchKey, type Derived } from '../lib/derive';
import { money, pct } from '../lib/format';
import { Badge, SectionHead } from './Common';
import { Icon } from './Icon';
import { InfoButton } from './Tooltip';
import { sectionDomId } from './SectionNav';

interface Kpi {
  label: string;
  value: string;
  unit?: string;
  foot?: string;
  tip: string;
  hero?: boolean;
  bench?: BenchKey;
  raw?: number;
}

function KpiCard({ k }: { k: Kpi }) {
  const b = k.bench != null && k.raw != null ? BADGE[rate(k.bench, k.raw)] : null;
  return (
    <div className={`kpi${k.hero ? ' hero-kpi' : ''}`}>
      <div className="kpi-top">
        <span>{k.label}</span>
        <InfoButton label={k.label} text={k.tip} />
      </div>
      <div className="kpi-val num">
        {k.value}
        {k.unit && <small>{k.unit}</small>}
      </div>
      <div className="kpi-foot">
        <span className="num">{k.foot}</span>
        {b && k.bench && (
          <Badge tone={b.tone} icon={b.icon} tip={{ title: 'Benchmark', text: BENCH[k.bench].text }}>
            {b.label}
          </Badge>
        )}
      </div>
    </div>
  );
}

interface Props {
  data: StartupProfileData;
  x: Derived;
  onOpenMethod: () => void;
}

export function Overview({ data, x, onOpenMethod }: Props) {
  const c = data.company;
  const f = data.financials;
  const accel = (x.netNew3 / x.netNewPrev3 - 1) * 100;

  const groups: [string, Kpi[]][] = [
    [
      'Growth',
      [
        { label: 'ARR', value: money(x.arrNow), foot: `+${money(x.netNew3)} last 3 mo`, hero: true, tip: 'Annual recurring revenue: month-end recurring subscription revenue × 12, excluding one-off fees.' },
        { label: 'ARR growth', value: pct(x.growth, true), unit: 'YoY', raw: x.growth, bench: 'growth', foot: `vs ${money(x.arrYearAgo)} a year ago`, tip: 'Year-on-year change in ARR. The single most-watched growth number at this stage.' },
        { label: 'Net new ARR', value: money(x.netNew3), unit: '3 mo', foot: `${pct(accel, true)} vs prior 3 mo`, tip: 'New + expansion − churned ARR over the last 3 months. Shows whether growth is accelerating in absolute dollars.' },
        { label: 'Customers', value: f.customers.toLocaleString('en-US'), foot: 'paying accounts', tip: 'Paying customer accounts at month end.' }
      ]
    ],
    [
      'Retention & margin',
      [
        { label: 'Net retention', value: pct(f.nrrPct), raw: f.nrrPct, bench: 'nrr', foot: 'trailing 12 mo', tip: 'Net revenue retention: revenue today from customers who were customers 12 months ago, including upsell, downgrades and churn. Above 100% means the base grows by itself.' },
        { label: 'Gross retention', value: pct(f.grrPct), raw: f.grrPct, bench: 'grr', foot: 'trailing 12 mo', tip: 'Gross revenue retention: like NRR but excluding upsell; capped at 100%. A cleaner read on churn and downgrade.' },
        { label: 'Gross margin', value: pct(f.grossMarginPct), raw: f.grossMarginPct, bench: 'gm', foot: 'subscription + services', tip: '(Revenue − cost of revenue) ÷ revenue. Hosting, support and payment costs count as cost of revenue.' },
        { label: 'Avg. contract value', value: `$${(x.acv / 1000).toFixed(1)}K`, unit: '/ yr', foot: 'ARR ÷ customers', tip: 'Average annual revenue per customer. Low ACV with fast growth usually means a product-led or self-serve motion.' }
      ]
    ],
    [
      'Efficiency & runway',
      [
        { label: 'Burn multiple', value: `${x.burnMultiple.toFixed(1)}x`, raw: x.burnMultiple, bench: 'burn', foot: `$${x.burnMultiple.toFixed(1)} per $1 new ARR`, tip: 'Net burn ÷ net new ARR over the same 3 months. Lower is better: how much cash it costs to add a dollar of recurring revenue.' },
        { label: 'Rule of 40', value: String(Math.round(x.rule40)), raw: x.rule40, bench: 'rule40', foot: 'growth % + FCF margin %', tip: 'ARR growth % plus free-cash-flow margin %. Here ARR stands in for revenue and burn for negative FCF.' },
        { label: 'CAC payback', value: String(f.cacPaybackMonths), unit: 'months', raw: f.cacPaybackMonths, bench: 'payback', foot: 'gross-margin adjusted', tip: 'Months of gross profit from a new customer needed to repay the cost of acquiring them.' },
        { label: 'Runway', value: String(Math.round(x.runway)), unit: 'months', raw: x.runway, bench: 'runway', foot: `${money(f.cash)} cash`, tip: 'Cash on hand ÷ average monthly net burn over the last 3 months.' }
      ]
    ]
  ];

  const facts: [string, ReactNode][] = [
    ['Stage', c.stage],
    ['Founded', c.founded],
    ['Headquarters', c.hq],
    ['Employees', c.employees],
    ['Model', c.businessModel]
  ];

  return (
    <section className="card section" id={sectionDomId('overview')} aria-label="Overview">
      <SectionHead icon="overview" title="Overview" />
      <p className="about">{c.description}</p>
      <dl className="facts">
        {facts.map(([k, v]) => (
          <div className="fact" key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h2 className="section-title" style={{ fontSize: 17 }}>Key metrics</h2>
        <button className="btn ghost" type="button" onClick={onOpenMethod} style={{ height: 30, fontSize: 13 }}>
          <Icon name="info" size="sm" />How benchmarks work
        </button>
      </div>
      <div style={{ marginTop: 14 }}>
        {groups.map(([title, kpis]) => (
          <div className="kpi-group" key={title}>
            <h3 className="eyebrow">{title}</h3>
            <div className="kpi-grid">
              {kpis.map((k) => <KpiCard key={k.label} k={k} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
