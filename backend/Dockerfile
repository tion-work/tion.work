# 使用 Debian 版 Node 镜像（兼容 glibc）
FROM node:20-bullseye-slim

# 安装系统依赖和 Go
RUN apt-get update && apt-get install -y curl bash git wget && \
    # 安装 Go 1.23
    wget https://go.dev/dl/go1.23.3.linux-amd64.tar.gz && \
    tar -C /usr/local -xzf go1.23.3.linux-amd64.tar.gz && \
    rm go1.23.3.linux-amd64.tar.gz && \
    # 设置 Go 环境变量
    echo 'export PATH=$PATH:/usr/local/go/bin' >> /root/.bashrc && \
    echo 'export GOPATH=/root/go' >> /root/.bashrc && \
    echo 'export GOBIN=$GOPATH/bin' >> /root/.bashrc && \
    rm -rf /var/lib/apt/lists/*

# 安装 Cursor CLI
RUN curl https://cursor.com/install -fsS | bash

# 设置环境变量
ENV PATH="/root/.local/bin:/usr/local/go/bin:$PATH"
ENV GOPATH="/root/go"
ENV GOBIN="/root/go/bin"
ENV CURSOR_API_KEY=key_a41791e71f6b02ffe959a88b1f4467387175b3bf93c4471bf9b9b813c2987e9d

# 配置 bashrc 以便进入容器时自动设置 PATH
RUN echo 'export PATH="/root/.local/bin:/usr/local/go/bin:$PATH"' >> /root/.bashrc && \
    echo 'export GOPATH="/root/go"' >> /root/.bashrc && \
    echo 'export GOBIN="/root/go/bin"' >> /root/.bashrc && \
    echo 'alias cursor-agent="/root/.local/bin/cursor-agent"' >> /root/.bashrc

# 设置工作目录
WORKDIR /workspace

# 复制 Go 模块文件
COPY go.mod go.sum ./

# 下载 Go 依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建聊天服务
RUN go build -o chat-service cmd/chat/main.go

# 复制聊天应用前端文件
COPY templates/chat-app.html /workspace/templates/chat-app.html

# 创建启动脚本，自动克隆项目
RUN echo '#!/bin/bash\n\
# 如果项目不存在，则克隆项目\n\
if [ ! -d "/workspace/tion.work" ]; then\n\
    echo "正在克隆 tion.work 项目..."\n\
    git clone https://github.com/tion-work/tion.work.git\n\
    echo "项目克隆完成！"\n\
    echo "项目位置: /workspace/tion.work"\n\
    echo "使用以下命令进入项目目录:"\n\
    echo "  cd /workspace/tion.work"\n\
else\n\
    echo "项目已存在: /workspace/tion.work"\n\
    echo "使用以下命令进入项目目录:"\n\
    echo "  cd /workspace/tion.work"\n\
fi\n\
\n\
# 保持容器运行\n\
exec "$@"' > /usr/local/bin/entrypoint.sh && \
    chmod +x /usr/local/bin/entrypoint.sh

# 设置入口点
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# 启动聊天服务
CMD ["./chat-service"]
