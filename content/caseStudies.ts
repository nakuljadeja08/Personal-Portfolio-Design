export type Flow = { title: string; steps: { name: string; detail: string }[] };

export type CaseStudy = {
  slug: string;
  title: string;
  year: string;
  summary: string;
  links: { repo?: string; live?: string };
  stack: string[];
  facts: { value: string; label: string }[];
  problem: string[];
  flows: Flow[];
  decisions: { decision: string; why: string }[];
  example?: { title: string; body: string[] };
  limits: string[];
  next?: string[];
};

export const caseStudyCopy = {
  back: "← All projects",
  eyebrow: "Case study",
  problem: "The problem",
  flow: "How it works",
  decisions: "Decisions, and why",
  limits: "What it doesn't do (yet)",
  next: "What's next",
  source: "Source ↗",
  live: "Live ↗",
  nextStudy: "Next case study",
  contact: "Want the long version in person? Say hello →",
};

// Every fact here comes from the project's own README or code. If it isn't written down there, it isn't written down here.
export const caseStudies: CaseStudy[] = [
  {
    slug: "valorant-copilot",
    title: "VALORANT Coaching Copilot",
    year: "2026",
    summary: "A coach that explains why a match was lost, and shows its work for every sentence it says.",
    links: {
      repo: "https://github.com/nakuljadeja08/valorant-copilot",
      live: "https://valorant-copilot.vercel.app",
    },
    stack: ["Python", "SQLite", "React", "GitHub Actions", "Vercel"],
    facts: [
      { value: "12", label: "team rules across the Analyst and Economist" },
      { value: "3", label: "hops from any sentence back to its raw match rows" },
      { value: "0", label: "bytes of drift allowed, or CI fails the build" },
    ],
    problem: [
      "Stat sites hand you a scoreboard: K/D, ACS, headshot %. Plenty of numbers, no reasons. A human coach says something different: you lost round 12 because you went in on a half-buy when your loss bonus should have paid for a full one.",
      "I wanted that coach, with one rule a human can't promise. Every claim links back to the exact rows it came from, and if a number can't be traced and re-checked, it doesn't get said.",
      "It coaches at two levels. For the team, that means economy mistakes, the pivotal round and post-plant conversion. For each player, it means scoring them against their own role, because a Sentinel isn't a weak Duelist just because they rarely take first blood.",
    ],
    flows: [
      {
        title: "From match to debrief",
        steps: [
          { name: "Ingest", detail: "Rate-limited, cached and resumable, into a normalised SQLite store of matches, rounds, kills and per-player stats." },
          { name: "Features", detail: "Raw rounds become coaching signals: buy type, loss streaks, broken buys, plant rate. Each feature row stores the raw rows it came from." },
          { name: "Rule agents", detail: "Deterministic rules turn features into conclusions. The Analyst and Economist cover the team, and RoleCoach covers each player." },
          { name: "Watchdog", detail: "Re-reads every cited value from the store and compares it with what the rule saw. A mismatch drops the claim." },
          { name: "Writer", detail: "Template text by default. An LLM can rephrase it, but any draft with a number that isn't in the trace is rejected." },
          { name: "Static export", detail: "Byte-stable JSON bundles feed a React dashboard where every claim expands into its trace. No backend." },
        ],
      },
    ],
    decisions: [
      {
        decision: "One adapter seam for live and simulated data",
        why: "Everything downstream of the adapter doesn't know where a match came from, so switching to live data is one config flag and no other code change.",
      },
      {
        decision: "Lineage stored as data",
        why: "Each feature row carries the raw rows it was computed from. That's what makes \"click a claim, see the evidence\" possible: the trace comes from the store, not from something assembled for display.",
      },
      {
        decision: "Rules decide, the LLM only phrases",
        why: "Conclusions come from testable rules. The no-new-numbers rule is a post-check in code, not a line in a prompt, and the whole pipeline runs without an API key.",
      },
      {
        decision: "Tests that try to break the Watchdog",
        why: "The test suite deliberately corrupts the store to prove the Watchdog catches it, instead of trusting that it would.",
      },
      {
        decision: "Byte-stable exports with a CI drift check",
        why: "No timestamps and sorted collections mean an unchanged store exports identical bytes. CI rebuilds everything from a seeded simulator and fails on any diff, so a change in the data always means something really changed.",
      },
      {
        decision: "Peer baselines versioned by content hash",
        why: "Same corpus in, same version out. A debrief can say which baseline a percentile was scored against.",
      },
    ],
    limits: [
      "Match data is simulated for now. Riot's match endpoint needs a production key, so a simulator emits the documented val-match-v1 schema, grounded in real agent and map IDs from the endpoints a development key can reach. Nothing is scraped.",
      "Some metrics are stand-ins, and they're labelled sim-approx or role-approx in the code and in the UI, right where the number appears.",
      "Signals the data can't support, like anchor positioning, are left unbuilt rather than faked. One drafted rule was cut because the simulator could never trigger it, and the reason is written down in the code.",
    ],
    next: [
      "Apply for a production key, with player opt-in, and run the same pipeline on real matches.",
      "Rebuild role baselines from real players and recalibrate thresholds against real distributions.",
      "Replace the approximations with real trade windows and true attack and defence sides once the data has timestamps.",
    ],
  },
  {
    slug: "orblex-industries",
    title: "Orblex Industries",
    year: "2026",
    summary: "Claude proposes swing trades. Python owns every number and limit, and a person approves every order.",
    links: {
      repo: "https://github.com/nakuljadeja08/orblex-industries",
      live: "https://www.orblexindustries.com",
    },
    stack: ["Python", "Claude API", "Supabase", "React", "GitHub Actions", "Vercel"],
    facts: [
      { value: "0", label: "limits the model is allowed to loosen" },
      { value: "1.5R", label: "minimum reward to risk, or a BUY becomes a HOLD" },
      { value: "5%", label: "most open risk across all positions" },
    ],
    problem: [
      "LLMs are good at reading a messy pile of context: prices, earnings dates, options flow, headlines. They are not good at being trusted with position sizes. So the split is simple: the model proposes, and Python decides.",
      "Each weekday, a pipeline turns market data into trade plans held for 1 to 10 days. Rule code sizes and checks each plan, I approve it on a dashboard, and I place it by hand. On Saturdays the same pipeline writes rebalance advice for a long-term account it never trades.",
    ],
    flows: [
      {
        title: "A trade plan, start to finish",
        steps: [
          { name: "Market context", detail: "Prices, earnings dates, options flow and a market regime (bull, choppy, correction, bear) classified by rules, not by a model." },
          { name: "Analyst", detail: "One Claude call per ticker proposes BUY, SELL or HOLD, with an entry, a stop, a target and a horizon." },
          { name: "Swing rules", detail: "Clamp the levels to an allowed band, block entries that would be held through earnings, and turn any BUY under 1.5R into a HOLD." },
          { name: "Risk rules", detail: "A 1 to 10 score from volatility, earnings and the regime. A score of 8 or more excludes the ticker." },
          { name: "Sizing and guard", detail: "Whole shares from a fixed percentage of equity at risk, then every limit: positions, open risk, entries per day, halts." },
          { name: "Approval", detail: "I approve on the dashboard. An executor that can send orders exists, but it's off by default, and even then each order waits for a tap in the broker's app." },
          { name: "Backtest", detail: "Past plans are simulated on daily bars, net of costs, and their results feed back into the analyst's context." },
        ],
      },
    ],
    decisions: [
      {
        decision: "Limits only tighten",
        why: "There are three layers: ceilings in code, a daily mandate, and per-order approval. Each can make the one above stricter, never looser.",
      },
      {
        decision: "Fail closed",
        why: "Missing data, an unreadable ledger or a stale price blocks the order. A ticker the risk stage drops is excluded rather than sized like normal. Exits stay allowed, because they reduce risk.",
      },
      {
        decision: "Rules wherever a rule is enough",
        why: "Regime detection, signal-drift detection, the backtest and the newsletter's \"what changed\" diff use no LLM at all.",
      },
      {
        decision: "Orders that can't be sent twice",
        why: "Each order carries a fixed id, so a retry or a crash can't place it a second time.",
      },
      {
        decision: "One run id for every row",
        why: "Every stage of a run shares a single run id, so anything written to Postgres can be traced back to the run that produced it.",
      },
      {
        decision: "Change models on evidence",
        why: "The switch to Sonnet 5.5 came from an A/B on 25 tickers with identical context: $0.32 a run against $0.48, a median of 6 seconds against 17, and 25 out of 25 valid JSON replies.",
      },
    ],
    limits: [
      "It hasn't shown a proven edge. The backtest is the judge, and the new version only replaces the old one after at least 30 closed trades per book with an average R at least as good.",
      "The public demo runs on made-up tickers and numbers. It's a personal project and not financial advice.",
    ],
  },
  {
    slug: "rocathon-search",
    title: "RoCathon Search",
    year: "2025",
    summary: "A creator search engine for brands that balances two questions that don't agree: does this creator fit, and do they actually sell?",
    links: { repo: "https://github.com/nakuljadeja08/RoCathon-SearchEngine" },
    stack: ["TypeScript", "PostgreSQL", "pgvector", "OpenAI Embeddings", "Supabase"],
    facts: [
      { value: "2nd", label: "place at the RoCathon hackathon" },
      { value: "127", label: "lifestyle traits mapped to 14 buying signals" },
      { value: "6", label: "signals in the final score" },
    ],
    problem: [
      "Brands searching for creators get two bad options. Tag filters are too rigid: a brand selling rugged gear wants someone who documents extreme adventures, and no tag says that. Pure semantic search finds the right vibe, then hands you a creator with $0 in sales.",
      "Fit and sales are separate problems, so I solved them separately and balanced them in the score.",
    ],
    flows: [
      {
        title: "Ingest, once per creator",
        steps: [
          { name: "Classify traits", detail: "GPT-4o-mini reads each bio against all 127 trait definitions and returns up to three, at temperature 0." },
          { name: "Buying signals", detail: "Each trait maps to audience behaviours like high_spender or price_sensitive, taken from the survey questions that define it." },
          { name: "Embedding text", detail: "Bio, tags, trait definitions, signals, demographics and metrics in one auditable text blob." },
          { name: "Embed and upsert", detail: "text-embedding-3-small into a 1,536-dimension pgvector column, with an upsert that's safe to re-run." },
        ],
      },
      {
        title: "Search, once per query",
        steps: [
          { name: "Intent", detail: "Keywords in the query map to buying signals, so \"luxury\" asks for luxury_buyer and \"affordable\" asks for price_sensitive." },
          { name: "Two retrieval legs", detail: "Cosine similarity on an HNSW index and BM25 on a tsvector column, top 30 each, in parallel." },
          { name: "Fuse", detail: "Reciprocal Rank Fusion merges the legs, then a semantic floor drops weak matches." },
          { name: "Score and rank", detail: "Six weighted signals, an industry boost, and a halving penalty for creators in an unrelated category. Top 10 out." },
        ],
      },
    ],
    decisions: [
      {
        decision: "Rank fusion, not score fusion",
        why: "Cosine scores cluster between 0.4 and 0.99, and ts_rank lives on a completely different scale. RRF only uses each creator's rank, so no normalisation is needed.",
      },
      {
        decision: "Embed definitions, not labels",
        why: "\"Radiant Ritualists\" means nothing to an embedding model. \"Enthusiastic about beauty rituals, invests in skincare\" does.",
      },
      {
        decision: "Score what the audience buys",
        why: "The trait spreadsheet's survey column says what each audience actually spends money on. Turning that into 14 signals let search match purchase intent, not just topics.",
      },
      {
        decision: "A hard penalty for the wrong industry",
        why: "BM25 matched tech reviewers to an outdoor-gear query on the word \"gear\". Halving the score when categories don't overlap removed them.",
      },
    ],
    example: {
      title: "\"Affordable home decor for small apartments\"",
      body: [
        "renter_decor_tips_kay had a perfect semantic score, because her bio literally says apartment and decor. Her 30-day sales were $556, so she landed at #5: relevant, but not allowed to dominate.",
        "plumbing_diy_skip was a weaker topical match but had $183K in sales and the strongest commercial signals in the pool, so he ranked #2.",
      ],
    },
    limits: [
      "The data is 200 mock creators supplied for the hackathon, not live accounts.",
      "The weights are fixed in the formula, not learned from real campaign results.",
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((study) => study.slug === slug);
}
