// store.js — TowerProject 数据中心
// 单页静态站点共享。模块系统：原生 ES Module。
// 用法：import { Store, LAYERS, STATUSES } from './js/store.js';

export const LAYERS = [
  { key: 'vision', name: '愿景层', en: 'VISION' },
  { key: 'design', name: '设计层', en: 'DESIGN' },
  { key: 'coordination', name: '协同层', en: 'COORDINATION' },
  { key: 'implementation', name: '实现层', en: 'IMPLEMENTATION' },
  { key: 'infrastructure', name: '基础设施层', en: 'INFRASTRUCTURE' },
];

export const LAYER_KEYS = LAYERS.map((layer) => layer.key);

export const STATUSES = [
  { key: 'done', name: '已完成', color: '#7fc060' },
  { key: 'in_progress', name: '进行中', color: '#f0a040' },
  { key: 'overdue', name: '延期', color: '#ffd040' },
  { key: 'blocked', name: '阻塞', color: '#ff5040' },
  { key: 'not_started', name: '待启动', color: '#9a8862' },
];

const STORAGE_KEY = 'tower.project.v1';
const SNAPSHOT_KEY_PREFIX = 'tower.snapshot.';
const LAST_OPEN_KEY = 'tower.lastOpenDate';
const JSON_FILE_TYPE = {
  description: 'Tower Project',
  accept: { 'application/json': ['.json'] },
};
const STATUS_PROGRESS = {
  done: 100,
  in_progress: 60,
  overdue: 40,
  blocked: 25,
  not_started: 0,
};

function uuid(prefix = 'i') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function uniqStrings(values) {
  return Array.from(new Set((values || []).map((value) => String(value || '').trim()).filter(Boolean)));
}

function clampProgress(value, status = 'not_started') {
  if (value === '' || value == null || Number.isNaN(Number(value))) return STATUS_PROGRESS[status] ?? 0;
  return Math.max(0, Math.min(100, Math.round(Number(value))));
}

function normalizeDateInput(value) {
  const input = String(value || '').trim();
  if (!input) return '';
  const match = input.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (!match) return '';
  return `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`;
}

function slugify(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'tag';
}

function dedupeMilestones(list) {
  const seen = new Set();
  const result = [];
  (list || []).forEach((entry) => {
    if (!entry || !entry.id || seen.has(entry.id)) return;
    seen.add(entry.id);
    result.push(entry);
  });
  return result;
}

function normalizeMilestone(raw = {}, index = 0) {
  const name = String(raw.name || raw.title || raw.label || '').trim();
  if (!name) return null;
  const date = normalizeDateInput(raw.date || raw.dueDate || raw.deadline);
  const fallback = `ms_${slugify(`${name}-${date || index + 1}`)}`;
  return {
    id: String(raw.id || raw.key || fallback).trim() || fallback,
    name,
    date,
  };
}

function normalizeGoal(raw = {}, index = 0) {
  const title = String(raw.title || raw.name || '').trim();
  const description = String(raw.description || raw.desc || raw.summary || '').trim();
  if (!title && !description) return null;
  const fallback = `goal_${slugify(title || `goal-${index + 1}`)}`;
  return {
    id: String(raw.id || raw.key || fallback).trim() || fallback,
    title: title || `目标 ${index + 1}`,
    description,
  };
}

function defaultGoals() {
  return [
    {
      id: 'goal_delivery',
      title: '提升交付效率',
      description: '通过自动化流水线与标准化流程，缩短版本交付周期。',
    },
    {
      id: 'goal_stability',
      title: '保障系统稳定',
      description: '构建高可用、可观测的系统架构，降低故障风险。',
    },
    {
      id: 'goal_resource',
      title: '优化资源利用',
      description: '实现资源弹性管理与成本优化，提高资源利用率。',
    },
    {
      id: 'goal_teamwork',
      title: '赋能团队协作',
      description: '加强跨团队协作与知识沉淀，提升整体研发效能。',
    },
  ];
}

function defaultMilestones() {
  return [
    { id: 'ms_orientation', name: '立项定盘', date: '2026-05-08' },
    { id: 'ms_design_ready', name: '方案成稿', date: '2026-05-28' },
    { id: 'ms_joint_debug', name: '联调通塔', date: '2026-06-20' },
    { id: 'ms_release', name: '首轮交付', date: '2026-07-18' },
  ];
}

