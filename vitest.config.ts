import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['topics/**/*.test.ts'],
  },
})
