FROM node:18-alpine as development

WORKDIR /usr/src/app/frontend

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY frontend/package.json /usr/src/app/frontend

RUN npm install -g pnpm

RUN pnpm install

ADD frontend /usr/src/app/frontend

RUN yarn build