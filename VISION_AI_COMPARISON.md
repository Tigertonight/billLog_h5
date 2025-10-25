# 支持图像识别的大模型对比

## 综合调研结果

根据最新调研，以下是支持图像识别的主流大模型及其特点：
- 官网：https://open.bigmodel.cn/

## 一、国内大模型

### 1. 智谱AI - GLM-4V ✅ **强烈推荐**

**基本信息：**
- 模型：`glm-4v` / `glm-4v-plus`
- 状态：✅ 已支持图像识别
- 语言：中文优化

**优势：**
- ✅ **中文理解优秀**：针对中文票据优化
- ✅ **价格实惠**：比OpenAI便宜约70%
- ✅ **API兼容OpenAI格式**：代码几乎不需要改动
- ✅ **响应速度快**：国内服务器，延迟低
- ✅ **免费额度**：新用户有一定免费token

**价格：**
- GLM-4V：¥0.01/千tokens（输入）+ ¥0.03/千tokens（输出）
- 图片处理：¥0.01/张

**API示例：**
```typescript
const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'glm-4v',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: '请识别这张票据的金额和商家'
          },
          {
            type: 'image_url',
            image_url: {
              url: imageBase64  // 支持base64或URL
            }
          }
        ]
      }
    ]
  })
})
```

---

### 2. 阿里云 - 通义千问 Qwen-VL ✅ **推荐**

**基本信息：**
- 官网：https://dashscope.aliyun.com/
- 模型：`qwen-vl-plus` / `qwen-vl-max` / `qwen2-vl-7b`
- 状态：✅ 已支持图像识别
- 特点：视觉理解冠军

**优势：**
- ✅ **性能最强**：多项评测超越GPT-4V
- ✅ **支持长视频**：可处理超1小时视频
- ✅ **OCR能力强**：文字识别准确率高
- ✅ **中文优化**：票据、发票识别准确

**价格：**
- Qwen-VL-Plus：¥0.008/千tokens
- Qwen-VL-Max：¥0.02/千tokens

**API示例：**
```python
from dashscope import MultiModalConversation

response = MultiModalConversation.call(
    model='qwen-vl-plus',
    messages=[{
        'role': 'user',
        'content': [
            {'text': '识别票据信息'},
            {'image': image_url}
        ]
    }]
)
```

---

### 3. Kimi (Moonshot AI) ❌ **暂不支持**

**基本信息：**
- 官网：https://platform.moonshot.cn/
- 模型：`moonshot-v1-8k` / `moonshot-v1-32k` / `moonshot-v1-128k`
- 状态：❌ **当前不支持图像识别**
- 特点：超长上下文（最高128k）

**说明：**
- Kimi目前专注于文本处理
- 主打超长上下文对话
- **不支持图片输入**
- 未来可能会推出多模态版本

---

### 4. 百度 - 文心一言 ERNIE-Bot ⚠️ **有限支持**

**基本信息：**
- 官网：https://cloud.baidu.com/
- 模型：`ERNIE-Bot-4` / `ERNIE-ViL`
- 状态：⚠️ 部分支持
- 特点：需要企业认证

**说明：**
- 文心一言4.0支持图文理解
- 需要企业账号和实名认证
- API调用较复杂

---

## 二、国际大模型

### 1. OpenAI - GPT-4V / GPT-4O ✅ **性能最佳**

**基本信息：**
- 官网：https://platform.openai.com/
- 模型：`gpt-4-vision-preview` / `gpt-4o`
- 状态：✅ 成熟稳定
- 特点：行业标杆

**优势：**
- ✅ **识别准确率最高**
- ✅ **API稳定可靠**
- ✅ **文档完善**
- ✅ **支持detail参数**（高清/标清模式）

**劣势：**
- ❌ 价格较高
- ❌ 需要国际支付
- ❌ 国内访问可能受限

**价格：**
- GPT-4V：$0.01/图 + $0.03/千tokens
- GPT-4O：$0.005/图 + $0.015/千tokens（更便宜）

---

### 2. Anthropic - Claude 3 ✅ **推荐**

**基本信息：**
- 官网：https://www.anthropic.com/
- 模型：`claude-3-opus` / `claude-3-sonnet` / `claude-3-haiku`
- 状态：✅ 支持视觉
- 特点：安全性强

**优势：**
- ✅ 高准确率
- ✅ 支持PDF直接识别
- ✅ 价格比GPT-4V便宜

