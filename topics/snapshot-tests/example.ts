export interface Invoice {
  id: string
  items: { name: string; price: number }[]
}

export function renderInvoiceSummary(invoice: Invoice): string {
  const total = invoice.items.reduce((sum, item) => sum + item.price, 0)
  const lines = invoice.items.map((item) => `  ${item.name}: $${item.price.toFixed(2)}`)
  return [`Invoice ${invoice.id}`, ...lines, `Total: $${total.toFixed(2)}`].join('\n')
}
