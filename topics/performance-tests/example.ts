export function findLinear(haystack: number[], needle: number): boolean {
  return haystack.includes(needle)
}

export function findWithSet(haystackSet: Set<number>, needle: number): boolean {
  return haystackSet.has(needle)
}
