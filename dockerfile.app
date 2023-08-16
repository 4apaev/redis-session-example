# FROM node:alpine as base
FROM node:alpine

WORKDIR /app

COPY ./src ./src
COPY ./.env ./.env
COPY ./*.json .

RUN npm ci --production

# FROM base as production
CMD [ "node", "src/index.js" ]