function mapMilestoneRefs(values, milestones) {
  const byId = new Set((milestones || []).map((entry) => entry.id));
  const byName = new Map((milestones || []).map((entry) => [entry.name.toLowerCase(), entry.id]));
  return uniqStrings(values).map((value) => {
    if (byId.has(value)) return value;
    return byName.get(String(value).toLowerCase()) || '';
  }).filter(Boolean);
}

function inferMilestonesForItem(item, milestones) {
  const ids = milestones.map((entry) => entry.id);
  const [orientation, designReady, jointDebug, release] = ids;
  const preset = {
    vision: [orientation],
    design: [orientation, designReady],
    coordination: [designReady, jointDebug],
    implementation: [jointDebug, release],
    infrastructure: [orientation, release],
  };
  const refs = new Set((preset[item.layer] || [release || orientation]).filter(Boolean));
  if ((item.status === 'done' || item.progress >= 100) && release) refs.add(release);
  return [...refs];
}

function normalizeItem(raw = {}) {
  const id = String(raw.id || uuid()).trim() || uuid();
  const risk = !!raw.risk;
  const layer = LAYER_KEYS.includes(raw.layer) ? raw.layer : 'implementation';
  const status = STATUSES.some((entry) => entry.key === raw.status) ? raw.status : 'not_started';
  const progress = clampProgress(raw.progress, status);
  const effort = Math.max(1, Math.min(20, parseInt(raw.effort, 10) || 1));
  const createdAt = raw.createdAt || nowIso();
  const updatedAt = raw.updatedAt || createdAt;
  const dependencies = Array.isArray(raw.dependencies)
    ? Array.from(new Set(raw.dependencies.map((depId) => String(depId)).filter(Boolean))).filter((depId) => depId !== id)
    : [];
  const milestones = uniqStrings([
    ...(raw.milestones || []),
    ...(raw.milestoneIds || []),
    ...(raw.tags || []),
    ...(raw.labels || []),
  ]);
  return {
    id,
    title: String(raw.title || '新事项').trim() || '新事项',
    layer,
    status: risk ? 'blocked' : status,
    progress: risk ? Math.max(progress, STATUS_PROGRESS.blocked) : progress,
    effort,
    dependencies,
    assignee: String(raw.assignee || '').trim(),
    risk,
    notes: String(raw.notes || ''),
    milestones,
    createdAt,
    updatedAt,
  };
}

function normalizeProject(raw) {
  if (!raw || !Array.isArray(raw.items)) throw new Error('无效的 tower.json');
  let items = raw.items.map(normalizeItem);
  let milestones = dedupeMilestones((raw.milestones || []).map(normalizeMilestone).filter(Boolean));

  if (!milestones.length) {
    milestones = defaultMilestones();
    items = items.map((item) => ({
      ...item,
      milestones: item.milestones.length ? item.milestones : inferMilestonesForItem(item, milestones),
    }));
  } else {
    items = items.map((item) => ({
      ...item,
      milestones: mapMilestoneRefs(item.milestones, milestones),
    }));
  }

  return {
    version: '1.2',
    name: String(raw.name || 'Tower 项目').trim() || 'Tower 项目',
    goal: String(raw.goal || '').trim(),
    acceptanceCriteria: String(raw.acceptanceCriteria || '').trim(),
    goals: (raw.goals || raw.objectives || []).map(normalizeGoal).filter(Boolean).slice(0, 8).length
      ? (raw.goals || raw.objectives || []).map(normalizeGoal).filter(Boolean).slice(0, 8)
      : defaultGoals(),
    owners: uniqStrings([...(raw.owners || []), ...items.map((item) => item.assignee)]),
    milestones,
    items,
  };
}

function itemProgress(item) {
  return clampProgress(item?.progress, item?.status);
}

