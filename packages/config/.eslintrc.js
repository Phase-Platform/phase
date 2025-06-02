const path = require('path');

module.exports = {
  root: true,
  extends: ['@phase-platform/tools-eslint'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  rules: {
    // Add any config-specific rules here
  },
};
