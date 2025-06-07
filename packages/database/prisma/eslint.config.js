import baseConfig from '@phase-platform/tools-eslint';

const baseConfigWithoutTypeScript = baseConfig.map((config) => {
  if (config.files?.includes('**/*.js')) {
    return {
      ...config,
      files: ['**/*.{ts,tsx}'],
    };
  }
  return config;
});

export default [
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  ...baseConfigWithoutTypeScript,
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: '.',
      },
    },
  },
];
