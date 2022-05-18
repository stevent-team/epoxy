import path from 'path'
import { Parcel } from '@parcel/core'

// Compile the routes file, then import it
const loadRoutes = async (routeFile: string) => {
  const distDir = path.resolve(__dirname, '../routes/')

  // Setup bundler
  const bundler = new Parcel({
    entries: routeFile,
    defaultConfig: '@parcel/config-default',
    mode: 'production',
    shouldDisableCache: true,
    targets: {
      'main': {
        context: 'node',
        distDir,
        engines: {
          node: ">=10"
        },
        scopeHoist: false,
        optimize: false,
      }
    }
  })

  // Build
  const { buildTime } = await bundler.run()
  console.log(`✨ Built routes file in ${buildTime}ms`)

  // Import
  const module = await import(path.resolve(distDir, path.basename(routeFile)))
  return module?.default?.default ?? module?.default
}

export default loadRoutes
