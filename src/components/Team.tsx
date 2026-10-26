import type { StartupProfileData } from '../types';
import { Badge, SectionHead } from './Common';
import { Icon } from './Icon';
import { sectionDomId } from './SectionNav';

export function Team({ data }: { data: StartupProfileData }) {
  return (
    <section className="card section" id={sectionDomId('team')} aria-label="Founding team">
      <SectionHead icon="award" title="Founding team" sub={`${data.founders.length} founders`} />
      <div className="founders">
        {data.founders.map((p) => (
          <article className="founder" key={p.name}>
            <div className="founder-head">
              <div className="avatar" aria-hidden="true">{p.initials}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3>{p.name}</h3>
                <div className="role">{p.role}</div>
              </div>
              <a className="icon-btn" href={p.linkedin} aria-label={`${p.name} on LinkedIn`} style={{ textDecoration: 'none' }}>
                <Icon name="linkedin" />
              </a>
            </div>
            <p className="bio">{p.bio}</p>
            <div className="signals">
              {p.signals.map((s) => <Badge key={s} tone="neutral" icon="check">{s}</Badge>)}
            </div>
            <div className="mini-label"><Icon name="briefcase" size="sm" />Previously worked at</div>
            {p.previously.map((s) => <div className="pill-row" key={s}>{s}</div>)}
            <div className="mini-label"><Icon name="cap" size="sm" />Education</div>
            {p.education.map((s) => <div className="pill-row edu" key={s}>{s}</div>)}
          </article>
        ))}
      </div>
      <h3 className="subhead" style={{ marginBottom: 0 }}>Leadership team</h3>
      <div className="leadership">
        {data.leadership.map((l) => (
          <div className="leader" key={l.name}>
            <b>{l.name}</b>
            <div className="role">{l.role}</div>
            <p>{l.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
