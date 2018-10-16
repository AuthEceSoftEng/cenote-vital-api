FROM node:8.12.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY . .
RUN yarn
RUN yarn build

ENV NODE_ENV production

EXPOSE 8000
CMD ["node", "server"]
