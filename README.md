# 🪣 Epoxy
Simple server-side per-route html injection

## Purpose
Epoxy allows for running middleware on select HTTP routes that inject HTML into the served content.
Simply point it at a static directory, define some routes in a script and you're off to the races :horse:!

## Usage

Add as a dev dependency
```bash
yarn add --dev @stevent/epoxy
```

Create a script to define your dynamic routes. *(requires .mjs extension)*
```js
// Handlers are async functions returning HTML to be injected
const routeHandler = async req => {
  return {
    head: '<meta property="coolness" value="100">', // Injected into the end of the <head>
    body: 'Howdy!' // Injected into the end of the <body>
  }
}

export default [
  "/some/route/with/:param": routeHandler
]
```

Then serve your static directory and dynamic routes!
```bash
epoxy ./dist ./routes.mjs
```

or setup an npm script
```js
// package.json
{
  "scripts": {
    "serve": "epoxy ./dist ./epoxy-routes.mjs"
  }
}
```

### Contributing
PRs and Issues are more than welcome :)

### License
Created by Stevent (2022) and licensed under MIT
