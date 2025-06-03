import path from 'path';
import { fileURLToPath } from 'url';

import baseConfig from "@phase-platform/tools-eslint/src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  ...baseConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: path.resolve(__dirname, './tsconfig.json'),
      },
    },
  },
];
