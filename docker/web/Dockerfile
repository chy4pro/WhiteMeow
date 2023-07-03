# node镜像
FROM node:18.16.0-alpine3.18 as build-stage
RUN echo "-------------------- web环境配置 --------------------"
# 指定接下来的工作路径为/app  - 类似于cd命令
WORKDIR /app
# 拷贝前端项目到app目录下
COPY ./web/package*.json ./
# 安装依赖
RUN npm install
COPY ./web ./
# 打包 - 目的：丢到nginx下跑
RUN npm run build
# ======================== 上：npm打包  下：nginx运行 ========================
# nginx镜像
FROM nginx:1.15.3-alpine as production-stage
# 移除nginx容器的default.conf文件、nginx配置文件
RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf
# 把主机的nginx.conf文件复制到nginx容器的/etc/nginx文件夹下
COPY ./docker/web/nginx.conf /etc/nginx/
# 拷贝前端vue项目打包后生成的文件到nginx下运行
COPY --from=build-stage /app/dist /usr/share/nginx/html
# 暴露80端口
EXPOSE 8081
# 使用daemon off的方式将nginx运行在前台保证镜像不至于退出
CMD ["nginx", "-g", "daemon off;"]