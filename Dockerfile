# Build Astro site — explicit file copies, no symlinks
FROM node:22-alpine AS builder
WORKDIR /app

# 1. Dependencies (cached layer)
COPY artecuador-v2/package.json artecuador-v2/package-lock.json ./
RUN npm ci

# 2. Astro source (no public/media — that's a symlink we handle below)
COPY artecuador-v2/src            ./src
COPY artecuador-v2/public/styles  ./public/styles
COPY artecuador-v2/public/favicon.ico artecuador-v2/public/favicon.svg ./public/
COPY artecuador-v2/astro.config.mjs artecuador-v2/tsconfig.json ./
COPY artecuador-v2/nginx.conf     ./nginx.conf

# 3. Media files (direct copy — bypasses symlink entirely)
COPY media ./public/media

# 4. Build
RUN npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist              /usr/share/nginx/html
COPY --from=builder /app/nginx.conf        /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

