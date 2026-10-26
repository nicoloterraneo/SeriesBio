/**
 * The data contract for <StartupProfile />.
 * Return JSON in this shape from your API. Only raw inputs live here; derived
 * KPIs (burn multiple, runway, Rule of 40, ACV, overall score…) are computed in
 * lib/derive.ts so they cannot drift from the inputs.
 */

/** 'YYYY-MM' */
export type YearMonth = string;
export type PillarKey = 'founder' | 'market' | 'strategic' | 'traction' | 'execution';
export type Stage = 'pre-seed' | 'seed' | 'series-a' | 'series-b';
export type PillarWeights = Record<PillarKey, number>;

export interface Company {
  name: string;
  initials: string;
  tagline: string;
  description: string;
  website: string;
  founded: number;
  hq: string;
  stage: string;
  employees: number;
  businessModel: string;
  tags: string[];
  secondaryMarket?: 'open' | 'closed';
}

export interface Financials {
  /** Month-end ARR in USD millions, oldest → newest. Needs ≥ 13 points (24 recommended). */
  arr: [YearMonth, number][];
  /** Total net cash burn over the trailing 3 months, USD millions. */
  netBurnLast3m: number;
  /** Cash on hand, USD millions. */
  cash: number;
  grossMarginPct: number;
  /** Trailing-12-month net revenue retention. */
  nrrPct: number;
  /** Trailing-12-month gross revenue retention. */
  grrPct: number;
  cacPaybackMonths: number;
  customers: number;
}

export interface Signal {
  label: string;
  unit: string;
  points: [string, number][];
  period: string;
}

export interface Round {
  date: YearMonth;
  name: string;
  /** USD millions */
  amount: number;
  lead: string;
  /** USD millions, if disclosed or estimated */
  postMoney: number | null;
}

export interface Investor {
  name: string;
  lead?: boolean;
  type: string;
}

export interface Founder {
  name: string;
  role: string;
  initials: string;
  bio: string;
  previously: string[];
  education: string[];
  signals: string[];
  linkedin: string;
}

export interface Leader {
  name: string;
  role: string;
  note: string;
}

export interface Competitor {
  name: string;
  self?: boolean;
  stage: string;
  /** USD millions */
  raised: number;
  headcount: number;
  focus: string;
}

export interface Pillar {
  key: PillarKey;
  name: string;
  /** Two short lines used for the radar label. */
  lines: [string, string];
  score: number;
  blurb: string;
  evidence: string[];
}

export type Slide =
  | { kind: 'title'; title: string }
  | { kind: 'text'; eyebrow: string; title: string; body: string }
  | { kind: 'stats'; eyebrow: string; title: string; stats: [string, string][] };

export interface StartupProfileData {
  meta: { asOf: string; currency: string; sample?: boolean };
  company: Company;
  financials: Financials;
  signals: { headcount: Signal; traffic: Signal; openRoles: Signal };
  growthScore: {
    /** One value per quarter, oldest → newest. */
    history: [string, number][];
    components: [string, number][];
  };
  rounds: Round[];
  investors: Investor[];
  founders: Founder[];
  leadership: Leader[];
  market: {
    /** USD billions */
    tam: number;
    sam: number;
    som: number;
    cagr: number;
    definitions: { tam: string; sam: string; som: string };
    drivers: string[];
  };
  competitors: Competitor[];
  evaluation: {
    stage: Stage;
    updated: string;
    confidence: string;
    sources: number;
    /** Per-stage weights; each set must sum to 100. */
    weights: Record<Stage, PillarWeights>;
    pillars: Pillar[];
    summary: string;
    strengths: string[];
    risks: string[];
  };
  deck: { updated: YearMonth; slides: Slide[] };
}

/** Everything the page reports back to the host app. It never calls a backend itself. */
export type ProfileAction =
  | { type: 'watch' | 'unwatch' | 'download-onepager' | 'open-deck' }
  | { type: 'share'; url: string }
  | { type: 'request-intro'; message: string };
