export function parseQueryString(input: string): Record<string, string> {
  const result: Record<string, string> = {}

  for (const pair of input.split('&')) {
    if (pair === '') continue
    const [key, value = ''] = pair.split('=')
    if (key) result[key] = value
  }

  return result
}
