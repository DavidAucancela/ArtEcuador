# Build Astro site
FROM node:22-alpine AS builder
WORKDIR /app
# Copy full repo so the artecuador-v2/public/media symlink resolves to /app/media
COPY . .
WORKDIR /app/artecuador-v2
RUN npm ci && npm run build

# Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/artecuador-v2/dist /usr/share/nginx/html
COPY --from=builder /app/artecuador-v2/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
