FROM node:current-alpine

WORKDIR /api

COPY package.json .

RUN npm i

COPY . ./

EXPOSE 5000

CMD ["yarn","dev"]