import autocannon from 'autocannon'
import { startServer } from '../system-tests/server'

async function main() {
  const { server, url } = startServer()

  const result = await autocannon({
    url: `${url}/health`,
    connections: 10,
    duration: 2,
  })

  server.close()

  console.log(`Requests/sec: ${result.requests.average}`)
  console.log(`Latency (ms), avg: ${result.latency.average}, p99: ${result.latency.p99}`)
  console.log(`Errors: ${result.errors}, Timeouts: ${result.timeouts}`)
}

main()
