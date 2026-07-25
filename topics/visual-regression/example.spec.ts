import { test, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const fixturePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixture.html')

test('the pricing card matches its visual baseline', async ({ page }) => {
  await page.goto(`file://${fixturePath}`)
  await expect(page.locator('.card')).toHaveScreenshot('pricing-card.png')
})
