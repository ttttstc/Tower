# Tower — 设计基线

> 本文档是 Tower MVP 的设计基线，覆盖视觉规范、交互规范、数据模型、技术架构和实现方案。
> 所有后续设计和开发以本文档为准。

---

## 1. 视觉规范

### 1.1 整体造型：应县木塔

Tower 的主视图是一座数字化的应县木塔。视觉特征：

- **五层明层**：对应五大楼段，从底部基础设施层到顶部愿景层
- **飞檐出挑**：每层之间有装饰性飞檐，飞檐中央标注楼段名称（如"基础设施层"）
- **底宽顶收**：塔体整体呈上窄下宽的锥形收缩，符合应县木塔的真实比例
- **塔刹**：塔顶有装饰性塔刹，代表项目愿景的最终达成
- **楼段内部**：每层内部为 Treemap 云图，方块紧密填充（1px 缝隙）

注意：飞檐是装饰性向外延伸，不承载数据。楼段内部的 Treemap 可用区域随塔体收窄而收窄。

### 1.2 色彩体系

全部用色来自暖色 token，无冷色蓝灰。

**状态色（方块填充色）：**

| 状态 | 色名 | 用途 |
|------|------|------|
| 完成 | Olive Green | 事项已闭环 |
| 进行中 | Amber / Brick | 正在推进中 |
| 待启动 | Warm Gray | 已录入未开始 |
| 延期 | Saffron Yellow | 超过预期时间 |
| 阻塞/风险 | Brick Red | 被阻塞或存在已知风险 |

（具体 HEX 值在 DESIGN-TOKENS.md 中定义，本文档仅定义语义。）

**楼段封顶色：**

某楼段内所有方块全部完成 → 整个楼段背景变为绿色调（封顶效果），静态，无动画闪烁。

**全局约束：**

- 零 drop shadow（仅允许 `0 0 0 1px` ring shadow）
- 方块之间 1px 缝隙，缝隙色为背景色（Border Cream）
- 方块不是卡片，无圆角、无阴影、无边框装饰

### 1.3 字体

| 用途 | 字体 | License |
|------|------|---------|
| Display（楼段名、塔刹、项目标题） | Fraunces | SIL Open Font |
| Body（方块标题、抽屉文本、日报） | Geist Sans | Open Source |

### 1.4 缩放

- 首页默认按比例缩小，在视口内展示完整塔身全貌
- 支持滚轮缩放（zoom in/out）
- 屏幕上提供 +/- 按钮
- 缩放时塔体中心锚定，可平移拖拽查看局部
- 缩放范围：最小 = 全塔可见，最大 = 单个楼段填满视口

---

## 2. 交互规范

### 2.1 楼段内 Treemap

**布局算法**：Squarified Treemap

- 输入：该楼段内所有事项的 effort 值
- 输出：每个事项方块的 bounds {x, y, w, h}
- 方块面积严格正比于 effort
- 事项增删时，整个楼段的 Treemap 重新计算，其他方块动态调整大小以填满楼层
- 楼段内不分小楼层，不做拓扑分层——依赖关系仅通过 hover 连线表达

### 2.2 Hover 挤压（Cursor-driven Expansion）

当鼠标 hover 某个方块时：

1. 该方块面积平滑扩张（目标面积 = 原面积 × 扩张系数 k，建议 k ≈ 1.8）
2. 同楼层内其他方块面积按距离反比压缩（距离越近压缩越少，越远压缩越多）
3. 楼层容器总面积保持不变
4. 对新的面积分布重新跑 Squarified Treemap，得到新的 bounds
5. 所有方块从当前 bounds 向目标 bounds 做弹簧物理插值

**约束：**
- 挤压效果仅影响同楼层内的方块，不跨楼层
- 楼层高度不变（楼板是刚性的）
- 扩张不改变 z-index，不悬浮覆盖
- 弹簧参数建议：stiffness 0.12, damping 0.78

### 2.3 方块内文本

方块内只显示事项标题。根据方块面积动态调整：

