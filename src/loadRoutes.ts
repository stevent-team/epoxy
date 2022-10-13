import esbuild from 'esbuild'
import requireFromString from 'require-from-string'

// Compile the routes file, then import it
const loadRoutes = async (routeFile: string, build: boolean) => {
  // Just import a cjs file
  if (!build) {
    console.log(`🎁 Using route file "${routeFile}"`)
    const module = await import(routeFile)
    return module.default?.default ?? module.default
  }

  // Build to memory
  const startTime = new Date().getTime()
  const result = await esbuild.build({
    entryPoints: [routeFile],
    platform: 'node',
    outdir: 'out',
    bundle: true,
    format: 'cjs',
    external: ['./node_modules/*'],
    target: 'node16',
    write: false,
  })
  console.log(`✨ Built routes file to memory in ${new Date().getTime() - startTime}ms`)

  // Require from string
  const module = requireFromString(Buffer.from(result.outputFiles[0].contents).toString())
  return module.default
}

export default loadRoutes
