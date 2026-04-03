# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and .npmrc if it exists
COPY package.json package-lock.json .npmrc* ./

# Install all dependencies (including devDependencies required for build)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the SvelteKit app
RUN npm run build

# Delete all dependencies and install only production dependencies
# This keeps the final image smaller
RUN rm -rf node_modules
RUN npm ci --omit=dev

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy the built app and production dependencies from builder stage
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

# Expose the default port used by adapter-node
EXPOSE 3000

# Start the node server
CMD ["node", "build/index.js"]
