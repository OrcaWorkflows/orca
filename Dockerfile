FROM node:12.13.0-stretch

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY ./ /usr/src/app

COPY package.json /usr/src/app/package.json
EXPOSE 3000

RUN npm config set registry https://registry.npmjs.org/
RUN npm install --verbose
RUN npm install react-scripts@3.0.1 -g --verbose

CMD ["npm", "run", "start"]
