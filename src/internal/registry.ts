import { LanguageData } from './types';

function normalize(tag: string): string {
  if (!tag) return 'und';
  const primary = tag.split('-')[0];
  return primary ? primary.toLowerCase() : 'und';
}

const registry = new Map<string, LanguageData>();

export function registerLanguage(tag: string, data: LanguageData): void {
  registry.set(normalize(tag), data);
}

export function getRegisteredLanguage(tag: string): LanguageData | undefined {
  return registry.get(normalize(tag));
}