// ========== Demo seed data ==========
function seed() {
  const owners = ['PM', 'Arch', 'Dev-A', 'Dev-B', 'Dev-C', 'QA'];
  const milestones = defaultMilestones();
  const T = [
    ['vision', '北极星指标', 'done', 2, 'PM'],
    ['vision', '商业化路径', 'in_progress', 3, 'PM'],
    ['vision', '里程碑规划', 'done', 2, 'PM'],
    ['vision', '相关方对齐', 'in_progress', 2, 'PM'],
    ['design', '应县木塔视觉', 'done', 5, 'Arch'],
    ['design', '交互规范', 'in_progress', 4, 'Arch'],
    ['design', '组件库', 'in_progress', 6, 'Dev-B'],
    ['design', '色彩 token', 'done', 1, 'Arch'],
    ['design', '字体方案', 'done', 1, 'Arch'],
    ['coordination', '工作流引擎', 'in_progress', 5, 'Dev-A'],
    ['coordination', '权限模型', 'in_progress', 4, 'Dev-A'],
    ['coordination', 'Webhook 对接', 'not_started', 3, 'Dev-C'],
    ['coordination', '通知服务', 'blocked', 4, 'Dev-C'],
    ['coordination', '审计日志', 'not_started', 2, 'Dev-C'],
    ['implementation', 'API 网关', 'in_progress', 5, 'Dev-A'],
    ['implementation', '数据流引擎', 'in_progress', 6, 'Dev-A'],
    ['implementation', '触发链', 'overdue', 3, 'Dev-B'],
    ['implementation', '前端框架', 'done', 4, 'Dev-B'],
    ['implementation', 'E2E 测试', 'not_started', 4, 'QA'],
    ['implementation', '插件机制', 'not_started', 5, 'Dev-B'],
    ['infrastructure', 'K8s 集群', 'done', 5, 'Dev-C'],
    ['infrastructure', 'CI 镜像', 'done', 2, 'Dev-C'],
    ['infrastructure', '对象存储', 'done', 2, 'Dev-C'],
    ['infrastructure', 'CDN 部署', 'done', 1, 'Dev-C'],
    ['infrastructure', '监控告警', 'in_progress', 3, 'Dev-C'],
    ['infrastructure', '容灾演练', 'not_started', 3, 'Dev-C'],
  ];
  const items = T.map(([layer, title, status, effort, assignee]) => {
    const progress = STATUS_PROGRESS[status] ?? 0;
    const item = {
      id: uuid(),
      title,
      layer,
      status,
      progress,
      effort,
      dependencies: [],
      assignee,
      risk: status === 'blocked',
      notes: '',
      milestones: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    item.milestones = inferMilestonesForItem(item, milestones);
    return item;
  });

  const find = (title) => items.find((item) => item.title === title)?.id;
  const link = (from, to) => {
    const fromId = find(from);
    const toId = find(to);
    if (fromId && toId) items.find((item) => item.id === fromId).dependencies.push(toId);
  };
  link('数据流引擎', 'K8s 集群');
  link('API 网关', '权限模型');
  link('工作流引擎', 'API 网关');
  link('交互规范', '应县木塔视觉');

  return {
    version: '1.2',
    name: 'Cloud-Native DevOps Platform',
    goal: '打造覆盖规划、设计、协同、交付与运维的云原生 DevOps 平台，让事项推进、资源协同与里程碑交付都能在一座塔里清晰可见。',
    acceptanceCriteria: '覆盖需求、设计、协同、实现与基础设施全流程',
    goals: defaultGoals(),
    owners,
    milestones,
    items,
  };
}

// ========== Store ==========
function loadRaw() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function saveRaw(project) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
}

class StoreImpl {
  constructor() {
    this._listeners = new Set();
    this._fileHandle = null;
    this._fileName = '';
    let project = loadRaw();
    try {
      this._project = project ? normalizeProject(project) : normalizeProject(seed());
    } catch {
      this._project = normalizeProject(seed());
    }
    this._save();
    this._maybeSnapshot();
  }

  // ---------- subscribe ----------
  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _emit(evt) {
    this._listeners.forEach((fn) => fn(evt, this._project));
  }

  // ---------- read ----------
  get project() { return this._project; }
  get items() { return this._project.items; }
  get goals() { return this._project.goals || []; }
  get milestones() { return this._project.milestones || []; }
  itemsByLayer(key) { return this._project.items.filter((item) => item.layer === key); }
  itemsByMilestone(id) { return this._project.items.filter((item) => (item.milestones || []).includes(id)); }
  getItem(id) { return this._project.items.find((item) => item.id === id); }
  getMilestone(id) { return this.milestones.find((milestone) => milestone.id === id); }

  fileSystemSupported() {
    return typeof window !== 'undefined' && ('showOpenFilePicker' in window || 'showSaveFilePicker' in window);
  }

