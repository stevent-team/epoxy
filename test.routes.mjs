const eventDetailRoute = async (req) => {
  return { head: `<meta property="coolness" value="100">` }
}

export default {
  '/event/:eventid': eventDetailRoute,
}
