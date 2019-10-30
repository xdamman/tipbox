FROM node:13-stretch

RUN mkdir /app
WORKDIR /app

CMD [ "node", "server.js" ]
