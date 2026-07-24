import { describe, expect, it } from 'vitest'
import { renderInvoiceSummary } from './example'

describe('renderInvoiceSummary', () => {
  it('renders a stable, human-readable summary', () => {
    const summary = renderInvoiceSummary({
      id: 'INV-1',
      items: [
        { name: 'Widget', price: 9.99 },
        { name: 'Gadget', price: 19.99 },
      ],
    })

    expect(summary).toMatchSnapshot()
  })
})
