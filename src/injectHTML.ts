import { Injection } from 'server'

// Inject strings into specific places in the html
const injectHTML = (htmlText: string, { head, body }: Injection): string => {
  htmlText = inject(htmlText, '</head>', head)
  htmlText = inject(htmlText, '</body>', body)
  return htmlText
}

const inject = (text: string, on: string, insert: string): string =>
  insert ? text.split(on).join(`${insert}${on}`) : text

export default injectHTML
