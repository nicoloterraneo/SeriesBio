import { useEffect, useState, type RefObject } from 'react';

export const SECTIONS = [
  ['overview', 'Overview'],
  ['team', 'Team'],
  ['traction', 'Traction'],
  ['funding', 'Funding'],
  ['market', 'Market'],
  ['deck', 'Pitch deck']
] as const;

export type SectionId = (typeof SECTIONS)[number][0];

export const sectionDomId = (id: string) => `sp-${id}`;

/** Smooth-scrolls to a section inside the profile root, honouring reduced motion. */
export function scrollToSection(root: RefObject<HTMLElement>, id: string) {
  const el = root.current?.querySelector(`#${sectionDomId(id)}`);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

/** Tracks which section sits in the upper third of the viewport. */
function useScrollSpy(root: RefObject<HTMLElement>): [SectionId, (id: SectionId) => void] {
  const [current, setCurrent] = useState<SectionId>('overview');
  useEffect(() => {
    const host = root.current;
    if (!host || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setCurrent(en.target.id.replace('sp-', '') as SectionId);
        });
      },
      { rootMargin: '-25% 0px -65% 0px' }
    );
    SECTIONS.forEach(([id]) => {
      const el = host.querySelector(`#${sectionDomId(id)}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [root]);
  return [current, setCurrent];
}

export function SectionNav({ root }: { root: RefObject<HTMLElement> }) {
  const [current, setCurrent] = useScrollSpy(root);
  return (
    <nav className="tabs" aria-label="Profile sections">
      {SECTIONS.map(([id, label]) => (
        <button
          key={id}
          className="tab"
          type="button"
          aria-current={current === id}
          onClick={() => {
            scrollToSection(root, id);
            setCurrent(id);
          }}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
