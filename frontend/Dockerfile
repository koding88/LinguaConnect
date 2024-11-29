# Build stage
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Add package files
COPY package*.json ./

# Install dependencies with legacy peer deps flag to handle compatibility
RUN npm ci --legacy-peer-deps

# Copy source files
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

# Install serve
RUN npm install -g serve

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5173

# Start server
CMD ["serve", "-s", "dist", "-l", "5173"]
