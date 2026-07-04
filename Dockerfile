FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/index.html /usr/share/nginx/html/index.html
