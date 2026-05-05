FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY packages ./packages
COPY services ./services

RUN npm install
RUN npm run build -w packages/shared && npm run build -w packages/config && npm run build -w services/order-service

EXPOSE 4006 5006

CMD ["npm", "run", "start:prod", "-w", "services/order-service"]
