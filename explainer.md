# Proposal: `text-wrap-preferences: minor-words`

**Status:** Explainer for discussion
**Module:** CSS Text Level 4/5 (to be decided)
**Authors/Champions:** *TBD*
**Use cases:** editorial-quality line breaking in languages where it is customary to avoid line breaks immediately after **minor words** (articles, prepositions, short conjunctions).

## Problem

`text-wrap: pretty` introduces paragraph-aware line breaking to improve typographic quality, but it does not provide an author-controlled way to bias against line breaks immediately **after minor words** (e.g., Italian *a, di, la*; French *de, le*; Polish *w, z*).
In many European languages this is a widely accepted typesetting convention for body text (not just headlines). Today authors must inject `&nbsp;` or JS to approximate this, which is brittle, harms portability, and can interfere with accessibility tooling.

## Non-goal

This proposal does **not** attempt to hard-specify the minor-word lists for each language. It defines an author **preference** and delegates language-sensitive data to UAs, guided by the element’s language (`lang`) and platform locale resources.

## Prior art

* `text-wrap: balance` started as a polyfill (e.g., *Balance Text*) used to motivate the feature.
* Countless production sites implement “widont”/“no-orphan” scripts and language-specific NBSP filters to keep minor words with the following word.
* Professional typesetting tools commonly offer locale-aware “non-breaking short words” options.

## Proposal

Introduce an additive property that lets authors request language-aware preferences used during paragraph-aware wrapping (notably when `text-wrap: pretty` is in effect).

### Syntax

```
text-wrap-preferences: none | [ minor-words ]#;
```

* **Initial:** `none`
* **Applies to:** all elements
* **Inherited:** yes
* **Media:** visual
* **Computed value:** as specified
* **Interaction:** UAs **consider** these preferences whenever they apply a multi-line, quality-biased wrapping algorithm (e.g., `text-wrap: pretty`). If `pretty` is not in effect, UAs **may** ignore preferences (at their discretion).

### Semantics

When `minor-words` is present, the UA SHOULD reduce the priority of line break opportunities immediately **after minor words** according to the element’s language (BCP 47) and locale data.

* This is a *bias*, not an absolute prohibition: if honoring the preference would cause worse outcomes (e.g., severe rag, overflow), the UA may still break there.
* UAs are encouraged to use existing platform dictionaries and locale rules (e.g., ICU/CLDR) to identify minor words per language.
* The preference applies throughout the paragraph, not only to the last line. It composes with other quality heuristics (e.g., avoid very short last lines).

### Examples

```css
.article {
  text-wrap: pretty;
  text-wrap-preferences: minor-words;
}

/* Optional: limit to display contexts */
h1, h2, h3 { text-wrap-preferences: minor-words; }
```

```html
<p lang="it">
  Vado a casa con la bici.
  <!-- UA biases against breaking after: a, con, la -->
</p>

<p lang="pl">
  Jestem w domu i czekam.
  <!-- UA biases after: w, i -->
</p>

<p lang="en">
  This is a test.
  <!-- No bias required by default in English; UA may effectively do nothing -->
</p>
```

## Internationalization

* Behavior is **language-sensitive**. UAs determine minor-word sets per language; authors can indicate language via `lang` attributes.
* English, German, Dutch often do **not** require this preference in body text; many Romance and Slavic languages typically benefit from it.
* For scripts without word spacing or with very different line-breaking traditions (CJK, Thai, Arabic, Hebrew), UAs may ignore `minor-words`.

### Suggested per-language defaults (non-normative)

- Active by default: it, fr, es, pt, ca, ro, pl, cs, sk, sl, hr, sr, ru, uk, el.
- Neutral by default: en, de, nl (preference may still be used in display contexts).

## Interoperability & testability

* The property is additive and backward compatible; unknown values are ignored.
* Interop can be achieved with WPTs that assert **relative** outcomes: in presence of competing breakpoints, a UA that honors `minor-words` should prefer a different breakpoint than the baseline in test paragraphs for given `lang`.
* The preference is intentionally weaker than a non-breaking joiner: it’s a heuristic signal, not a mandate.

### Spec sketch (summary)

Non-normative summary of intended spec shape (to aid review):

