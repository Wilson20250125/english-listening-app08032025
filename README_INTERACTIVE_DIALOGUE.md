# Interactive Learning Dialogue System

## 功能概述

我们已经成功将原有的5个固定问题系统替换为一个智能交互式对话系统，该系统能够：

1. **智能视频总结**：GPT自动分析视频内容并提供3句话总结
2. **交互式对话**：根据学生回答动态提出新问题，深化理解
3. **综合评价**：从5个维度评估学生的学习效果
4. **数据持久化**：将对话和评估结果保存到现有的Supabase表结构中

## 主要特性

### 1. 智能初始化
- GPT自动分析视频标题和描述
- 生成3句话的视频总结
- 提出一个简单的问题来测试理解

### 2. 动态对话
- 根据学生回答提供个性化反馈
- 提出后续问题深化理解
- 提供温和的纠正和鼓励

### 3. 多维度评估
评估包含以下5个维度（0-100分）：
- **准确性** (Accuracy)：理解的正确程度
- **主旨理解** (Main Idea Understanding)：核心概念掌握
- **细节追踪** (Detail Tracking)：对具体细节的关注
- **词汇使用** (Vocabulary Usage)：词汇选择的适当性
- **情感理解** (Emotional Understanding)：对语调和语境的理解

### 4. 评估弹窗
- 点击"Submit & Get Evaluation"按钮显示评估结果
- 可视化评分条显示各维度得分
- 提供建设性反馈
- 支持保存评估结果

## 技术实现

### 组件结构
```
src/
├── components/
│   └── InteractiveDialogue.tsx    # 主要对话组件
├── types/
│   └── index.ts                   # 类型定义
├── api/
│   └── chat-gpt.ts               # GPT API集成
└── pages/
    └── LessonDetailPage.tsx       # 课程详情页面
```

### 数据库结构
使用现有的 `student_answers` 表结构：
```sql
-- 现有表结构
CREATE TABLE student_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id text NOT NULL,
  question_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  dialogue_record text,           -- 存储对话内容
  feedback text,                  -- 存储评估结果
  created_at timestamptz DEFAULT now()
);
```

### 数据存储格式
- **dialogue_record**: 格式化的对话文本
  ```
  Tutor: [GPT的总结和问题]
  
  Student: [学生回答]
  
  Tutor: [GPT的回应和后续问题]
  ```

- **feedback**: 格式化的评估结果
  ```
  Evaluation Results:
  Accuracy: 85/100
  Main Idea Understanding: 90/100
  Detail Tracking: 75/100
  Vocabulary Usage: 80/100
  Emotional Understanding: 85/100
  
  Overall Feedback: [建设性反馈]
  ```

### 类型定义
```typescript
interface DialogueMessage {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface Evaluation {
  accuracy: number;
  mainIdea: number;
  detailTracking: number;
  vocabulary: number;
  emotionalUnderstanding: number;
  overallFeedback: string;
}
```

## 使用方法

### 1. 访问课程页面
- 导航到任意课程详情页面（如 `/lesson/:id`）
- 观看视频内容

### 2. 开始对话
- 系统自动显示GPT生成的视频总结和初始问题
- 在输入框中回答GPT的问题
- 点击发送按钮或按Enter键

### 3. 继续对话
- GPT会根据你的回答提供反馈
- 提出新的问题深化理解
- 可以继续对话直到满意

### 4. 获取评估
- 点击"Submit & Get Evaluation"按钮
- 系统会分析整个对话过程
- 显示5个维度的评分和总体反馈

### 5. 保存结果
- 在评估弹窗中点击"Save Evaluation"
- 或直接点击"Save"按钮（会自动生成评估）
- 对话和评估结果会保存到 `student_answers` 表

## API集成

### GPT提示词设计
1. **初始化提示**：要求GPT提供总结和问题
2. **对话提示**：基于对话历史生成回应
3. **评估提示**：分析对话内容生成评分

### 错误处理
- API调用失败时的友好错误提示
- 网络问题的重试机制
- 默认评估作为备用方案

## 安全特性

### 数据库安全
- 使用现有的Row Level Security (RLS)策略
- 用户只能访问自己的对话数据
- 自动用户身份验证

### 数据隐私
- 对话内容仅对用户本人可见
- 评估结果保密存储
- 符合数据保护要求

## 与现有系统的兼容性

### 表结构兼容
- 使用现有的 `student_answers` 表
- 保持与原有问答系统的数据结构一致
- `question_id` 字段使用 'interactive-dialogue' 标识对话系统

### 数据格式
- 对话内容以文本格式存储，便于查看和分析
- 评估结果格式化存储，包含所有评分维度
- 支持与现有数据分析工具的集成

## 未来扩展

### 可能的功能增强
1. **对话历史查看**：查看之前的对话记录
2. **进度追踪**：长期学习进度分析
3. **个性化推荐**：基于评估结果推荐学习内容
4. **多语言支持**：支持更多语言的学习
5. **语音交互**：集成语音识别和合成

### 技术优化
1. **缓存机制**：减少API调用频率
2. **离线支持**：本地存储对话内容
3. **实时同步**：多设备数据同步
4. **性能优化**：提升响应速度

## 部署说明

### 环境要求
- Node.js 16+
- Supabase项目配置
- OpenAI API密钥

### 配置步骤
1. 设置环境变量 `VITE_OPENAI_API_KEY`
2. 确保Supabase RLS策略正确配置
3. 验证 `student_answers` 表结构

### 启动应用
```bash
npm install
npm run dev
```

## 总结

新的智能对话系统完全替代了原有的固定问题模式，提供了更加个性化和互动性的学习体验。系统能够：

- 自动理解视频内容并生成相关问题
- 根据学生回答进行动态调整
- 提供全面的学习评估
- 安全保存学习数据到现有表结构

这个系统为英语学习者提供了一个更加智能和个性化的学习环境，有助于提高学习效果和参与度，同时保持了与现有数据结构的完全兼容性。 