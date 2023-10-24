FROM node:18-alpine3.17 as base
WORKDIR /app/
RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./

FROM base as build
COPY . .
RUN pnpm install
RUN pnpm run build

FROM base as prod
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
RUN pnpm install --prod

CMD pnpm start:prod
