FROM nginx:alpine
# v2 static — 2026-05-23
COPY index.html /usr/share/nginx/html/index.html
COPY media      /usr/share/nginx/html/media
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
