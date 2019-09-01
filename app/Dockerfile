FROM node:10.16-alpine AS deps
WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --production

FROM node:10.16-alpine
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules/
COPY  src/ ./src/

EXPOSE 8080

CMD ["node", "src/app.js"]
