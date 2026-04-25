# Tower 项目管理平台 - 前端组件库与开发规格说明

> 版本：v0.1  
> 目标：交给 Codex / 前端工程师后，可直接按模块开发第一版 MVP。  
> 设计基准：基于已有三张核心视觉稿：主页塔视图、事项大盘书架视图、事项详情卷轴视图，并补充 Excel 导入、新增/编辑事项、项目配置等页面。

---

## 1. 产品定位

Tower 是一个视觉驱动的项目事项管理平台。

它不是普通表格型项目管理工具，而是通过「塔 / 书架 / 卷轴」的空间结构，把项目事项、进度、风险、依赖关系转化为可直观看懂的视觉形态。

核心价值：

- 用结构可视化替代 Excel 扁平列表。
- 让 PM 和研发一眼识别任务位置、风险点和依赖影响。
- 支持 Excel 导入，降低初始化成本。
- 支持事项新增、编辑、管理和风险识别。

---

## 2. MVP 范围

### 2.1 必做能力

- 项目主页总览
- 事项大盘
- 事项详情
- Excel 导入
- 字段映射
- 数据预览与校验
- 新增事项
- 编辑事项
- 项目配置
- 状态 / 进度 / 风险可视化
- 搜索、筛选、风险扫描、聚焦模式

### 2.2 暂不做能力

- 多租户
- 权限系统
- 高级报表
- 自动化工作流
- 团队绩效分析
- 消息通知中心

---

## 3. 信息架构

```txt
项目 Project
├── 愿景层 Vision
├── 设计层 Design
├── 协同层 Coordination
├── 实现层 Implementation
└── 基础设施层 Infrastructure
    └── 事项 Task
        └── 子事项 SubTask
```

---

## 4. 推荐技术栈

```txt
Framework: Next.js / React
Language: TypeScript
Styling: CSS Modules / Tailwind + CSS Variables
State: Zustand / React Context
Mock Data: local JSON / MSW
Charts/Graph: SVG first, later D3 optional
Icons: lucide-react or custom SVG
```

第一版建议以纯前端 mock 数据实现完整交互流。

---

## 5. 推荐目录结构

```txt
src/
  app/
    page.tsx
    project/
      page.tsx
      board/page.tsx
      task/[id]/page.tsx
      import/page.tsx
      config/page.tsx

  data/
    mock-project.ts
    mock-tasks.ts
    mock-import.ts

  types/
    project.ts
    task.ts
    import.ts

  design-system/
    tokens/
      colors.css
      typography.css
      spacing.css
      shadows.css
    animations/
      pulse.css
      flow.css
      scroll.css
    components/
      base/
      form/
      navigation/
      display/

  features/
    project-home/
      ProjectTowerHome.tsx
      ProjectInfoPanel.tsx
      TowerScene.tsx
      LayerProgressRail.tsx
      GlobalProgressCard.tsx

    task-board/
      TaskShelfBoard.tsx
      BoardHeader.tsx
      BoardFilterBar.tsx
      LayerSummaryRail.tsx
      ShelfCanvas.tsx
      ShelfRow.tsx
      BookTask.tsx
      DependencyLightPath.tsx
      TaskHoverCard.tsx
      BoardLegend.tsx

    task-detail/
      TaskScrollDetail.tsx
      DetailHeader.tsx
      ScrollSideNav.tsx
      TaskOverview.tsx
      TaskBreakdownFlow.tsx
      DependencyGraph.tsx
      ProgressTimeline.tsx
      RiskPanel.tsx
      DetailRightStatusPanel.tsx

    excel-import/
      ExcelImportPage.tsx
      ImportStepNav.tsx
      ExcelUploadPanel.tsx
      FieldMappingTable.tsx
      ImportPreviewTable.tsx
      ImportActionBar.tsx
      ImportResultPanel.tsx

    task-form/
      TaskCreatePage.tsx
      TaskEditPage.tsx
      TaskCreateDrawer.tsx
      TaskFormScroll.tsx
      TaskBasicFields.tsx
      TaskStatusFields.tsx
      TaskScheduleFields.tsx
      TaskRiskFields.tsx
      TaskDependencyFields.tsx

    project-config/
      ProjectConfigPage.tsx
      ConfigSideNav.tsx
      ProjectBasicConfig.tsx
      LayerConfig.tsx
      StatusConfig.tsx
      ExcelMappingConfig.tsx
      RiskRuleConfig.tsx
```

