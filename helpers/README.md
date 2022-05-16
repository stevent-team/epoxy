# 🧼 Epoxy Helpers

A collection of helpers to use with Epoxy

## createMeta

A function that will help create meta tags based on an object

### Example

```js
import { createMeta } from 'epoxy/helpers'

const meta = {
  'og:title': 'My Page',
  'og:description': 'Here lies my things',
  'og:image': 'https://my.page/image.jpg',
}

console.log(createMeta(meta))
/*
  <meta property="og:title" value="My Page">
  <meta property="og:description" value="Here lies my things">
  <meta property="og:image" value="https://my.page/image.jpg">
*/
```
