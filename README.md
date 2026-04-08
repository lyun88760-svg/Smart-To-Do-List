# Task Tracker

> 智能待办清单 - 支持优先级排序、到期提醒、标签分类

## 功能列表

- [x] 添加任务
- [x] 删除任务
- [x] 标记完成
- [x] 设置截止时间
- [x] 按状态筛选
- [x] 优先级排序（高/中/低）
- [x] 到期提醒
- [x] 统计功能（完成率）
- [x] 搜索任务
- [x] 标签分类
- [x] 深色模式

## 技术栈

- **前端**: React (Vite)
- **后端**: Express (Node.js)
- **数据库**: SQLite
- **提醒**: node-cron

## 如何运行

```bash
# 安装所有依赖
npm run install:all

# 启动开发服务器
npm run dev
```

## 项目结构

```
├── frontend/     # React 前端
├── backend/      # Express 后端
└── docs/         # 文档
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/tasks | 获取任务列表 |
| POST | /api/tasks | 创建任务 |
| PUT | /api/tasks/:id | 更新任务 |
| DELETE | /api/tasks/:id | 删除任务 |
| PATCH | /api/tasks/:id/complete | 切换完成状态 |
| GET | /api/stats | 获取统计数据 |
| GET | /api/tags | 获取标签列表 |
| GET | /api/notifications | 获取未读提醒 |
| PATCH | /api/notifications/:id/read | 标记已读 |

## 后续计划

- [ ] 任务拖拽排序
- [ ] 批量操作
- [ ] 数据导出/导入
- [ ] 移动端适配
