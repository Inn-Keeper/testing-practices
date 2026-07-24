import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { generateReport } from './example'

const approvedPath = fileURLToPath(new URL('./approved/example.approved.txt', import.meta.url))

describe('generateReport', () => {
  it('matches the human-approved golden master', () => {
    const actual = generateReport([
      { region: 'North', sales: 120 },
      { region: 'South', sales: 95 },
    ])
    const approved = readFileSync(approvedPath, 'utf-8')

    expect(actual.trim()).toBe(approved.trim())
  })
})
