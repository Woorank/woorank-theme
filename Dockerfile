FROM node:0.10.37

RUN npm install -g gulp

RUN mkdir -p /opt/gulp
WORKDIR /opt/gulp

COPY package.json /opt/gulp/

RUN npm install
