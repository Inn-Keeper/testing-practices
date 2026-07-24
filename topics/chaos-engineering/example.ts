export class ChaosError extends Error {}

export async function fetchWithRetry(operation: () => Promise<string>, maxAttempts: number): Promise<string> {
  let lastError: unknown
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}
