FROM node:20-alpine

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/
COPY build /home/app/build

RUN npm ci

CMD npm start