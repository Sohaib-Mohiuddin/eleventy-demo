# Use a small Node image
FROM node:24-alpine

# Create non-root workspace
WORKDIR /app

# Install system deps needed by some npm packages (optional but safe)
RUN apk add --no-cache git

# Copy manifest first for better build caching
COPY package.json package-lock.json* ./

# Install dependencies (ci = clean, deterministic)
RUN npm install --force

# Copy the rest of the project
COPY . .

# Eleventy will serve on 8080; Browsersync UI on 3001
EXPOSE 8080

# Default: development server (overridden by docker-compose for dev)
CMD ["npm","run","dev"]
