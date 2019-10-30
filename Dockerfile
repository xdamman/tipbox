FROM mhart/alpine-node:6

RUN apk update && apk upgrade && apk add --no-cache git bash openssh gnupg

RUN mkdir /app
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

CMD [ "node", "server.js" ]