| 方块面积 | 文本显示 |
|----------|----------|
| 大（面积充足） | 完整标题 |
| 中（面积紧张） | 标题截断 + 省略号 |
| 小（面积极小） | 仅首字或首两字 |
| 极小（阈值以下） | 不显示文字，仅色块 |

文本显隐通过 opacity 渐变，不突兀。

### 2.4 依赖线

- 默认所有依赖线不可见
- hover 方块时，该方块的所有上下游跨楼段依赖线在 150ms 内淡入（opacity 0 → 0.6）
- 鼠标移开 200ms 后线条淡出
- 线条：1px 暖色，从下方方块顶部到上方方块底部
- 依赖线穿越飞檐时无特殊处理（直接穿过）
- 使用 SVG overlay 层渲染，与方块层分离

### 2.5 责任人面板

位于页面右侧，是主页面的常驻组成部分（不是抽屉）：

- 列出项目内所有责任人
- 默认全选
- 支持全选、全不选、单个点击切换
- 选中某些人名时，对应方块高亮，其余方块 opacity 降低
- 筛选状态不影响数据，仅影响视觉

### 2.6 详情抽屉

- 点击任意方块触发，从右侧滑入
- 层级在责任人面板之上（覆盖）
- 滑入动效：ease-out-expo, 240ms
- 宽度约占视口 1/3，背景 Ivory
- 无 drop shadow，仅 1px Border Cream 左边框
- 文本行宽 65-75ch

**可编辑字段：**
- 标题
- 所属楼段（五选一）
- 依赖列表（多选其他事项）
- 工作量（effort 数值）
- 负责人
- 状态（五选一）
- 风险标记（开关，开启后状态自动设为"阻塞/风险"）
- 备注（自由文本）

编辑保存后方块视觉立即更新，tower.json 在 200ms 内写回磁盘。

### 2.7 项目设置

- 新建项目时强制录入：项目名、目标、验收标准
- 主看板顶部展示项目名，可点击进入编辑

### 2.8 日报

- 点击"今日日报"按钮，全屏抽屉显示
- 对比昨日快照与当前 tower.json
- 内容：新增方块、状态变化的方块、新封顶的楼段
- 纯文本 Markdown 格式
- 支持一键复制到剪贴板

---

## 3. 数据模型

### 3.1 tower.json 结构

```typescript
interface TowerProject {
  version: "1.0";
  name: string;                    // 项目名称
  goal: string;                    // 项目目标
  acceptanceCriteria: string;      // 验收标准
  items: TowerItem[];              // 所有事项
}

interface TowerItem {
  id: string;                      // 唯一标识 (UUID)
  title: string;                   // 事项标题
  layer: Layer;                    // 所属楼段
  status: Status;                  // 当前状态
  effort: number;                  // 工作量 (正整数, 决定方块面积)
  dependencies: string[];          // 依赖的其他事项 ID
  assignee: string;                // 负责人
  risk: boolean;                   // 是否有风险 (true 时状态强制为 blocked)
  notes: string;                   // 备注
  createdAt: string;               // 创建时间 ISO 8601
  updatedAt: string;               // 更新时间 ISO 8601
}

type Layer =
  | "vision"           // 愿景层
  | "design"           // 设计层
  | "coordination"     // 协同层
  | "implementation"   // 实现层
  | "infrastructure";  // 基础设施层

type Status =
  | "done"             // 完成 (绿色)
  | "in_progress"      // 进行中 (暖色)
  | "not_started"      // 待启动 (灰色)
  | "overdue"          // 延期 (黄色)
  | "blocked";         // 阻塞/风险 (红色)
```

### 3.2 快照

每日首次打开时自动生成 `snapshots/YYYY-MM-DD.json`，内容为当时的完整 tower.json 副本。日报通过 diff 昨日快照与当前数据生成。

### 3.3 持久化

- 使用 File System Access API 读写本地文件
- 仅支持 Chromium 系浏览器（Chrome, Edge, Arc, Brave）
- 关闭浏览器后再打开，通过持久化句柄记住上次文件路径
- tower.json 符合公开发布的 JSON Schema

