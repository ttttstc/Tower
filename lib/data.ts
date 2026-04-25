export const PROJECT_DATA = {
  name: "Cloud-Native DevOps Platform",
  subtitle: "打造覆盖全研发生命周期的云原生 DevOps 平台",
  description: "本项目致力于构建一套高效、可靠、智能的云原生 DevOps 平台，通过标准化、自动化和可观测性能力，全面提升研发效能与交付质量，助力企业数字化转型。",
};

export const GOALS = [
  {
    id: "goal-1",
    icon: "rocket",
    title: "提升交付效率",
    description: "通过自动化流水线与标准化流程，缩短交付周期",
  },
  {
    id: "goal-2",
    icon: "shield",
    title: "保障系统稳定",
    description: "构建高可用、可观测的系统架构，降低故障风险",
  },
  {
    id: "goal-3",
    icon: "cpu",
    title: "优化资源利用",
    description: "实现资源弹性管理与成本优化，提高资源利用率",
  },
  {
    id: "goal-4",
    icon: "users",
    title: "赋能团队协作",
    description: "加强跨团队协作与知识沉淀，提升整体研发效能",
  },
];

export const LAYERS = [
  {
    id: "vision",
    name: "愿景层",
    nameEn: "VISION",
    progress: 75,
    color: "#8a9a6a",
  },
  {
    id: "design",
    name: "设计层",
    nameEn: "DESIGN",
    progress: 60,
    color: "#7a8a5a",
  },
  {
    id: "coordination",
    name: "协同层",
    nameEn: "COORDINATION",
    progress: 45,
    color: "#9a8a4a",
  },
  {
    id: "implementation",
    name: "实现层",
    nameEn: "IMPLEMENTATION",
    progress: 25,
    color: "#aa8a3a",
  },
  {
    id: "infrastructure",
    name: "基础设施层",
    nameEn: "INFRASTRUCTURE",
    progress: 80,
    color: "#8a5a3a",
  },
];

export const OVERALL_PROGRESS = {
  percentage: 48,
  completed: 24,
  total: 50,
};

export const SIDEBAR_SECTIONS = [
  { id: "intro", title: "项目介绍", defaultOpen: true },
  { id: "goals", title: "目标", defaultOpen: true },
  { id: "scope", title: "范围", defaultOpen: false },
  { id: "milestones", title: "里程碑", defaultOpen: false },
  { id: "documents", title: "相关文档", defaultOpen: false },
];

// Items data for the dashboard and detail pages
export interface ItemTask {
  id: string;
  name: string;
  progress: number;
  status: "completed" | "in-progress" | "not-started";
}

export interface ItemDependency {
  id: string;
  name: string;
  progress: number;
  status: "completed" | "in-progress" | "not-started";
  type: "upstream" | "downstream";
}

export interface ProgressLogEntry {
  date: string;
  event: string;
}

export interface Item {
  id: string;
  name: string;
  layerId: string;
  section: string;
  segment: string;
  progress: number;
  status: "completed" | "in-progress" | "not-started";
  description: string;
  tasks: ItemTask[];
  dependencies: ItemDependency[];
  progressLog: ProgressLogEntry[];
  owner: {
    name: string;
    role: string;
  };
  priority: "high" | "medium" | "low";
  complexity: "high" | "medium" | "low";
  completedSteps: number;
  totalSteps: number;
}

