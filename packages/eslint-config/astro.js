import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginAstro from 'eslint-plugin-astro';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { config as baseConfig } from './base.js';

/**
 * A custom ESLint configuration for Astro applications.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const astroConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  ...pluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
      },
    },
  },
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
      // Allow JSX in .astro files
      'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.tsx', '.astro'] }],
    },
  },
  {
    // TypeScript specific rules for better type safety
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      // Disable some rules that don't work well with Astro files
      'react/jsx-filename-extension': 'off',
      'react/no-unknown-property': 'off', // Astro uses class, not className
      'react/no-unescaped-entities': 'off', // Astro handles entities differently
    },
  },
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', '**/*.d.ts'],
  },
];
