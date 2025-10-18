# Multi-stage build for Reddit Image Generator
FROM node:20-slim as base

# Install system dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
wget \
curl \
gnupg \
ca-certificates \
procps \
libxss1 \
libgconf-2-4 \
libxrandr2 \
libasound2 \
libpangocairo-1.0-0 \
libatk1.0-0 \
libcairo-gobject2 \
libgtk-3-0 \
libgdk-pixbuf2.0-0 \
libxcomposite1 \
libxcursor1 \
libxdamage1 \
libxext6 \
libxfixes3 \
libxi6 \
libxrender1 \
libxtst6 \
libxrandr2 \
libasound2 \
libpangocairo-1.0-0 \
libatk1.0-0 \
libcairo-gobject2 \
libgtk-3-0 \
libgdk-pixbuf2.0-0 \
&& rm -rf /var/lib/apt/lists/*

# Install Google Chrome
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
&& echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
&& apt-get update \
&& apt-get install -y google-chrome-stable \
&& rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Install dependencies with timeout and retry
RUN npm config set fetch-timeout 300000 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci --omit=dev --timeout=300000 --retry=3 && \
    npm cache clean --force

# Copy source code
COPY src/ ./src/

# Create non-root user
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Switch to non-root user
USER pptruser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "src/index.js"]
