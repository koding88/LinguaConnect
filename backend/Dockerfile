FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies including devDependencies for build
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Clean up devDependencies
RUN npm ci --only=production --legacy-peer-deps

# Create uploads and logs directories with proper permissions
RUN mkdir -p uploads logs && chown -R node:node uploads logs

# Add non-root user
USER node

# Expose port
EXPOSE 3000

# Run app
CMD ["npm", "run", "prod"]
