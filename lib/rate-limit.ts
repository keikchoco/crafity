import "server-only"

const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 3

const attempts = new Map<string, number[]>()

export function isRateLimited(key: string): boolean {
  const now = Date.now()
  const timestamps = (attempts.get(key) ?? []).filter((time) => now - time < WINDOW_MS)

  if (timestamps.length >= MAX_ATTEMPTS) {
    attempts.set(key, timestamps)
    return true
  }

  timestamps.push(now)
  attempts.set(key, timestamps)
  return false
}
