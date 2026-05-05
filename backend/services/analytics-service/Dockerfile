FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY packages ./packages
COPY services ./services

RUN npm install
RUN npm run build -w packages/shared && npm run build -w packages/config && npm run build -w services/analytics-service

EXPOSE 5007

CMD ["npm", "run", "start:prod", "-w", "services/analytics-service"]
