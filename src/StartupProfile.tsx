'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { ProfileAction, StartupProfileData } from './types';
import { derive } from './lib/derive';
import { ChartDefs } from './charts/primitives';
import { Hero } from './components/Hero';
import { SectionNav } from './components/SectionNav';
import { Overview } from './components/Overview';
import { Team } from './components/Team';
import { Traction } from './components/Traction';
import { Funding } from './components/Funding';
import { Market } from './components/Market';
import { PitchDeck } from './components/PitchDeck';
import { ScorePanel } from './components/ScorePanel';
import { IntroDialog, MethodDialog } from './components/Dialogs';
import { TooltipProvider } from './components/Tooltip';
import './styles/profile.css';

export interface StartupProfileProps {
  data: StartupProfileData;
  /** Light is the default. */
  theme?: 'light' | 'dark';
  /**
   * Controlled watchlist state. Omit it and the component keeps its own state
   * (starting at `defaultWatched`); pass it and update it from `onAction`.
   */
  watched?: boolean;
  defaultWatched?: boolean;
  /** Every user action is reported here; the component never calls a backend itself. */
  onAction?: (action: ProfileAction) => void;
  /**
   * Height in px of your app's fixed top bar. The section tabs and score column
   * stick below it. Use 0 if you have none.
   */
  stickyOffset?: number;
  /** Rendered above the page (e.g. your app bar). Place it inside so it shares the theme tokens. */
  topBar?: ReactNode;
  className?: string;
}

export function StartupProfile({
  data,
  theme = 'light',
  watched,
  defaultWatched = false,
  onAction,
  stickyOffset = 56,
  topBar,
  className
}: StartupProfileProps) {
  const root = useRef<HTMLDivElement>(null);
  const x = useMemo(() => derive(data), [data]);

  const [watchedState, setWatchedState] = useState(defaultWatched);
  const isWatched = watched ?? watchedState;
  const [methodOpen, setMethodOpen] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const emit = useCallback((a: ProfileAction) => onAction?.(a), [onAction]);

  const toggleWatch = () => {
    const next = !isWatched;
    if (watched === undefined) setWatchedState(next);
    setToast(next ? 'Added to your watchlist' : 'Removed from watchlist');
    emit({ type: next ? 'watch' : 'unwatch' });
  };

  const share = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => setToast('Link copied'), () => setToast('Copy not available'));
    } else {
      setToast('Copy not available');
    }
    emit({ type: 'share', url });
  };

  return (
    <div
      ref={root}
      className={`sp${className ? ' ' + className : ''}`}
      data-theme={theme}
      style={{ '--nav-h': `${stickyOffset}px` } as CSSProperties}
    >
      <TooltipProvider>
        <ChartDefs />
        {topBar}
        <div className="page">
          <Hero
            data={data}
            x={x}
            watched={isWatched}
            onToggleWatch={toggleWatch}
            onShare={share}
            onOnePager={() => { emit({ type: 'download-onepager' }); setToast('One-pager requested'); }}
          />
          <div className="layout">
            <main className="main">
              <SectionNav root={root} />
              <Overview data={data} x={x} onOpenMethod={() => setMethodOpen(true)} />
              <Team data={data} />
              <Traction data={data} />
              <Funding data={data} x={x} />
              <Market data={data} />
              <PitchDeck data={data} onOpenDeck={() => emit({ type: 'open-deck' })} />
              <p className="foot">
                {data.meta.sample ? 'Sample data for design review. ' : ''}Figures as of {data.meta.asOf}.
              </p>
            </main>
            <ScorePanel data={data} x={x} onOpenMethod={() => setMethodOpen(true)} onRequestIntro={() => setIntroOpen(true)} />
          </div>
        </div>

        <MethodDialog open={methodOpen} onClose={() => setMethodOpen(false)} data={data} x={x} />
        <IntroDialog
          open={introOpen}
          onClose={() => setIntroOpen(false)}
          company={data.company.name}
          onSend={(message) => { emit({ type: 'request-intro', message }); setToast('Introduction request sent'); }}
        />
        <div className={`toast${toast ? ' show' : ''}`} role="status">{toast}</div>
      </TooltipProvider>
    </div>
  );
}
