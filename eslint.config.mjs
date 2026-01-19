import next from '@next/eslint-plugin-next';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', '.turbo/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      '@next/next': next,
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'error',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
