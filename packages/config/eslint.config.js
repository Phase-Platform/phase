import baseConfig from '@phase-platform/tools-eslint/base';

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
  // JavaScript files
  {
    files: ['**/*.js'],
    ignores: ['**/eslint.config.js'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
  },
  // TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/eslint.config.js', 'tools/eslint/**'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: '.',
      },
    },
  },
  // Apply base config
  ...baseConfig,
];
