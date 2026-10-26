import type { PillarWeights, StartupProfileData } from '../types';

/*
 * Benchmarks are directional ranges synthesised from public SaaS benchmark
 * write-ups (KeyBanc/OpenView-style surveys, investor guides). They differ by
 * source, ARR band and year — treat them as defaults to tune, not ground truth.
 */
export type BenchKey = 'growth' | 'nrr' | 'grr' | 'gm' | 'burn' | 'rule40' | 'payback' | 'runway';
export type Rating = 'strong' | 'ok' | 'watch';

interface Bench {
  dir: 'high' | 'low';
  strong: number;
  ok: number;
  text: string;
}

export const BENCH: Record<BenchKey, Bench> = {
  growth: { dir: 'high', strong: 100, ok: 50, text: 'Top tier ≥100% · On par 50–99% · Below par <50% (at ~$10–20M ARR)' },
  nrr: { dir: 'high', strong: 120, ok: 105, text: 'Top tier ≥120% · On par 105–119% · Below par <105%' },
  grr: { dir: 'high', strong: 90, ok: 85, text: 'Top tier ≥90% · On par 85–89% · Below par <85%' },
  gm: { dir: 'high', strong: 75, ok: 65, text: 'Top tier ≥75% · On par 65–74% · Below par <65%' },
  burn: { dir: 'low', strong: 1.5, ok: 2.5, text: 'Top tier ≤1.5x · On par 1.5–2.5x · Below par >2.5x' },
  rule40: { dir: 'high', strong: 40, ok: 25, text: 'Top tier ≥40 · On par 25–39 · Below par <25' },
  payback: { dir: 'low', strong: 12, ok: 18, text: 'Top tier ≤12 mo · On par 13–18 mo · Below par >18 mo' },
  runway: { dir: 'high', strong: 24, ok: 12, text: 'Top tier ≥24 mo · On par 12–23 mo · Below par <12 mo' }
};

export function rate(key: BenchKey, v: number): Rating {
  const b = BENCH[key];
  if (b.dir === 'high') return v >= b.strong ? 'strong' : v >= b.ok ? 'ok' : 'watch';
  return v <= b.strong ? 'strong' : v <= b.ok ? 'ok' : 'watch';
}

export const BADGE: Record<Rating, { tone: 'good' | 'neutral' | 'warn'; icon: 'check' | 'minus' | 'alert'; label: string }> = {
  strong: { tone: 'good', icon: 'check', label: 'Top tier' },
  ok: { tone: 'neutral', icon: 'minus', label: 'On par' },
  watch: { tone: 'warn', icon: 'alert', label: 'Below par' }
};

export function scoreBand(s: number): string {
  return s >= 85 ? 'Excellent' : s >= 70 ? 'Strong' : s >= 50 ? 'Moderate' : 'Weak';
}

export interface Derived {
  arrNow: number;
  arrYearAgo: number;
  growth: number;
  netNew3: number;
  netNewPrev3: number;
  burnMultiple: number;
  runway: number;
  rule40: number;
  acv: number;
  totalRaised: number;
  overall: number;
  weights: PillarWeights;
  growthScore: number;
  growthDelta: number;
}

/** Everything computed from raw inputs. Needs ≥13 monthly ARR points. */
export function derive(d: StartupProfileData): Derived {
  const f = d.financials;
  const arr = f.arr;
  const n = arr.length;
  const now = arr[n - 1][1];
  const yearAgo = arr[n - 13][1];
  const netNew3 = now - arr[n - 4][1];
  const netNewPrev3 = arr[n - 4][1] - arr[n - 7][1];
  const burnPerMonth = f.netBurnLast3m / 3;
  const growth = (now / yearAgo - 1) * 100;
  // Annualised burn ÷ ARR, with ARR standing in for revenue.
  const fcfMargin = -((f.netBurnLast3m * 4) / now) * 100;
  const ev = d.evaluation;
  const w = ev.weights[ev.stage];
  const overall = Math.round(ev.pillars.reduce((s, p) => s + (p.score * w[p.key]) / 100, 0));
  const gh = d.growthScore.history;
  return {
    arrNow: now,
    arrYearAgo: yearAgo,
    growth,
    netNew3,
    netNewPrev3,
    burnMultiple: f.netBurnLast3m / netNew3,
    runway: f.cash / burnPerMonth,
    rule40: growth + fcfMargin,
    acv: (now * 1e6) / f.customers,
    totalRaised: d.rounds.reduce((s, r) => s + r.amount, 0),
    overall,
    weights: w,
    growthScore: gh[gh.length - 1][1],
    growthDelta: gh[gh.length - 1][1] - gh[gh.length - 2][1]
  };
}
