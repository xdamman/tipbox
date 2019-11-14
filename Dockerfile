FROM node:13.1-stretch

RUN mkdir /app
WORKDIR /app

CMD [ "yarn", "start" ]