  boundFileName() { return this._fileName; }
  isBoundToFile() { return !!this._fileHandle; }

  layerProgress(key) {
    const items = this.itemsByLayer(key);
    const total = items.reduce((sum, item) => sum + (item.effort || 0), 0);
    const weighted = items.reduce((sum, item) => sum + (item.effort || 0) * itemProgress(item), 0);
    const doneCount = items.filter((item) => itemProgress(item) >= 100 || item.status === 'done').length;
    return {
      total,
      weighted,
      done: doneCount,
      doneCount,
      pct: total ? Math.round(weighted / total) : 0,
      count: items.length,
    };
  }

  overallProgress() {
    const total = this._project.items.reduce((sum, item) => sum + (item.effort || 0), 0);
    const weighted = this._project.items.reduce((sum, item) => sum + (item.effort || 0) * itemProgress(item), 0);
    const doneCount = this._project.items.filter((item) => itemProgress(item) >= 100 || item.status === 'done').length;
    return {
      total,
      weighted,
      done: Math.round(weighted / 100),
      pct: total ? Math.round(weighted / total) : 0,
      count: this._project.items.length,
      doneCount,
    };
  }

  milestoneProgress(id) {
    const milestone = this.getMilestone(id);
    const items = this.itemsByMilestone(id);
    const total = items.reduce((sum, item) => sum + (item.effort || 0), 0);
    const weighted = items.reduce((sum, item) => sum + (item.effort || 0) * itemProgress(item), 0);
    const doneCount = items.filter((item) => itemProgress(item) >= 100 || item.status === 'done').length;
    return {
      id,
      name: milestone?.name || '',
      date: milestone?.date || '',
      total,
      weighted,
      pct: total ? Math.round(weighted / total) : 0,
      count: items.length,
      doneCount,
      items,
    };
  }

  milestoneSummaries() {
    return this.milestones
      .map((milestone) => ({ ...milestone, ...this.milestoneProgress(milestone.id) }))
      .sort((left, right) => {
        if (left.date && right.date) return left.date.localeCompare(right.date);
        if (left.date) return -1;
        if (right.date) return 1;
        return left.name.localeCompare(right.name, 'zh-CN');
      });
  }

  // ---------- mutate ----------
  _save() { saveRaw(this._project); }

  _setProject(project, evt = { type: 'reset' }) {
    this._project = normalizeProject(project);
    this._save();
    this._emit(evt);
    return this._project;
  }

  _sanitizeMilestoneRefs(values) {
    return mapMilestoneRefs(values, this.milestones);
  }

  setProjectMeta({ name, goal, acceptanceCriteria, goals, milestones }) {
    if (name !== undefined) this._project.name = name;
    if (goal !== undefined) this._project.goal = goal;
    if (acceptanceCriteria !== undefined) this._project.acceptanceCriteria = acceptanceCriteria;
    if (goals !== undefined) {
      this._project.goals = (goals || []).map(normalizeGoal).filter(Boolean).slice(0, 8);
    }
    if (milestones !== undefined) {
      this._project.milestones = dedupeMilestones((milestones || []).map(normalizeMilestone).filter(Boolean));
      this._project.items.forEach((item) => {
        item.milestones = this._sanitizeMilestoneRefs(item.milestones);
      });
    }
    this._save();
    this._emit({ type: 'meta' });
  }

  addOwner(name) {
    if (!name) return;
    if (!this._project.owners.includes(name)) {
      this._project.owners.push(name);
      this._save();
      this._emit({ type: 'owner-add', name });
    }
  }

