## Contributing

Thanks for your interest in improving text-wrap-minor-words!

### Scope and principles

- CSS-first: the library augments `text-wrap: pretty` and does not duplicate native behavior.
- Safe-by-default: prefer conventions that are broadly accepted across editorial practice. Avoid controversial or publisher-specific styles.
- Language-aware: additions must include appropriate `lang` fixtures and tests.

### How to propose language data changes

1. Edit or add `src/data/languages/<lang>.json`.
   - minorWords: keep `threshold` consistent (1 unless noted). Do not list tokens of length ≤ threshold; those are covered automatically.
   - categories: add `labels`, `honorifics`, `abbrCompounds` when broadly safe.
2. Add tests in `tests/engine.spec.ts` (or a new file) with input → expected NBSP/JOINER output.
3. Run `npm run test` and ensure all tests pass.
4. Update `docs/LEXICON.md` if you add safe label/honorific tokens.

### Development

- Install: `npm ci`
- Build: `npm run build`
- Tests: `npm run test`
- Bench: `npm run bench`

### Code of conduct

Please be respectful and collaborative. If in doubt, open an issue to discuss before submitting large changes.
