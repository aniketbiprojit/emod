FROM node:18-alpine as development

WORKDIR /usr/src/app

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY frontend/package.json .

RUN npm install -g pnpm

RUN pnpm install

COPY frontend/* . 
COPY frontend/.* . 

RUN yarn build