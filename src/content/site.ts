// Single source of truth for all copy. Edit here to change site content.

export const site = {
  name: 'Skiux',
  handle: 'hupax',
  tagline: 'Systems engineer · Building things that should not be built alone',
  hashtags: ['#storage', '#consensus', '#observability', '#runtimes'],
  location: 'Somewhere quiet',
  email: 'hello@example.com', // TODO
  github: 'https://github.com/hupax',
  twitter: '', // TODO

  // The fixed top nav. Order matters.
  nav: [
    { label: 'Index', href: '#top' },
    { label: 'Field', href: '#field-01' },
    { label: 'Manifesto', href: '#manifesto' },
    { label: 'Now', href: '#now' },
    { label: 'Work', href: '#projects' },
    { label: 'Reading', href: '#reading' },
    { label: 'Colophon', href: '#colophon' },
  ],

  manifesto: `I build the unglamorous parts — the storage layers, the consensus protocols, the breadcrumbs that explain why a request was slow at 3 a.m. Most of what I make is invisible by design. This page is one of the few places it is not.`,

  principles: [
    { n: '01', t: 'Boring by default.', d: 'Reach for the older, duller tool first. Excitement is a tax paid in incidents.' },
    { n: '02', t: 'Observability before features.', d: 'If I cannot see it, I cannot fix it, and I will pretend the bug is not there.' },
    { n: '03', t: 'Small, well-named units.', d: 'A function that fits on a screen rarely needs a comment to defend itself.' },
    { n: '04', t: 'Read before write.', d: 'Most of my edits are preceded by an hour of someone else’s code.' },
  ],

  stats: [
    { n: 2847, label: 'days since first commit', live: 'sinceFirstCommit', flicker: false, tone: 'normal' },
    { n: 120, label: 'go lines / day · rolling 30d', live: null, flicker: false, tone: 'normal' },
    { n: 38, label: 'papers in the queue', live: null, flicker: false, tone: 'normal' },
    { n: 14, label: 'books finished · 2025', live: null, flicker: false, tone: 'normal' },
    { n: 6, label: 'terminals open · right now', live: null, flicker: true, tone: 'normal' },
    { n: 0, label: 'production outages caused', live: null, flicker: false, tone: 'quiet' },
  ] as ReadonlyArray<{ n: number; label: string; live: string | null; flicker: boolean; tone: 'normal' | 'quiet' }>,

  now: [
    {
      title: 'A small KV store',
      detail: 'Raft for replication, LSM tree for storage. Reading the Etcd and Pebble source as I go.',
      since: '2026-04',
    },
    {
      title: 'A MapReduce / Spark-style runtime',
      detail: 'Stage planner, shuffle, fault tolerance. Trying to keep it under 5k lines.',
      since: '2026-03',
    },
    {
      title: 'Distributed tracing, end to end',
      detail: 'OpenTelemetry collectors, a tiny UI for spans, and a story about tail latency.',
      since: '2026-02',
    },
  ],

  reading: [
    { kind: 'paper', title: 'In Search of an Understandable Consensus Algorithm (Raft)', who: 'Ongaro & Ousterhout', year: 2014 },
    { kind: 'paper', title: 'The Log-Structured Merge-Tree (LSM-Tree)', who: 'O’Neil et al.', year: 1996 },
    { kind: 'paper', title: 'Dapper, a Large-Scale Distributed Systems Tracing Infrastructure', who: 'Google', year: 2010 },
    { kind: 'book',  title: 'Designing Data-Intensive Applications', who: 'Kleppmann', year: 2017 },
    { kind: 'book',  title: 'Database Internals', who: 'Petrov', year: 2019 },
    { kind: 'book',  title: 'Site Reliability Engineering', who: 'Google', year: 2016 },
  ],

  projects: [
    { numeral: 'I', title: 'Forthcoming', note: 'A storage thing.' },
    { numeral: 'II', title: 'Forthcoming', note: 'A scheduler thing.' },
    { numeral: 'III', title: 'Forthcoming', note: 'An observability thing.' },
  ],

  colophon: [
    { label: 'Type', value: 'Fraunces · Newsreader · JetBrains Mono' },
    { label: 'Stack', value: 'React · TypeScript · Vite · Tailwind v4' },
    { label: 'Surface', value: 'WebGL contour map · Canvas demos · grain' },
    { label: 'Built', value: '2026, in a small editor' },
    { label: 'Inspired by', value: 'jayzhushi · qzq · the read.cv crowd' },
    { label: 'Source', value: 'github.com/hupax (eventually)' },
  ],

  footerLine: '— Notes from the long tail.',
} as const;

export type SiteContent = typeof site;