---

## 6. TypeScript 数据模型

### 6.1 TaskStatus

```ts
export type TaskStatus =
  | 'done'
  | 'in_progress'
  | 'warning'
  | 'risk'
  | 'blocked'
  | 'not_started'
  | 'locked'
```

### 6.2 RiskLevel

```ts
export type RiskLevel = 'none' | 'low' | 'medium' | 'high'
```

### 6.3 Project

```ts
export type Project = {
  id: string
  name: string
  subtitle?: string
  description: string
  progress: number
  layers: TowerLayer[]
  goals?: string[]
  scope?: string[]
  milestones?: Milestone[]
}
```

### 6.4 TowerLayer

```ts
export type TowerLayer = {
  id: string
  name: string
  code:
    | 'vision'
    | 'design'
    | 'coordination'
    | 'implementation'
    | 'infrastructure'
  progress: number
  status: TaskStatus
  order: number
}
```

### 6.5 Task

```ts
export type Task = {
  id: string
  name: string
  layerId: string
  parentId?: string
  status: TaskStatus
  progress: number
  owner?: string
  startDate?: string
  endDate?: string
  riskLevel: RiskLevel
  riskReason?: string
  dependencies: string[]
  children?: Task[]
  description?: string
  priority?: 'low' | 'medium' | 'high'
  complexity?: 'low' | 'medium' | 'high'
}
```

### 6.6 Dependency

```ts
export type Dependency = {
  id: string
  from: string
  to: string
  status: 'normal' | 'delayed' | 'risk' | 'blocked'
}
```

### 6.7 Milestone

```ts
export type Milestone = {
  id: string
  date: string
  title: string
  status: TaskStatus
}
```

### 6.8 ImportMapping

```ts
export type ImportMapping = {
  excelColumn: string
  systemField: keyof Task | 'ignore'
  required: boolean
  confidence: number
  valid: boolean
}
```

### 6.9 ImportRow

```ts
export type ImportRow = {
  id: string
  raw: Record<string, string | number>
  mapped: Partial<Task>
  errors: ImportError[]
}

export type ImportError = {
  field: string
  message: string
  level: 'warning' | 'error'
}
```

---

## 7. Design Tokens

### 7.1 colors.css

```css
:root {
  /* Background */
  --tower-bg-night: #130c07;
  --tower-bg-wood-dark: #221309;
  --tower-bg-wood: #3a2110;
  --tower-bg-wood-light: #6a3e1c;

  /* Parchment */
  --tower-parchment: #e8d7b5;
  --tower-parchment-light: #f4e7c8;
  --tower-parchment-edge: #b98b4e;
  --tower-parchment-shadow: #8a5a2b;

  /* Text */
  --tower-text-primary: #2d1c10;
  --tower-text-secondary: #6f5233;
  --tower-text-muted: #9a7b52;
  --tower-text-light: #e8d7b5;

  /* Gold */
  --tower-gold: #c8943f;
  --tower-gold-light: #f0d078;
  --tower-gold-dark: #7a4e1f;

  /* State */
  --tower-done: #4f8a52;
  --tower-progress: #c8943f;
  --tower-warning: #c46a2b;
  --tower-risk: #a33a25;
  --tower-blocked: #612017;
  --tower-empty: #6e665a;
  --tower-locked: #3b332b;
}
```

### 7.2 typography.css

```css
:root {
  --font-title: 'Noto Serif SC', 'Songti SC', serif;
  --font-body: 'Noto Serif SC', 'Songti SC', serif;
  --font-number: 'Cinzel', 'Georgia', serif;

  --fs-display: 44px;
  --fs-title-xl: 34px;
  --fs-title-lg: 28px;
  --fs-title-md: 22px;
  --fs-body: 16px;
  --fs-small: 13px;
  --fs-mini: 11px;
}
```

