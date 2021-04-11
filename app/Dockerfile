FROM node:14-stretch as base

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

RUN apt-get update


COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

ENV HOST=0.0.0.0
ENV PORT=3000

ENV POSTGRES_HOST=db
ENV POSTGRES_USER=root
ENV POSTGRES_DB=root
ENV POSTGRES_PORT=5432
ENV POSTGRES_PASSWORD=qwerty


EXPOSE $PORT



FROM base as dev
CMD ["npm", "run", "dev"]

FROM base as prod
CMD ["npm", "run", "prod"]
