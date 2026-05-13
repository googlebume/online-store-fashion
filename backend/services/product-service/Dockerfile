FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY packages ./packages
COPY services ./services

RUN npm install
RUN npm run build -w packages/shared && npm run build -w packages/config && npm run build -w services/product-service

EXPOSE 5002

CMD ["npm", "run", "start:prod", "-w", "services/product-service"]