**价格：**
- Claude 3 Opus：$0.015/图
- Claude 3 Sonnet：$0.003/图
- Claude 3 Haiku：$0.0003/图

---

### 3. Google - Gemini Pro Vision ✅

**基本信息：**
- 官网：https://ai.google.dev/
- 模型：`gemini-pro-vision` / `gemini-1.5-pro`
- 状态：✅ 支持
- 特点：免费额度大

**优势：**
- ✅ 免费额度较高
- ✅ 多模态能力强
- ✅ 支持长上下文

---

## 三、推荐方案对比

### 方案对比表

| 模型 | 是否支持 | 中文能力 | 价格 | API难度 | 推荐度 |
|-----|---------|---------|------|---------|--------|
| **智谱GLM-4V** | ✅ | ⭐⭐⭐⭐⭐ | ¥¥ | ⭐ | ⭐⭐⭐⭐⭐ |
| **通义千问Qwen-VL** | ✅ | ⭐⭐⭐⭐⭐ | ¥ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **OpenAI GPT-4V** | ✅ | ⭐⭐⭐⭐ | ¥¥¥¥ | ⭐ | ⭐⭐⭐⭐ |
| **OpenAI GPT-4O** | ✅ | ⭐⭐⭐⭐ | ¥¥¥ | ⭐ | ⭐⭐⭐⭐ |
| **Claude 3 Sonnet** | ✅ | ⭐⭐⭐ | ¥¥ | ⭐⭐ | ⭐⭐⭐ |
| **Gemini Pro Vision** | ✅ | ⭐⭐⭐ | ¥ | ⭐⭐ | ⭐⭐⭐ |
| DeepSeek | ❌ | - | - | - | ❌ |
| Kimi | ❌ | - | - | - | ❌ |

---

## 四、针对您项目的推荐

### 🏆 最佳选择：智谱 GLM-4V

**理由：**

1. ✅ **完美支持中文票据**
   - 对中文场景优化
   - 识别中文商家名称准确
   - 理解中文金额格式

2. ✅ **API格式兼容OpenAI**
   - 代码几乎不需要修改
   - 只需更换endpoint和API key
   - 学习成本低

3. ✅ **价格实惠**
   - 比OpenAI便宜70%+
   - 新用户有免费额度
   - 适合长期运营

4. ✅ **国内访问稳定**
   - 服务器在国内
   - 响应速度快
   - 不需要科学上网

5. ✅ **成熟可靠**
   - 智谱AI是清华系公司
   - API稳定，文档完善
   - 技术支持响应快

---

## 五、快速集成指南

### 使用智谱GLM-4V的步骤

#### 1. 注册获取API Key

访问：https://open.bigmodel.cn/
- 注册账号
- 创建API Key
- 获取免费额度

#### 2. 添加环境变量

```env
# .env.local
GLM_API_KEY=your_glm_api_key_here
```

#### 3. 修改代码（我可以帮您实现）

```typescript
// lib/deepseek.ts 中添加
export async function parseReceiptImageGLM(imageBase64: string): Promise<ReceiptParseResult> {
  const apiKey = process.env.GLM_API_KEY
  
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'glm-4v',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageBase64 } }
          ]
        }
      ]
    })
  })
  
  // ... 解析响应
}
```

---

## 六、其他备选方案

### 备选1：通义千问 Qwen-VL
- **适用场景**：需要最高准确率
- **优势**：性能最强，OCR能力突出
- **缺点**：API格式稍有不同

### 备选2：OpenAI GPT-4O
- **适用场景**：预算充足，要求最高
- **优势**：最成熟稳定
- **缺点**：价格高，需要国际支付

---

## 七、总结

### Kimi 和 GLM 的答案：

- **Kimi**：❌ **暂不支持图像识别**，仅支持文本
- **GLM-4V**：✅ **完全支持图像识别**，且非常适合您的项目

### 我的建议：

**立即使用智谱 GLM-4V**，原因：
1. 中文票据识别准确
2. 价格实惠（约¥0.01/次）
3. API兼容性好，代码改动小
4. 国内访问稳定快速
5. 有免费额度可以测试

---

## 下一步

请告诉我您的决定，我可以立即帮您：

1. ✅ **集成智谱GLM-4V**（强烈推荐）
2. ✅ **集成通义千问Qwen-VL**（备选）
3. ✅ **集成OpenAI GPT-4O**（如果预算充足）
4. ❓ **其他选择**

只需一句话，我马上为您实现相应的代码！

