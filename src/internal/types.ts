/**
 * Public and internal types for language data and engine configuration.
 *
 * The engine is CSS-first and stateless; language data supplies
 * short word lists and lexical tokens to drive locale-aware joins.
 */

/** Configuration of the minor-words rule for a language. */
export interface MinorWordsConfig {
  /** Protect tokens with length <= threshold (lowercase only). */
  threshold: number;
  /** Additional short words to always protect. */
  list?: string[];
}

/** Lexical categories used by various rules. */
export interface LanguageCategories {
  /** Titles/abbr preceding a proper name: e.g., Dr., Mr., Prof. */
  honorifics?: string[];
  /** Labels preceding numbers: e.g., Fig., No., p., pp., § */
  labels?: string[];
  /** Abbreviation compounds with inner spaces: e.g., "z. B.", "u. a." */
  abbrCompounds?: string[];
}

/** Per-language data record. */
export interface LanguageData {
  /** Normalized BCP-47 primary subtag (e.g., "en"). */
  lang: string;
  /** Minor words configuration; null disables the rule by default. */
  minorWords: MinorWordsConfig | null;
  /** Lexical categories that drive rules. */
  categories: LanguageCategories;
}
