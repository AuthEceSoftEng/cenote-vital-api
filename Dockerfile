FROM node:8.12.0
RUN mkdir -p /app
WORKDIR /app

COPY . .
RUN apt-get update
RUN apt-get install build-essential
RUN yarn
RUN cd client && npm i
RUN npm run build