---

## 4. 技术架构

### 4.1 技术栈

- React + TypeScript
- 纯 Web App（无 Electron/Tauri）
- 字体：Fraunces (Display) + Geist Sans (Body)
- 仅支持 Chromium 系浏览器

### 4.2 状态分层（三层解耦）

```
┌──────────────────────────────────────────────┐
│  React State（低频，触发重渲染）                │
│  - project: TowerProject                      │
│  - selectedItemId: 详情抽屉                    │
│  - hoveredItemId: hover 哪个方块               │
│  - assigneeFilter: 责任人筛选状态              │
│  - zoomLevel / panOffset: 缩放平移             │
└──────────────────┬───────────────────────────┘
                   │ hoveredItemId 变化时
                   ▼
┌──────────────────────────────────────────────┐
│  Layout Engine（纯计算，不触发渲染）            │
│  - 根据 hoveredItemId 计算目标面积分布          │
│  - 每个楼层跑 Squarified Treemap → 目标 bounds │
│  - 存入 targetBounds: Map<string, Rect>       │
└──────────────────┬───────────────────────────┘
                   │ 每帧 RAF
                   ▼
┌──────────────────────────────────────────────┐
│  Spring Engine（RAF 循环，脱离 React）          │
│  - 每个方块 4 个弹簧值: x, y, w, h            │
│  - 每帧插值 current → target                  │
│  - 直接写 DOM: style.transform + width/height │
│  - 不调用 setState，不触发 React diff          │
└──────────────────────────────────────────────┘
```

React 管数据 CRUD、事件绑定、UI 结构。动画完全在 React 外用 RAF 驱动。这是 60fps 的保障。

### 4.3 Hover 挤压算法

```
当方块 A 被 hover 时:

1. 计算扩张后面积:
   A_area_new = A_area_old × k  (k ≈ 1.8)

2. 面积增量:
   delta = A_area_new - A_area_old

3. 其余方块 B 的压缩权重:
   weight_B = 1 / distance(center_B, center_A) ^ falloff
   falloff ≈ 1.5

4. 每个 B 的新面积:
   B_area_new = B_area_old - delta × (weight_B / Σweights)

5. 对 {A_new, B_new, C_new...} 重新跑 Squarified Treemap
   → 得到所有方块的新 bounds

6. Spring Engine 将当前 bounds 向新 bounds 插值
```

每帧不是移动单个方块，而是重新计算整个 Treemap 的布局——弹簧只负责平滑过渡。

### 4.4 渲染架构

```
绝对禁止: CSS Flexbox/Grid 驱动布局变化
绝对禁止: :hover 伪类触发重排

要求:
- 容器 position: relative
- 所有方块 position: absolute
- 每帧仅更新 transform: translate(x, y) + width + height
- 文本测量使用 Canvas measureText API 预计算
- 弹簧引擎使用 RAF (requestAnimationFrame) 循环
- 弹簧参数: stiffness 0.12, damping 0.78
```

### 4.5 组件树

```
<TowerApp>
  <Header />                    // 项目名、目标、日报按钮
  <main>
    <TowerViewport>             // 缩放/平移容器
      <PagodaShell>             // 塔体外壳 (SVG: 飞檐、塔刹、底座)
        <Floor layer="infrastructure">
          <TreemapContainer>
            <Brick />×N         // position:absolute, RAF 驱动
          </TreemapContainer>
        </Floor>
        <Eave label="实现层" />  // 飞檐 + 楼段名
        <Floor layer="implementation">
          ...
        </Floor>
        <Eave label="协同层" />
        <Floor layer="coordination">
          ...
        </Floor>
        <Eave label="设计层" />
        <Floor layer="design">
          ...
        </Floor>
        <Eave label="愿景层" />
        <Floor layer="vision">
          ...
        </Floor>
        <Spire />               // 塔刹
      </PagodaShell>
      <DependencyOverlay />     // SVG 依赖线层
    </TowerViewport>
    <AssigneePanel />           // 右侧责任人面板 (常驻)
  </main>
  <DetailDrawer />              // 详情抽屉 (覆盖在 AssigneePanel 之上)
  <DailyReportModal />          // 日报弹窗
  <ZoomControls />              // +/- 缩放按钮
</TowerApp>
```

