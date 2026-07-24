import { afterEach, describe, expect, it } from 'vitest'
import type { Server } from 'node:http'
import { startServer } from './server'

describe('system test: the whole HTTP surface working together', () => {
  let server: Server

  afterEach(() => {
    server.close()
  })

  it('creates a user and then retrieves it through the full request lifecycle', async () => {
    const started = startServer()
    server = started.server

    const createResponse = await fetch(`${started.url}/users`, {
      method: 'POST',
      body: JSON.stringify({ id: '1', name: 'Ada' }),
    })
    expect(createResponse.status).toBe(201)

    const getResponse = await fetch(`${started.url}/users/1`)
    expect(await getResponse.json()).toEqual({ id: '1', name: 'Ada' })
  })
})
