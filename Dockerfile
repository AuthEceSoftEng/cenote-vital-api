FROM node:8.12.0
RUN mkdir -p /app
WORKDIR /app

COPY . .
RUN yarn
RUN cd client && yarn
RUN yarn build
