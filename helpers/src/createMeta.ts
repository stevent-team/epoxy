type MetaTags = {
  [property: string]: string
}

const createMeta = (metaTags: MetaTags): string =>
  Object.entries(metaTags)
  .reduce((html, [property, content]) =>
    (property && content) ? `${html}<meta property="${property}" content="${content}">` : html,
    ''
  )

export default createMeta
