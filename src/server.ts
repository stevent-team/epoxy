import path from 'path'
import express, { Request } from 'express'
import cors from 'cors'
import { promises as fs } from 'fs'

import injectHTML from './injectHTML'

export type Injection = { head: string, body: string }
export type RouteHandler = (req: Request) => Injection
export type Routes = {
  [route: string]: RouteHandler
}

const startServer = async ({
  host = '0.0.0.0',
  target = './dist',
  index = './dist/index.html',
  port,
  routes,
}) => {
  // Resolve paths
  const resolvedTarget = path.resolve(__dirname, target)
  const resolvedIndex = path.resolve(__dirname, index)

  // Read index
  const indexText = await fs.readFile(resolvedIndex, 'utf-8').catch((e) => {
    throw new Error(`Failed to read index "${resolvedIndex}"`, e)
  })

  // Create and configure express app
  const app = express()
  app.use(cors())

  // Register dynamic routes
  Object.entries(routes as Routes).forEach(([route, handler]) => {
    app.get(route, async (req, res) => {
      const injectedIndex = injectHTML(indexText, await handler(req))
      return res
        .header('Content-Type', 'text/html')
        .send(injectedIndex)
    })
  })

  // Register static handler
  app.use(express.static(resolvedTarget, { index: resolvedIndex, fallthrough: true }))

  // Register fallback route
  app.use('*', (_req, res) => {
    return res.sendFile(resolvedIndex)
  })

  // Start server
  app.listen(port, () => {
    console.log(`🪣  Epoxy is serving your app at http://${host}:${port}`)
  })
}

export default startServer
