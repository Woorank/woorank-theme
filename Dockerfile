FROM node:6

RUN mkdir -p /opt/gulp
WORKDIR /opt/gulp

COPY package.json /opt/gulp/

RUN npm install
