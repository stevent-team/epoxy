export const loadRoutesFile = async routes => {
  const module = await import(routes)
  return module?.default
}
