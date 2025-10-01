import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next', 'next/typescript'],
    rules: {
      // Disable strict rules that are too noisy
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
    },
  }),
];

export default eslintConfig;
