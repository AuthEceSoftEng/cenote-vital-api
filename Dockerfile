FROM node:lts as client
WORKDIR /usr/app/client/
COPY client/package*.json ./
RUN npm i
COPY client/ ./
RUN npm run build

FROM node:lts
WORKDIR /usr/app
COPY --from=client /usr/app/client/dist/ ./client/dist/
COPY package*.json ./
RUN apt-get update
RUN apt-get install build-essential
RUN npm i
COPY server/ ./server
RUN npm run docs
COPY docs/ ./docs

USER node
EXPOSE 3000
CMD [ "npm", "start" ]
