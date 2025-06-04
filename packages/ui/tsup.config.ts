import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: [
        'src/index.ts',
    'src/button.tsx',
    'src/card.tsx',
    'src/code.tsx',
    'src/lib/utils.ts'
  ],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: !options.watch,
  external: ['react', 'react-dom', 'lucide-react'], // lucide-react is also a dependency used by components
  outDir: 'dist',
  // To handle JSX, ensure tsconfig has jsx: 'react-jsx' or 'preserve'
  // tsup uses esbuild, which should handle JSX correctly with tsconfig settings.
}));
