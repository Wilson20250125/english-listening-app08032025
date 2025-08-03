# BBC Lower Level 课程页面

## 功能概述

这个项目新增了 BBC Lower Level 视频课程展示功能，包含以下页面：

### 1. 课程列表页面 (`/course/bbc-lower`)

**文件位置**: `src/pages/BBCLowerPage.tsx`

**功能特性**:
- 从 Supabase `lesson_items` 表获取 `course_id = 'bbc-lower'` 的所有课程
- 展示字段：`id`, `title`, `description`, `video_url`
- 响应式卡片布局（1-3列网格）
- 加载状态和错误处理
- 每个卡片包含标题、描述和跳转按钮

**UI 特性**:
- 白底圆角阴影卡片设计
- 悬停效果和过渡动画
- 文本截断处理（标题单行，描述3行）
- 课程统计信息展示

### 2. 课程详情页面 (`/lesson/:id`)

**文件位置**: `src/pages/LessonDetailPage.tsx`

**功能特性**:
- 根据课程 ID 获取单个课程详情
- 视频播放器集成
- 返回课程列表的导航
- 额外资源展示（词汇表、练习等）

**UI 特性**:
- 视频播放器（支持 MP4 格式）
- 响应式布局
- 操作按钮（观看视频、下载字幕）
- 资源卡片展示

## 技术实现

### 类型定义

在 `src/types/index.ts` 中新增了 `LessonItem` 接口：

```typescript
export interface LessonItem {
  id: string;
  title: string;
  description: string;
  video_url: string;
  course_id: string;
}
```

### 路由配置

在 `src/App.tsx` 中新增了路由：

```typescript
<Route path="/course/bbc-lower" element={<BBCLowerPage />} />
<Route path="/lesson/:id" element={<LessonDetailPage />} />
```

### Supabase 集成

使用现有的 Supabase 客户端配置：
- 查询条件：`course_id = 'bbc-lower'`
- 排序：按 `id` 升序
- 错误处理和加载状态管理

## 使用方法

1. **访问课程列表**：
   - 导航到 `/course/bbc-lower`
   - 查看所有 BBC Lower Level 课程

2. **查看课程详情**：
   - 点击课程卡片上的 "Watch Lesson" 按钮
   - 或直接访问 `/lesson/[课程ID]`

3. **返回课程列表**：
   - 在课程详情页面点击 "Back to Course" 按钮

## 样式设计

- 使用 Tailwind CSS 进行样式设计
- 响应式布局，支持移动端和桌面端
- 统一的颜色主题（蓝色主色调）
- 现代化的卡片设计和阴影效果

## 依赖项

- React 18.3.1
- TypeScript 5.5.3
- React Router DOM 6.22.3
- Supabase JS 2.39.7
- Lucide React 0.344.0 (图标)
- Tailwind CSS 3.4.1

## 注意事项

1. 确保 Supabase 环境变量已正确配置
2. `lesson_items` 表需要包含相应的数据
3. 视频 URL 需要是可访问的 MP4 格式
4. 建议在生产环境中添加视频格式验证和错误处理 