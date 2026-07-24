import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './topics',
  testMatch: '**/*.spec.ts',
  // ponytail: this external volume writes a macOS AppleDouble "._name"
  // shadow file alongside every real file; ignore them, same as vitest.config.ts.
  testIgnore: '**/._*',
})