### 7.3 spacing.css

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
}
```

### 7.4 shadows.css

```css
:root {
  --shadow-wood: 0 16px 40px rgba(0, 0, 0, .45);
  --shadow-parchment: 0 8px 24px rgba(84, 48, 22, .28);
  --shadow-gold-glow: 0 0 18px rgba(240, 208, 120, .72);
  --shadow-risk-glow: 0 0 16px rgba(163, 58, 37, .78);
}
```

---

## 8. 状态视觉映射

```ts
export const taskVisualMap = {
  done: {
    color: 'var(--tower-done)',
    glow: 'green',
    crack: 'none',
    line: 'normal'
  },
  in_progress: {
    color: 'var(--tower-progress)',
    glow: 'gold',
    crack: 'none',
    line: 'normal'
  },
  warning: {
    color: 'var(--tower-warning)',
    glow: 'orange',
    crack: 'light',
    line: 'delayed'
  },
  risk: {
    color: 'var(--tower-risk)',
    glow: 'red',
    crack: 'light',
    line: 'risk'
  },
  blocked: {
    color: 'var(--tower-blocked)',
    glow: 'redPulse',
    crack: 'heavy',
    line: 'blocked'
  },
  not_started: {
    color: 'var(--tower-empty)',
    glow: 'none',
    crack: 'none',
    line: 'none'
  },
  locked: {
    color: 'var(--tower-locked)',
    glow: 'none',
    crack: 'none',
    line: 'none'
  }
} as const
```

---

## 9. 动效系统

### 9.1 金光呼吸

```css
@keyframes tower-gold-pulse {
  0% { box-shadow: 0 0 4px rgba(216, 170, 80, .35); }
  50% { box-shadow: 0 0 18px rgba(240, 208, 120, .85); }
  100% { box-shadow: 0 0 4px rgba(216, 170, 80, .35); }
}
```

用途：当前选中层级、当前事项、主按钮。

### 9.2 风险脉冲

```css
@keyframes tower-risk-pulse {
  0% { filter: brightness(.9); }
  50% { filter: brightness(1.25) drop-shadow(0 0 14px rgba(170, 45, 28, .85)); }
  100% { filter: brightness(.9); }
}
```

用途：高风险事项、阻塞路径、风险印记。

### 9.3 依赖光流

```css
@keyframes tower-light-flow {
  from { stroke-dashoffset: 120; }
  to { stroke-dashoffset: 0; }
}
```

用途：依赖线、进度流。

### 9.4 卷轴展开

```css
@keyframes tower-scroll-open {
  from { transform: scaleX(.92); opacity: 0; }
  to { transform: scaleX(1); opacity: 1; }
}
```

用途：详情页、导入页、配置页。

### 9.5 书本点亮

```css
@keyframes tower-book-lit {
  0% { transform: translateY(0); filter: brightness(.85); }
  50% { transform: translateY(-3px); filter: brightness(1.15); }
  100% { transform: translateY(0); filter: brightness(1); }
}
```

用途：搜索命中、hover、新增事项定位。

---

## 10. 基础组件 Base Components

### 10.1 WoodFrame

用途：木制外框，适用于主页、大盘、弹层。

```tsx
<WoodFrame variant="dark" ornament="corner" glow>
  {children}
</WoodFrame>
```

```ts
export type WoodFrameProps = {
  variant?: 'dark' | 'medium' | 'light'
  ornament?: 'none' | 'corner' | 'full'
  glow?: boolean
  children: React.ReactNode
}
```

实现要求：

- 暗木纹背景。
- 四角金色装饰。
- 可选金色发光边框。

---

### 10.2 ParchmentPanel

用途：卷轴面板，适用于详情页、导入页、新增页、配置页。

```tsx
<ParchmentPanel size="large" scrollEdge bordered>
  {children}
