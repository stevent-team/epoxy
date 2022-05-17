#!/usr/bin/env node
import yargs from 'yargs'
import path from 'path'

import loadRoutes from './src/loadRoutes'
import startServer, { Routes } from './src/server'

const serve = async ({ target, routeFile, host, port, index }) => {
  // Load routes
  let routes: Routes = {}
  if (routeFile) {
    const resolvedRoutes = path.resolve(__dirname, routeFile)
    routes = await loadRoutes(resolvedRoutes).catch(() => {
      throw new Error(`Failed to load routes file: ${resolvedRoutes}`)
    })
  }

  const routeCount = Object.keys(routes)?.length ?? 0
  if (routeCount === 0) {
    console.warn('No dynamic routes configured')
  } else {
    console.log(`🪴  Configured ${routeCount} dynamic route${routeCount !== 1 ? 's' : ''}`)
  }

  // Start server
  return startServer({
    host,
    port,
    target,
    routes,
    index: path.join(target, index),
  })
}

// Use yargs to parse command line options
yargs
  .scriptName("epoxy")
  .usage('$0 serve <target> [routeFile] [options]')
  .command(
    ['serve <target> [routeFile]', '$0 <target> [routeFile]'],
    'Serve the provided static folder',
    yargs => yargs
      .positional('target', { describe: 'Path to static directory', require: true })
      .positional('routeFile', { describe: 'Path to router script' }),
    serve
  )
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
