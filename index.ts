#!/usr/bin/env node
import yargs from 'yargs'
import path from 'path'
import { Parcel } from '@parcel/core'

import loadRoutes from './src/loadRoutes'
import startServer, { Routes } from './src/server'

const serve = async ({ target, routeFile, host, port, index, build }) => {
  // Load routes
  let routes: Routes = {}
  if (routeFile) {
    const resolvedRoutes = path.resolve(routeFile)
    routes = await loadRoutes(resolvedRoutes, build).catch(e => {
      throw new Error(`Failed to load routes file "${resolvedRoutes}": ${e}`)
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

const build = async ({ routeFile, outputDir }) => {
  // Setup bundler
  const bundler = new Parcel({
    entries: routeFile,
    defaultConfig: '@parcel/config-default',
    mode: 'production',
    shouldDisableCache: true,
    targets: {
      'main': {
        context: 'node',
        distDir: outputDir,
        engines: {
          node: ">=10"
        },
        scopeHoist: false,
        optimize: false,
      }
    }
  })

  // Build routes configuration
  const { buildTime } = await bundler.run()
  console.log(`✨ Built routes file in ${buildTime}ms`)
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
      .positional('routeFile', { describe: 'Path to cjs router script (can use ES6 with --build option)' })
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
      .option('build', {
        alias: 'b',
        type: 'boolean',
        description: 'build routes file in memory',
        default: false,
      }),
    serve
  )
  .command(
    'build <routeFile>',
    'Build a routes file',
    yargs => yargs
      .positional('routeFile', { describe: 'Path to ES6 router script', require: true })
      .option('outputDir', {
        alias: 'o',
        type: 'string',
        description: 'folder to output built routes file',
        default: 'dist',
      }),
    build
  )
  .argv
