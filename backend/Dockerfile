FROM node:18.5.0-alpine3.15
WORKDIR /app

# install gcc
RUN apk add --update build-base

# install python3
RUN apk add --update python3

# install java
RUN apk add --update openjdk20

COPY package*.json ./
RUN npm install 
COPY . .

EXPOSE 4000

CMD ["npx", "run", "dev"];
# CMD ["npm", "start"]