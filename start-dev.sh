#!/bin/bash

# 加载 nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 切换到 Node 18
nvm use 18

# 进入项目目录
cd /Users/yuanzexiang/billLog_h5

# 启动开发服务器
npm run dev


