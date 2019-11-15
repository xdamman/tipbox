FROM node:13.1-stretch

RUN mkdir /app
WORKDIR /app
COPY . /app
RUN yarn install

CMD [ "yarn", "start" ]
