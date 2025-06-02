# @phase-platform/tools-eslint

Shared ESLint configuration for the Phase SDLC platform monorepo.

## Installation

From your workspace root:

```bash
pnpm add -D @phase-platform/tools-eslint
```

## Usage

The configuration is designed to work out of the box with the monorepo structure. Simply add the package as a dev dependency in your workspace's `package.json`:

```json
{
  "devDependencies": {
    "@phase-platform/tools-eslint": "workspace:*"
  }
}
```

Add these scripts to your workspace's `package.json`:

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix"
  }
}
```

## Features

This ESLint configuration includes:

- **TypeScript**: Full TypeScript support with type-aware linting
- **React**: Modern React patterns (React 17+ JSX transform)
- **Next.js**: Next.js specific rules and configurations
- **Import Management**: Automatic import sorting and unused import removal
- **Accessibility**: JSX-A11Y rules for inclusive development
- **Performance**: Rules to catch common performance issues
- **Monorepo Support**: Handles multiple packages and apps structure

## Customization

If you need to override any rules in a specific workspace, create an `.eslintrc.js` file in that workspace:

```javascript
module.exports = {
  extends: ["@phase-platform/tools-eslint"],
  rules: {
    // Your custom overrides
    "@typescript-eslint/no-explicit-any": "error",
  },
};
```

## Dependencies

This configuration requires the following peer dependencies:

- `eslint`
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`
- `eslint-plugin-jsx-a11y`
- `eslint-plugin-import`
- `eslint-plugin-unused-imports`
- `eslint-plugin-simple-import-sort`
- `eslint-config-prettier`
- `@next/eslint-config-next`
- `eslint-plugin-jest`
- `eslint-plugin-jsonc`
- `jsonc-eslint-parser`
- `typescript`

## File Structure

The configuration handles these file types and patterns:

- **TypeScript/JavaScript**: `.ts`, `.tsx`, `.js`, `.jsx`
- **Configuration files**: Special rules for config files
- **Test files**: Relaxed rules for test files
- **Next.js**: Special handling for pages and API routes
- **Storybook**: Configuration for story files
- **JSON**: JSONC parser for JSON files

## Environment Support

- Browser
- Node.js
- ES2022
- Jest
