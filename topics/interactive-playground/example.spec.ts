import { test, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const playgroundPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'playground.html')

test('running the playground escapes an XSS payload and shows the result', async ({ page }) => {
  await page.goto(`file://${playgroundPath}`)

  await page.fill('#playground-input', '<img src=x onerror=alert(1)>')
  await page.click('#playground-run')

  await expect(page.locator('#playground-raw')).toHaveText('<img src=x onerror=alert(1)>')
  await expect(page.locator('#playground-escaped')).toHaveText('&lt;img src=x onerror=alert(1)&gt;')
  await expect(page.locator('#playground-verdict')).toContainText('PASS')
})
