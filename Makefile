# 定义目标
.PHONY: build

# 定义生成API的规则
build:
	@git pull && docker-compose build && docker-compose down && docker-compose up -d
