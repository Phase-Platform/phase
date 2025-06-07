import baseConfig from '@phase-platform/tools-tailwind';

/** @type {import('tailwindcss').Config} */
const config = /** @type {import('tailwindcss').Config} */ ({
  ...baseConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
});

export default config;
