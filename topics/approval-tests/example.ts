export function generateReport(rows: { region: string; sales: number }[]): string {
  const header = 'Region | Sales'
  const divider = '-------|------'
  const lines = rows.map((r) => `${r.region} | ${r.sales}`)
  return [header, divider, ...lines].join('\n')
}