- Name: `text-wrap-preferences`
- Values: `none | [ minor-words ]#`
- Initial: `none`
- Applies to: all elements
- Inherited: yes
- Computed value: as specified
- Media: visual
- Interaction: UAs consider preferences when a multi-line, quality-biased wrapping algorithm is active (e.g., `text-wrap: pretty`). UAs MAY ignore preferences under `auto`/greedy wrapping.
- Error handling: unknown keywords ignored per CSS error handling; list order does not matter.
- Feature detection: `CSS.supports('text-wrap-preferences','minor-words')`.

### Reference datasets and fixtures

This repository provides language JSON tables and unit tests/fixtures demonstrating expected transformations. These are intended to be ported into WPT as relative-preference tests (i.e., that a UA honoring the preference chooses a different breakpoint than an identical paragraph without the preference).

## Performance

* Evaluating “minor-words” requires tokenization at word granularity within already paragraph-aware algorithms. Implementations can reuse existing segmentation (e.g., the same pass used by `pretty`).
* No layout measurements are required; impact should be negligible compared to `pretty`’s existing overhead.

## Security & privacy considerations

This proposal does not introduce new web-exposed data or cross-origin interactions. It influences layout decisions only and keeps content unchanged. There are no additional fingerprinting surfaces beyond existing CSS feature detection.

## Accessibility & authoring impact

* No DOM mutations are needed (unlike current JS/`&nbsp;` workarounds).
* Screen readers and copy/paste behavior remain unchanged; UAs make a layout decision rather than altering content.
* Authors gain a declarative, locale-aware tool; content remains clean.

## Links (reference implementation & demo)

* Reference implementation (polyfill): `./src` + language data in `./src/data/languages`
* Demo page: `./demo.html`
* Tests/fixtures: `./tests` (designed to be ported to WPT)

## References

* WebKit: “Better Typography with text-wrap: pretty” — [webkit.org](https://webkit.org/blog/16547/better-typography-with-text-wrap-pretty/)
* Chrome Developers: “CSS text-wrap: pretty” — [developer.chrome.com](https://developer.chrome.com/blog/css-text-wrap-pretty/)
* CSS Text Level 4 draft (text-wrap, wrapping heuristics) — [drafts.csswg.org/css-text-4](https://drafts.csswg.org/css-text-4/#text-wrap-shorthand)
* Mark Boulton, “Run Ragged” (editorial guidance for rag quality) — [24ways.org](https://24ways.org/2013/run-ragged/)
* Practical Typography (widows/orphans, runts, general practice) — [practicaltypography.com](https://practicaltypography.com/)

## Alternatives considered

1. **Fold into `text-wrap: pretty` without a knob:** feasible (UA-dependent), but authors cannot opt in/out per language/context; risks divergence.
2. **New keyword in `text-wrap-style`:** not composable (mutually exclusive with `pretty`).
3. **Content processing (`&nbsp;`) or JS:** brittle, non-semantic, and harder to internationalize.

## Open questions

* Should the preference apply under other wrapping modes (e.g., justified text without `pretty`) or remain scoped to paragraph-aware algorithms?
* Do we need a stronger “never break” variant for specific editorial contexts (e.g., headings), or is the bias sufficient?
* How should UAs expose/maintain the language data (CLDR-based? UA-maintained tables? overrides)?
* Do we want an author-side escape hatch (e.g., a span-level no-break utility) that composes with this preference?

### Explicit request for feedback

The editors would appreciate feedback specifically on:

1) Whether `minor-words` should be strictly scoped to `text-wrap: pretty`, or considered under other wrapping modes.
2) Language data sourcing: CLDR-derived vs. UA-maintained lists; author overrides.
3) Control surface: is a simple on/off preference sufficient, or is a future intensity/context dimension (e.g., display-only) desirable?
4) Interactions with `hyphens: auto` and potential `avoid-short-last-lines`.

## Reference implementation

This repository includes a reference polyfill for `text-wrap-preferences: minor-words`.

- Engine: see [`/src`](./src) (paragraph-aware processing, NBSP/WJ insertion).
- Language data: see [`/src/data/languages`](./src/data/languages).
- Tests/fixtures: see [`/tests`](./tests), designed to be ported to WPT.

The polyfill is intended for experimentation and interop discussions; behavior is scoped to elements using `text-wrap: pretty`.
