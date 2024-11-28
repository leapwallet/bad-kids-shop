# Use Node.js LTS as base image
FROM node:20-alpine

# Install dependencies needed for node-gyp and global packages
RUN apk add --no-cache python3 make g++ git

# Set working directory
WORKDIR /app

# Copy package files first
COPY package.json ./
COPY yarn.lock ./

# Copy config files
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY tsconfig*.json ./

# Install dependencies with specific flags to handle peer dependencies
RUN yarn install --network-timeout 1000000 --ignore-engines --ignore-platform --legacy-peer-deps

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