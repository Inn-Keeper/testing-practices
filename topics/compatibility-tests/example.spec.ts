import { test, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const fixturePath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixture.html')

test('the native <dialog> element opens and closes', async ({ page }) => {
  await page.goto(`file://${fixturePath}`)
  const dialog = page.locator('#dialog')

  await expect(dialog).not.toBeVisible()
  await page.click('#open')
  await expect(dialog).toBeVisible()
  await page.click('#close')
  await expect(dialog).not.toBeVisible()
})
