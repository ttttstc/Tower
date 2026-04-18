# Tower — 设计基线

> 本文档是 Tower MVP 的设计基线，覆盖视觉规范、交互规范、数据模型、技术架构和实现方案。
> 所有后续设计和开发以本文档为准。

---

## 1. 视觉规范

### 1.1 整体造型：应县木塔

Tower 的主视图是一座数字化的应县木塔。视觉特征：

- **六层明层**：对应六大楼段，从底部基础设施层到顶部用户界面层
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

### 2.2 Hover 高亮（静态，无位移）

hover 一个方块时，**方块的位置和尺寸完全不变**。hover 只做纯视觉层变化：

1. 被 hover 的方块显示 1px ring（outline），颜色取填充色加深一级
2. 该方块的上下游跨楼段依赖线淡入（见 2.4）
3. 鼠标指针变为 pointer

**约束：**
- 严禁任何 translate / scale / width / height 变化——方块视觉完全静止
- 只允许 opacity、outline、cursor 三类属性响应 hover
- hover 不触发 Layout Engine，不跑 Treemap，不走 Spring
- 方块位置和尺寸**只在事项新增 / 删除 / 改 effort / 改 layer 时**重新计算并刷新一次（见 4.3）

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
- **方块位置和尺寸不变**——筛选只改 opacity，不触发 Layout Engine 重算，不跑 Treemap，不走 Spring。相关的亮（opacity=1），无关的暗（opacity≈0.25）

### 2.6 详情抽屉

- 点击任意方块触发，从右侧滑入
- 层级在责任人面板之上（覆盖）
- 滑入动效：ease-out-expo, 240ms
- 宽度约占视口 1/3，背景 Ivory
- 无 drop shadow，仅 1px Border Cream 左边框
- 文本行宽 65-75ch

**可编辑字段：**

- **标题**：单行文本框
- **所属楼段**：六选一下拉（ui / coordination / capability / infrastructure / design / vision）；修改后源楼段和目标楼段都需重跑 Treemap
- **依赖列表**：可多选的事项选择器
  - 展开后列出同项目内除自身外的全部事项，按楼段分组显示
  - 每项左侧复选框，勾选即加入 dependencies；再次点击解除
  - 支持按标题模糊搜索过滤候选
  - 禁止勾选构成环依赖的事项（保存时校验，失败时 inline 报错不关闭抽屉）
  - 已选项在顶部"当前依赖"区以芯片形式展示，点击 × 可移除
  - 保存后依赖线（2.4）数据源立即更新
- **工作量（effort）**：整数数字输入框
  - 范围 1–20，步进 1；`+` / `−` 按钮或直接输入
  - 显示单位"人天"
  - 保存后所在楼段重跑 Treemap，方块面积按新 effort 重新分配
- **负责人**：单选下拉（项目内已有责任人列表）+ "新建责任人"入口
- **状态**：五选一按钮组
- **风险标记**：开关；开启后状态字段自动设为"阻塞/风险"且置灰不可改
- **备注**：多行文本框（自由文本）

编辑保存后：方块视觉立即更新，tower.json 在 200ms 内写回磁盘；若修改涉及 layer / effort / dependencies，则触发 Layout 重算（见 4.3）。

### 2.7 项目设置

- 新建项目时强制录入：项目名、目标、验收标准
- 主看板顶部展示项目名，可点击进入编辑

### 2.8 新增事项

右侧责任人面板顶部常驻一个 **+ 新增事项** 按钮：

- 位置：责任人面板最上方，在标题下方、责任人列表之上
- 样式：宽度与面板内边距对齐（面板宽 - 2×padding），高度 32px；背景 Olive Green，文字 Ivory，无阴影；悬停时底色加深一级
- 点击行为：打开空的详情抽屉（复用 2.6），顶部标题区显示"新增事项"，无楼段标签胶囊
- 字段默认值：
  - 标题：空（自动聚焦，placeholder "给事项起个标题"）
  - 所属楼段：下拉默认 capability（能力层），用户可改
  - 依赖：空
  - 工作量：1
  - 负责人：项目上次选择的负责人；若无则空
  - 状态：not_started
  - 风险：false
  - 备注：空
- 保存条件：标题非空 + 楼段已选；不满足时"保存"按钮禁用
- 保存后：tower.json 追加该事项，对应楼段重跑 Treemap（见 4.3），抽屉关闭
- 取消（关闭抽屉未保存）：放弃草稿，不写盘

### 2.9 日报

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
  | "ui"              // 用户界面层（顶部，最窄）
  | "coordination"     // 协同层
  | "capability"       // 能力层
  | "infrastructure"  // 基础设施层
  | "design"           // 设计层
  | "vision";          // 愿景层（底部，最宽）

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
│  React State（数据 + 非几何 UI 状态）           │
│  - project: TowerProject                      │
│  - selectedItemId: 详情抽屉                    │
│  - hoveredItemId: hover 哪个方块（仅用于        │
│    ring outline 与依赖线，不进 Layout）         │
│  - assigneeFilter: 责任人筛选状态              │
│  - zoomLevel / panOffset: 缩放平移             │
└──────────────────┬───────────────────────────┘
                   │ items 新增 / 删除 / 改 effort / 改 layer 时
                   ▼
