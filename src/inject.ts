export const injectHTML = (htmlText, { head, body }) => {
  htmlText = inject(htmlText, '</head>', head)
  htmlText = inject(htmlText, '</body>', body)
  return htmlText
}

const inject = (text, on, insert) =>
  insert ? text.split(on).join(`${insert}${on}`) : text
