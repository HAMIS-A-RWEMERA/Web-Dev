# Use the official lightweight Node.js environment
FROM node:20-alpine

# Set the working environment inside the machine
WORKDIR /app

# Copy dependency configuration maps
COPY package*.json ./

# Install SQLite and clean dependencies inside the production container
RUN npm ci --omit=dev

# Copy all your source files (HTML, CSS, JS, database file)
COPY . .

# Inform the system routing portal to match our internal door port
EXPOSE 3005

# Start your native server script node automatically
CMD ["node", "server.js"]
