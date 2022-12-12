FROM node:18-alpine as development

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY frontepackage.json .

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN yarn build