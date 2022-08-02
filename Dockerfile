FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN yarn --frozen-lockfile && yarn cache clean

RUN yarn build

EXPOSE 8022

CMD [ "yarn", "serve" ]
