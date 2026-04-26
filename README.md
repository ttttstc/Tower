# Tower

[English](./README.en.md)

Tower 是一个本地优先、场景化表达的项目管理原型。它把项目总览、事项大盘、详情阅读、编辑录入和 Excel 导入串成一套连续体验，而不是拆成彼此割裂的后台页面。

当前版本的核心视觉母题是：

- 首页：山水与塔景总览
- 大盘：书架与书脊事项
- 详情 / 编辑 / 导入：卷轴与纸页工作台

## 当前能力

- 首页总览：展示项目名称、项目目标、里程碑、整体进度、分层进度
- 事项大盘：按层展示事项、状态、负责人筛选、依赖线、快速新增
- 事项详情：查看说明、任务拆解、依赖关系、进度日志、风险与负责人摘要
- 新增 / 编辑事项：维护标题、层级、状态、进度、负责人、依赖、里程碑标签等字段
- Excel 导入：支持上传、字段映射、预览校验、导入回写
- 数据持久化：支持 `localStorage` 草稿，以及 `tower.json` 打开 / 保存
- 日报能力：基于快照生成今日日报文本

## 页面结构

| 路径 | 说明 |
| --- | --- |
| `index.html` | 项目首页 / 战略总览 |
| `dashboard.html` | 事项大盘 |
| `detail.html` | 事项详情 |
| `item-form.html` | 新增 / 编辑事项 |
| `mockup/import.html` | Excel 导入流程 |

## 技术形态

- 多页面静态 HTML
- 原生 ES Modules
- 共享状态中心：`js/store.js`
- 共享主题：`tower-theme.css`
- 贴图资源：`UX/resource/`

当前不是 React 或后端驱动应用，也不依赖构建流程就能运行。

## 快速开始

推荐通过本地静态服务器打开，而不是直接双击 `file://`。

```powershell
cd D:\AI\workspace\Tower\.claude\worktrees\thirsty-grothendieck-e6a6bd
python -m http.server 8124
```

然后在浏览器访问：

- `http://127.0.0.1:8124/index.html`
- `http://127.0.0.1:8124/dashboard.html`

## 数据说明

项目数据由 `js/store.js` 统一管理，当前包含这些核心概念：

- 项目基础信息：名称、目标、范围、验收标准
- 项目目标卡：用于首页展示
- 里程碑：标签概念，进度由挂载该标签的事项自动加权计算
- 事项：标题、层级、状态、进度、负责人、依赖、风险、备注、里程碑标签等

默认情况下，页面会优先读取浏览器本地草稿；也可以在大盘中打开或保存 `tower.json`。

## 目录概览

```text
.
|- index.html
|- dashboard.html
|- detail.html
|- item-form.html
|- mockup/import.html
|- js/
|  |- store.js
|  |- ui.js
|  |- itemDrawer.js
|  |- layout.js
|  `- spring.js
|- UX/resource/
|- DESIGN.md
`- VISION.md
```

## 设计与文档

- 产品愿景：[VISION.md](./VISION.md)
- 设计基线：[DESIGN.md](./DESIGN.md)

这两份文档都已经按当前实现版本更新，不再使用旧版 6 层 Treemap 设想。

## 当前定位

Tower 目前仍是一个高保真原型 / 本地优先 MVP，重点验证的是：

- 首页到大盘到详情的连续体验
- 场景化表达是否能提升项目可读性
- 文件优先的数据工作流是否足够顺手

如果你准备继续迭代，建议优先沿着这条主线推进，而不是把它改回通用后台模板。
