module.exports = {
  extends: ['../../tools/eslint/base.js'],
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    next: {
      rootDir: '.',
    },
  },
};