export const LAYER_ITEMS: Record<string, Item[]> = {
  vision: [
    { id: "v1", name: "架构概念设计", layerId: "vision", section: "愿景层", segment: "第1段", progress: 100, status: "completed", description: "定义整体架构概念", tasks: [], dependencies: [], progressLog: [], owner: { name: "李明", role: "架构师" }, priority: "high", complexity: "high", completedSteps: 5, totalSteps: 5 },
    { id: "v2", name: "用例场景设计", layerId: "vision", section: "愿景层", segment: "第1段", progress: 80, status: "in-progress", description: "梳理核心用例场景", tasks: [], dependencies: [], progressLog: [], owner: { name: "王芳", role: "产品经理" }, priority: "high", complexity: "medium", completedSteps: 4, totalSteps: 5 },
    { id: "v3", name: "技术选型评估", layerId: "vision", section: "愿景层", segment: "第2段", progress: 60, status: "in-progress", description: "评估技术栈选型", tasks: [], dependencies: [], progressLog: [], owner: { name: "张伟", role: "技术负责人" }, priority: "high", complexity: "high", completedSteps: 3, totalSteps: 5 },
    { id: "v4", name: "风险评估", layerId: "vision", section: "愿景层", segment: "第2段", progress: 40, status: "in-progress", description: "识别项目风险", tasks: [], dependencies: [], progressLog: [], owner: { name: "刘洋", role: "项目经理" }, priority: "medium", complexity: "medium", completedSteps: 2, totalSteps: 5 },
    { id: "v5", name: "性能目标设定", layerId: "vision", section: "愿景层", segment: "第3段", progress: 60, status: "in-progress", description: "设定性能指标", tasks: [], dependencies: [], progressLog: [], owner: { name: "赵敏", role: "架构师" }, priority: "high", complexity: "medium", completedSteps: 3, totalSteps: 5 },
    { id: "v6", name: "成本分析", layerId: "vision", section: "愿景层", segment: "第3段", progress: 40, status: "in-progress", description: "进行成本分析", tasks: [], dependencies: [], progressLog: [], owner: { name: "孙强", role: "财务分析师" }, priority: "medium", complexity: "low", completedSteps: 2, totalSteps: 5 },
    { id: "v7", name: "合规分析", layerId: "vision", section: "愿景层", segment: "第3段", progress: 40, status: "in-progress", description: "合规性分析", tasks: [], dependencies: [], progressLog: [], owner: { name: "周琳", role: "合规专员" }, priority: "medium", complexity: "medium", completedSteps: 2, totalSteps: 5 },
    { id: "v8", name: "市场分析", layerId: "vision", section: "愿景层", segment: "第4段", progress: 40, status: "in-progress", description: "市场调研分析", tasks: [], dependencies: [], progressLog: [], owner: { name: "吴昊", role: "市场分析师" }, priority: "low", complexity: "low", completedSteps: 2, totalSteps: 5 },
  ],
  design: [
    { id: "d1", name: "系统模块设计", layerId: "design", section: "设计层", segment: "第1段", progress: 100, status: "completed", description: "设计系统模块划分", tasks: [], dependencies: [], progressLog: [], owner: { name: "李明", role: "架构师" }, priority: "high", complexity: "high", completedSteps: 5, totalSteps: 5 },
    { id: "d2", name: "接口设计", layerId: "design", section: "设计层", segment: "第1段", progress: 75, status: "in-progress", description: "设计API接口规范", tasks: [], dependencies: [], progressLog: [], owner: { name: "张伟", role: "技术负责人" }, priority: "high", complexity: "high", completedSteps: 4, totalSteps: 5 },
    { id: "d3", name: "数据结构设计", layerId: "design", section: "设计层", segment: "第2段", progress: 50, status: "in-progress", description: "设计数据模型", tasks: [], dependencies: [], progressLog: [], owner: { name: "王芳", role: "数据架构师" }, priority: "high", complexity: "high", completedSteps: 3, totalSteps: 5 },
    { id: "d4", name: "安全设计", layerId: "design", section: "设计层", segment: "第2段", progress: 50, status: "in-progress", description: "安全架构设计", tasks: [], dependencies: [], progressLog: [], owner: { name: "赵敏", role: "安全专家" }, priority: "high", complexity: "high", completedSteps: 3, totalSteps: 5 },
    { id: "d5", name: "缓存设计", layerId: "design", section: "设计层", segment: "第3段", progress: 50, status: "in-progress", description: "缓存策略设计", tasks: [], dependencies: [], progressLog: [], owner: { name: "刘洋", role: "架构师" }, priority: "medium", complexity: "medium", completedSteps: 3, totalSteps: 5 },
    { id: "d6", name: "日志设计", layerId: "design", section: "设计层", segment: "第3段", progress: 50, status: "in-progress", description: "日志系统设计", tasks: [], dependencies: [], progressLog: [], owner: { name: "孙强", role: "运维工程师" }, priority: "medium", complexity: "low", completedSteps: 3, totalSteps: 5 },
    { id: "d7", name: "监控设计", layerId: "design", section: "设计层", segment: "第4段", progress: 50, status: "in-progress", description: "监控系统设计", tasks: [], dependencies: [], progressLog: [], owner: { name: "周琳", role: "SRE工程师" }, priority: "high", complexity: "medium", completedSteps: 3, totalSteps: 5 },
    { id: "d8", name: "容灾设计", layerId: "design", section: "设计层", segment: "第4段", progress: 50, status: "in-progress", description: "容灾方案设计", tasks: [], dependencies: [], progressLog: [], owner: { name: "吴昊", role: "架构师" }, priority: "high", complexity: "high", completedSteps: 3, totalSteps: 5 },
  ],
  coordination: [
    { id: "c1", name: "服务架构设计", layerId: "coordination", section: "协同层", segment: "第1段", progress: 75, status: "in-progress", description: "微服务架构设计", tasks: [], dependencies: [], progressLog: [], owner: { name: "李明", role: "架构师" }, priority: "high", complexity: "high", completedSteps: 4, totalSteps: 5 },
    { 
      id: "c2", 
      name: "数据流设计", 
      layerId: "coordination", 
      section: "协同层", 
      segment: "第3段", 
      progress: 50, 
      status: "in-progress", 
      description: "本项用于设计平台数据流转机制，定义数据采集、处理、存储、分发全链路标准，为上层应用提供稳定可靠的数据基础。",
      tasks: [
        { id: "t1", name: "接口设计", progress: 100, status: "completed" },
        { id: "t2", name: "数据模型设计", progress: 75, status: "in-progress" },
        { id: "t3", name: "状态管理设计", progress: 50, status: "in-progress" },
        { id: "t4", name: "数据校验与容错", progress: 0, status: "not-started" },
        { id: "t5", name: "文档编写与评审", progress: 0, status: "not-started" },
      ],
      dependencies: [
        { id: "dep1", name: "用户体系", progress: 100, status: "completed", type: "upstream" },
        { id: "dep2", name: "权限系统", progress: 50, status: "in-progress", type: "upstream" },
        { id: "dep3", name: "接口设计", progress: 70, status: "in-progress", type: "downstream" },
        { id: "dep4", name: "监控告警系统", progress: 0, status: "not-started", type: "downstream" },
      ],
      progressLog: [
        { date: "3/10", event: "开工，明确设计范围" },
        { date: "3/12", event: "完成接口设计" },
        { date: "3/14", event: "数据模型设计中" },
        { date: "3/16", event: "评审通过，进入开发" },
        { date: "3/18", event: "上线接口联调反馈" },
        { date: "3/20", event: "记录中" },
        { date: "3/22", event: "记录中" },
      ],
      owner: { name: "张三", role: "主匠（负责人）" },
      priority: "high",
      complexity: "medium",
      completedSteps: 3,
      totalSteps: 7
    },
    { id: "c3", name: "交互流程设计", layerId: "coordination", section: "协同层", segment: "第2段", progress: 50, status: "in-progress", description: "用户交互流程设计", tasks: [], dependencies: [], progressLog: [], owner: { name: "王芳", role: "UX设计师" }, priority: "medium", complexity: "medium", completedSteps: 3, totalSteps: 5 },
    { id: "c4", name: "数据治理设计", layerId: "coordination", section: "协同层", segment: "第3段", progress: 25, status: "in-progress", description: "数据治理方案", tasks: [], dependencies: [], progressLog: [], owner: { name: "赵敏", role: "数据工程师" }, priority: "high", complexity: "high", completedSteps: 2, totalSteps: 5 },
    { id: "c5", name: "性能设计", layerId: "coordination", section: "协同层", segment: "第4段", progress: 25, status: "in-progress", description: "性能优化设计", tasks: [], dependencies: [], progressLog: [], owner: { name: "刘洋", role: "性能工程师" }, priority: "high", complexity: "high", completedSteps: 2, totalSteps: 5 },
    { id: "c6", name: "资源设计", layerId: "coordination", section: "协同层", segment: "第4段", progress: 50, status: "in-progress", description: "资源调度设计", tasks: [], dependencies: [], progressLog: [], owner: { name: "孙强", role: "云架构师" }, priority: "medium", complexity: "medium", completedSteps: 3, totalSteps: 5 },
    { id: "c7", name: "任务调度设计", layerId: "coordination", section: "协同层", segment: "第5段", progress: 50, status: "in-progress", description: "任务调度方案", tasks: [], dependencies: [], progressLog: [], owner: { name: "周琳", role: "后端工程师" }, priority: "medium", complexity: "medium", completedSteps: 3, totalSteps: 5 },
    { id: "c8", name: "依赖管理设计", layerId: "coordination", section: "协同层", segment: "第5段", progress: 50, status: "in-progress", description: "依赖管理方案", tasks: [], dependencies: [], progressLog: [], owner: { name: "吴昊", role: "DevOps工程师" }, priority: "medium", complexity: "medium", completedSteps: 3, totalSteps: 5 },
  ],
  implementation: [
    { id: "i1", name: "服务实现", layerId: "implementation", section: "实现层", segment: "第1段", progress: 75, status: "in-progress", description: "核心服务开发", tasks: [], dependencies: [], progressLog: [], owner: { name: "李明", role: "高级开发" }, priority: "high", complexity: "high", completedSteps: 4, totalSteps: 5 },
    { id: "i2", name: "数据层实现", layerId: "implementation", section: "实现层", segment: "第1段", progress: 50, status: "in-progress", description: "数据层开发", tasks: [], dependencies: [], progressLog: [], owner: { name: "张伟", role: "数据工程师" }, priority: "high", complexity: "high", completedSteps: 3, totalSteps: 5 },
    { id: "i3", name: "监控实现", layerId: "implementation", section: "实现层", segment: "第2段", progress: 25, status: "in-progress", description: "监控系统开发", tasks: [], dependencies: [], progressLog: [], owner: { name: "王芳", role: "SRE工程师" }, priority: "high", complexity: "medium", completedSteps: 2, totalSteps: 5 },
    { id: "i4", name: "告警实现", layerId: "implementation", section: "实现层", segment: "第2段", progress: 25, status: "in-progress", description: "告警系统开发", tasks: [], dependencies: [], progressLog: [], owner: { name: "赵敏", role: "运维工程师" }, priority: "high", complexity: "medium", completedSteps: 2, totalSteps: 5 },
    { id: "i5", name: "容灾实现", layerId: "implementation", section: "实现层", segment: "第3段", progress: 25, status: "in-progress", description: "容灾方案实现", tasks: [], dependencies: [], progressLog: [], owner: { name: "刘洋", role: "架构师" }, priority: "high", complexity: "high", completedSteps: 2, totalSteps: 5 },
    { id: "i6", name: "性能实现", layerId: "implementation", section: "实现层", segment: "第3段", progress: 25, status: "in-progress", description: "性能优化实现", tasks: [], dependencies: [], progressLog: [], owner: { name: "孙强", role: "性能工程师" }, priority: "medium", complexity: "high", completedSteps: 2, totalSteps: 5 },
    { id: "i7", name: "安全加固", layerId: "implementation", section: "实现层", segment: "第4段", progress: 25, status: "in-progress", description: "安全加固实现", tasks: [], dependencies: [], progressLog: [], owner: { name: "周琳", role: "安全工程师" }, priority: "high", complexity: "high", completedSteps: 2, totalSteps: 5 },
    { id: "i8", name: "集成总装", layerId: "implementation", section: "实现层", segment: "第4段", progress: 25, status: "in-progress", description: "系统集成测试", tasks: [], dependencies: [], progressLog: [], owner: { name: "吴昊", role: "测试工程师" }, priority: "high", complexity: "medium", completedSteps: 2, totalSteps: 5 },
  ],
  infrastructure: [
    { id: "inf1", name: "需求收集", layerId: "infrastructure", section: "基础设施层", segment: "第1段", progress: 100, status: "completed", description: "收集基础设施需求", tasks: [], dependencies: [], progressLog: [], owner: { name: "李明", role: "架构师" }, priority: "high", complexity: "low", completedSteps: 5, totalSteps: 5 },
    { id: "inf2", name: "先决分析", layerId: "infrastructure", section: "基础设施层", segment: "第1段", progress: 75, status: "in-progress", description: "前置条件分析", tasks: [], dependencies: [], progressLog: [], owner: { name: "张伟", role: "技术负责人" }, priority: "high", complexity: "medium", completedSteps: 4, totalSteps: 5 },
    { id: "inf3", name: "审批", layerId: "infrastructure", section: "基础设施层", segment: "第2段", progress: 50, status: "in-progress", description: "资源审批流程", tasks: [], dependencies: [], progressLog: [], owner: { name: "王芳", role: "项目经理" }, priority: "medium", complexity: "low", completedSteps: 3, totalSteps: 5 },
    { id: "inf4", name: "资源申请", layerId: "infrastructure", section: "基础设施层", segment: "第2段", progress: 25, status: "in-progress", description: "云资源申请", tasks: [], dependencies: [], progressLog: [], owner: { name: "赵敏", role: "云架构师" }, priority: "high", complexity: "medium", completedSteps: 2, totalSteps: 5 },
    { id: "inf5", name: "基准配置", layerId: "infrastructure", section: "基础设施层", segment: "第3段", progress: 75, status: "in-progress", description: "基准环境配置", tasks: [], dependencies: [], progressLog: [], owner: { name: "刘洋", role: "运维工程师" }, priority: "high", complexity: "medium", completedSteps: 4, totalSteps: 5 },
    { id: "inf6", name: "业务分析", layerId: "infrastructure", section: "基础设施层", segment: "第3段", progress: 50, status: "in-progress", description: "业务需求分析", tasks: [], dependencies: [], progressLog: [], owner: { name: "孙强", role: "业务分析师" }, priority: "medium", complexity: "medium", completedSteps: 3, totalSteps: 5 },
    { id: "inf7", name: "环境搭建", layerId: "infrastructure", section: "基础设施层", segment: "第4段", progress: 75, status: "in-progress", description: "开发环境搭建", tasks: [], dependencies: [], progressLog: [], owner: { name: "周琳", role: "DevOps工程师" }, priority: "high", complexity: "medium", completedSteps: 4, totalSteps: 5 },
    { id: "inf8", name: "CI/CD流水线", layerId: "infrastructure", section: "基础设施层", segment: "第4段", progress: 75, status: "in-progress", description: "CI/CD流水线搭建", tasks: [], dependencies: [], progressLog: [], owner: { name: "吴昊", role: "DevOps工程师" }, priority: "high", complexity: "high", completedSteps: 4, totalSteps: 5 },
  ],
};

export function getItemById(id: string): Item | undefined {
  for (const layerItems of Object.values(LAYER_ITEMS)) {
    const item = layerItems.find(i => i.id === id);
    if (item) return item;
  }
  return undefined;
}

export function getLayerById(id: string) {
  return LAYERS.find(l => l.id === id);
}
