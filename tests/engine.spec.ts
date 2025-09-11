import { describe, it, expect } from 'vitest';
import { processTextNodes } from '../src/internal/pipeline';
import { resolveLanguageData } from '../src/internal/lang';

const NBSP = '\u00A0';
const WJ = '\u2060';

describe('processTextNodes', () => {
  it('handles Catalan articles/determinants', () => {
    const ca = resolveLanguageData('ca');
    const out = processTextNodes('Vaig a les cases amb els amics.', ca);
    expect(out).toBe(`Vaig a${NBSP}les${NBSP}cases amb${NBSP}els${NBSP}amics.`);
  });

  it('joins label + number (en)', () => {
    const en = resolveLanguageData('en');
    const out = processTextNodes('See Fig. 2 for details.', en);
    expect(out).toBe(`See Fig.${NBSP}2 for details.`);
  });

  it('handles localized label variants (Nº/N°/N.)', () => {
    const es = resolveLanguageData('es');
    const fr = resolveLanguageData('fr');
    const it = resolveLanguageData('it');
    expect(processTextNodes('Ver Nº 7', es)).toBe(`Ver Nº${NBSP}7`);
    expect(processTextNodes('Voir N° 7', fr)).toBe(`Voir N°${NBSP}7`);
    expect(processTextNodes('Vedi N. 7', it)).toBe(`Vedi N.${NBSP}7`);
  });

  it('joins number + unit', () => {
    const en = resolveLanguageData('en');
    const out = processTextNodes('It was 20 °C at 9:30 am.', en);
    expect(out).toBe(`It was 20${NBSP}°C at 9:30${NBSP}am.`);
  });

  it('handles French minor words (single-letter à)', () => {
    const fr = resolveLanguageData('fr');
    const out = processTextNodes('Je vais à Paris.', fr);
    expect(out).toBe(`Je vais à${NBSP}Paris.`);
  });

  it('handles Greek articles και prepositions', () => {
    const el = resolveLanguageData('el');
    const s1 = processTextNodes('οι άνθρωποι στο σπίτι.', el);
    expect(s1).toBe(`οι${NBSP}άνθρωποι στο${NBSP}σπίτι.`);
    const s2 = processTextNodes('στις πόλεις και στους δρόμους.', el);
    expect(s2).toBe(`στις${NBSP}πόλεις και στους${NBSP}δρόμους.`);
  });

  it('handles Bulgarian minor words', () => {
    const bg = resolveLanguageData('bg');
    const out = processTextNodes('Аз съм в града и отивам на работа по пътя.', bg);
    expect(out).toBe(`Аз съм в${NBSP}града и отивам на${NBSP}работа по${NBSP}пътя.`);
  });

  it('applies Italian articles gli/le', () => {
    const it = resolveLanguageData('it');
    const s1 = processTextNodes('Parlo con gli amici.', it);
    expect(s1).toBe(`Parlo con${NBSP}gli${NBSP}amici.`);
    const s2 = processTextNodes('Le amiche arrivano.', it);
    expect(s2).toBe(`Le${NBSP}amiche arrivano.`);
  });

  it('joins honorific + Name (en)', () => {
    const en = resolveLanguageData('en');
    const out = processTextNodes('Mr. Smith is ready.', en);
    expect(out).toBe(`Mr.${NBSP}Smith is ready.`);
  });

  it('joins initials sequence (en)', () => {
    const en = resolveLanguageData('en');
    const out = processTextNodes('J. K. Rowling wrote it.', en);
    expect(out).toBe(`J.${NBSP}K.${NBSP}Rowling wrote it.`);
  });

  it('adds word-joiners around numeric range dash', () => {
    const en = resolveLanguageData('en');
    const out = processTextNodes('1900-2000 were busy years.', en);
    expect(out).toBe(`1900${WJ}-${WJ}2000 were busy years.`);
  });

  it('collapses DE abbreviation compounds inner spaces', () => {
    const de = resolveLanguageData('de');
    const out = processTextNodes('Das gilt z. B. heute.', de);
    expect(out).toBe(`Das gilt z.${NBSP}B. heute.`);
  });

  it('handles Spanish plural articles unos/unas', () => {
    const es = resolveLanguageData('es');
    const out = processTextNodes('Son unos amigos y unas amigas.', es);
    expect(out).toBe(`Son unos${NBSP}amigos y${NBSP}unas${NBSP}amigas.`);
  });

  it('handles Portuguese plural articles uns/umas', () => {
    const pt = resolveLanguageData('pt');
    const out = processTextNodes('São uns amigos e umas amigas.', pt);
    expect(out).toBe(`São uns${NBSP}amigos e${NBSP}umas${NBSP}amigas.`);
  });

  it('handles Polish short prepositions variants', () => {
    const pl = resolveLanguageData('pl');
    const out = processTextNodes('Idę w dom i ze szkoły, u kolegi.', pl);
    expect(out).toBe(`Idę w${NBSP}dom i${NBSP}ze${NBSP}szkoły, u${NBSP}kolegi.`);
  });

  it('handles Romanian minor words', () => {
    const ro = resolveLanguageData('ro');
    const out = processTextNodes('Merg la oraș cu un prieten și o prietenă.', ro);
    expect(out).toBe(`Merg la${NBSP}oraș cu${NBSP}un${NBSP}prieten și o${NBSP}prietenă.`);
  });

  it('handles Slovene minor words', () => {
    const sl = resolveLanguageData('sl');
    const out = processTextNodes('Sem v mestu in pri prijatelju.', sl);
    expect(out).toBe(`Sem v${NBSP}mestu in pri${NBSP}prijatelju.`);
  });

  it('handles Croatian minor words', () => {
    const hr = resolveLanguageData('hr');
    const out = processTextNodes('Sam u gradu i s prijateljem.', hr);
    expect(out).toBe(`Sam u${NBSP}gradu i s${NBSP}prijateljem.`);
  });

  it('handles Serbian minor words', () => {
    const sr = resolveLanguageData('sr');
    const out = processTextNodes('Sam u gradu i s prijateljem.', sr);
    expect(out).toBe(`Sam u${NBSP}gradu i s${NBSP}prijateljem.`);
  });

  it('handles Italian minor words', () => {
    const it = resolveLanguageData('it');
    const out = processTextNodes('Vado a casa con la bici.', it);
    expect(out).toBe(`Vado a${NBSP}casa con${NBSP}la${NBSP}bici.`);
  });

  it('handles Ukrainian minor words', () => {
    const uk = resolveLanguageData('uk');
    const out = processTextNodes('Я у місті і йду до друга, на роботу.', uk);
    expect(out).toBe(`Я у${NBSP}місті і йду до${NBSP}друга, на${NBSP}роботу.`);
  });

  it('handles Bulgarian minor words', () => {
    const bg = resolveLanguageData('bg');
    const out = processTextNodes('Аз съм в града и отивам на работа по пътя.', bg);
    expect(out).toBe(`Аз съм в${NBSP}града и отивам на${NBSP}работа по${NBSP}пътя.`);
  });

  it('handles Macedonian minor words', () => {
    const mk = resolveLanguageData('mk');
    const out = processTextNodes('Сум во град и одам на работа со пријател.', mk);
    expect(out).toBe(`Сум во${NBSP}град и одам на${NBSP}работа со${NBSP}пријател.`);
  });

  it('handles Belarusian minor words', () => {
    const be = resolveLanguageData('be');
    const out = processTextNodes('Я ў горадзе і іду да друга, на працу.', be);
    expect(out).toBe(`Я ў${NBSP}горадзе і іду да${NBSP}друга, на${NBSP}працу.`);
  });

  it('handles Galician minor words', () => {
    const gl = resolveLanguageData('gl');
    const out = processTextNodes('Vou a casa con un amigo. Ver Nº 7.', gl);
    expect(out).toBe(`Vou a${NBSP}casa con${NBSP}un${NBSP}amigo. Ver Nº${NBSP}7.`);
  });
});
