FROM node:13.1-stretch

RUN mkdir /app
COPY . /app
WORKDIR /app
RUN yarn install

CMD [ "yarn", "start" ]
