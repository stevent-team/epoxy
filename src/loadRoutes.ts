import { Parcel, createWorkerFarm } from '@parcel/core'
import { MemoryFS } from '@parcel/fs'
import requireFromString from 'require-from-string'

// Compile the routes file, then import it
const loadRoutes = async (routeFile: string, build: boolean) => {
  // Just import a cjs file
  if (!build) {
    console.log(`🎁 Using route file "${routeFile}"`)
    const module = await import(routeFile)
    return module.default?.default ?? module.default
  }

  // Setup bundler using memory file system
  const workerFarm = createWorkerFarm()
  const outputFS = new MemoryFS(workerFarm)
  const bundler = new Parcel({
    workerFarm,
    outputFS,
    entries: routeFile,
    defaultConfig: '@parcel/config-default',
    mode: 'production',
    shouldDisableCache: true,
    targets: {
      'main': {
        context: 'node',
        distDir: 'dist',
        engines: {
          node: ">=10"
        },
        scopeHoist: false,
        optimize: false,
      }
    }
  })

  // Build routes configuration
  const { bundleGraph, buildTime } = await bundler.run()
  console.log(`✨ Built routes file to memory in ${buildTime}ms`)

  const [bundle] = bundleGraph.getBundles()

  // Require from string
  const module = requireFromString(await outputFS.readFile(bundle.filePath, 'utf8'))
  return module.default
}

export default loadRoutes
