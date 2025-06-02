module.exports = {
  extends: ['../../tools/eslint'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  rules: {
    // Add any types-specific rules here
  },
};
