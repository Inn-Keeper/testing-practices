import autocannon from 'autocannon'
import { startServer } from '../system-tests/server'

async function main() {
  const { server, url } = startServer()

  // Stress testing means pushing connections well past expected production
  // load to find the point where the system degrades or errors.
  const result = await autocannon({
    url: `${url}/health`,
    connections: 500,
    duration: 3,
  })

  server.close()

  console.log(`Requests/sec: ${result.requests.average}`)
  console.log(`Latency (ms), avg: ${result.latency.average}, p99: ${result.latency.p99}`)
  console.log(`Errors: ${result.errors}, Timeouts: ${result.timeouts}`)
  console.log(`Non-2xx responses: ${result.non2xx}`)
}

main()
