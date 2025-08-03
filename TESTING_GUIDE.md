# Interactive Dialogue System - 测试指南

## 测试前准备

### 1. 环境检查
- [ ] 确保 `VITE_OPENAI_API_KEY` 环境变量已设置
- [ ] 确保 Supabase 连接正常
- [ ] 确保用户已登录（用于数据保存）

### 2. 数据库验证
在 Supabase 中确认 `student_answers` 表包含以下字段：
- `id` (uuid, primary key)
- `lesson_id` (text)
- `question_id` (text)
- `user_id` (uuid)
- `dialogue_record` (text)
- `feedback` (text)
- `created_at` (timestamptz)

## 功能测试步骤

### 1. 页面加载测试
1. 访问任意课程详情页面（如 `/lesson/:id`）
2. 确认页面正常加载，显示视频播放器
3. 确认在视频下方显示 "Interactive Learning Dialogue" 区域

### 2. 对话初始化测试
1. 等待页面完全加载
2. 观察是否自动显示 GPT 生成的视频总结和初始问题
3. 确认显示格式为：
   ```
   [3句话的视频总结]
   
   [初始问题]
   ```

### 3. 对话交互测试
1. 在输入框中输入回答（如："I learned about conditional sentences"）
2. 点击发送按钮
3. 确认 GPT 给出回应和后续问题
4. 继续对话 2-3 轮，测试动态交互

### 4. 评估生成测试
1. 完成几轮对话后，点击 "Submit & Get Evaluation" 按钮
2. 确认弹出评估弹窗
3. 检查是否显示 5 个维度的评分条：
   - Accuracy
   - Main Idea Understanding
   - Detail Tracking
   - Vocabulary Usage
   - Emotional Understanding
4. 确认显示总体反馈

### 5. 数据保存测试
1. 在评估弹窗中点击 "Save Evaluation" 按钮
2. 检查浏览器控制台是否显示 "✅ Conversation saved successfully to student_answers table"
3. 在 Supabase 中查看 `student_answers` 表，确认新增记录：
   - `question_id` 应为 'interactive-dialogue'
   - `dialogue_record` 应包含完整对话内容
   - `feedback` 应包含评估结果

### 6. 直接保存测试
1. 刷新页面，重新开始对话
2. 完成几轮对话后，直接点击 "Save" 按钮
3. 确认自动生成评估并保存到数据库

## 错误处理测试

### 1. API 错误测试
1. 临时断开网络连接
2. 尝试发送消息
3. 确认显示友好的错误提示

### 2. 空输入测试
1. 尝试发送空消息
2. 确认发送按钮被禁用

### 3. 加载状态测试
1. 观察发送消息时的加载状态
2. 确认显示 "Thinking..." 提示

## 数据格式验证

### 1. 对话内容格式
在 Supabase 中检查 `dialogue_record` 字段，应包含：
```
Tutor: [GPT的总结和问题]

Student: [学生回答]

Tutor: [GPT的回应和后续问题]

Student: [学生回答]
...
```

### 2. 评估内容格式
在 Supabase 中检查 `feedback` 字段，应包含：
```
Evaluation Results:
Accuracy: [分数]/100
Main Idea Understanding: [分数]/100
Detail Tracking: [分数]/100
Vocabulary Usage: [分数]/100
Emotional Understanding: [分数]/100

Overall Feedback: [建设性反馈]
```

## 性能测试

### 1. 响应时间
- 对话初始化：< 5 秒
- 消息发送：< 3 秒
- 评估生成：< 5 秒

### 2. 内存使用
- 长时间对话不应导致内存泄漏
- 页面刷新后状态正确重置

## 兼容性测试

### 1. 浏览器兼容性
- Chrome (推荐)
- Firefox
- Safari
- Edge

### 2. 设备兼容性
- 桌面端
- 平板端
- 移动端

## 常见问题排查

### 1. 对话不初始化
- 检查 OpenAI API 密钥是否正确
- 检查网络连接
- 查看浏览器控制台错误信息

### 2. 数据不保存
- 确认用户已登录
- 检查 Supabase 连接
- 查看浏览器控制台错误信息

### 3. 评估不生成
- 确认对话内容不为空
- 检查 GPT API 响应
- 查看浏览器控制台错误信息

## 测试报告模板

```
测试日期: [日期]
测试人员: [姓名]
测试环境: [浏览器/设备]

功能测试结果:
- [ ] 页面加载
- [ ] 对话初始化
- [ ] 对话交互
- [ ] 评估生成
- [ ] 数据保存
- [ ] 错误处理

性能测试结果:
- [ ] 响应时间正常
- [ ] 内存使用正常

兼容性测试结果:
- [ ] 浏览器兼容
- [ ] 设备兼容

发现的问题:
1. [问题描述]
2. [问题描述]

建议:
1. [建议内容]
2. [建议内容]
```

## 联系支持

如果在测试过程中遇到问题，请：
1. 记录详细的错误信息
2. 截图保存问题现象
3. 查看浏览器控制台日志
4. 联系开发团队并提供测试报告 