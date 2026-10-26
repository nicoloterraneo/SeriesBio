import type { StartupProfileData } from '../types';

/** ALL NAMES AND NUMBERS BELOW ARE FICTIONAL SAMPLE DATA. */
export const sampleProfile: StartupProfileData = {
  meta: { asOf: '2026-10-22', currency: 'USD', sample: true },

  company: {
    name: 'Nuvio',
    initials: 'N',
    tagline: 'An all-in-one SaaS platform that streamlines finance management for startups and SMEs.',
    description:
      'Nuvio replaces the patchwork of invoicing, expense, payroll-sync and cash-forecasting tools that small ' +
      'finance teams juggle with one workspace. Its AI layer reconciles transactions, flags anomalies and ' +
      'produces investor-ready reporting without a dedicated finance hire.',
    website: 'nuvio.example',
    founded: 2021,
    hq: 'Austin, TX',
    stage: 'Series B',
    employees: 148,
    businessModel: 'B2B SaaS · usage-tiered subscription',
    tags: ['FinTech', 'B2B SaaS', 'SME finance', 'AI automation'],
    secondaryMarket: 'open'
  },

  /* ---- Raw financial inputs (USD millions unless noted) ---- */
  financials: {
    // Month-end ARR, oldest → newest. Last 24 months.
    arr: [
      ['2024-10', 3.9], ['2024-11', 4.1], ['2024-12', 4.3], ['2025-01', 4.6], ['2025-02', 4.8], ['2025-03', 5.0],
      ['2025-04', 5.3], ['2025-05', 5.6], ['2025-06', 5.9], ['2025-07', 6.1], ['2025-08', 6.3], ['2025-09', 6.4],
      ['2025-10', 6.9], ['2025-11', 7.4], ['2025-12', 7.9], ['2026-01', 8.5], ['2026-02', 9.1], ['2026-03', 9.8],
      ['2026-04', 10.5], ['2026-05', 11.3], ['2026-06', 12.1], ['2026-07', 12.9], ['2026-08', 13.8], ['2026-09', 14.8]
    ],
    netBurnLast3m: 2.9,      // total net cash burn over the trailing 3 months
    cash: 31.0,              // cash on hand today
    grossMarginPct: 78,
    nrrPct: 118,             // trailing-12-month net revenue retention
    grrPct: 92,              // trailing-12-month gross revenue retention
    cacPaybackMonths: 14,
    customers: 640
  },

  /* ---- Growth signals (external / alt data) ---- */
  signals: {
    headcount: { label: 'Headcount', unit: '', points: [['Q4 ’24', 52], ['Q1 ’25', 61], ['Q2 ’25', 74], ['Q3 ’25', 92], ['Q4 ’25', 108], ['Q1 ’26', 121], ['Q2 ’26', 135], ['Q3 ’26', 148]], period: 'YoY' },
    traffic: { label: 'Web visits / mo', unit: 'k', points: [['Oct', 41], ['Nov', 44], ['Dec', 47], ['Jan', 52], ['Feb', 58], ['Mar', 63], ['Apr', 71], ['May', 79], ['Jun', 88], ['Jul', 96], ['Aug', 109], ['Sep', 121]], period: '12 mo' },
    openRoles: { label: 'Open roles', unit: '', points: [['Q4 ’24', 9], ['Q1 ’25', 11], ['Q2 ’25', 14], ['Q3 ’25', 22], ['Q4 ’25', 19], ['Q1 ’26', 24], ['Q2 ’26', 27], ['Q3 ’26', 31]], period: 'YoY' }
  },

  growthScore: {
    // Composite 0–100 momentum index; one value per quarter, oldest → newest.
    history: [['Q2 ’25', 71], ['Q3 ’25', 78], ['Q4 ’25', 86], ['Q1 ’26', 92], ['Q2 ’26', 99], ['Q3 ’26', 94]],
    components: [
      ['ARR growth', 35], ['Headcount growth', 20], ['Web traffic', 15], ['Hiring velocity', 15], ['Funding recency', 15]
    ]
  },

  /* ---- Funding ---- */
  rounds: [
    { date: '2021-09', name: 'Pre-seed', amount: 1.2, lead: 'Tamarack Capital', postMoney: null },
    { date: '2022-06', name: 'Seed', amount: 4.8, lead: 'Northbeam Ventures', postMoney: 22 },
    { date: '2023-10', name: 'Series A', amount: 14.0, lead: 'Northbeam Ventures', postMoney: 85 },
    { date: '2025-09', name: 'Series B', amount: 42.0, lead: 'Lumen Capital', postMoney: 240 }
  ],
  investors: [
    { name: 'Lumen Capital', lead: true, type: 'Growth' },
    { name: 'Northbeam Ventures', lead: true, type: 'VC' },
    { name: 'Tamarack Capital', lead: true, type: 'Seed fund' },
    { name: 'Harbor Point Partners', type: 'VC' },
    { name: 'Ardent Growth', type: 'Growth' },
    { name: 'Kestrel Fund', type: 'VC' },
    { name: 'Foundry Row', type: 'Seed fund' },
    { name: 'Tidewater Ventures', type: 'VC' },
    { name: 'Quill Ventures', type: 'VC' },
    { name: 'Meridian Seed', type: 'Seed fund' },
    { name: 'Beacon Angels', type: 'Syndicate' },
    { name: 'Alder & Finch', type: 'Family office' }
  ],

  /* ---- Team ---- */
  founders: [
    {
      name: 'Anaya Rao', role: 'Co-founder, CEO', initials: 'AR',
      bio: 'Led SMB billing product before founding Nuvio. Second-time founder; first company acquired in 2019.',
      previously: ['Stripe', 'McKinsey & Company'],
      education: ['Stanford GSB, MBA'],
      signals: ['Repeat founder', 'Prior exit'],
      linkedin: '#'
    },
    {
      name: 'Daniel Okafor', role: 'Co-founder, CTO', initials: 'DO',
      bio: 'Built large-scale data pipelines for regulated industries; owns Nuvio’s reconciliation engine.',
      previously: ['Palantir', 'Intuit'],
      education: ['University of Cambridge, MEng'],
      signals: ['Deep-tech background'],
      linkedin: '#'
    }
  ],
  leadership: [
    { name: 'Priya Nair', role: 'CFO', note: 'Ex-Brex, finance lead through two growth rounds' },
    { name: 'Marcus Webb', role: 'Chief Revenue Officer', note: 'Scaled SMB sales at Gusto from $5M to $60M ARR' },
    { name: 'Lena Hoffmann', role: 'VP Engineering', note: 'Ex-Plaid, led platform reliability' }
  ],

  /* ---- Market ---- */
  market: {
    tam: 48, sam: 11.2, som: 1.4, cagr: 14.2,   // USD billions, % per year
    definitions: {
      tam: 'Global spend on SME finance software and services',
      sam: 'English-speaking markets, 5–250 employee firms, cloud-native stacks',
      som: 'Reachable in 5 years at current go-to-market capacity'
    },
    drivers: [
      'SMEs consolidating point solutions as software budgets tighten',
      'AI-assisted bookkeeping removing the need for a dedicated finance hire',
      'Investor and lender demand for real-time reporting'
    ]
  },
  competitors: [
    { name: 'Nuvio', self: true, stage: 'Series B', raised: 62, headcount: 148, focus: 'All-in-one finance workspace, AI-first' },
    { name: 'Ledgerly', stage: 'Series C', raised: 180, headcount: 420, focus: 'Accounting + invoicing, mid-market skew' },
    { name: 'Brightbook', stage: 'Late stage', raised: 310, headcount: 900, focus: 'Legacy bookkeeping suite, broad integrations' },
    { name: 'Fynch', stage: 'Series A', raised: 22, headcount: 61, focus: 'Expense and card management' },
    { name: 'Coinwise', stage: 'Seed', raised: 6, headcount: 18, focus: 'Cash-flow forecasting for agencies' }
  ],

  /* ---- AI evaluation ---- */
  evaluation: {
    stage: 'series-b',
    updated: '2026-10-22',
    confidence: 'High',
    sources: 14,
    // Weights are stage-specific and must sum to 100.
    weights: {
      'pre-seed': { founder: 35, market: 25, strategic: 15, traction: 10, execution: 15 },
      'seed': { founder: 30, market: 25, strategic: 15, traction: 15, execution: 15 },
      'series-a': { founder: 25, market: 20, strategic: 15, traction: 25, execution: 15 },
      'series-b': { founder: 20, market: 20, strategic: 15, traction: 30, execution: 15 }
    },
    pillars: [
      {
        key: 'founder', name: 'Founder Background', lines: ['Founder', 'Background'], score: 92,
        blurb: 'Experience, domain fit and track record of the founding team.',
        evidence: ['Repeat founder with a prior exit', '9+ years in payments and finance tooling', 'Technical and commercial skills split cleanly across both founders']
      },
      {
        key: 'market', name: 'Market & Scalability', lines: ['Market &', 'Scalability'], score: 71,
        blurb: 'Size and growth of the market and how well the model scales.',
        evidence: ['$48B TAM growing ~14% a year', 'Fragmented incumbents, but a crowded SME segment', 'SME churn is structurally higher than mid-market']
      },
      {
        key: 'strategic', name: 'Strategic Position', lines: ['Strategic', 'Position'], score: 82,
        blurb: 'Differentiation, defensibility and competitive pressure.',
        evidence: ['Proprietary reconciliation data improves with every customer', 'Bundled pricing undercuts the 3–4 tools it replaces', 'Moat is data and workflow, not brand yet']
      },
      {
        key: 'traction', name: 'Traction Momentum', lines: ['Traction', 'Momentum'], score: 90,
        blurb: 'Revenue growth, retention and customer demand.',
        evidence: ['ARR up 131% year on year to $14.8M', 'Net revenue retention at 118%', 'Burn multiple of ~1.1x is efficient for this growth rate']
      },
      {
        key: 'execution', name: 'Execution Velocity', lines: ['Execution', 'Velocity'], score: 88,
        blurb: 'Speed of shipping, hiring and hitting stated milestones.',
        evidence: ['Headcount up 61% in 12 months with 31 open roles', 'Hit every public milestone since Series A', 'Web visits up 195% over the last 12 months']
      }
    ],
    summary:
      'Nuvio combines an unusually strong founding team with efficient, fast revenue growth. Retention is ' +
      'healthy and capital efficiency is well inside the range investors consider strong at this stage. ' +
      'The score is held back mainly by market structure: SME finance is crowded and SME customers churn more ' +
      'than the mid-market accounts the company is starting to land.',
    strengths: [
      'Growing 131% a year while burning ~$1.1 for every $1 of net new ARR',
      'Founders have shipped and exited before, and the team is balanced',
      '32 months of runway after the Series B removes near-term financing risk'
    ],
    risks: [
      'Net revenue retention (118%) is healthy but below the 120%+ premium tier',
      'Crowded segment: Ledgerly and Brightbook both move down-market',
      'Growth Score fell 5 points last quarter as ARR growth rate eased'
    ]
  },

  /* ---- Pitch deck ---- */
  deck: {
    updated: '2026-09',
    slides: [
      { kind: 'title', title: 'An all-in-one SaaS platform that streamlines finance management for Startups and SMEs.' },
      { kind: 'text', eyebrow: 'The problem', title: 'Small finance teams run on five tools and a spreadsheet.', body: 'The average 50-person company reconciles invoicing, expenses, payroll and bank data by hand — about 11 hours a week of finance time.' },
      { kind: 'text', eyebrow: 'The product', title: 'One workspace. AI does the reconciliation.', body: 'Nuvio connects to banks and payroll, categorises every transaction, and keeps the books investor-ready in real time.' },
      { kind: 'stats', eyebrow: 'Traction', title: 'Growing faster than the market, efficiently.', stats: [['$14.8M', 'ARR'], ['+131%', 'YoY growth'], ['118%', 'Net retention'], ['640', 'Customers']] },
      { kind: 'stats', eyebrow: 'Market', title: 'A $48B market in the middle of a platform shift.', stats: [['$48B', 'TAM'], ['$11.2B', 'SAM'], ['14.2%', 'CAGR']] },
      { kind: 'text', eyebrow: 'The team', title: 'Repeat founders, built for finance.', body: 'Anaya Rao (CEO, ex-Stripe) and Daniel Okafor (CTO, ex-Palantir) lead a 148-person team across Austin, London and Toronto.' }
    ]
  }
};
