# node镜像
FROM node:18.16.0-alpine3.18 as build-stage
RUN echo "-------------------- web环境配置 --------------------"
# 指定接下来的工作路径为/app  - 类似于cd命令
WORKDIR /app
# 拷贝前端项目到app目录下
COPY ./packages ./packages
COPY ./*.json ./
COPY ./*.yaml ./
COPY .npmrc ./
#删除子项目的依赖
RUN rm -rf ./packages/whitemeow-pc/node_modules
RUN rm -rf ./packages/whitemeow-mobile/node_modules

# 安装依赖
RUN npm cache clean --force
RUN npm install -g pnpm
RUN pnpm install
# 打包pc项目
RUN pnpm run build:pc
# 打包h5项目
RUN pnpm run build:mb
# ======================== 上：npm打包  下：nginx运行 ========================
# nginx镜像
FROM nginx:1.15.3-alpine as production-stage
# 移除nginx容器的default.conf文件、nginx配置文件
RUN rm /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/nginx.conf
# 把主机的nginx.conf文件复制到nginx容器的/etc/nginx文件夹下
COPY ./docker/web/nginx.conf /etc/nginx/
# 拷贝打包后的pc项目到nginx下运行
COPY --from=build-stage /app/packages/whitemeow-pc/dist /usr/share/nginx/html
# 拷贝打包后的mobile项目到nginx下运行
COPY --from=build-stage /app/packages/whitemeow-mobile/dist /usr/share/nginx/html/h5
# 暴露80端口
EXPOSE 80
# 使用daemon off的方式将nginx运行在前台保证镜像不至于退出
CMD ["nginx", "-g", "daemon off;"]
