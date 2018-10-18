FROM node:8.12.0
RUN npm install express
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .
RUN yarn
RUN cd client && yarn
RUN yarn build

#ENV NODE_ENV production

#CMD ["yarn", "start"]
