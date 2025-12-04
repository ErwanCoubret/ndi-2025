FROM node:23-slim

ENV TZ=Europe/Paris

WORKDIR /next-app

COPY package*.json ./
RUN npm install pnpm -g
RUN pnpm install

COPY . .

