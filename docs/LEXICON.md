## Lexicon reference: safe labels and honorifics

Purpose: provide a concise, “safe-by-default” list of tokens used by the polyfill rules that are broadly accepted in editorial practice. This keeps `README.md` lean while offering a single place to review or extend locale data.

### Rules recap (mapping → replacement)

- label + number: `LABEL␠NUMBER` → `LABEL NUMBER` (NBSP)
- honorific + Name: `HONORIFIC␠CapWord` → `HONORIFIC CapWord` (NBSP)
- initials sequence: `A.␠(A.|CapWord)` → `A. (A.|CapWord)` (NBSP)
- number + unit: `NUMBER␠UNIT` → `NUMBER UNIT` (NBSP)
- section mark: `§␠NUMBER` → `§ NUMBER` (NBSP)
- numeric range: `x – y` → `x⁠–⁠y` (WORD JOINER around dash)

NBSP = U+00A0, WORD JOINER = U+2060

### Language tokens (safe set)

- be
  - labels: Рыс., №, с., §
- bg
  - labels: Фиг., №, с., §
- ca
  - labels: Fig., Núm., p., pp.
- cs
  - labels: obr., č., s.
- de
  - labels: Abb., Kap., Nr., S., §, Nr
  - honorifics: Dr., Prof., Fr.
  - abbrCompounds: z. B., u. a., d. h., o. Ä.
- el
  - labels: Εικ., αρ., Νο.
- en
  - labels: Fig., Eq., Sec., Ch., No., Vol., Art., p., pp., §, ¶, Fig, No
  - honorifics: Mr., Mrs., Ms., Dr., Prof., St.
- es
  - labels: Fig., Nº, No., p., pp.
- fr
  - labels: Fig., N°, No., p., pp.
- gl
  - labels: Fig., Nº, p., pp.
- hr
  - labels: sl., br., str.
- it
  - labels: p., pp., Fig., N., n.
- mk
  - labels: Сл., бр., стр., §
- nl
  - labels: fig., nr., p., §
- pl
  - labels: Rys., Nr, s.
- pt
  - labels: Fig., N.º, No., p., pp.
- ro
  - labels: Fig., Nr., p., pp.
- ru
  - labels: Рис., №, с., §
- sk
  - labels: obr., č., s.
- sl
  - labels: sl., št., str.
- sr
  - labels: sl., br., str.
- uk
  - labels: Рис., №, с., §

This list intentionally favors widely used abbreviations and avoids style-guide-specific variants.

### Rationale (why these are safe)

- Label + number and honorific + Name pairs are almost universally kept unbroken in editorial work to avoid widowed tokens and improve scanning.
- Initials sequences (“J. K. Rowling”) read as a single unit.
- Units, section marks, and numeric ranges are standard microtypographic joins.

### Contributing updates

1. Update `src/data/languages/<lang>.json` (add tokens to `labels`, `honorifics`, or `abbrCompounds`).
2. Add/adjust unit tests in `tests/engine.spec.ts` with input → expected output.
3. Keep changes conservative and broadly accepted; avoid publisher- or brand-specific styles.
