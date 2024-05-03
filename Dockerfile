FROM node:20-alpine
EXPOSE 3000

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

COPY HelloWorld/.next/ /home/app/HelloWorld/.next/
COPY HelloWorld/package.json /home/app/HelloWorld/
COPY HelloWorld/package-lock.json /home/app/HelloWorld/
COPY HelloWorld/next.config.mjs/ /home/app/HelloWorld/
COPY HelloWorld/public/ /home/app/HelloWorld/public/

RUN npm run cis

CMD npm run start