module.exports = {
  extends: ['../../tools/eslint/dist/index.js', 'next/core-web-vitals'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  settings: {
    next: {
      rootDir: __dirname,
    },
  },
  rules: {
    // Next.js specific rules
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'warn',
    '@next/next/no-unwanted-polyfillio': 'error',
  },
};
