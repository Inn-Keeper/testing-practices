import { createServer, type Server } from 'node:http'

interface StoredUser {
  id: string
  name: string
}

export function startServer(): { server: Server; url: string } {
  const users = new Map<string, StoredUser>()

  const server = createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200).end('ok')
      return
    }

    if (req.method === 'POST' && req.url === '/users') {
      let body = ''
      req.on('data', (chunk) => (body += chunk))
      req.on('end', () => {
        const { id, name } = JSON.parse(body) as StoredUser
        users.set(id, { id, name })
        res.writeHead(201, { 'Content-Type': 'application/json' }).end(JSON.stringify({ id, name }))
      })
      return
    }

    if (req.method === 'GET' && req.url?.startsWith('/users/')) {
      const id = req.url.split('/')[2]
      const user = users.get(id ?? '')
      if (!user) {
        res.writeHead(404).end()
        return
      }
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(user))
      return
    }

    res.writeHead(404).end()
  })

  server.listen(0)
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  return { server, url: `http://127.0.0.1:${port}` }
}
