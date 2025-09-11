import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/lite.ts'],
  format: ['esm', 'iife'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  target: 'es2020',
  globalName: 'TextWrapMinorWords',
  outExtension: ({ format }) => ({ js: format === 'esm' ? '.mjs' : '.global.js' }),
});
