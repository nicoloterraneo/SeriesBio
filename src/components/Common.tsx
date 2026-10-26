import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { useTip } from './Tooltip';

export function SectionHead({ icon, title, sub, right }: { icon: IconName; title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="section-head">
      <div>
        <h2 className="section-title">
          <span className="glyph"><Icon name={icon} /></span>
          {title}
        </h2>
        {sub && <p className="section-sub" style={{ margin: '6px 0 0 40px' }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

interface BadgeProps {
  tone: 'good' | 'warn' | 'bad' | 'neutral';
  icon?: IconName;
  children: ReactNode;
  /** Optional hover/focus explanation. Makes the badge keyboard-focusable. */
  tip?: { text: string; title?: string };
}

export function Badge({ tone, icon, children, tip }: BadgeProps) {
  const t = useTip();
  return (
    <span className={`badge ${tone}`} tabIndex={tip ? 0 : undefined} {...(tip ? t(tip.text, tip.title) : {})}>
      {icon && <Icon name={icon} size="sm" />}
      {children}
    </span>
  );
}
