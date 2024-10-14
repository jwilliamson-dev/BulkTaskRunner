import { buildSync } from 'esbuild'

buildSync({
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  format: 'esm',
  sourcemap: true,
  outfile: 'dist/index.js',
  tsconfig: './tsconfig.json',
  platform: 'node',
})
