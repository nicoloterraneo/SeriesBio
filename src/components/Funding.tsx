import type { StartupProfileData } from '../types';
import type { Derived } from '../lib/derive';
import { initialsOf, money, monthLabel } from '../lib/format';
import { SectionHead } from './Common';
import { sectionDomId } from './SectionNav';
import { useTip } from './Tooltip';

interface Props {
  data: StartupProfileData;
  x: Derived;
}

export function Funding({ data, x }: Props) {
  const tip = useTip();
  const last = data.rounds[data.rounds.length - 1];
  const maxAmount = Math.max(...data.rounds.map((r) => r.amount));
  const leads = data.investors.filter((i) => i.lead);
  const rest = data.investors.filter((i) => !i.lead);
  const ordered = [...leads, ...rest];
  const shown = ordered.slice(0, 6);
  const more = ordered.length - shown.length;

  const scrollToInvestors = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('sp-investors')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section className="card section" id={sectionDomId('funding')} aria-label="Funding">
      <SectionHead icon="layers" title="Funding" />

      <div className="round-card">
        <div className="round-top">
          <div>
            <div className="k">Latest round</div>
            <div className="v">{last.name}<em>·</em><span className="accent num">{money(last.amount, 0)}</span></div>
          </div>
          <div>
            <div className="k">Revenue figure</div>
            <div className="v num">{money(x.arrNow)} <span style={{ fontSize: 14, opacity: 0.7, fontWeight: 500 }}>ARR</span></div>
          </div>
          {last.postMoney != null && (
            <div>
              <div className="k">Est. post-money</div>
              <div className="v num">{money(last.postMoney, 0)}</div>
            </div>
          )}
        </div>
        <div className="round-inv">
          <span className="k">Investors ({data.investors.length})</span>
          {shown.map((i) => <span key={i.name} className={`inv-chip${i.lead ? ' lead' : ''}`}>{i.name}</span>)}
          {more > 0 && <button className="inv-chip more" type="button" onClick={scrollToInvestors}>+{more} more</button>}
        </div>
      </div>

      <div className="rounds-chart" role="list" aria-label="Amount raised by round">
        {data.rounds.map((r) => (
          <div
            key={r.date}
            className="rc-col"
            role="listitem"
            tabIndex={0}
            {...tip(`${r.name} · ${money(r.amount)} · led by ${r.lead}`, monthLabel(r.date))}
          >
            <span className="rc-val num">{money(r.amount)}</span>
            <div className="rc-bar" style={{ height: `${Math.max(4, Math.round((r.amount / maxAmount) * 100))}%` }} />
            <span className="rc-lbl">{r.name}</span>
            <span className="rc-date">{monthLabel(r.date, true)}</span>
          </div>
        ))}
      </div>

      <h3 className="subhead">Funding rounds</h3>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr><th>Date</th><th>Round</th><th className="r">Amount</th><th>Lead investor</th><th className="r">Post-money (est.)</th></tr>
          </thead>
          <tbody>
            {[...data.rounds].reverse().map((r) => (
              <tr key={r.date}>
                <td>{monthLabel(r.date)}</td>
                <td><b>{r.name}</b></td>
                <td className="r num">{money(r.amount)}</td>
                <td>{r.lead}</td>
                <td className="r num">{r.postMoney ? money(r.postMoney, 0) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="subhead" id="sp-investors">
        All investors <span className="section-sub">{leads.length} lead · {rest.length} participating</span>
      </h3>
      <div className="investors">
        {ordered.map((i) => (
          <span key={i.name} className={`investor${i.lead ? ' lead' : ''}`}>
            <i aria-hidden="true">{initialsOf(i.name)}</i>
            {i.name}
            {i.lead && <> <span className="lead-tag">Lead</span></>}
          </span>
        ))}
      </div>
    </section>
  );
}
