FROM node:18.16.0-alpine3.18

WORKDIR /frontend/
COPY ./web .

RUN yarn && yarn build

FROM nginx:alpine
LABEL MAINTAINER="SliverHorn@sliver_horn@qq.com"

COPY docker/web2/nginx/conf.d/my.conf /etc/nginx/conf.d/my.conf
COPY --from=0 /frontend/dist /usr/share/nginx/html
# 暴露80端口
EXPOSE 80

RUN cat /etc/nginx/nginx.conf && cat /etc/nginx/conf.d/my.conf && ls -al /usr/share/nginx/html
