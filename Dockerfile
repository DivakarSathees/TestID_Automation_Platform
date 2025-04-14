# Use a Node.js base image
FROM node:18-bullseye

# Install dependencies for Chrome
RUN apt-get update && apt-get install -y \
    wget gnupg unzip fonts-liberation libappindicator3-1 \
    libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 \
    libgdk-pixbuf2.0-0 libnspr4 libnss3 libx11-xcb1 libxcomposite1 \
    libxdamage1 libxrandr2 xdg-utils libu2f-udev libvulkan1 \
    libgbm1 libxshmfence1 xvfb \
 && rm -rf /var/lib/apt/lists/*

# Install Chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
 && dpkg -i google-chrome-stable_current_amd64.deb || apt-get -fy install

# Set working directory
WORKDIR /app

# Copy and install app dependencies
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

# Expose a port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
