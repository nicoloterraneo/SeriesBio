import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';

interface TipState {
  text: string;
  title?: string;
  rect: DOMRect;
}

type TipHandlers = {
  onPointerEnter: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
  onFocus: (e: React.FocusEvent<HTMLElement>) => void;
  onBlur: () => void;
};

const TipContext = createContext<(text: string, title?: string) => TipHandlers>(() => ({
  onPointerEnter: () => {},
  onPointerLeave: () => {},
  onFocus: () => {},
  onBlur: () => {}
}));

/** Returns a function that spreads hover/focus handlers onto any element: `<b {...tip('text', 'Title')} />`. */
export const useTip = () => useContext(TipContext);

/** One shared floating tooltip for the whole profile. */
export function TooltipProvider({ children }: { children: ReactNode }) {
  const [tip, setTip] = useState<TipState | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  const hide = useCallback(() => setTip(null), []);
  const make = useCallback(
    (text: string, title?: string): TipHandlers => {
      const show = (el: HTMLElement) => setTip({ text, title, rect: el.getBoundingClientRect() });
      return {
        onPointerEnter: (e) => show(e.currentTarget),
        onPointerLeave: hide,
        onFocus: (e) => show(e.currentTarget),
        onBlur: hide
      };
    },
    [hide]
  );

  // Position after render so the tooltip's own size is known; clamp to the viewport.
  useLayoutEffect(() => {
    if (!tip || !ref.current) return;
    const t = ref.current.getBoundingClientRect();
    const r = tip.rect;
    const left = Math.max(8, Math.min(window.innerWidth - t.width - 8, r.left + r.width / 2 - t.width / 2));
    let top = r.top - t.height - 10;
    if (top < 8) top = r.bottom + 10;
    setPos({ left, top });
  }, [tip]);

  useLayoutEffect(() => {
    if (!tip) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hide();
    window.addEventListener('scroll', hide, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', hide);
      document.removeEventListener('keydown', onKey);
    };
  }, [tip, hide]);

  return (
    <TipContext.Provider value={make}>
      {children}
      <div ref={ref} className="sp-tip" role="tooltip" style={{ left: pos.left, top: pos.top, opacity: tip ? 1 : 0 }}>
        {tip?.title && <b>{tip.title}</b>}
        {tip?.text}
      </div>
    </TipContext.Provider>
  );
}

/** The little (i) button used next to labels. */
export function InfoButton({ label, text }: { label: string; text: string }) {
  const tip = useTip();
  return (
    <button className="info" type="button" aria-label={`About ${label}`} {...tip(text, label)}>
      <Icon name="info" size="sm" />
    </button>
  );
}
