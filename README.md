# WhiteMeow
白小喵，是一个集成chatgpt等功能的AI聊天系统。

## 目录结构
```
├── web
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

一键启动：
```docker-compose up -d```