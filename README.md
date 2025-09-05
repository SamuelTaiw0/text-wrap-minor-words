## text-wrap-minor-words

Experimental, CSS-first polyfill that augments `text-wrap: pretty` by biasing against line breaks immediately after minor words (articles, prepositions, short conjunctions) in languages where this is a widely accepted typesetting convention. It also applies a couple of safe, language-agnostic joins (e.g., `Fig. 2`, `20 °C`).

Status: experimental. See `explainer.md`.

### Motivation (lean)

`text-wrap: pretty` improves paragraph breaking but does not let authors express locale-aware preferences about breaking immediately after minor words. Many European languages treat this as a common editorial convention even in body text. This library offers a CSS-first polyfill so authors can experiment today and help inform standardization.

### Install

```bash
npm i text-wrap-minor-words
```

### Recommended CSS (snippet)

```css
.typo {
  text-wrap: pretty;
  hyphens: auto;
  font-kerning: normal;
  font-variant-ligatures: common-ligatures;
}
.typo :is(h1,h2,h3) { text-wrap: balance; }
```

### Usage (ESM)

```ts
import { init } from 'text-wrap-minor-words';

// Process elements that compute to text-wrap: pretty
const ctrl = init({ observe: true });

// Optionally process a specific subtree later:
// ctrl.process(element);
```

HTML markup should declare the language (`lang`) on blocks:

```html
<main class="typo">
  <p lang="it">Vado a casa con la bici.</p>
  <p lang="fr">Je vais à Paris.</p>
  <p lang="pl">Jestem w domu i czekam.</p>
  <p lang="en">See Fig. 2 for details.</p>
  <p lang="en">It was 20 °C at 9:30 am.</p>
  <h2 lang="en">A display heading if you want to opt-in later</h2>
  <!-- The library acts only where text-wrap: pretty is in effect -->
  <!-- NBSP is inserted where appropriate; content remains otherwise intact. -->
  <!-- Apostrophes/elision are intentionally out of scope for now. -->
  </main>
```

### Usage (Browser global)

```html
<script src="./dist/index.global.js"></script>
<script>
  const ctrl = TextWrapMinorWords.init({ observe: true });
  // ctrl.process(document.querySelector('.typo'));
  // ctrl.disconnect();
  </script>
```

### What it does

- Extends `text-wrap: pretty` behavior by inserting NBSP after minor words in languages where this is customary (Romance, Slavic, Greek by default).
- Applies safe joins regardless of language:
  - label + number: `Fig. 2`, `p. 12`, `§ 5`
  - number + unit: `20 °C`, `9:30 am`

### Language defaults

- Active by default: it, fr, es, pt, ca, ro, pl, cs, sk, sl, hr, sr, ru, uk, el (minor words enabled).
- Neutral by default: en, de, nl (only safe joins; no minor-words glue in body text).
- The effective language is taken from `lang` (with fallback to the document root).

### API

```ts
type InitOptions = {
  selector?: string;      // default: 'html' (scans under elements that compute to text-wrap: pretty)
  languages?: string[];   // pre-load specific BCP-47 primary subtags (e.g., ['it','en'])
  observe?: boolean;      // MutationObserver to process added/edited content
  context?: 'all'|'display'; // if 'display', only process headings/DT
};
```

Returns a controller `{ process(root?), disconnect() }`.

### Configuration

- The library reads `lang` to select language defaults.
- Neutral languages (e.g., `en`, `de`, `nl`) do not enable minor-words glue by default; only safe joins apply.
- For display-only processing, pass `{ context: 'display' }`.
- You can pre-load language data via `languages: ['it','fr']` to avoid first-use compile cost.

### Performance & constraints

- One TreeWalker pass over text nodes under elements that compute to `text-wrap: pretty`.
- No layout measurements; O(n) string replacements; NBSP insertions are idempotent.
- Skips `pre, code, kbd, samp, script, style, textarea, math, svg, [contenteditable]` and basic URL/email-like text.
- Does not cross inline elements by default.

### Browser support

- The polyfill acts only where the computed style is `text-wrap: pretty`. On browsers without support, it effectively no-ops unless the author explicitly applies an opt-in selector targeting the same blocks.
- The library itself targets modern evergreen browsers (ES2020, Intl.Segmenter optional).

### Contributing language data

- Language tables live in `src/data/languages/<lang>.json`.
- To propose additions:
  1. Add or edit the JSON with `minorWords` (threshold + list) and lexical categories (`labels`, `honorifics`, `abbrCompounds`).
  2. Add unit tests in `tests/engine.spec.ts` (or a new spec file) with input → expected output.
  3. Run `npm run test`.

### Tests & benchmarks

- Run tests: `npm run test`
- Run a simple throughput benchmark: `npm run bench`

### Limitations

- No apostrophe/elision handling (out of scope for now).
- Does not measure layout; it applies static glues consistent with editorial conventions.
- Does not cross inline elements unless an advanced option is introduced in future.

### Standards context

- This repo accompanies the explainer (`explainer.md`) that proposes `text-wrap-preferences: minor-words` as an additive, language-sensitive author preference for paragraph-aware wrapping.
  For a consolidated list of safe labels/honorifics used by the polyfill, see `docs/LEXICON.md`.

### License

MIT
