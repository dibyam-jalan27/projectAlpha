FROM node:14-alpine
WORKDIR /app/backend

# Copy the backend files to the container
COPY ./backend .

# Set the working directory to the root directory
WORKDIR /app

# Copy the package.json file to the container
COPY ./package.json .

# Install backend dependencies
RUN npm install
  
# Set the command to run your backend
CMD [ "npm", "start" ]