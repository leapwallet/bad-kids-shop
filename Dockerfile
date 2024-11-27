# Use Node.js LTS as base image
FROM node:20-alpine

# Install dependencies needed for node-gyp and global packages
RUN apk add --no-cache python3 make g++ git

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json yarn.lock ./

# Copy config files
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY tsconfig*.json ./

# Clear existing files and install with yarn
RUN rm -rf node_modules && \
    rm -rf .next && \
    rm -rf yarn.lock && \
    yarn cache clean && \
    yarn install --network-timeout 100000

# Copy the rest of the application
COPY . .

# Initialize Tailwind (force overwrite any existing config)
RUN npx tailwindcss init -p --force

# Set NODE_ENV to development explicitly
ENV NODE_ENV=development
ENV NODE_OPTIONS="--max-old-space-size=4096"

EXPOSE 3000

# Use yarn for running the dev server
CMD ["yarn", "dev"]
