FROM registry.gitlab.com/mango-nxt/cached-images/node:12 AS mango-nxt-base
WORKDIR /app
COPY package.json .
RUN npm install

FROM registry.gitlab.com/mango-nxt/cached-images/node:12 as mango-nxt-packages
WORKDIR /app
COPY --from=mango-nxt-base /app/node_modules node_modules
COPY . .
RUN npm run build

FROM registry.gitlab.com/mango-nxt/monorepo/nginx:stable-alpine as admin
LABEL version="1.0"
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY --from=mango-nxt-packages /app/dist/green-town .
