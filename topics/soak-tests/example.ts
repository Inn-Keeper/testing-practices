import autocannon from 'autocannon'
import { startServer } from '../system-tests/server'

async function main() {
  const { server, url } = startServer()

  // Real soak tests run for hours or days at moderate, sustained load to
  // catch slow leaks (memory growth, connection exhaustion, clock drift)
  // that a short run can't reveal. This example runs for a few seconds
  // only, to stay runnable as part of this repo — the technique is
  // identical, just the duration differs by orders of magnitude.
  const result = await autocannon({
    url: `${url}/health`,
    connections: 10,
    duration: 5,
  })

  server.close()

  console.log(`Requests/sec: ${result.requests.average}`)
  console.log(`Latency (ms), avg: ${result.latency.average}, p99: ${result.latency.p99}`)
  console.log(`Errors: ${result.errors}, Timeouts: ${result.timeouts}`)
  console.log('(A real soak test would run this same shape for hours, watching for drift over time.)')
}

main()
