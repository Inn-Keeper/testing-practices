// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import axe from 'axe-core'
import { createSignupForm } from './form'

describe('createSignupForm', () => {
  it('has no accessibility violations', async () => {
    document.body.innerHTML = ''
    createSignupForm(document.body)

    // Scoped to component-relevant rules: full-page rules like "region"
    // (content must be inside a landmark) assume a whole document, not an
    // isolated fragment under test here.
    const results = await axe.run(document.body, {
      runOnly: ['label', 'aria-valid-attr', 'image-alt'],
    })

    expect(results.violations).toEqual([])
  })
})
