import nextPlugin from '@next/eslint-plugin-next';
import baseConfig from '@phase-platform/tools-eslint';

export default [
  ...baseConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.turbo/**',
      '**/.cache/**',
      '**/out/**',
      '**/*.d.ts',
      '**/*.js.map',
      '**/coverage/**',
      '**/.eslintcache',
      '**/.DS_Store',
      '**/Thumbs.db',
      '**/.vscode/**',
      '**/.idea/**',
      '**/*.swp',
      '**/*.swo',
      '**/*.log',
      '**/npm-debug.log*',
      '**/pnpm-debug.log*',
      '**/.env*',
    ],
    plugins: {
      '@next/next': nextPlugin,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
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
      // Disable rules that might conflict with Next.js build output
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
];
