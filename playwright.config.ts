import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './topics',
  testMatch: '**/*.spec.ts',
  // ponytail: this external volume writes a macOS AppleDouble "._name"
  // shadow file alongside every real file; ignore them, same as vitest.config.ts.
  testIgnore: '**/._*',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
