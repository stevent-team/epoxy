FROM rust:1.60.0 as build
ENV PKG_CONFIG_ALLOW_CROSS=1

WORKDIR /usr/src/epoxy
COPY . .

RUN cargo install --path .

FROM gcr.io/distroless/cc

COPY --from=build /usr/local/cargo/bin/epoxy /usr/local/bin/epoxy
COPY --from=build /usr/src/epoxy/static ./static

CMD ["epoxy"]
