import nextPlugin from '@next/eslint-plugin-next';
import baseConfig from '@phase-platform/tools-eslint';

export default [
  ...baseConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['**/.next/**', '**/node_modules/**', '**/dist/**', '**/build/**'],
    plugins: {
      '@next/next': nextPlugin,
    },
    settings: {
      next: {
        rootDir: '.',
      },
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-unwanted-polyfillio': 'error',
    },
  },
];
