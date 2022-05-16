#!/usr/bin/env node
import yargs from 'yargs'

import { loadRoutesFile } from 'routes'
import startServer from 'server'
import path from 'path'

const serve = async ({ target, routes, host, port, index }) => {
  // Load routes
  const resolvedRoutes = routes ? path.resolve(__dirname, routes) : ''
  const routesMap = routes ? (await loadRoutesFile(resolvedRoutes)
    .catch(() => { throw new Error(`Failed to load routes file: ${resolvedRoutes}`) })) : {}

  if (!Object.keys(routesMap)?.length) {
    console.warn('No dynamic routes configured')
  } else {
    console.log(`🪴  Configured ${Object.keys(routesMap).length} dynamic route(s)`)
  }

  // Start server
  return startServer({
    host,
    port,
    target,
    routes: routesMap,
    index: path.join(target, index),
  })
}

yargs
  .scriptName("epoxy")
  .usage('$0 serve <target> [routes] [options]')
  .command(['serve <target> [routes]', '$0 <target>'], 'Serve the provided static folder', (yargs) => {
    yargs
      .positional('target', { describe: 'Path to static directory', require: true })
      .positional('routes', { describe: 'Path to routes script' })
  }, serve)
  .option('port', {
    alias: 'p',
    type: 'string',
    description: 'port to use for http server',
    default: 8080,
  })
  .option('host', {
    alias: 'h',
    type: 'string',
    description: 'host to use for http server',
    default: '0.0.0.0',
  })
  .option('index', {
    alias: 'i',
    type: 'string',
    description: 'path to index html inside of target',
    default: 'index.html',
  })
  .argv
