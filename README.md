# WhiteMeow
白小喵，是一个集成chatgpt等功能的AI聊天系统的前端项目。

## 目录结构
```
├── web                            -- web项目文件
│   ├── favicon.ico
│   ├── index.html                 -- 主页面
│   ├── package.json               -- 包管理器代码
│   ├── src                        -- 源代码
│   └── vite.config.js             -- vite 配置文件
├── docker                         -- 对应服务下的 Dockerfile 和配置文件
│   └── web
│       ├── Dockerfile             -- web项目的 Dockerfile
│       └── nginx.conf             -- web项目的 nginx配置文件
└── docker-compose.yml             -- docker-compose 配置文件
```

## 项目部署
```shell
cd /www/wwwroot/WhiteMeow           #进入项目目录
git pull                            #拉取最新代码
docker-compose build                #打包
docker-compose down                 #关闭服务
docker-compose up -d                #启用服务
```
