FROM node:20-alpine
EXPOSE 3002

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/
COPY build /home/app/build

RUN npm ci

CMD npm start