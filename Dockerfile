# syntax=docker/dockerfile:1

# ---------- build stage ----------
FROM node:22.16.0-bookworm-slim AS build

WORKDIR /app

ENV NUXT_TELEMETRY_DISABLED=1 \
    CI=1

COPY package.json package-lock.json ./
# --ignore-scripts: skip postinstall (nuxt prepare / git hooks / npm audit) — not needed for a build
RUN npm ci --ignore-scripts --no-audit --no-fund

COPY . .

# call nuxt directly to skip the `prebuild` hook (git hooks + audit report)
RUN npx nuxt build

# ---------- runtime stage ----------
FROM node:22.16.0-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000

COPY --from=build /app/.output ./.output

EXPOSE 3000

USER node

CMD ["node", ".output/server/index.mjs"]
