# STAGE 1: Setup Node.js Backend
FROM node:18-alpine AS backend-setup
WORKDIR /app/backend
# Copy package files first for better caching
COPY backend/package*.json ./
RUN npm install --production
# Copy the rest of the backend source code
COPY backend/ ./

# STAGE 2: Final Production Image with Nginx
FROM nginx:alpine

# Install Node.js in the Nginx image to run the backend process
RUN apk add --update nodejs npm

WORKDIR /app

# Copy backend from Stage 1
COPY --from=backend-setup /app/backend /app/backend

# Copy custom Nginx configuration (Reverse Proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Port 80 (The standard web port)
EXPOSE 80

# Start both Node.js and Nginx
# Node runs in the background (&), Nginx runs in the foreground
CMD ["sh", "-c", "node /app/backend/server.js & nginx -g 'daemon off;'"]