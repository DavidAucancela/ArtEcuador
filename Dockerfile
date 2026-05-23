FROM node:22-alpine AS builder
WORKDIR /app

# Instalar dependencias
COPY artecuador-v2/package*.json ./
RUN npm ci --omit=dev

# Copiar código fuente y media
COPY artecuador-v2/ .
COPY media/ ./public/media/

# Build estático
RUN npm run build

# Servir con nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY artecuador-v2/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
