# FROM node:18-alpine as build

# WORKDIR /app

# COPY package*.json ./

# RUN npm cache add -g https://registry.npmjs.org
# RUN npm install --production

# COPY . .

# RUN npm run build

# FROM node:18-alpine

# WORKDIR /app

# COPY --from=build /app/build .

# EXPOSE 3000

# CMD ["npm", "start"]



FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache add -g https://registry.npmjs.org

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]