</ParchmentPanel>
```

```ts
export type ParchmentPanelProps = {
  size?: 'small' | 'medium' | 'large' | 'full'
  scrollEdge?: boolean
  bordered?: boolean
  children: React.ReactNode
}
```

实现要求：

- 羊皮纸底色。
- 左右卷轴轴杆。
- 纸面轻微噪点纹理。
- 进入时使用 `tower-scroll-open`。

---

### 10.3 SealButton

用途：保存、删除、导入、确认等关键动作。

```tsx
<SealButton tone="primary" size="md">保存</SealButton>
<SealButton tone="danger">删除</SealButton>
```

```ts
export type SealButtonProps = {
  tone?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
}
```

实现要求：

- primary：金色木牌。
- danger：红色印章。
- hover：轻微上浮 + 金光。
- disabled：灰化。

---

### 10.4 WoodButton

用途：返回、筛选、次级操作。

```tsx
<WoodButton icon="back">返回项目首页</WoodButton>
```

```ts
export type WoodButtonProps = {
  icon?: React.ReactNode
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
}
```

---

### 10.5 GoldDivider

用途：金色分割线。

```tsx
<GoldDivider ornament />
```

```ts
export type GoldDividerProps = {
  ornament?: boolean
  vertical?: boolean
}
```

---

### 10.6 StatusBadge

```tsx
<StatusBadge status="in_progress" />
```

```ts
export type StatusBadgeProps = {
  status: TaskStatus
  label?: string
}
```

---

### 10.7 RiskSeal

```tsx
<RiskSeal level="high" />
```

```ts
export type RiskSealProps = {
  level: RiskLevel
}
```

---

### 10.8 ProgressRing

```tsx
<ProgressRing value={60} status="in_progress" />
```

```ts
export type ProgressRingProps = {
  value: number
  status?: TaskStatus
  size?: 'sm' | 'md' | 'lg'
}
```

---

### 10.9 ProgressBar

```tsx
<ProgressBar value={75} status="done" />
```

---

### 10.10 AncientTooltip

```tsx
<AncientTooltip content={<TaskHoverCard task={task} />}>
  <BookTask task={task} />
</AncientTooltip>
```

---

## 11. 表单组件 Form Components

### 11.1 InkInput

```tsx
<InkInput label="事项名称" required value={name} onChange={setName} />
```

要求：

- 羊皮纸输入底。
- 聚焦时金色描边。
- 错误时红墨提示。

---

### 11.2 AncientSelect

```tsx
<AncientSelect label="所属层级" options={layers} value={layerId} onChange={setLayerId} />
```

---

### 11.3 ProgressSlider

```tsx
<ProgressSlider value={progress} onChange={setProgress} />
```

要求：

- 金色滑轨。
- 圆形铜钉作为 thumb。
- 显示百分比。

---

### 11.4 DatePickerField

```tsx
<DatePickerField label="开始时间" value={startDate} onChange={setStartDate} />
```

---

### 11.5 RiskSelector

```tsx
<RiskSelector value="medium" onChange={setRiskLevel} />
```

视觉：低/中/高三枚印记。

---

### 11.6 DependencyPicker

```tsx
<DependencyPicker tasks={tasks} selected={dependencies} onChange={setDependencies} />
```

---

### 11.7 ToggleSwitch

```tsx
<ToggleSwitch label="自动计算父级进度" checked={enabled} onChange={setEnabled} />
```

---

### 11.8 CheckSeal

```tsx
<CheckSeal checked={true} onChange={setChecked} />
```

---

## 12. 导航组件 Navigation Components

### 12.1 BackWoodButton

```tsx
<BackWoodButton href="/project">返回项目首页</BackWoodButton>
```

---

### 12.2 ScrollSideNav

详情页、配置页左侧卷轴导航。

```tsx
<ScrollSideNav
  active="overview"
  items={[
    { key: 'overview', label: '概述', icon: 'book' },
    { key: 'breakdown', label: '任务拆解', icon: 'list' },
    { key: 'dependency', label: '依赖关系', icon: 'link' },
    { key: 'risk', label: '风险记录', icon: 'warning' }
  ]}
  onChange={setActive}
/>
```

---

### 12.3 ImportStepNav

```tsx
<ImportStepNav current={2} />
```

步骤：

1. 上传文件
2. 字段映射
3. 数据预览
4. 导入完成

---

### 12.4 LayerRail

主页右侧层级导航。

```tsx
<LayerRail layers={layers} active="design" onSelect={setLayer} />
```

---

### 12.5 BoardToolbar

```tsx
<BoardToolbar
  onCreateTask={openCreateDrawer}
  onImportExcel={goImport}
  onRiskScan={toggleRiskScan}
