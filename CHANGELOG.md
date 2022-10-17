# @stevent-team/epoxy

## 2.2.0

### Minor Changes

- 6a9fbfb: **Breaking:** Swapped out the cli argument parser from `yargs` to `commander`. `epoxy serve` is no longer a valid command. Use `epoxy` instead.

### Patch Changes

- e70a138: Switched from parcel to esbuild for transpiling routes and package
- 6a9fbfb: Add changesets for versioning

## 2.1.0

### Minor Changes

- In-memory caching of routes

### Patch Changes

- Escape HTML special characters from the content of meta tags

## 2.0.1

### Patch Changes

- Fix GitHub actions

## 2.0.0

### Major Changes

- **Breaking:** Separate cli `build` command

## 1.1.3

### Patch Changes

- Use memory cache to compile routes
- Catch errors within route handlers

## 1.1.0

### Minor Changes

- Epoxy can now build routes file with command line command

### Patch Changes

- Fix error reporting

## 1.0.1

### Patch Changes

- Fix path resolution

## 1.0.0

### Major Changes

- Refactor to nodejs and express
- Updated the namespace of the library to `@stevent-team`

### Minor Changes

- Update README with library usage
- Added the `createMeta` helper
