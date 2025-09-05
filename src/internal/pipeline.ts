/**
 * Text processing pipeline: applies safe typographic joins first,
 * then minor-words glue. No layout reads, idempotent-ish transformations.
 */

import { LanguageData } from './types';

const NBSP = '\u00A0';

type Compiled = {
  labelRegexes: RegExp[];
  honorificRegexes: RegExp[];
  initialsRegex: RegExp;
  abbrCompoundRegexes: RegExp[];
  numberPlusUnit: RegExp;
  sectionMark: RegExp;
  numericRange: RegExp;
  minorOneLetter?: RegExp;
  minorStoplist?: RegExp;
};

const cache = new Map<string, Compiled>();

const UNITS = [
  'km','m','mm','cm','kg','g','°C','°F','h','min','s','am','a\\.m\\.','pm','p\\.m\\.'
];

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compile(lang: LanguageData): Compiled {
  const key = lang.lang;
  const hit = cache.get(key);
  if (hit) return hit;

  const labels = lang.categories.labels ?? [];
  const labelRegexes = labels.map(label => {
    // Match: (<ws or start>) LABEL ' ' (?=[0-9(]) → replace the single ASCII space with NBSP
    return new RegExp(`(^| )(${escapeRe(label)}) (?=[0-9(])`, 'g');
  });

  const honorifics = lang.categories.honorifics ?? [];
  const honorificRegexes = honorifics.map(h => {
    // (<ws or start>) HONORIFIC ' ' (?=CapWord)
    return new RegExp(`(^| )(${escapeRe(h)}) (?=[A-Z][a-z])`, 'g');
  });

  // Initials: (\b[A-Z]\.) ' ' (?=[A-Z]\.|[A-Z][a-z])
  const initialsRegex = /(\b[A-Z]\.) (?=[A-Z]\.|[A-Z][a-z])/g;

  // number + unit: (\d+(?:[.,]\d+)?) ' ' (?=UNIT\b)
  const numberPlusUnit = new RegExp(
    `(\\d+(?:[.,]\\d+)?) (?=(?:${UNITS.join('|')})\\b)`,
    'g'
  );

  // Section mark: (§) ' ' (?=\d)
  const sectionMark = /(§) (?=\d)/g;

  // Numeric ranges around en-dash/hyphen: add word joiner around dash
  const numericRange = /(\d)\s*(–|-)\s*(\d)/g;

  // minor words
  const minorOneLetter = lang.minorWords?.threshold === 1
    ? /(^| )(\p{Ll}) (?=\p{L})/gu
    : undefined;

  const list = lang.minorWords?.list ?? [];
  const minorStoplist = list.length
    ? new RegExp(`(?<!\\p{L})(${list.map(escapeRe).join('|')})\\s+(?=\\p{L})`, 'giu')
    : undefined;

  const abbrCompoundRegexes = (lang.categories.abbrCompounds ?? []).map(a => {
    // Collapse inner spaces to NBSP: match literal sequence
    const parts = a.split(' ');
    if (parts.length < 2) return new RegExp('$^');
    // Build a regex that captures inner ASCII spaces between tokens
    const re = new RegExp(parts.map(escapeRe).join(' ') , 'g');
    return re;
  });

  const compiled: Compiled = {
    labelRegexes,
    honorificRegexes,
    initialsRegex,
    abbrCompoundRegexes,
    numberPlusUnit,
    sectionMark,
    numericRange,
    minorOneLetter,
    minorStoplist
  };
  cache.set(key, compiled);
  return compiled;
}

export function processTextNodes(input: string, lang: LanguageData): string {
  let out = input;
  const rx = compile(lang);

  // Safe joins first
  if (rx.labelRegexes.length) {
    for (const r of rx.labelRegexes) {
      out = out.replace(r, (_m, pre: string, label: string) => `${pre}${label}${NBSP}`);
    }
  }

  if (rx.honorificRegexes.length) {
    for (const r of rx.honorificRegexes) {
      out = out.replace(r, (_m, pre: string, hon: string) => `${pre}${hon}${NBSP}`);
    }
  }

  // Initals chains
  out = out.replace(rx.initialsRegex, (_m, capDot: string) => `${capDot}${NBSP}`);

  out = out.replace(rx.numberPlusUnit, (_m, num: string) => `${num}${NBSP}`);

  // Section mark
  out = out.replace(rx.sectionMark, (_m, mark: string) => `${mark}${NBSP}`);

  // Numeric ranges: word-joiner around dash
  out = out.replace(rx.numericRange, (_m, a: string, dash: string, b: string) => `${a}\u2060${dash}\u2060${b}`);

  // Abbreviation compounds: replace inner ASCII spaces with NBSP
  if (rx.abbrCompoundRegexes.length) {
    for (const r of rx.abbrCompoundRegexes) {
      out = out.replace(r, (m: string) => m.replace(/ /g, NBSP));
    }
  }

  // Minor words last
  if (rx.minorStoplist) {
    out = out.replace(rx.minorStoplist, (_m, w: string) => `${w}${NBSP}`);
  }
  if (rx.minorOneLetter) {
    out = out.replace(rx.minorOneLetter, (_m, pre: string, ch: string) => `${pre}${ch}${NBSP}`);
  }

  return out;
}
