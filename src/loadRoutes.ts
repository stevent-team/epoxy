// Dynamically import the routes file
const loadRoutes = async (routeFile: string) => {
  const module = await import(routeFile)
  return module?.default?.default ?? module?.default
}

export default loadRoutes
