import { afterEach, describe, expect, it } from 'vitest'
import type { Server } from 'node:http'
import { startServer } from '../system-tests/server'

describe('smoke test: does the build basically work', () => {
  let server: Server

  afterEach(() => {
    server.close()
  })

  it('responds to a health check', async () => {
    const started = startServer()
    server = started.server

    const response = await fetch(`${started.url}/health`)

    expect(response.status).toBe(200)
  })
})
