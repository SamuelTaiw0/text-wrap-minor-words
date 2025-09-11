## 0.3.0

- Core: lite entry + runtime language registry (`registerLanguage`) for single‑locale usage.
- Core: CSS overrides for minor‑words opt‑in per container (`--text-wrap-minor-threshold`, `--text-wrap-minor-stoplist`) when `--text-wrap-preferences: minor-words` is active and the locale has no built‑in config.
- Datasets: add uk, bg, mk, be, gl, sv, da, nb, nn, lt, lv.
- Docs: README updated (Lite usage, CSS opt‑in), demo unchanged.

## 0.2.0

- Core: dual gate for activation — explicit `--text-wrap-preferences` opt-out/opt-in with fallback to computed `text-wrap: pretty` where supported.
- Demos: update `demo.html` and GitHub Pages to set `--text-wrap-preferences: minor-words` under `@supports not (text-wrap: pretty)`.

## 0.1.0

- Engine: CSS-first polyfill augmenting `text-wrap: pretty` with minor-words bias and safe joins (labels+number, honorific+Name, initials, number+unit, §, numeric ranges).
- Language datasets: ca, cs, de, el, en, es, fr, hr, it, nl, pl, pt, ro, ru, sk, sl, sr.
- Demo: multilingual examples aligned with dataset.
- Docs: README (lean), explainer (with references), docs/LEXICON.md (safe tokens), CONTRIBUTING.
- CI: GitHub Actions for typecheck, test, build. Bench script.
