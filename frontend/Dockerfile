# BUILD stage
FROM node:18-alpine AS builder

# Set BUILD stage workdir to app folder
WORKDIR /app

# Copy package files to workdir
COPY package*.json .

# Install exact dependencies from lockfile
RUN npm ci --silent

# Copy the source code
COPY . .

# Build the project for production
RUN npm run build

# RUN stage
FROM nginx:alpine AS runner

LABEL maintainer="themarcos" \
      description="MedApp - Frontend React" \
      version="1.0.0"

# Copy build artifacts from the BUILD stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE port 80 outside the container
EXPOSE 80

# Use wget to check if the web server is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider \
    http://localhost:80 || exit 1

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]