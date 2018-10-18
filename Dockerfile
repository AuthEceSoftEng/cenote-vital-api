FROM node:8.12.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
EXPOSE 8000

COPY . .
RUN yarn
RUN cd client && yarn
RUN yarn build

ENV NODE_ENV production

CMD ["yarn", "start"]
