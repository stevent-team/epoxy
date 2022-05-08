# 🪣 epoxy
*Stevent open-graph event proxy*

## Purpose
Epoxy is a http web server that sits in front of the Stevent frontend. For most requests, it forwards them to a built copy of the Stevent react app located in `static/`. However, event detail (`/event/{eventid}`) and club detail (`/club/{clubid}`) requests are embellished with data from the Stevent database. This data is added in the form of opengraph (og) `<meta />` tags in the head of the returned `index.html` file.


## Usage

After cloning the repo and ensuring rust is installed,
```
cargo run
```


## Development

During development, it can be usefull to live-restart the server. To do so you will need `cargo-watch` installed:
```bash
cargo install cargo-watch
```
After `cargo-watch` is installed you can run
```bash
cargo watch -x 'run'
```

## Current Meta Tags
```
- "og:title"
- "og:description"
- "og:image"
- "event:start_time"
- "event:end_time"
- "og:site_name"
- "og:type"
- "twitter:card"
- "theme-color"
```