/>
```

---

## 13. 数据展示组件 Data Display

### 13.1 DataTableParchment

用于 Excel 预览、配置表。

```tsx
<DataTableParchment columns={columns} data={rows} errors={errors} />
```

要求：

- 错误格红墨圈出。
- 校验通过淡金底。
- 必填缺失加红色印记。

---

### 13.2 FieldMappingRow

```tsx
<FieldMappingRow
  excelColumn="事项名称"
  systemField="name"
  confidence={0.96}
  valid
/>
```

视觉：左列 Excel 字段 → 金色箭头 → 右侧系统字段。

---

### 13.3 ValidationMessage

```tsx
<ValidationMessage type="error">发现 3 条异常数据</ValidationMessage>
```

---

### 13.4 ProgressTimeline

```tsx
<ProgressTimeline logs={logs} />
```

---

### 13.5 RiskLogItem

```tsx
<RiskLogItem level="high" title="接口延期" date="2024-05-12" />
```

---

## 14. 页面与业务组件

---

# 14.1 项目主页 ProjectTowerHome

对应已有第三张图：中央塔 + 左侧项目介绍 + 右侧层级进度。

```tsx
<ProjectTowerHome project={project} />
```

内部结构：

```tsx
<ProjectTowerHome>
  <ProjectInfoPanel />
  <TowerScene />
  <LayerProgressRail />
  <GlobalProgressCard />
</ProjectTowerHome>
```

### ProjectInfoPanel

```ts
export type ProjectInfoPanelProps = {
  title: string
  subtitle: string
  description: string
  goals: string[]
  scope?: string[]
  milestones?: Milestone[]
}
```

### TowerScene

```tsx
<TowerScene layers={layers} selectedLayer="design" />
```

交互：

| 操作 | 反馈 |
|---|---|
| hover 层 | 该层描边发光 |
| click 层 | 进入事项大盘并筛选该层 |
| 风险层 | 塔层局部泛红 |
| 完成层 | 灯火稳定 |

### LayerProgressCard

```tsx
<LayerProgressCard name="设计层" progress={60} status="in_progress" />
```

---

# 14.2 事项大盘 TaskShelfBoard

对应已有第一张图：木制书架 + 事项书本 + 进度光流。

```tsx
<TaskShelfBoard tasks={tasks} dependencies={dependencies} />
```

内部结构：

```tsx
<TaskShelfBoard>
  <BoardHeader />
  <BoardFilterBar />
  <LayerSummaryRail />
  <ShelfCanvas />
  <BoardLegend />
</TaskShelfBoard>
```

### BoardHeader

```tsx
<BoardHeader
  title="事项大盘"
  progress={60}
  onImport={goImport}
  onCreate={openCreateDrawer}
  onConfig={goConfig}
/>
```

### BoardFilterBar

```tsx
<BoardFilterBar
  filters={{ layer: 'all', status: 'all', owner: 'all', keyword: '' }}
  onChange={setFilters}
/>
```

包含：

- 层级筛选
- 状态筛选
- 负责人筛选
- 搜索
- 风险扫描
- 聚焦模式开关

### LayerSummaryRail

```tsx
<LayerSummaryRail layers={layers} />
```

### ShelfCanvas

```tsx
<ShelfCanvas rows={shelfRows} dependencies={dependencies} />
```

### ShelfRow

```tsx
<ShelfRow layer={layer} tasks={tasksInLayer} />
```

视觉：

- 横向木架。
- 多本书纵向站立。
- 每层左侧显示层级进度。
- 层内任务通过光流线连接。

### BookTask

最核心组件。

```tsx
<BookTask
  task={task}
  selected={selectedTaskId === task.id}
  focused={focusedTaskIds.includes(task.id)}
  onClick={() => openTask(task.id)}
