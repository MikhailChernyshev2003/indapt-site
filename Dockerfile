# syntax=docker/dockerfile:1

# Образ собирается из готового .output: nuxt build прогоняется на машине
# разработчика, на сервер уезжает только результат. Полная сборка внутри
# контейнера серверу не по силам — там 2 ГБ памяти на все контейнеры разом

FROM node:22.16.0-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000

COPY .output ./.output

EXPOSE 3000

USER node

CMD ["node", ".output/server/index.mjs"]
