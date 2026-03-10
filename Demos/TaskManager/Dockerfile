# We are going to make a multi-stage Dockerfile that produces
# a minimal production image for our front end, that we can make containers
# based on later.

# We are going to do things multi-stage, because somethings that we need 
# for the build step (Node) are not needed to actually have the app running
# So we can keep our container's size as small as possible. 

# Stage 1: Build
# We can use premade images as part of our own image creation
# We will use the offical Node.js 18 Alpine image
FROM node:18-alpine AS build

# Setting the working directory INSIDE the container
WORKDIR /app

# Because we're using Vite, we can have it inject environment variables for us
# during app startup within our container
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy the package manifest files 
# COPY Source-(Your machine) Destination-(Container File system)
# You can have more than 2 arguments, the final file location is the 
# destination on the container file system
COPY package.json package-lock.json ./

# Install dependencies using npm ci - again because it's deterministic
RUN npm ci

# Copy everything from the current directory (where the Dockerfile is)
# into the working directory
COPY . . 

# Build the production bundle
# outputs the production bundle to /app/dist inside the container
RUN npm run build

# Stage 2, serve the app via Nginx
FROM nginx:alpine

# Copy from the preceding step's production bundle output
# into the location nginx needs our bundle to be in in order to be
# served
COPY --from=build /app/dist /usr/share/nginx/html

# Exposing a port so that we can access our front end from
# outside the container - port 80 is the nginx default. 
EXPOSE 80

# Nginx starts automatically. No additional RUN commands needed.