  addItem(partial) {
    const item = {
      id: uuid(),
      title: partial.title || '新事项',
      layer: partial.layer || 'implementation',
      status: partial.status || 'not_started',
      progress: clampProgress(partial.progress, partial.status || 'not_started'),
      effort: Math.max(1, Math.min(20, parseInt(partial.effort, 10) || 1)),
      dependencies: Array.isArray(partial.dependencies) ? partial.dependencies.slice() : [],
      assignee: partial.assignee || '',
      risk: !!partial.risk,
      notes: partial.notes || '',
      milestones: this._sanitizeMilestoneRefs(partial.milestones),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    if (item.risk) {
      item.status = 'blocked';
      item.progress = Math.max(item.progress, STATUS_PROGRESS.blocked);
    }
    this._project.items.push(item);
    if (item.assignee) this.addOwner(item.assignee);
    this._save();
    this._emit({ type: 'item-add', id: item.id, layers: [item.layer] });
    return item;
  }

  updateItem(id, patch) {
    const item = this.getItem(id);
    if (!item) return null;
    const oldLayer = item.layer;
    const layers = new Set();
    Object.keys(patch).forEach((key) => {
      if (key === 'id' || key === 'createdAt') return;
      if (key === 'effort') item[key] = Math.max(1, Math.min(20, parseInt(patch[key], 10) || 1));
      else if (key === 'progress') item[key] = clampProgress(patch[key], patch.status || item.status);
      else if (key === 'milestones') item[key] = this._sanitizeMilestoneRefs(patch[key]);
      else item[key] = patch[key];
    });
    if (item.risk) {
      item.status = 'blocked';
      item.progress = Math.max(clampProgress(item.progress, item.status), STATUS_PROGRESS.blocked);
    } else {
      item.progress = clampProgress(item.progress, item.status);
    }
    if (item.dependencies) item.dependencies = (item.dependencies || []).filter((depId) => depId !== id);
    item.updatedAt = nowIso();
    if (item.layer !== oldLayer) {
      layers.add(oldLayer);
      layers.add(item.layer);
    } else {
      layers.add(item.layer);
    }
    if (item.assignee) this.addOwner(item.assignee);
    this._save();
    this._emit({ type: 'item-update', id, layers: [...layers] });
    return item;
  }

  removeItem(id) {
    const index = this._project.items.findIndex((item) => item.id === id);
    if (index < 0) return;
    const layer = this._project.items[index].layer;
    this._project.items.splice(index, 1);
    this._project.items.forEach((item) => {
      item.dependencies = (item.dependencies || []).filter((depId) => depId !== id);
    });
    this._save();
    this._emit({ type: 'item-remove', id, layers: [layer] });
  }

  bulkAddItems(items) {
    const created = [];
    items.forEach((entry) => { created.push(this.addItem(entry)); });
    return created;
  }

  // ---------- 依赖环检测 ----------
  wouldCycle(itemId, depId) {
    if (itemId === depId) return true;
    const visited = new Set();
    const stack = [depId];
    while (stack.length) {
      const current = stack.pop();
      if (current === itemId) return true;
      if (visited.has(current)) continue;
      visited.add(current);
      const item = this.getItem(current);
      if (item) (item.dependencies || []).forEach((dependency) => stack.push(dependency));
    }
    return false;
  }

  // ---------- 快照 / 日报 ----------
  _maybeSnapshot() {
    const today = todayStr();
    const last = localStorage.getItem(LAST_OPEN_KEY);
    if (last !== today) {
      if (last) {
        const snapKey = SNAPSHOT_KEY_PREFIX + last;
        if (!localStorage.getItem(snapKey)) {
          localStorage.setItem(snapKey, JSON.stringify(this._project));
        }
      }
      localStorage.setItem(LAST_OPEN_KEY, today);
    }
  }

  latestSnapshot() {
    const keys = Object.keys(localStorage)
      .filter((key) => key.startsWith(SNAPSHOT_KEY_PREFIX))
      .sort();
    if (!keys.length) return null;
    try {
      return {
        date: keys[keys.length - 1].slice(SNAPSHOT_KEY_PREFIX.length),
        data: JSON.parse(localStorage.getItem(keys[keys.length - 1])),
      };
    } catch {
      return null;
    }
  }

  buildDailyReport() {
    const snapshot = this.latestSnapshot();
    const current = this._project;
    const lines = [];
    lines.push(`# ${current.name} · 今日日报`);
    lines.push('');
    lines.push(`> 生成于 ${new Date().toLocaleString('zh-CN')}`);
    lines.push('');
    if (!snapshot) {
      lines.push('（无历史快照可对比，仅展示当前状态）');
      lines.push('');
    } else {
      lines.push(`对比快照：${snapshot.date}`);
      lines.push('');
      const prevMap = new Map(snapshot.data.items.map((item) => [item.id, item]));
      const curMap = new Map(current.items.map((item) => [item.id, item]));

      const added = current.items.filter((item) => !prevMap.has(item.id));
      const removed = snapshot.data.items.filter((item) => !curMap.has(item.id));
      const changed = current.items.filter((item) => prevMap.has(item.id) && prevMap.get(item.id).status !== item.status);

      lines.push(`## 新增事项（${added.length}）`);
      added.forEach((item) => lines.push(`- [${LAYERS.find((layer) => layer.key === item.layer)?.name}] ${item.title}（${item.assignee || '未分配'}）`));
      if (!added.length) lines.push('- 无');
      lines.push('');

      lines.push(`## 状态变化（${changed.length}）`);
      changed.forEach((item) => {
        const prev = prevMap.get(item.id);
        lines.push(`- [${LAYERS.find((layer) => layer.key === item.layer)?.name}] ${item.title}: ${labelOf(prev.status)} → **${labelOf(item.status)}**`);
      });
      if (!changed.length) lines.push('- 无');
      lines.push('');

      lines.push(`## 已删除（${removed.length}）`);
      removed.forEach((item) => lines.push(`- [${LAYERS.find((layer) => layer.key === item.layer)?.name}] ${item.title}`));
      if (!removed.length) lines.push('- 无');
      lines.push('');
    }

    const overall = this.overallProgress();
    lines.push('## 当前总览');
    lines.push(`- 整体进度 ${overall.pct}%（${overall.doneCount}/${overall.count} 项已完成）`);
    LAYERS.forEach((layer) => {
      const progress = this.layerProgress(layer.key);
      lines.push(`- ${layer.name}：${progress.pct}%（${progress.count} 项）`);
    });
    if (this.milestones.length) {
      lines.push('');
      lines.push('## 里程碑进度');
      this.milestoneSummaries().forEach((milestone) => {
        lines.push(`- ${milestone.name}${milestone.date ? `（${milestone.date}）` : ''}：${milestone.pct}%（${milestone.count} 项）`);
      });
    }
    return lines.join('\n');
  }

  // ---------- 全量重置（debug） ----------
  resetToSeed() {
    this._setProject(seed(), { type: 'reset' });
  }

  // ---------- 导出 ----------
  exportJson() { return JSON.stringify(this._project, null, 2); }

  downloadJson(filename = '') {
    const safeName = filename || this._fileName || 'tower.json';
    const blob = new Blob([this.exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = safeName;
    a.click();
    URL.revokeObjectURL(url);
    return { kind: 'download', name: safeName };
  }

  importJson(str, meta = {}) {
    const project = JSON.parse(str);
    this._fileHandle = meta.handle || null;
    this._fileName = meta.fileName || (meta.handle && meta.handle.name) || '';
    this._setProject(project, { type: 'reset' });
  }

  async openProjectFile() {
    if (typeof window === 'undefined' || !('showOpenFilePicker' in window)) {
      throw new Error('当前浏览器不支持直接打开文件');
    }
    try {
      const [handle] = await window.showOpenFilePicker({
        multiple: false,
        excludeAcceptAllOption: false,
        types: [JSON_FILE_TYPE],
      });
      if (!handle) return null;
      const file = await handle.getFile();
      this.importJson(await file.text(), {
        handle,
        fileName: handle.name || file.name || 'tower.json',
      });
      return this._project;
    } catch (error) {
      if (error?.name === 'AbortError') return null;
      throw error;
    }
  }

  async saveProjectFile(opts = {}) {
    const { saveAs = false } = opts;
    const suggestedName = this._fileName || 'tower.json';
    try {
      if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
        let handle = saveAs ? null : this._fileHandle;
        if (!handle) {
          handle = await window.showSaveFilePicker({
            suggestedName,
            excludeAcceptAllOption: false,
            types: [JSON_FILE_TYPE],
          });
        }
        if (!handle) return null;
        const writable = await handle.createWritable();
        await writable.write(this.exportJson());
        await writable.close();
        this._fileHandle = handle;
        this._fileName = handle.name || suggestedName;
        return { kind: 'file', name: this._fileName };
      }
      return this.downloadJson(suggestedName);
    } catch (error) {
      if (error?.name === 'AbortError') return null;
      throw error;
    }
  }
}

function labelOf(status) {
  return STATUSES.find((entry) => entry.key === status)?.name || status;
}

export const Store = new StoreImpl();
export const colorOf = (status) => STATUSES.find((entry) => entry.key === status)?.color || '#888';
export const layerOf = (key) => LAYERS.find((layer) => layer.key === key);
export const statusOf = (key) => STATUSES.find((entry) => entry.key === key);
export { uuid };
