// src/polyfills.ts
(() => {
  const g: any = globalThis as any;

  // minimal Node globals used by util/inspect in browser bundles
  if (!g.process) g.process = { env: {} };
  if (!g.process.env) g.process.env = {};
  if (!g.global) g.global = g;
})();
