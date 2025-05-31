const baseConfig = require('../../tools/tailwind/base.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
};
