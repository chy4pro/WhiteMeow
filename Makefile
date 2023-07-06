# 定义目标
.PHONY: build_whitemeow

# 定义生成API的规则
build_whitemeow:
	git pull && docker-compose build && docker-compose down && docker-compose up -d
