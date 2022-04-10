FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN yarn --frozen-lockfile

EXPOSE 8228

CMD [ "yarn", "serve" ]