┌──────────────────────────────────────────────┐
│  Layout Engine（纯计算，不触发渲染）            │
│  - 按受影响楼段跑 Squarified Treemap          │
│  - 未受影响的楼段不重算                        │
│  - 输出 targetBounds: Map<itemId, Rect>       │
└──────────────────┬───────────────────────────┘
                   │ CRUD 触发时启动一次过渡
                   ▼
┌──────────────────────────────────────────────┐
│  Spring Engine（CRUD 过渡期 RAF，收敛即停）     │
│  - 每个方块 4 个弹簧值: x, y, w, h            │
│  - 每帧插值 current → target                  │
│  - 直接写 DOM: style.transform + width/height │
│  - |Δ| < 0.05 连续两帧后关闭 RAF               │
└──────────────────────────────────────────────┘
```

Hover、点击、责任人筛选、缩放平移等交互**不进入 Layout / Spring 管线**，这是 hover 静态、筛选不移位的实现基础。

### 4.3 Layout 失效触发（Invalidation）

Layout Engine 仅在以下事件后触发重算：

| 事件 | 重算范围 |
|------|----------|
| 事项新增 | 目标楼段重跑 Treemap |
| 事项删除 | 源楼段重跑 Treemap |
| 修改 effort | 所在楼段重跑 Treemap |
| 修改 layer（跨楼段移动） | 源楼段 + 目标楼段各跑一次 |
| 视口尺寸变化（resize） | 全塔重跑 Treemap |

**明确不触发**重算的事件：hover、点击、责任人筛选 / hover 预览、依赖线浮现、缩放、平移、状态切换（status）、备注修改、风险开关、负责人切换。

重算后，方块从旧 bounds 到新 bounds 由 Spring Engine 一次性插值过渡（stiffness 0.12, damping 0.78），典型 300–500ms 收敛，收敛后 RAF 暂停。

### 4.4 渲染架构

```
绝对禁止: CSS Flexbox/Grid 驱动方块尺寸/位置
绝对禁止: :hover 伪类改变方块的 width / height / transform
允许:     :hover 改 outline / opacity / cursor

要求:
- 容器 position: relative
- 所有方块 position: absolute
- CRUD 过渡期每帧更新 transform + width + height
- 过渡完成后 RAF 暂停，CSS 负责静态外观
- 文本测量使用 Canvas measureText API 预计算
- 弹簧参数: stiffness 0.12, damping 0.78
```

### 4.5 组件树

```
<TowerApp>
  <Header />                    // 项目名、目标、日报按钮
  <main>
    <TowerViewport>             // 缩放/平移容器
      <PagodaShell>             // 塔体外壳 (SVG: 飞檐、塔刹、底座)
        <Floor layer="ui">
          <TreemapContainer>
            <Brick />×N         // position:absolute, RAF 驱动
          </TreemapContainer>
        </Floor>
        <Eave label="用户界面层" />  // 飞檐 + 楼段名
        <Floor layer="coordination">
          ...
        </Floor>
        <Eave label="协同层" />
        <Floor layer="capability">
          ...
        </Floor>
        <Eave label="能力层" />
        <Floor layer="infrastructure">
          ...
        </Floor>
        <Eave label="基础设施层" />
        <Floor layer="design">
          ...
        </Floor>
        <Eave label="设计层" />
        <Floor layer="vision">
          ...
        </Floor>
        <Spire />               // 塔刹
      </PagodaShell>
      <DependencyOverlay />     // SVG 依赖线层
    </TowerViewport>
    <SidePanel>                 // 右侧常驻面板
      <AddItemButton />         // 顶部: [+ 新增事项]
      <AssigneePanel />         // 责任人列表
    </SidePanel>
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
│                               │ ┌─────────────────┐ │
│                               │ │  + 新增事项      │ │
│         塔体视口               │ └─────────────────┘ │
│     (缩放/平移区域)            │   责任人            │
│                               │   ☑ PM              │
│        ┌─ 塔刹 ─┐             │   ☑ Arch            │
│        │ 愿景层  │             │   ☑ Dev-A           │
│       ─┤飞檐标注├─            │   ☐ Dev-B           │
│        │ 设计层  │             │   ☑ Dev-C           │
│       ─┤飞檐标注├─            │   ...               │
│        │ 协同层  │             │                     │
│       ─┤飞檐标注├─            │   [全选] [全不选]    │
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

- G1: 应县木塔主看板（六楼段 + Treemap 云图 + 飞檐 + 塔刹）
- G2: 状态色彩可视化（五种状态五种颜色）
- G3: 事项 CRUD（创建/编辑/删除，详情抽屉）
- G4: 项目设置（名称/目标/验收标准）
- G5: tower.json 本地持久化（File System Access API）
- G6: 每日快照 + 日报生成
- G7: Hover 静态高亮（ring outline + 依赖线浮现，方块位置尺寸不变）
- G8: 跨楼段依赖线（hover 浮现）
- G9: 责任人筛选面板（仅改 opacity，不重排）
- G10: 缩放/平移
- G11: 新增事项按钮（右侧面板顶部常驻）
- G12: CRUD 后的 Treemap 一次性 Spring 过渡

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
| A5 | Hover 时方块位置和尺寸零变化；仅 CRUD / resize 触发 Treemap 重算，过渡 60fps |
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
| AS4 | 六大楼段覆盖大部分项目需求 |
| AS5 | Squarified Treemap 对 ≤200 节点性能可接受 |
