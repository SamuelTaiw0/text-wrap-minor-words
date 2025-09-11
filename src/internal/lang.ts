/**
 * Language utilities: normalize tags and resolve language data from bundled tables.
 */

import ca from '../data/languages/ca.json';
import be from '../data/languages/be.json';
import bg from '../data/languages/bg.json';
import cs from '../data/languages/cs.json';
import de from '../data/languages/de.json';
import el from '../data/languages/el.json';
import en from '../data/languages/en.json';
import es from '../data/languages/es.json';
import fr from '../data/languages/fr.json';
import gl from '../data/languages/gl.json';
import it from '../data/languages/it.json';
import nl from '../data/languages/nl.json';
import da from '../data/languages/da.json';
import pl from '../data/languages/pl.json';
import pt from '../data/languages/pt.json';
import ro from '../data/languages/ro.json';
import ru from '../data/languages/ru.json';
import sl from '../data/languages/sl.json';
import hr from '../data/languages/hr.json';
import sr from '../data/languages/sr.json';
import sk from '../data/languages/sk.json';
import uk from '../data/languages/uk.json';
import mk from '../data/languages/mk.json';
import sv from '../data/languages/sv.json';
import nb from '../data/languages/nb.json';
import nn from '../data/languages/nn.json';
import lt from '../data/languages/lt.json';
import lv from '../data/languages/lv.json';
import { LanguageData } from './types';

const TABLE: Record<string, LanguageData> = {
  be,
  bg,
  ca,
  cs,
  de,
  el,
  en,
  es,
  fr,
  gl,
  hr,
  it,
  lt,
  lv,
  mk,
  nb,
  nl,
  nn,
  pl,
  pt,
  ro,
  ru,
  sk,
  sl,
  sr,
  sv,
  uk
};

/** Normalize BCP47 tag to primary subtag in lowercase, e.g. "en-GB" -> "en". */
export function normalizeLang(tag: string): string {
  if (!tag) return 'und';
  const primary = tag.split('-')[0];
  return primary ? primary.toLowerCase() : 'und';
}

/** Return language data or a neutral default. */
export function resolveLanguageData(tag: string): LanguageData {
  const key = normalizeLang(tag);
  return TABLE[key] ?? { lang: key, minorWords: null, categories: { labels: [] } };
}
