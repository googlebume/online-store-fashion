FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY packages ./packages
COPY services ./services

RUN npm install

EXPOSE 3003

CMD ["npm", "run", "start", "--workspace=services/product"]
