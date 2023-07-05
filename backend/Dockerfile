FROM node:15-alpine
WORKDIR /app/backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "start"]