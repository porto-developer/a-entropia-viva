FROM nginx:alpine

ENV PORT=8080

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY index.html admin.html publico.html /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY data /usr/share/nginx/html/data
COPY assets /usr/share/nginx/html/assets

EXPOSE 8080
