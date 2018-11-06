FROM node:8.12.0
RUN mkdir -p /app
WORKDIR /app

COPY . .
RUN yarn
RUN cd client && npm i
RUN npm run build
