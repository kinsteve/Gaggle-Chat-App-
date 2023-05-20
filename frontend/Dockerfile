# Use an official Node.js runtime as the base image
FROM node:16.17.0

# Set the working directory in the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install --legacy-peer-deps

# Copy the entire frontend to the working directory
COPY . .

# Set environment variables, if necessary
# ENV VARIABLE_NAME=value

# Expose the port your frontend is listening on (default: 3000 for React apps)
EXPOSE 3000

# Build the production version of the React app
# RUN npm run build

# Start the frontend server
CMD ["npm", "start"]
