# Task Tracker 智能待办清单 - 设计文档

## 1. 项目概述

**项目名称**：Task Tracker
**项目类型**：全栈 Web 应用（前后端分离）
**核心功能**：支持优先级排序、到期提醒、标签分类、搜索过滤和统计功能的智能待办清单
**目标用户**：需要任务管理能力的个人用户

## 2. 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | React (Vite) | 现代化的组件化前端框架 |
| 后端 | Express (Node.js) | 轻量级 REST API 服务器 |
| 数据库 | SQLite | 轻量级关系数据库 |
| 提醒 | node-cron | 后端定时任务实现到期提醒 |
| 前端状态 | React Context | 管理主题和任务全局状态 |

## 3. 项目结构

```
todo-app/
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── components/       # UI 组件
│   │   │   ├── TaskItem.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── StatsPanel.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── NotificationBell.jsx
│   │   ├── pages/
│   │   │   └── HomePage.jsx
│   │   ├── hooks/
│   │   │   └── useTasks.js
│   │   ├── context/
│   │   │   ├── TaskContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── backend/                  # Express 后端
│   ├── routes/
│   │   ├── tasks.js
│   │   └── stats.js
│   ├── models/
│   │   ├── task.js
│   │   └── notification.js
│   ├── services/
│   │   └── reminderService.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── db/
│   │   └── init.js
│   ├── index.js
│   └── package.json
├── docs/
│   └── specs/
├── README.md
└── package.json              # 根目录，协调整合
```

## 4. 数据模型

### 4.1 Task（任务）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| title | TEXT | 任务标题（必填） |
| description | TEXT | 任务描述（可选） |
| priority | TEXT | 优先级：high / medium / low |
| status | TEXT | 状态：pending / completed |
| dueDate | DATETIME | 截止时间（可选） |
| tags | TEXT | 标签，JSON 数组字符串 |
| completedAt | DATETIME | 完成时间（可选） |
| createdAt | DATETIME | 创建时间 |
| updatedAt | DATETIME | 更新时间 |

### 4.2 Notification（提醒）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| taskId | INTEGER | 关联任务 ID |
| message | TEXT | 提醒消息内容 |
| read | BOOLEAN | 是否已读 |
| createdAt | DATETIME | 创建时间 |

## 5. API 设计

### 5.1 任务相关

| 方法 | 路径 | 说明 | 请求体 |
|------|------|------|--------|
| GET | /api/tasks | 获取任务列表 | query: status, tag, search, sort |
| POST | /api/tasks | 创建任务 | { title, description, priority, dueDate, tags } |
| PUT | /api/tasks/:id | 更新任务 | { title, description, priority, dueDate, tags } |
| DELETE | /api/tasks/:id | 删除任务 | - |
| PATCH | /api/tasks/:id/complete | 切换完成状态 | - |

### 5.2 统计相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/stats | 获取统计数据（完成率等） |
| GET | /api/tags | 获取所有标签列表 |

### 5.3 提醒相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/notifications | 获取未读提醒 |
| PATCH | /api/notifications/:id/read | 标记提醒为已读 |
| PATCH | /api/notifications/read-all | 全部已读 |

## 6. 前端组件设计

### 6.1 TaskItem
- 显示任务标题、优先级标签、标签列表、截止时间
- 优先级颜色：high=红色，medium=黄色，low=绿色
- 截止时间显示：已过期显示红色，正常显示灰色
- 右侧操作按钮：编辑、删除、完成 checkbox

### 6.2 TaskForm
- 字段：标题（必填）、描述、优先级（select）、截止时间（datetime-local）、标签（多选）
- 内置标签：学习、工作、生活
- 支持添加新标签
- 验证：标题不能为空

### 6.3 TaskList
- 根据筛选条件显示任务列表
- 支持按优先级和截止时间排序
- 空状态显示友好提示

### 6.4 FilterBar
- 状态筛选：全部 / 待完成 / 已完成
- 标签筛选：下拉多选
- 优先级筛选：全部 / 高 / 中 / 低

### 6.5 SearchBar
- 实时搜索，300ms 防抖
- 搜索范围：标题和描述

### 6.6 StatsPanel
- 显示：总任务数、已完成数、待完成数、完成率百分比
- 进度条可视化

### 6.7 ThemeToggle
- 切换浅色/深色模式
- 图标显示当前模式
- 记住用户偏好（localStorage）

### 6.8 NotificationBell
- 铃铛图标显示未读提醒数量
- 点击展开提醒列表
- 支持标记单条/全部已读

## 7. 提醒系统设计

### 7.1 触发机制
- 后端使用 `node-cron` 每分钟执行一次检查
- 查询截止时间 <= 当前时间 且 status = pending 的任务
- 生成提醒记录存入 notifications 表

### 7.2 防重复提醒
- 同一任务只生成一次未读提醒
- 任务完成或删除后不再提醒

### 7.3 前端轮询
- 前端每 30 秒请求一次未读提醒
- 实时显示提醒数量

## 8. 深色模式实现

### 8.1 CSS 变量方案
```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
}

[data-theme="dark"] {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --border-color: #2d2d44;
}
```

### 8.2 主题切换
- React Context 提供 ThemeContext
- 初始化时读取 localStorage 或系统偏好
- 切换时更新 data-theme 属性和 localStorage

## 9. 开发模块顺序

1. **后端基础设施** — Express 搭建、数据库初始化、基础 CRUD
2. **后端进阶功能** — 统计 API、标签 API、提醒服务
3. **前端基础设施** — Vite + React 搭建、路由、主题 Context
4. **前端核心功能** — TaskForm、TaskList、TaskItem
5. **前端进阶功能** — 筛选、搜索、统计面板、深色模式、提醒通知

## 10. README.md 结构（开发过程中生成）

```
# Task Tracker

## 项目介绍

## 功能列表

## 技术栈

## 如何运行

## 项目截图

## 后续计划
```
