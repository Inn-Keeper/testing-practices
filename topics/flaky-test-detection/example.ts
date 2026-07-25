export function createUnstableOperation(): () => string {
  let callCount = 0

  return () => {
    callCount += 1
    if (callCount < 3) throw new Error(`Transient failure on call ${callCount}`)
    return 'ok'
  }
}
