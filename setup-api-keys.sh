#!/bin/bash

echo "========================================"
echo "  BillLog H5 - API 密钥配置向导"
echo "========================================"
echo ""
echo "本向导将帮助你配置 API 密钥"
echo ""

# 检查 .env.local 是否存在
if [ -f .env.local ]; then
    echo "⚠️  发现已存在的 .env.local 文件"
    echo ""
    read -p "是否要覆盖现有配置？(y/N): " overwrite
    if [[ ! $overwrite =~ ^[Yy]$ ]]; then
        echo ""
        echo "❌ 已取消。你可以手动编辑 .env.local 文件"
        echo "   使用命令: nano .env.local"
        exit 0
    fi
fi

echo ""
echo "----------------------------------------"
echo "1️⃣  DeepSeek API 配置"
echo "----------------------------------------"
echo "用途: AI 消费分析、省钱建议、个性化理财建议"
echo "获取: https://platform.deepseek.com/"
echo ""
read -p "请输入 DeepSeek API 密钥 (按回车跳过): " deepseek_key

echo ""
echo "----------------------------------------"
echo "2️⃣  智谱 GLM API 配置"
echo "----------------------------------------"
echo "用途: 票据图片识别(OCR)、自动提取消费信息"
echo "获取: https://open.bigmodel.cn/"
echo ""
read -p "请输入 GLM API 密钥 (按回车跳过): " glm_key

# 如果两个都为空，提示至少配置一个
if [ -z "$deepseek_key" ] && [ -z "$glm_key" ]; then
    echo ""
    echo "⚠️  警告: 你没有配置任何 API 密钥"
    echo "   - 基础记账功能仍可使用"
    echo "   - AI 功能将不可用"
    echo ""
    read -p "是否继续？(y/N): " continue
    if [[ ! $continue =~ ^[Yy]$ ]]; then
        echo "❌ 已取消"
        exit 0
    fi
fi

# 设置默认值
if [ -z "$deepseek_key" ]; then
    deepseek_key="your_deepseek_api_key_here"
fi

if [ -z "$glm_key" ]; then
    glm_key="your_glm_api_key_here"
fi

# 写入配置文件
cat > .env.local << EOF
# DeepSeek API 密钥 - 用于 AI 消费分析和省钱建议
# 获取方式：访问 https://platform.deepseek.com/ 注册并创建 API 密钥
DEEPSEEK_API_KEY=${deepseek_key}

# 智谱 GLM API 密钥 - 用于图片识别（票据OCR）
# 获取方式：访问 https://open.bigmodel.cn/ 注册并创建 API 密钥
GLM_API_KEY=${glm_key}
EOF

echo ""
echo "✅ 配置文件已创建: .env.local"
echo ""

# 显示配置摘要
echo "----------------------------------------"
echo "📋 配置摘要"
echo "----------------------------------------"

if [ "$deepseek_key" != "your_deepseek_api_key_here" ]; then
    echo "✅ DeepSeek API: 已配置"
else
    echo "⚠️  DeepSeek API: 未配置 (AI 建议功能不可用)"
fi

if [ "$glm_key" != "your_glm_api_key_here" ]; then
    echo "✅ GLM API: 已配置"
else
    echo "⚠️  GLM API: 未配置 (图片识别功能不可用)"
fi

echo ""
echo "----------------------------------------"
echo "⚠️  重要提醒"
echo "----------------------------------------"
echo "1. 配置完成后需要重启开发服务器"
echo "2. 使用 Ctrl+C 停止当前服务器"
echo "3. 运行 ./start-dev.sh 重新启动"
echo ""
echo "如需修改配置，可以："
echo "  - 重新运行此脚本"
echo "  - 或手动编辑: nano .env.local"
echo ""
echo "详细说明请查看: API_KEYS_SETUP.md"
echo ""
echo "========================================="
echo "  配置完成！记得重启服务器 🚀"
echo "========================================="


