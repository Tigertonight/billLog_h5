#!/bin/bash

# Vercel 快速部署脚本
# 使用方法: ./deploy-vercel.sh

set -e

echo "🚀 开始 Vercel 部署流程..."
echo ""

# 检查 Vercel CLI 是否安装
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装"
    echo "📦 正在安装 Vercel CLI..."
    npm i -g vercel
    echo "✅ Vercel CLI 安装完成"
    echo ""
fi

# 检查是否已登录
echo "🔐 检查登录状态..."
if ! vercel whoami &> /dev/null; then
    echo "请先登录 Vercel："
    vercel login
    echo ""
fi

# 显示当前用户
echo "👤 当前用户: $(vercel whoami)"
echo ""

# 确认部署
read -p "📋 是否要部署到生产环境？(y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "🚫 已取消部署"
    exit 0
fi

echo ""
echo "🔍 检查本地构建..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 本地构建成功"
else
    echo "❌ 本地构建失败，请检查错误"
    exit 1
fi

echo ""
echo "📤 开始部署到 Vercel 生产环境..."
vercel --prod

echo ""
echo "🎉 部署完成！"
echo "📊 查看部署状态: vercel ls"
echo "🌐 查看生产环境: vercel inspect --prod"

