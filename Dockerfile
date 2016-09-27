FROM node:6

RUN npm install -g gulp
RUN npm install -g kss@2

RUN mkdir -p /opt/gulp
WORKDIR /opt/gulp

COPY package.json /opt/gulp/

RUN npm install
