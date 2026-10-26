import type { StartupProfileData } from '../types';
import type { Derived } from '../lib/derive';
import { money } from '../lib/format';
import { Ring } from '../charts/primitives';
import { Badge } from './Common';
import { Icon } from './Icon';
import { InfoButton } from './Tooltip';

interface Props {
  data: StartupProfileData;
  x: Derived;
  watched: boolean;
  onToggleWatch: () => void;
  onShare: () => void;
  onOnePager: () => void;
}

export function Hero({ data, x, watched, onToggleWatch, onShare, onOnePager }: Props) {
  const c = data.company;
  const delta = x.growthDelta;
  const components = data.growthScore.components.map(([n, w]) => `${n} ${w}%`).join(' · ');

  return (
    <section className="card hero" aria-labelledby="sp-co-name">
      <div>
        <div className="hero-id">
          <div className="logo" aria-hidden="true">{c.initials}</div>
          <div style={{ minWidth: 0 }}>
            <h1 id="sp-co-name">{c.name}</h1>
            <p className="tagline">{c.tagline}</p>
            <div className="meta">
              <span><Icon name="pin" size="sm" />{c.hq}</span>
              <span><Icon name="calendar" size="sm" />Founded {c.founded}</span>
              <span><Icon name="users" size="sm" />{c.employees} employees</span>
              <span>
                <Icon name="globe" size="sm" />
                <a href={`https://${c.website}`} rel="noopener noreferrer" target="_blank">{c.website}</a>
              </span>
            </div>
            <div className="tags">
              {c.tags.map((t, i) => (
                <span key={t} className={`chip${i === 0 ? ' brand' : ''}`}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-actions">
          <button className="btn" type="button" aria-pressed={watched} onClick={onToggleWatch}>
            <Icon name="star" />
            <span>{watched ? 'On watchlist' : 'Add to watchlist'}</span>
          </button>
          <button className="btn" type="button" onClick={onShare}><Icon name="share" />Share</button>
          <button className="btn" type="button" onClick={onOnePager}><Icon name="download" />One-pager</button>
        </div>
      </div>

      <div className="hero-stats">
        <div className="stat-block">
          <div className="stat-label">
            Total funding
            <InfoButton label="Total funding" text="Sum of all disclosed equity rounds. Valuations are estimates from reported post-money figures." />
          </div>
          <div className="stat-value num">{money(x.totalRaised)}</div>
          <div className="stat-sub">
            <span>{data.rounds.length} rounds</span>
            {c.secondaryMarket === 'open' && (
              <Badge
                tone="neutral"
                icon="repeat"
                tip={{ title: 'Secondary market', text: 'Existing holders can list shares for sale through approved secondary transactions.' }}
              >
                Secondary market open
              </Badge>
            )}
          </div>
        </div>
        <div className="stat-block">
          <div className="stat-label">
            Growth Score
            <InfoButton label="Growth Score" text={`Momentum index (0–100) refreshed quarterly. Weights: ${components}.`} />
          </div>
          <div className="growth-row">
            <Ring score={x.growthScore} />
            <div className="stat-value num">{x.growthScore}</div>
          </div>
          <div className="stat-sub">
            <Badge tone={delta < 0 ? 'bad' : 'good'} icon={delta < 0 ? 'down' : 'up'}>{Math.abs(delta)} pts</Badge>
            <span>in past quarter</span>
          </div>
        </div>
      </div>
    </section>
  );
}
