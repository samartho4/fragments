# Dockerfile for the fragments node.js microservice

# Use a specific version of the official Node image
FROM node:23.5.0

# Image metadata
LABEL maintainer="Samarth <samarthx04@gmail.com>"
LABEL description="Fragments node.js microservice"

# Set environment variables for the service and npm configuration
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files and install node modules
COPY package*.json ./
RUN npm install

# Copy the source code into the container
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Document the port the container listens on
EXPOSE 8080

# Define the command to run the server
CMD npm start
