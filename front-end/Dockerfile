# FROM node:18

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npm", "run", "dev"]

# file below runs a production copy
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm cache add -g https://registry.npmjs.org

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
