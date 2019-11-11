FROM node:13-stretch

RUN mkdir /app
COPY . /app
WORKDIR /app
RUN yarn install
RUN yarn build

CMD [ "yarn", "start" ]
