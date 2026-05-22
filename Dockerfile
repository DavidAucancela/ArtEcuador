# Build Astro site
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies first (better layer caching)
COPY artecuador-v2/package*.json ./
RUN npm ci

# Copy Astro source and media separately (avoids symlink resolution issues)
COPY artecuador-v2 .
COPY media ./public/media

RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
