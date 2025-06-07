import reactConfig from '@phase-platform/tools-eslint/react';

export default [
  // Base configuration for all files
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**'],
  },
  // ESLint config files
  {
    files: ['**/eslint.config.js'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
  },
  // Apply React config
  ...reactConfig,
];