/>
```

视觉规则：

| 数据 | 视觉 |
|---|---|
| progress >= 75 | 绿色书脊 |
| 50 <= progress < 75 | 金色书脊 |
| 25 <= progress < 50 | 橙色书脊 |
| progress < 25 | 红褐书脊 |
| riskLevel=high | 裂纹 + 红色外光 |
| status=blocked | 深红 + 重裂纹 + 风险脉冲 |
| locked=true | 暗化 + 锁图标 |
| selected=true | 金色描边 + 外发光 |
| focused=false | 降低透明度 |

### DependencyLightPath

```tsx
<DependencyLightPath from="task-a" to="task-b" status="risk" />
```

状态：

| 状态 | 线条 |
|---|---|
| normal | 金色流动 |
| delayed | 橙色断续流动 |
| risk | 红色脉冲流动 |
| blocked | 深红断裂线 |

### TaskHoverCard

```tsx
<TaskHoverCard task={task} />
```

展示：

- 名称
- 状态
- 负责人
- 进度
- 风险原因
- 上游数量
- 下游数量

### 事项大盘交互要求

| 操作 | 结果 |
|---|---|
| hover 书本 | 显示 TaskHoverCard |
| click 书本 | 进入事项详情页 |
| click 聚焦 | 高亮上下游依赖，非相关暗化 |
| click 风险扫描 | 风险任务增强显示 |
| filter 状态 | 非匹配书本暗化 |
| search | 匹配书本发光 |
| 新增事项后 | 定位到新书本并点亮 |

---

# 14.3 事项详情 TaskScrollDetail

对应已有第二张图：卷轴详情页。

```tsx
<TaskScrollDetail task={task} />
```

内部结构：

```tsx
<TaskScrollDetail>
  <DetailHeader />
  <ScrollSideNav />
  <TaskOverview />
  <TaskBreakdownFlow />
  <DependencyGraph />
  <ProgressTimeline />
  <RiskPanel />
  <DetailRightStatusPanel />
</TaskScrollDetail>
```

### DetailHeader

```tsx
<DetailHeader
  title="数据流设计"
  status="in_progress"
  breadcrumbs={['协同层', '基础设施建设', '第3段']}
/>
```

### TaskBreakdownFlow

```tsx
<TaskBreakdownFlow subtasks={subtasks} />
```

视觉：纸卡 + 箭头。

### DependencyGraph

```tsx
<DependencyGraph upstream={upstream} current={task} downstream={downstream} />
```

规则：

- 当前节点：金色牌匾。
- 上游正常：绿色/金色。
- 上游风险：红光传导。
- 下游被影响：红色边缘闪烁。

### DetailRightStatusPanel

```tsx
<DetailRightStatusPanel
  progress={50}
  location="木塔-第3层"
  owner="张三"
  priority="高"
  complexity="中"
/>
```

---

# 14.4 Excel 导入 ExcelImportPage

新增页面：横向卷轴式导入向导。

```tsx
<ExcelImportPage />
```

内部结构：

```tsx
<ExcelImportPage>
  <ImportStepNav />
  <ExcelUploadPanel />
  <FieldMappingTable />
  <ImportPreviewTable />
  <ImportActionBar />
  <ImportResultPanel />
</ExcelImportPage>
```

### 页面步骤

1. 上传文件
2. 字段映射
3. 数据预览
4. 导入完成

### ExcelUploadPanel

```tsx
<ExcelUploadPanel accept=".xlsx,.xls,.csv" maxSize={20} onUpload={handleUpload} />
```

视觉：

- 中央虚线框。
- 文件卷宗图标。
- 上传按钮为金色木牌。
- 支持拖拽上传。

### FieldMappingTable

```tsx
<FieldMappingTable mappings={mappings} onChange={setMappings} />
```

映射规则：

| Excel 列 | 系统字段 |
|---|---|
| 事项名称 | name |
| 层级 | layerId |
| 父任务 | parentId |
| 状态 | status |
| 进度 | progress |
| 负责人 | owner |
| 开始时间 | startDate |
| 结束时间 | endDate |
| 风险等级 | riskLevel |
| 依赖任务 | dependencies |

### ImportPreviewTable

```tsx
<ImportPreviewTable rows={rows} errors={errors} />
```

要求：

- 展示前 20 行。
- 错误格红墨圈出。
- 风险字段高亮。
- 底部显示成功/异常条数。

### ImportActionBar

```tsx
<ImportActionBar canNext canImport onPrev={prev} onNext={next} onImport={submitImport} />
```

### 导入完成行为

- mock 生成任务数据。
- 跳转到事项大盘。
- 新导入任务点亮 2 秒。

---

# 14.5 新增 / 编辑事项 TaskCreatePage / TaskEditPage

新增事项支持两种入口：

1. 独立新增页：完整录入。
2. 大盘右侧快速新建抽屉：快速创建。

```tsx
<TaskCreatePage />
<TaskEditPage taskId="task-1" />
<TaskCreateDrawer open />
```

内部结构：

```tsx
<TaskFormScroll>
  <TaskBasicFields />
  <TaskStatusFields />
  <TaskScheduleFields />
  <TaskRiskFields />
  <TaskDependencyFields />
