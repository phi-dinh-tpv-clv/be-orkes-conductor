#! /bin/sh
FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

COPY ./.env.example ./.env

CMD ["npm", "run", "start:dev"]
