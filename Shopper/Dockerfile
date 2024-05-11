FROM node:20-alpine
EXPOSE 3000

WORKDIR /home/app

COPY .next/ /home/app/.next/
COPY package.json /home/app/
COPY package-lock.json /home/app/
COPY next.config.mjs/ /home/app/
COPY next-i18next.config.js/ /home/app/
COPY public/ /home/app/public/

RUN npm ci
CMD npm run start