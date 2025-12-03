# Build stage
FROM node:25-alpine AS build

WORKDIR /app

# Accept version as a build argument
ARG VERSION=dev

# Copy package files
COPY package*.json ./

# Skip Cypress binary installation as it's not needed for builds
ENV CYPRESS_INSTALL_BINARY=0

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set version environment variable for Vite
ENV npm_package_version=$VERSION

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
