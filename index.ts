#!/usr/bin/env node
import { InvalidArgumentError, program } from 'commander'
import path from 'path'
import esbuild from 'esbuild'

import loadRoutes from './src/loadRoutes'
import startServer, { Routes } from './src/server'
import { version } from './package.json'

const serve = async ({ target, routeFile, host, port, index, build, cache }) => {
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
    cache,
  })
}

const build = async ({ routeFile, outputDir }) => {
  const startTime = new Date().getTime()
  // Build routes configuration
  await esbuild.build({
    entryPoints: [routeFile],
    platform: 'node',
    outdir: outputDir,
    bundle: true,
    format: 'cjs',
    external: ['./node_modules/*'],
    target: 'node16',
  })
  console.log(`✨ Built routes file in ${new Date().getTime() - startTime}ms`)
}

// Use command-line-options to parse command line options
program
  .name('epoxy')
  .description('Serve the provided static folder')
  .version(version)
  .argument('<target>', 'Path to static directory')
  .argument('[routeFile]', 'Path to cjs router script (can use ES6 with --build option)')
  .option('-p, --port <port>', 'port to use for http server', v => {
    const parsed = parseInt(v)
    if (isNaN(parsed)) throw new InvalidArgumentError('Not a number')
    return parsed
  }, 8080)
  .option('-h, --host <url>', 'host to use for http server', '0.0.0.0')
  .option('-i, --index <path>', 'path to index html inside of target', 'index.html')
  .option('-b, --build', 'build routes file in memory', false)
  .option('--no-cache', 'disable all route handler result caching', true)
  .action((target, routeFile, options) => serve({ target, routeFile, ...options }))

program.command('build')
  .description('Build a routes file')
  .argument('<routeFile>', 'Path to ES6 router script')
  .option('-o, --outputDir <path>', 'folder to output built routes file', 'dist')
  .action((routeFile, options) => build({ routeFile, ...options }))

program.parse()
