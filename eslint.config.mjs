// Mobile-adapted ESLint config derived from the web project.
// Intentionally excludes next/* rules and adds react-native plugin.

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import perfectionist from 'eslint-plugin-perfectionist';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        __DEV__: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      import: importPlugin,
      'unused-imports': unusedImports,
      perfectionist,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-native/no-unused-styles': 'warn',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/no-raw-text': 'off',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'import/order': 'off',
      'perfectionist/sort-imports': [
        'warn',
        {
          type: 'line-length',
          order: 'asc',
          newlinesBetween: 'always',
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'type',
          ],
        },
      ],
    },
  },
  {
    ignores: ['node_modules/**', '.expo/**', 'dist/**', 'android/**', 'ios/**'],
  },
];
