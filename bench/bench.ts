import { processTextNodes } from '../src/internal/pipeline';
import { resolveLanguageData } from '../src/internal/lang';

function lorem(lang: string): string {
  switch (lang) {
    case 'ca':
      return 'Vaig a les cases amb els amics. Vegeu Fig. 2.';
    case 'cs':
      return 'Jdu v sadu a jsem ve škole. Viz obr. 2.';
    case 'de':
      return 'Dr. Müller sagt: z. B. so. Siehe Abb. 3 auf S. 12.';
    case 'el':
      return 'οι άνθρωποι στο σπίτι. στις πόλεις και στους δρόμους.';
    case 'en':
      return 'See Fig. 2 for details. It was 20 °C at 9:30 am. Mr. Smith met J. K. Rowling in 1900-2000 studies.';
    case 'es':
      return 'Voy a casa y estoy en el parque con un amigo. Son unos amigos y unas amigas. Ver Nº 7.';
    case 'fr':
      return 'Je vais à Paris et je suis de Lyon, chez un ami. C\'est un test. Voir N° 7.';
    case 'hr':
      return 'Sam u gradu i s prijateljem. Vidi sl. 2.';
    case 'it':
      return 'Vado a casa con la bici. Sono di Roma e vado in centro. Tra le cose piu utili c\'è la semplicità.';
    case 'nl':
      return 'dr. De Vries spreekt. Zie fig. 2.';
    case 'pl':
      return 'Jestem w domu i czekam na przyjaciela. To jest test w języku polskim.';
    case 'pt':
      return 'Vou a casa e estou no parque com um amigo. São uns amigos e umas amigas.';
    case 'ro':
      return 'Merg la oraș cu un prieten și o prietenă. Vezi Fig. 2.';
    case 'ru':
      return 'Я в Москве и иду на работу утром. См. Рис. 2.';
    case 'sk':
      return 'Idem v sade a som v škole, pri dome. Pozri obr. 2.';
    case 'sl':
      return 'Sem v mestu in pri prijatelju. Glej sl. 2.';
    case 'sr':
      return 'Сам у граду и с пријатељем. Види сл. 2.';
    case 'uk':
      return 'Я у місті і йду до друга, на роботу. Див. Рис. 2.';
    default:
      return 'See Fig. 2 for details. It was 20 °C at 9:30 am.';
  }
}

function run(lang: string, iterations: number, repeat: number): number {
  const text = lorem(lang);
  const data = resolveLanguageData(lang);
  let out = '';
  const start = performance.now();
  for (let r = 0; r < repeat; r++) {
    for (let i = 0; i < iterations; i++) {
      out = processTextNodes(text, data);
    }
  }
  const end = performance.now();
  // Prevent dead-code elimination
  if (!out) console.log('');
  return end - start;
}

const langs = ['ca','cs','de','el','en','es','fr','hr','it','nl','pl','pt','ro','ru','sk','sl','sr','uk'];
const iterations = 2000;
const repeat = 20;

for (const lang of langs) {
  const ms = run(lang, iterations, repeat);
  const ops = (iterations * repeat) / (ms / 1000);
  console.log(`${lang}: ${(ops | 0).toLocaleString()} ops/sec (${ms.toFixed(1)} ms)`);
}
