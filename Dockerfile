FROM nginx:latest

WORKDIR /usr/share/nginx/html

COPY ./frontend/* .

RUN apt-get update

EXPOSE 80