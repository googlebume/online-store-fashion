FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
COPY packages ./packages
COPY services ./services

RUN npm install
RUN npm run build -w packages/shared && npm run build -w packages/config && npm run build -w services/database

EXPOSE 5000 5001

COPY services/database/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
