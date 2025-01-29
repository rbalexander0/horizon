FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm install && \
    npm run init && \
    npm run build

EXPOSE 8080

CMD ["node", "server.js"]