## 0.2.0

- Core: dual gate for activation — explicit `--text-wrap-preferences` opt-out/opt-in with fallback to computed `text-wrap: pretty` where supported.
- Demos: update `demo.html` and GitHub Pages to set `--text-wrap-preferences: minor-words` under `@supports not (text-wrap: pretty)`.

## 0.1.0

- Engine: CSS-first polyfill augmenting `text-wrap: pretty` with minor-words bias and safe joins (labels+number, honorific+Name, initials, number+unit, §, numeric ranges).
- Language datasets: ca, cs, de, el, en, es, fr, hr, it, nl, pl, pt, ro, ru, sk, sl, sr.
- Demo: multilingual examples aligned with dataset.
- Docs: README (lean), explainer (with references), docs/LEXICON.md (safe tokens), CONTRIBUTING.
- CI: GitHub Actions for typecheck, test, build. Bench script.