</TaskFormScroll>
```

### 必填字段

- 事项名称
- 所属层级
- 状态
- 进度
- 负责人

### 可选字段

- 父任务
- 开始时间
- 结束时间
- 风险等级
- 风险原因
- 优先级
- 复杂度
- 依赖任务
- 描述

### 保存行为

- 新增成功后回到大盘。
- 新事项作为新书本插入对应层级。
- 新书本使用 `tower-book-lit` 动效点亮。

---

# 14.6 项目配置 ProjectConfigPage

新增页面：配置项目层级、状态、Excel 映射、风险规则。

```tsx
<ProjectConfigPage />
```

内部结构：

```tsx
<ProjectConfigPage>
  <ConfigSideNav />
  <ProjectBasicConfig />
  <LayerConfig />
  <StatusConfig />
  <ExcelMappingConfig />
  <RiskRuleConfig />
</ProjectConfigPage>
```

### ProjectBasicConfig

字段：

- 项目名称
- 副标题
- 项目介绍
- 项目负责人

### LayerConfig

支持：

- 层级名称
- 层级顺序
- 层级状态色
- 是否启用

### StatusConfig

支持：

- 状态名称
- 状态颜色
- 是否计入完成
- 是否触发风险

### ExcelMappingConfig

支持配置默认映射：

- Excel 列名 alias
- 系统字段
- 是否必填
- 默认值

### RiskRuleConfig

MVP 风险规则：

- 到期未完成 → 风险
- 上游阻塞 → 风险
- 进度低于计划 → 预警
- 风险等级高 → 大盘红光强化

---

## 15. Mock 数据要求

### mock-project.ts

```ts
export const mockProject = {
  id: 'project-cloud-devops',
  name: 'Cloud-Native DevOps Platform',
  subtitle: '打造覆盖全研发生命周期的云原生 DevOps 平台',
  description: '本项目致力于构建一套高效、可靠、智能的云原生 DevOps 平台。',
  progress: 48,
  layers: [
    { id: 'vision', name: '愿景层', code: 'vision', progress: 75, status: 'done', order: 1 },
    { id: 'design', name: '设计层', code: 'design', progress: 60, status: 'in_progress', order: 2 },
    { id: 'coordination', name: '协同层', code: 'coordination', progress: 45, status: 'warning', order: 3 },
    { id: 'implementation', name: '实现层', code: 'implementation', progress: 25, status: 'risk', order: 4 },
    { id: 'infrastructure', name: '基础设施层', code: 'infrastructure', progress: 80, status: 'done', order: 5 }
  ]
}
```

### mock-tasks.ts

要求至少包含：

- 5 个层级。
- 每层 8-12 个任务。
- 状态覆盖 done / in_progress / warning / risk / blocked / not_started。
- 至少 12 条依赖关系。
- 至少 5 个风险任务。

---

## 16. 路由与交互流

### 16.1 路由

```txt
/project                 项目主页
/project/board           事项大盘
/project/task/:id        事项详情
/project/import          Excel 导入
/project/config          项目配置
```

### 16.2 主流程

```txt
项目主页
  → 点击层级 / 进入事项清单
事项大盘
  → 搜索 / 筛选 / 风险扫描 / 聚焦模式
  → 点击事项
事项详情
  → 编辑事项
  → 返回大盘
