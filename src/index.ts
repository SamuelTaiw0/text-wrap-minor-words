/**
 * text-wrap-minor-words
 *
 * CSS-first polyfill that augments `text-wrap: pretty` by
 * applying no-break glue after minor words and other safe typographic joins.
 *
 * - Processes only elements whose computed style has `text-wrap: pretty`.
 * - No layout measurement. One pass over text nodes.
 * - Idempotent: does not re-apply glue when already present.
 */

import { processTextNodes } from './internal/pipeline';
import { normalizeLang, resolveLanguageData } from './internal/lang';

export type InitOptions = {
  selector?: string;
  languages?: string[];
  observe?: boolean;
  context?: 'all' | 'display';
};

export interface Controller {
  process(root?: Element | Document): void;
  disconnect(): void;
}

/** Returns true if any ancestor element of `el` computes to `text-wrap: pretty`. */
function hasPretty(el: Element): boolean {
  let cur: Element | null = el;
  while (cur) {
    const cs = getComputedStyle(cur);
    const val = cs.getPropertyValue('text-wrap').trim();
    if (val === 'pretty') return true;
    cur = cur.parentElement;
  }
  return false;
}

function* iterTextNodes(root: Element | Document, filter: (el: Element) => boolean): IterableIterator<Text> {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      if (p.closest('pre,code,kbd,samp,script,style,textarea,math,svg,[contenteditable]')) return NodeFilter.FILTER_REJECT;
      if (!filter(p)) return NodeFilter.FILTER_REJECT;
      // Rudimentary URL/email guard
      const v = node.nodeValue;
      if (/[a-z]+:\/\//i.test(v) || /www\./i.test(v) || /\S+@\S+/.test(v)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let n: Node | null;
  // eslint-disable-next-line no-cond-assign
  while ((n = walker.nextNode())) {
    yield n as Text;
  }
}

export function init(options: InitOptions = {}): Controller {
  const selector = options.selector ?? 'html';
  const context = options.context ?? 'all';

  // Preload language data map
  const langs = new Map<string, ReturnType<typeof resolveLanguageData>>();
  const requested = (options.languages ?? []).map(normalizeLang);
  for (const tag of requested) {
    langs.set(tag, resolveLanguageData(tag));
  }

  const shouldProcessElement = (el: Element): boolean => {
    if (context === 'display') {
      const tag = el.tagName.toLowerCase();
      if (!/^(h1|h2|h3|h4|h5|h6|dt)$/.test(tag)) return false;
    }
    return hasPretty(el);
  };

  const process = (root?: Element | Document) => {
    const scope: Element | Document = root ?? document;
    const containers: Element[] = [];
    const base = scope instanceof Document ? scope.documentElement : scope;
    for (const el of (base.matches(selector) ? [base] : Array.from(base.querySelectorAll(selector)))) {
      containers.push(el);
    }
    for (const container of containers) {
      for (const text of iterTextNodes(container, shouldProcessElement)) {
        const langTag = normalizeLang(text.parentElement?.lang || document.documentElement.lang || '');
        const data = langs.get(langTag) ?? resolveLanguageData(langTag);
        const next = processTextNodes(text.nodeValue!, data);
        if (next !== text.nodeValue) text.nodeValue = next;
      }
    }
  };

  const mo = options.observe
    ? new MutationObserver(muts => {
        const batch = new Set<Element>();
        for (const m of muts) {
          if (m.type === 'childList') {
            m.addedNodes.forEach(n => {
              if (n.nodeType === 1) batch.add(n as Element);
            });
          } else if (m.type === 'characterData') {
            const p = (m.target as CharacterData).parentElement;
            if (p) batch.add(p);
          }
        }
        if (batch.size) {
          // Defer to idle to avoid jank
          const run = () => batch.forEach(el => process(el));
          (window as any).requestIdleCallback ? (window as any).requestIdleCallback(run) : setTimeout(run, 0);
        }
      })
    : null;
  if (mo) mo.observe(document, { childList: true, characterData: true, subtree: true });

  return {
    process,
    disconnect() {
      mo?.disconnect();
    }
  };
}

export type { LanguageData } from './internal/types';
