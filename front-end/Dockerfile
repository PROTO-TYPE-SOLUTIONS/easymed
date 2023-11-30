FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src/ ./app/src

RUN cd ./app/src && npm run build

FROM builder2 AS final

COPY --from=builder2 ./app/src/dist ./app/

EXPOSE 3000

CMD ["npm", "run", "start"]
