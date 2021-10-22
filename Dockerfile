FROM node:12.16.1-alpine
RUN apk add --no-cache bash
WORKDIR /usr/src/app/
ADD package.json ./
ADD package-lock.json ./
RUN npm ci

ADD . .
# RUN npm run build

EXPOSE 8000
CMD npm start