事项大盘
  → 新增事项
  → 新书本点亮
事项大盘
  → Excel 导入
  → 上传 → 映射 → 预览 → 导入完成
  → 返回大盘并高亮导入事项
```

---

## 17. Codex 开发任务拆分

### Task 1：初始化项目与设计 Token

- 创建 Next.js + TypeScript 项目。
- 添加 design-system tokens。
- 添加全局字体、颜色、动效 CSS。

### Task 2：实现基础组件

实现：

- WoodFrame
- ParchmentPanel
- SealButton
- WoodButton
- StatusBadge
- RiskSeal
- ProgressRing
- ProgressBar
- AncientTooltip

### Task 3：实现项目主页

实现：

- ProjectTowerHome
- ProjectInfoPanel
- TowerScene
- LayerProgressRail
- GlobalProgressCard

使用 mockProject。

### Task 4：实现事项大盘

实现：

- TaskShelfBoard
- BoardHeader
- BoardFilterBar
- LayerSummaryRail
- ShelfCanvas
- ShelfRow
- BookTask
- DependencyLightPath
- TaskHoverCard
- BoardLegend

实现 hover、click、filter、search、riskScan、focusMode。

### Task 5：实现事项详情

实现：

- TaskScrollDetail
- DetailHeader
- ScrollSideNav
- TaskOverview
- TaskBreakdownFlow
- DependencyGraph
- ProgressTimeline
- RiskPanel
- DetailRightStatusPanel

### Task 6：实现 Excel 导入流程

实现：

- ExcelImportPage
- ImportStepNav
- ExcelUploadPanel
- FieldMappingTable
- ImportPreviewTable
- ImportActionBar
- ImportResultPanel

mock 上传后生成 rows / mappings。

### Task 7：实现新增 / 编辑事项

实现：

- TaskCreatePage
- TaskEditPage
- TaskCreateDrawer
- TaskFormScroll
- TaskBasicFields
- TaskStatusFields
- TaskScheduleFields
- TaskRiskFields
- TaskDependencyFields

### Task 8：实现项目配置页

实现：

- ProjectConfigPage
- ConfigSideNav
- ProjectBasicConfig
- LayerConfig
- StatusConfig
- ExcelMappingConfig
- RiskRuleConfig

### Task 9：串联完整交互

- 首页跳大盘。
- 大盘跳详情。
- 大盘打开新增抽屉。
- Excel 导入完成回大盘。
- 新增/导入任务点亮。
- 风险扫描视觉增强。

---

## 18. 验收标准

### 18.1 视觉验收

- 页面不能像普通 SaaS 后台。
- 必须保留木塔、书架、卷轴的主视觉结构。
- 状态颜色在首页、大盘、详情、导入、配置中保持一致。
- 风险状态必须比普通状态更容易被识别。

### 18.2 交互验收

- PM 能在 3 秒内识别风险任务。
- 研发能快速找到自己负责的事项。
- 用户能完成：导入 Excel → 映射 → 预览 → 导入 → 大盘查看。
- 用户能完成：新增事项 → 对应层级出现新书本。
- 用户能完成：点击事项 → 查看详情 → 编辑保存。

### 18.3 代码验收

- 所有业务组件 TypeScript 类型完整。
- 设计 token 不硬编码到业务组件。
- mock 数据与组件分离。
- 组件可独立复用。
- 动效通过 className 控制，不写死在 JS 中。

---

## 19. 第一版优先级

### P0

- Design Tokens
- 基础组件
- ProjectTowerHome
- TaskShelfBoard
- BookTask
- DependencyLightPath
- TaskScrollDetail
- ExcelImportPage
- TaskCreateDrawer

### P1

- ProjectConfigPage
- TaskEditPage
- ImportResultPanel
- RiskRuleConfig
- 复杂聚焦模式

### P2

- 高级报表
- 权限
- 自动化
- 团队视图

---

## 20. 核心护城河组件

以下组件必须重点打磨：

```txt
TowerScene
ShelfCanvas
BookTask
DependencyLightPath
RiskVisualState
TaskScrollDetail
```

产品核心不是“古风皮肤”，而是：

> 让项目状态从“读表格”变成“看结构”。

