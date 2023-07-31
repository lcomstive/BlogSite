FROM node:20-alpine

# Set default environment variables if not present
ENV NODE_ENV=${NODE_ENV:-development}
ENV PORT=${PORT:-3000}

WORKDIR /Blog

# Install app dependencies
# (wildcard to copy both package.json and package-lock.json)
COPY package*.json ./
RUN if [[ "$NODE_ENV" = "production" ]]; then npm ci --omit=dev; else npm i; fi

# Copy source to working directory
COPY . .

# Open listen port
EXPOSE ${PORT}

# Run application
CMD [ "node", "index.js" ]