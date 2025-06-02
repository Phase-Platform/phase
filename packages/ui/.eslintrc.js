module.exports = {
  extends: ['../../tools/eslint'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  rules: {
    // UI specific rules
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
};
