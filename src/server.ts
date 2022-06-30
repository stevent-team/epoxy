import path from 'path'
import express, { Request } from 'express'
import cors from 'cors'
import { promises as fs } from 'fs'

import injectHTML from './injectHTML'
import cache from './cache'

export type Injection = { head: string, body: string }
export type RouteHandler = (req: Request) => Promise<Injection>
export type RouteObject = { handler: RouteHandler, key?: any, ttl?: number }
export type RouteValue = RouteHandler | RouteObject
export type Routes = { [route: string]: RouteValue }

// Take the route object and return a handler and optional key
const getRouteObject: (value: RouteValue) => Promise<RouteObject> = async value => {
  if (typeof value === 'function') return { handler: value }
  return value
}

// Take a key that could be a string or function, and resolve to a string
const resolveKey = async (key, req) => {
  if (typeof key === 'function') return key(req)
  return key
}

// Given a route, resolve the handler or serve the cached handler
const resolveHandler = async (
  route: string,
  req: Request,
  value: RouteValue,
  indexText: string,
) => {
  const { handler, key, ttl } = await getRouteObject(value)

  const resolvedKey = await resolveKey(key, req)
  const keyValue = resolvedKey && `${route}-${JSON.stringify(resolvedKey)}`

  const cachedResult = keyValue && await cache.get(keyValue)
  if (cachedResult) {
    return injectHTML(indexText, cachedResult)
  } else {
    const handlerResult = await handler(req)
      .catch(e => console.warn(`Handler for route ${route} threw an error`, e))

    // Save result in cache if key set
    if (keyValue && handlerResult) {
      await cache.set(keyValue, handlerResult, ttl)
    }

    return handlerResult ? injectHTML(indexText, handlerResult) : indexText
  }
}

const startServer = async ({
  host = '0.0.0.0',
  target = './dist',
  index = './dist/index.html',
  port,
  routes,
}) => {
  // Resolve paths
  const resolvedTarget = path.resolve(target)
  const resolvedIndex = path.resolve(index)

  // Read index
  const indexText = await fs.readFile(resolvedIndex, 'utf-8').catch((e) => {
    throw new Error(`Failed to read index "${resolvedIndex}"`, e)
  })

  // Create and configure express app
  const app = express()
  app.use(cors())

  // Register dynamic routes
  Object.entries(routes as Routes).forEach(([route, value]) => {
    app.get(route, async (req, res) => {
      const injectedIndex = await resolveHandler(route, req, value, indexText)
      return res.header('Content-Type', 'text/html').send(injectedIndex)
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
