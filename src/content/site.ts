// Single source of truth for all copy. Edit here to change site content.

export const site = {
  name: 'Skiux',
  tagline: 'Systems engineer · Building things that should not be built alone',
  location: 'Somewhere quiet',
  email: 'hello@example.com', // TODO
  github: 'https://github.com/hupax',
  twitter: '', // TODO

  manifesto: `I build the unglamorous parts — the storage layers, the consensus protocols, the breadcrumbs that explain why a request was slow at 3 a.m. Most of what I make is invisible by design. This page is one of the few places it is not.`,

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

  projects: [
    { numeral: 'I', title: 'Forthcoming', note: 'A storage thing.' },
    { numeral: 'II', title: 'Forthcoming', note: 'A scheduler thing.' },
    { numeral: 'III', title: 'Forthcoming', note: 'An observability thing.' },
  ],

  colophon: [
    { label: 'Type', value: 'Fraunces · Newsreader · JetBrains Mono' },
    { label: 'Stack', value: 'React · TypeScript · Vite · Tailwind v4' },
    { label: 'Surface', value: 'Looped film + a WebGL grain pass' },
    { label: 'Built', value: '2026, in a small editor' },
    { label: 'Inspired by', value: 'jayzhushi · qzq · the read.cv crowd' },
    { label: 'Source', value: 'github.com/hupax (eventually)' },
  ],

  footerLine: '— Notes from the long tail.',
} as const;

export type SiteContent = typeof site;
