const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2025-09' → 'Sep 2025' (or "Sep ’25" when short). */
export function monthLabel(ym: string, short = false): string {
  const [y, m] = ym.split('-');
  return MONTHS[+m - 1] + (short ? ` ’${y.slice(2)}` : ` ${y}`);
}

/** '2026-10-22' → 'Oct 22, 2026' */
export function dayLabel(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${MONTHS[+m - 1]} ${parseInt(d, 10)}, ${y}`;
}

/** USD millions → '$14.8M' / '$850K' / '$1.2B'. */
export function money(m: number, decimals = 1): string {
  if (m >= 1000) return `$${(m / 1000).toFixed(1)}B`;
  if (m < 1) return `$${Math.round(m * 1000)}K`;
  return `$${m.toFixed(decimals)}M`;
}

export function pct(n: number, signed = false): string {
  return `${signed && n > 0 ? '+' : ''}${Math.round(n)}%`;
}

export function initialsOf(name: string): string {
  return name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}
