FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN yarn --frozen-lockfile

RUN yarn build

EXPOSE 8228

CMD [ "yarn", "serve" ]
