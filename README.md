# 🪣 Epoxy

Simple server-side per-route html injection

## Purpose

Epoxy allows for running middleware on select HTTP routes that inject HTML into the served content.
Simply point it at a static directory, define some routes in a script and you're off to the races! :horse:

## Usage

Add as a dependency

```bash
yarn add @stevent-team/epoxy
```

### Options

You can also run `npx epoxy --help` to see this information.

```
epoxy <target> [routeFile] [options]

target     Path to static directory
routeFile  Path to router script

Options:
      --help     Show help                                                     [boolean]
      --version  Show version number                                           [boolean]
  -p, --port     port to use for http server                    [string] [default: 8080]
  -h, --host     host to use for http server               [string] [default: "0.0.0.0"]
  -i, --index    path to index html inside of target    [string] [default: "index.html"]
```

## Example

Create a script to define your dynamic routes.

```js
// Handlers are async functions returning HTML to be injected
const routeHandler = async req => {
  const { params } = req // Get route params from request

  return {
    head: `<meta property="coolness" value="${params.coolness}">`, // Injected into the end of the <head>
    body: 'Howdy!' // Injected into the end of the <body>
  }
}

export default {
  '/some/route/with/:coolness': routeHandler
}
```

<details>
  <summary>See an example using the `createMeta` helper</summary>

  > ### `createMeta` Helper
  >
  > Epoxy comes with a helper that allows you to easily create meta tags from an object.
  >
  > ```js
  > import { createMeta } from '@stevent-team/epoxy/helpers'
  >
  > const routeHandler = async ({ params }) => {
  >   // Create a string of meta tags from the object passed in
  >   const metaTags = createMeta({
  >     coolness: params.coolness,
  >     description: 'A pretty cool page',
  >   })
  >
  >   return { head: metaTags }
  > }
  >
  > export default {
  >   '/route/:coolness': routeHandler
  > }
  > ```
  >
  > For more information about the helpers available in Epoxy, see the [readme](./helpers/README.md).
</details>

Then serve your static directory and dynamic routes!

```bash
epoxy ./dist ./routes.js
```

or setup an npm script

```js
// package.json
{
  "scripts": {
    "serve": "epoxy ./dist ./routes.js"
  }
}
```

## API

Your route handler will be built by Epoxy using Parcel when Epoxy is started. It also has to export a default object with the structure:

```js
export default {
  'express/js/route/:withParams': yourRouteHandlerFunction
}
```

Each route must have a function to handle it, which will receive a `request` object from ExpressJS, from which you can learn about the request. See the express docs for the [request object](https://expressjs.com/en/api.html#req) for more information.

## Contributing

PRs and Issues are more than welcome :)

## License

Created by Stevent (2022) and licensed under MIT
