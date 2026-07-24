import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['topics/**/*.test.ts'],
    // ponytail: this external volume writes a macOS AppleDouble "._name"
    // shadow file alongside every real file; exclude them or Vitest treats
    // them as test files and fails on the binary content.
    exclude: ['**/node_modules/**', '**/._*'],
  },
})
