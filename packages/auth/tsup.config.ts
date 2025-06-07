import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/auth.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
});
