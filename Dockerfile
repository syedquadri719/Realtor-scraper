FROM node:18-slim

# Install Puppeteer dependencies only (can be adjusted as needed)
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 libgtk-3-0 \
  --no-install-recommends && \
  apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .

# Skip Chromium download (it’ll still work at runtime if needed)
ENV PUPPETEER_SKIP_DOWNLOAD true
RUN npm install

COPY . .

CMD ["npm", "start"]
