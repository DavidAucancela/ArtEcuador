FROM node:22-alpine AS builder
WORKDIR /app
COPY artecuador-v2/package.json ./
RUN npm install
COPY artecuador-v2/ .
COPY media/ ./public/media/
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/data ./src/data
COPY --from=builder /app/node_modules ./node_modules
ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080
CMD ["node", "./dist/server/entry.mjs"]
