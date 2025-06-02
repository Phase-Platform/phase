module.exports = {
  extends: ['@phase-platform/tools-eslint'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  rules: {
    // API specific rules
    'no-console': 'off', // Allow console logs in API for debugging
  },
  overrides: [
    {
      files: ['.eslintrc.js'],
      parserOptions: {
        project: null,
      },
    },
  ],
};
