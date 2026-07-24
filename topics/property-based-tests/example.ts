export function sortAscending(numbers: number[]): number[] {
  return [...numbers].sort((a, b) => a - b)
}
