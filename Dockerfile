
FROM nginx:alpine

COPY target/task-manager-1.0.0-dist.zip /tmp/app.zip

RUN apk add --no-cache unzip \
    && unzip -o /tmp/app.zip -d /usr/share/nginx/html \
    && rm /tmp/app.zip

EXPOSE 80
