FROM node:16
ENV PLATFORM="docker"
#ENV NODE_ENV="production"

WORKDIR /usr/vc-modules
COPY ./vc-modules/package*.json ./
COPY ./vc-modules/tsconfig.json ./
RUN npm install
ADD ./vc-modules/src ./src/.
RUN npm run build

WORKDIR /usr/interfaces
COPY ./interfaces/package*.json ./
COPY ./interfaces/tsconfig.json ./
RUN npm install
ADD ./interfaces/src ./src/.
RUN npm run build

WORKDIR /usr/guardian-service
COPY ./guardian-service/package*.json ./
COPY ./guardian-service/tsconfig.json ./
COPY ./guardian-service/config.json ./
COPY ./guardian-service/.env.docker ./.env
RUN npm install
ADD ./guardian-service/src ./src/.
RUN npm run build

CMD npm start