---

## 5. 页面布局

```
┌─────────────────────────────────────────────────────┐
│  Header: 项目名 / 目标 / [今日日报]                    │
├───────────────────────────────┬─────────────────────┤
│                               │                     │
│                               │   责任人面板         │
│         塔体视口               │                     │
│     (缩放/平移区域)            │   ☑ PM              │
│                               │   ☑ Arch            │
│        ┌─ 塔刹 ─┐             │   ☑ Dev-A           │
│        │ 愿景层  │             │   ☐ Dev-B           │
│       ─┤飞檐标注├─            │   ☑ Dev-C           │
│        │ 设计层  │             │   ...               │
│       ─┤飞檐标注├─            │                     │
│        │ 协同层  │             │   [全选] [全不选]    │
│       ─┤飞檐标注├─            │                     │
│        │ 实现层  │             │                     │
│       ─┤飞檐标注├─            │                     │
│        │基础设施 │             │                     │
│        └─ 底座 ─┘             │                     │
│                               │                     │
│   [+] [-] 缩放按钮            │                     │
├───────────────────────────────┴─────────────────────┤
│  (点击方块时) 详情抽屉覆盖在责任人面板之上              │
└─────────────────────────────────────────────────────┘
```

---

## 6. MVP 范围

### 做

- G1: 应县木塔主看板（五楼段 + Treemap 云图 + 飞檐 + 塔刹）
- G2: 状态色彩可视化（五种状态五种颜色）
- G3: 事项 CRUD（创建/编辑/删除，详情抽屉）
- G4: 项目设置（名称/目标/验收标准）
- G5: tower.json 本地持久化（File System Access API）
- G6: 每日快照 + 日报生成
- G7: Hover 挤压动效（Cursor-driven Expansion + Spring Physics）
- G8: 跨楼段依赖线（hover 浮现）
- G9: 责任人筛选面板
- G10: 缩放/平移

### 不做（MVP 后）

- Excel 导入 (v1.1)
- IM 通知 / Webhook (v1.2)
- 云端 / 多人协作
- 移动端
- 暗色主题 (v1.1)
- 非 Chromium 浏览器
- 国际化
- 甘特图 / 看板视图

---

## 7. 验收标准摘要

| ID | 标准 |
|----|------|
| A1 | 旁观者 5 秒内识别"这是一座塔，每块是一个事项" |
| A2 | 所有用色 100% 暖色 token，无冷色蓝灰 |
| A3 | 全页面零 drop shadow |
| A4 | 方块面积严格 ∝ 工作量 |
| A5 | hover 挤压 60fps，弹簧物理驱动 |
| A6 | 依赖线 hover 150ms 淡入，移开 200ms 淡出 |
| A7 | 详情抽屉 240ms ease-out-expo 滑入 |
| A8 | 编辑保存后 200ms 内写回 tower.json |
| A9 | 日报对比快照生成 diff，支持 Markdown 复制 |

---

## 8. 约束

| ID | 约束 |
|----|------|
| C1 | 纯 Web App，禁止 Electron/Tauri |
| C2 | 仅 Chromium 系浏览器 |
| C3 | 字体仅 Fraunces + Geist Sans（免费开源） |
| C4 | 禁止卡片套卡片——方块不是卡片 |
| C5 | 数据仅本地 JSON，无后端/数据库/云服务 |
| C6 | UI 仅中文 |

---

## 9. 假设

| ID | 假设 |
|----|------|
| AS1 | 用户使用 Chromium 系浏览器 |
| AS2 | 典型项目 20-150 事项，超过 200 为非目标场景 |
| AS3 | 用户能接受"选择本地文件作为数据库"的工作流 |
| AS4 | 五大楼段覆盖大部分项目需求 |
| AS5 | Squarified Treemap 对 ≤200 节点性能可接受 |
