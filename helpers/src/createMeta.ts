type MetaTags = {
  [property: string]: string
}

const createMeta = (metaTags: MetaTags): string =>
  Object.entries(metaTags).reduce((html, [property, content]) => {
    if (!(property && content)) return html // Skip if unset

    // Escape html entities
    const escapedContent = content
      .replace(/"/g, "&quot;")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")

    return `${html}<meta property="${property}" content="${escapedContent}">`
  }, '')

export default createMeta
