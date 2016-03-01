FROM node:4.3.1

RUN npm install -g gulp
RUN npm install -g kss

RUN mkdir -p /opt/gulp
WORKDIR /opt/gulp

COPY package.json /opt/gulp/

RUN npm install
