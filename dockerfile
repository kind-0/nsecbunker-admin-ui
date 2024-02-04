# syntax=docker/dockerfile:1
FROM node:20.11-bullseye AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .
RUN npm run build

# Runtime stage
FROM node:20.11-alpine as runtime
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app .

# Install only runtime dependencies
RUN npm install --only=production

EXPOSE 30000

ENTRYPOINT [ "node", "./build/index.js" ]
