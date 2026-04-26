# Tower MVP 全能力实现计划

## 决策基线（已与用户确认 A A A）

- **5 层模型**：vision / design / coordination / implementation / infrastructure（与 home.html 背景图一致；DESIGN.md 同步修订）
- **多页静态 HTML + 共用 JS 模块**：保留现有 home.html / dashboard.html / index.html 视觉成果
- **保留 dashboard.html 现状**：能力先跑通，贴图后续再调
- **数据持久化**：mock 阶段用 localStorage；保留 File System Access API 升级口

## 入口与页面

| 路径 | 角色 | 现状 |
|------|------|------|
| `mockup/home.html` | 项目主页（应县木塔山水图 + 5 层联动） | 已接真实数据，支持跳转/日报/项目信息编辑/JSON 打开保存 |
| `dashboard.html` | 事项大盘（书架方块 Treemap） | 已接数据与交互，支持缩放/平移/依赖线/责任人筛选/JSON 打开保存 |
| `mockup/import.html` | Excel 导入向导 | 已完成，支持模板下载、预览校验、有效行导入、依赖按标题回连 |
| `index.html` | 旧的 6 层 Treemap 主视图 | 保留参考，不再作为入口 |

## 公共模块（`js/`）

| 模块 | 职责 |
|------|------|
| `store.js` | TowerProject CRUD、localStorage 读写、订阅、依赖图校验、快照 |
| `layout.js` | Squarified Treemap 算法（按 effort 切矩形） |
| `spring.js` | CRUD 后的 RAF 弹簧过渡（stiffness 0.12, damping 0.78） |
| `ui.js` | 抽屉/模态/Toast/Confirm 等通用组件 |
| `xlsx.js` | Excel 导入（用 SheetJS CDN） |

## G1–G12 进度

- [x] **G1** 应县木塔主视图（home.html 5 层 + 楼层联动）
- [x] **G2** 状态色彩可视化（5 状态 5 色）
- [x] **G3** 事项 CRUD（详情抽屉）
- [x] **G4** 项目设置（名称/目标/验收标准）
- [x] **G5** 持久化（localStorage + `tower.json` 打开/保存）
- [x] **G6** 快照 + 日报
- [x] **G7** Hover 高亮 / 同层挤压感
- [x] **G8** 跨楼段依赖线
- [x] **G9** 责任人筛选
- [x] **G10** 缩放/平移
- [x] **G11** 新增事项按钮
- [x] **G12** Treemap Spring 过渡
- [x] **G13**（追加）Excel 导入

## 实施顺序

1. 同步 DESIGN.md 到 5 层
2. 写 store.js 数据骨架 + 一份 demo 数据
3. 写 layout.js / spring.js / ui.js
4. home.html 接 store（顶部项目名、5 层进度、整体进度、跳转）
5. dashboard.html 接 store + layout + spring（5 层书架，每层 squarified treemap）
6. 详情抽屉（G3 全字段）
7. 新增事项（复用抽屉）
8. 责任人筛选 + 缩放 / 平移
9. 快照 + 日报
10. Excel 导入页
11. `tower.json` 打开 / 保存闭环
12. 页面联调与基础回归检查

## Review

### 当前结论

- MVP 交互链路已闭环：主页 → 大盘 → 详情编辑 / 新增 / 导入 / 日报。
- 数据支持两种持久化方式：浏览器本地草稿（localStorage）与 `tower.json` 文件打开/保存。
- 当前剩余主要是视觉精修，不再是功能缺口。
