import { test, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const fixturePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixture.html')

test('greets the name typed into the input', async ({ page }) => {
  await page.goto(`file://${fixturePath}`)
  await page.fill('#name', 'Ada')
  await page.click('#greet')
  await expect(page.locator('#message')).toHaveText('Hello, Ada!')
})
