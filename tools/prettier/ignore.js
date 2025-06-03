/** @type {string[]} */
export default [
  // Dependencies
  'node_modules/',
  '.pnp',
  '.pnp.js',

  // Production builds
  '.next/',
  'out/',
  'build/',
  'dist/',

  // Logs
  '*.log',

  // Database files
  '*.db',
  '*.sqlite',
  '*.sqlite3',

  // Environment files
  '.env*',

  // Coverage reports
  'coverage/',

  // IDE files
  '.vscode/',
  '.idea/',

  // OS files
  '.DS_Store',
  'Thumbs.db',

  // Package files
  '*.tgz',
  '*.tar.gz',

  // Prisma generated files
  '**/generated/',

  // Auto-generated files
  '**/*.generated.*',
  '**/prisma/migrations/',

  // Documentation builds
  'docs/build/',

  // Temporary files
  'tmp/',
  'temp/',

  // Cache directories
  '.cache/',
  '.turbo/',

  // Lock files (formatted differently)
  'pnpm-lock.yaml',
  'yarn.lock',
  'package-lock.json',
];
