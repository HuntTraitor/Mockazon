FROM node:20-alpine

WORKDIR /home/app

COPY package.json /home/app/
COPY package-lock.json /home/app/
COPY .env /home/app/

COPY AuthService/build/ /home/app/AuthService/build/
COPY AuthService/package.json /home/app/AuthService/
COPY AuthService/package-lock.json /home/app/AuthService

COPY ProductService/build/ /home/app/ProductService/build/
COPY ProductService/package.json /home/app/ProductService/
COPY ProductService/package-lock.json /home/app/ProductService

COPY OrderService/build/ /home/app/OrderService/build/
COPY OrderService/package.json /home/app/OrderService/
COPY OrderService/package-lock.json /home/app/OrderService

COPY KeyService/build/ /home/app/KeyService/build/
COPY KeyService/package.json /home/app/KeyService/
COPY KeyService/package-lock.json /home/app/KeyService

RUN npm run ms-cis

CMD npm run ms-starts