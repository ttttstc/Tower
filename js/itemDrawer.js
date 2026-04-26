// itemDrawer.js — 详情抽屉（同时复用于新增）
// openItemDrawer(itemId | null, onSaved, opts)
//   itemId === null 表示新增

import { Store, LAYERS, STATUSES, layerOf, colorOf } from './store.js';
import { openDrawer, openModal, toast, confirm, el } from './ui.js';

const STATUS_PROGRESS = {
  done: 100,
  in_progress: 60,
  overdue: 40,
  blocked: 25,
  not_started: 0,
};

export function openItemDrawer(itemId, onSaved, opts = {}) {
  const isNew = !itemId;
  const original = isNew ? null : Store.getItem(itemId);
  if (!isNew && !original) { toast('事项不存在', { type: 'error' }); return; }

  // 草稿
  const draft = isNew ? {
    title: '',
    layer: opts.defaultLayer || 'implementation',
    status: 'not_started',
    progress: 0,
    effort: 1,
    dependencies: [],
    assignee: Store.project.owners[Store.project.owners.length - 1] || '',
    risk: false,
    notes: '',
    milestones: [],
  } : JSON.parse(JSON.stringify(original));
  if (draft.progress == null) draft.progress = STATUS_PROGRESS[draft.status] ?? 0;
  if (!Array.isArray(draft.milestones)) draft.milestones = [];

  openDrawer({
    title: isNew ? '新增事项' : '事项详情',
    width: 480,
    render: (body, { close }) => {
      body.innerHTML = '';
      body.style.color = '#3a2a1a';

      const fld = (label, control) => {
        const wrap = el('div', { style: { marginBottom: '14px' } });
        wrap.appendChild(el('label', { style: { display: 'block', fontSize: '12px', color: '#7a5028', letterSpacing: '.06em', marginBottom: '4px', fontWeight: '700' } }, label));
        wrap.appendChild(control);
        return wrap;
      };
      const inputStyle = { width: '100%', padding: '7px 10px', border: '1px solid #b89868', borderRadius: '3px', fontSize: '13px', fontFamily: 'inherit', background: '#fffaf0', color: '#3a2a1a', boxSizing: 'border-box' };
      const syncProgressByStatus = () => {
        if (draft.risk) {
          draft.status = 'blocked';
          draft.progress = Math.max(parseInt(draft.progress, 10) || 0, STATUS_PROGRESS.blocked);
          return;
        }
        if (draft.status === 'done') draft.progress = 100;
        if (draft.status === 'not_started') draft.progress = 0;
        if (draft.status === 'blocked') draft.progress = Math.max(parseInt(draft.progress, 10) || 0, STATUS_PROGRESS.blocked);
      };
      const applyProgressToStatus = () => {
        const pct = Math.max(0, Math.min(100, parseInt(draft.progress, 10) || 0));
        draft.progress = pct;
        if (draft.risk) {
          draft.status = 'blocked';
          draft.progress = Math.max(pct, STATUS_PROGRESS.blocked);
          return;
        }
        if (pct === 100) draft.status = 'done';
        else if (pct >= 1) draft.status = 'in_progress';
        else draft.status = 'not_started';
      };
      const formatMilestoneDate = (value) => {
        if (!value) return '未排期';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return `${date.getMonth() + 1}/${date.getDate()}`;
      };

      // 标题
      const titleInput = el('input', { type: 'text', placeholder: '给事项起个标题', style: inputStyle });
      titleInput.value = draft.title;
      titleInput.oninput = () => { draft.title = titleInput.value; updateSaveBtn(); };
      body.appendChild(fld('标题 *', titleInput));

      // 楼段
      const layerSel = el('select', { style: inputStyle });
      LAYERS.forEach(L => {
        const o = el('option', { value: L.key }, L.name);
        if (draft.layer === L.key) o.selected = true;
        layerSel.appendChild(o);
      });
      layerSel.onchange = () => { draft.layer = layerSel.value; };
      body.appendChild(fld('所属楼段 *', layerSel));

      // 工作量
      const effortRow = el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } });
      const minus = el('button', { style: { padding: '4px 12px', border: '1px solid #b89868', background: '#fffaf0', borderRadius: '3px', cursor: 'pointer', fontSize: '14px' } }, '−');
      const plus  = el('button', { style: { padding: '4px 12px', border: '1px solid #b89868', background: '#fffaf0', borderRadius: '3px', cursor: 'pointer', fontSize: '14px' } }, '+');
      const effortInput = el('input', { type: 'number', min: 1, max: 20, style: { ...inputStyle, width: '80px', textAlign: 'center' } });
      effortInput.value = draft.effort;
      effortInput.oninput = () => { draft.effort = Math.max(1, Math.min(20, parseInt(effortInput.value) || 1)); };
      minus.onclick = (e) => { e.preventDefault(); draft.effort = Math.max(1, draft.effort - 1); effortInput.value = draft.effort; };
      plus.onclick  = (e) => { e.preventDefault(); draft.effort = Math.min(20, draft.effort + 1); effortInput.value = draft.effort; };
      effortRow.appendChild(minus); effortRow.appendChild(effortInput); effortRow.appendChild(plus);
      effortRow.appendChild(el('span', { style: { fontSize: '12px', color: '#7a5028' } }, '人天'));
      body.appendChild(fld('工作量', effortRow));

      // 责任人
      const ownerWrap = el('div', { style: { display: 'flex', gap: '6px' } });
      const ownerSel = el('select', { style: { ...inputStyle, flex: '1' } });
      function refreshOwners() {
        ownerSel.innerHTML = '';
        ownerSel.appendChild(el('option', { value: '' }, '— 未分配 —'));
        Store.project.owners.forEach(o => {
          const opt = el('option', { value: o }, o);
          if (draft.assignee === o) opt.selected = true;
          ownerSel.appendChild(opt);
        });
      }
      refreshOwners();
      ownerSel.onchange = () => { draft.assignee = ownerSel.value; };
      const newOwnerBtn = el('button', { style: { padding: '0 10px', border: '1px solid #b89868', background: '#fffaf0', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' } }, '新建');
      newOwnerBtn.onclick = (e) => {
        e.preventDefault();
        const name = prompt('新建责任人姓名'); if (!name) return;
        Store.addOwner(name.trim());
        draft.assignee = name.trim();
        refreshOwners();
      };
      ownerWrap.appendChild(ownerSel); ownerWrap.appendChild(newOwnerBtn);
      body.appendChild(fld('负责人', ownerWrap));

      // 里程碑标签
      const milestoneBox = el('div', {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          border: '1px solid #b89868',
          borderRadius: '10px',
          background: '#fffaf0',
          padding: '10px',
        },
      });
      function renderMilestones() {
        milestoneBox.innerHTML = '';
        if (!Store.milestones.length) {
          milestoneBox.appendChild(el('span', { style: { fontSize: '12px', color: '#9a8862' } }, '暂无里程碑，可回到项目主页创建后再标记'));
          return;
        }
        Store.milestones.forEach((milestone) => {
          const active = draft.milestones.includes(milestone.id);
          const progress = Store.milestoneProgress(milestone.id);
          const button = el('button', {
            type: 'button',
            style: {
              minWidth: '138px',
              padding: '10px 12px',
              borderRadius: '10px',
              border: `1px solid ${active ? '#6f8447' : '#d3b07e'}`,
              background: active ? 'linear-gradient(180deg, #f3ead4 0%, #dfcfaa 100%)' : 'rgba(255,252,245,.9)',
              color: '#4f3518',
              textAlign: 'left',
              cursor: 'pointer',
              boxShadow: active ? '0 8px 16px rgba(85,68,32,.12)' : 'none',
            },
          });
          button.appendChild(el('strong', {
            style: {
              display: 'block',
              fontFamily: '"Noto Serif SC",serif',
              fontSize: '14px',
            },
          }, milestone.name));
          button.appendChild(el('small', {
            style: {
              display: 'block',
              marginTop: '5px',
              color: '#7a603d',
              fontSize: '11px',
            },
          }, `${formatMilestoneDate(milestone.date)} · ${progress.pct}% · ${progress.count} 项`));
          button.onclick = (event) => {
            event.preventDefault();
            const refs = new Set(draft.milestones);
            if (refs.has(milestone.id)) refs.delete(milestone.id);
            else refs.add(milestone.id);
            draft.milestones = [...refs];
            renderMilestones();
          };
          milestoneBox.appendChild(button);
        });
      }
      renderMilestones();
      body.appendChild(fld('里程碑标签', milestoneBox));

      // 状态
      const statusGrp = el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' } });
      function renderStatusGrp() {
        statusGrp.innerHTML = '';
        STATUSES.forEach(s => {
          const isActive = draft.status === s.key;
          const btn = el('button', {
            style: {
              padding: '6px 4px', border: `1px solid ${isActive ? s.color : '#b89868'}`,
              background: isActive ? s.color : '#fffaf0',
              color: isActive ? '#fff' : '#3a2a1a',
              borderRadius: '3px', cursor: draft.risk ? 'not-allowed' : 'pointer',
              fontSize: '11px', fontFamily: 'inherit', opacity: draft.risk && s.key !== 'blocked' ? '0.45' : '1',
            }
          }, s.name);
          btn.onclick = (e) => {
            e.preventDefault();
            if (draft.risk) return;
            draft.status = s.key;
            syncProgressByStatus();
            if (progressInput) {
              progressInput.value = draft.progress;
              progressValue.textContent = `${draft.progress}%`;
            }
            renderStatusGrp();
          };
          statusGrp.appendChild(btn);
        });
      }
      renderStatusGrp();
      body.appendChild(fld('状态', statusGrp));

      // 风险开关
      const riskRow = el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } });
      const riskCb = el('input', { type: 'checkbox' });
      riskCb.checked = !!draft.risk;
      riskCb.onchange = () => {
        draft.risk = riskCb.checked;
        if (draft.risk) {
          draft.status = 'blocked';
          draft.progress = Math.max(parseInt(draft.progress, 10) || 0, STATUS_PROGRESS.blocked);
        } else {
          applyProgressToStatus();
        }
        progressInput.value = draft.progress;
        progressValue.textContent = `${draft.progress}%`;
        renderStatusGrp();
      };
      riskRow.appendChild(riskCb);
      riskRow.appendChild(el('span', { style: { fontSize: '12px', color: '#7a5028' } }, '标记为风险（状态强制为「阻塞」）'));
      body.appendChild(fld('风险', riskRow));

      // 进度
      const progressRow = el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } });
      const progressInput = el('input', { type: 'range', min: 0, max: 100, step: 5, style: { flex: '1', accentColor: '#b27b2d' } });
      const progressValue = el('span', { style: { minWidth: '46px', fontSize: '16px', fontFamily: 'Georgia,serif', color: '#7a5028' } }, `${draft.progress}%`);
      progressInput.value = draft.progress;
      progressInput.oninput = () => {
        draft.progress = parseInt(progressInput.value, 10) || 0;
        progressValue.textContent = `${draft.progress}%`;
        applyProgressToStatus();
        renderStatusGrp();
      };
      progressRow.appendChild(progressInput);
      progressRow.appendChild(progressValue);
      body.appendChild(fld('进度', progressRow));

      // 依赖
      const depBox = el('div', { style: { border: '1px solid #b89868', borderRadius: '3px', background: '#fffaf0', padding: '8px' } });
      function renderDeps() {
        depBox.innerHTML = '';
        // 当前依赖芯片
        const chips = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px', minHeight: '24px' } });
        if (!draft.dependencies.length) chips.appendChild(el('span', { style: { fontSize: '11px', color: '#9a8862' } }, '— 无依赖 —'));
        draft.dependencies.forEach(depId => {
          const it = Store.getItem(depId);
          if (!it) return;
          const c = el('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', background: '#e8d5a8', borderRadius: '12px', fontSize: '11px', color: '#3a2a1a' } });
          c.appendChild(el('span', {}, `${layerOf(it.layer).name}/${it.title}`));
          const rm = el('span', { style: { cursor: 'pointer', color: '#a8302a', fontWeight: '700' } }, '×');
          rm.onclick = () => { draft.dependencies = draft.dependencies.filter(x => x !== depId); renderDeps(); };
          c.appendChild(rm);
          chips.appendChild(c);
        });
        depBox.appendChild(chips);
        // 添加按钮
        const addDepBtn = el('button', { style: { padding: '4px 10px', border: '1px dashed #b89868', background: 'transparent', borderRadius: '3px', cursor: 'pointer', fontSize: '11px', color: '#7a5028' } }, '+ 选择依赖');
        addDepBtn.onclick = (e) => { e.preventDefault(); openDepPicker(); };
        depBox.appendChild(addDepBtn);
      }
      function openDepPicker() {
        openModal({
          title: '选择依赖事项', width: 520, render: (modalBody, { close: closeModal }) => {
            const search = el('input', { type: 'text', placeholder: '按标题搜索…', style: { ...inputStyle, marginBottom: '10px' } });
            modalBody.appendChild(search);
            const list = el('div', { style: { maxHeight: '420px', overflowY: 'auto', border: '1px solid #d4b888', borderRadius: '3px' } });
            modalBody.appendChild(list);
            function paint() {
              list.innerHTML = '';
              const kw = search.value.trim().toLowerCase();
              LAYERS.forEach(L => {
                const items = Store.itemsByLayer(L.key).filter(i => i.id !== itemId);
                if (!items.length) return;
                const filtered = items.filter(i => !kw || i.title.toLowerCase().includes(kw));
                if (!filtered.length) return;
                const head = el('div', { style: { padding: '6px 10px', background: '#e8d5a8', fontSize: '11px', color: '#3a2a1a', fontWeight: '700', letterSpacing: '.1em' } }, L.name);
                list.appendChild(head);
                filtered.forEach(it => {
                  const checked = draft.dependencies.includes(it.id);
                  const wouldCycle = !isNew && Store.wouldCycle(itemId, it.id);
                  const row = el('label', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 10px', borderTop: '1px solid #f0e0c0', fontSize: '12px', cursor: wouldCycle ? 'not-allowed' : 'pointer', opacity: wouldCycle ? '0.4' : '1' } });
                  const cb = el('input', { type: 'checkbox' });
                  cb.checked = checked; cb.disabled = wouldCycle;
                  cb.onchange = () => {
                    if (cb.checked) {
                      if (!draft.dependencies.includes(it.id)) draft.dependencies.push(it.id);
                    } else {
                      draft.dependencies = draft.dependencies.filter(x => x !== it.id);
                    }
                  };
                  row.appendChild(cb);
                  const dot = el('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: colorOf(it.status) } });
                  row.appendChild(dot);
                  row.appendChild(el('span', { style: { flex: '1' } }, it.title));
                  if (wouldCycle) row.appendChild(el('span', { style: { fontSize: '10px', color: '#a8302a' } }, '会成环'));
                  else row.appendChild(el('span', { style: { fontSize: '10px', color: '#7a5028' } }, `${it.effort}人天`));
                  list.appendChild(row);
                });
              });
            }
            search.oninput = paint; paint();
            const footer = el('div', { style: { marginTop: '12px', textAlign: 'right' } });
            const okBtn = el('button', { style: { padding: '6px 16px', border: 'none', background: '#5a7a3e', color: '#f6ecd2', borderRadius: '3px', cursor: 'pointer' } }, '完成');
            okBtn.onclick = () => { renderDeps(); closeModal(); };
            footer.appendChild(okBtn);
            modalBody.appendChild(footer);
          }
        });
      }
      renderDeps();
      body.appendChild(fld('依赖事项', depBox));

      // 备注
      const notes = el('textarea', { rows: 4, style: { ...inputStyle, resize: 'vertical', fontFamily: 'inherit' } });
      notes.value = draft.notes || '';
      notes.oninput = () => { draft.notes = notes.value; };
      body.appendChild(fld('备注', notes));

      // 时间信息
      if (!isNew) {
        const meta = el('div', { style: { fontSize: '11px', color: '#9a8862', borderTop: '1px dashed #d4b888', paddingTop: '10px', marginTop: '6px' } });
        meta.innerHTML = `创建：${new Date(original.createdAt).toLocaleString('zh-CN')}<br/>更新：${new Date(original.updatedAt).toLocaleString('zh-CN')}`;
        body.appendChild(meta);
      }

      // 底部操作
      const actions = el('div', { style: { display: 'flex', gap: '8px', justifyContent: 'space-between', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #d4b888' } });
      const left = el('div');
      if (!isNew) {
        const pageBtn = el('button', { style: { padding: '6px 14px', border: '1px solid #b89868', background: 'transparent', color: '#7a5028', borderRadius: '3px', cursor: 'pointer', fontSize: '12px', marginRight: '8px' } }, '完整编辑页');
        pageBtn.onclick = () => { location.href = `./item-form.html?id=${encodeURIComponent(itemId)}`; };
        left.appendChild(pageBtn);
        const delBtn = el('button', { style: { padding: '6px 14px', border: '1px solid #a8302a', background: 'transparent', color: '#a8302a', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' } }, '删除');
        delBtn.onclick = async () => {
          if (await confirm({ title: '删除事项', message: `确认删除「${original.title}」？此操作不可恢复。`, danger: true, okText: '删除' })) {
            Store.removeItem(itemId);
            close(); toast('已删除', { type: 'success' });
            onSaved && onSaved();
          }
        };
        left.appendChild(delBtn);
      }
      const right = el('div', { style: { display: 'flex', gap: '8px' } });
      const cancelBtn = el('button', { style: { padding: '6px 14px', border: '1px solid #b89868', background: 'transparent', color: '#3a2a1a', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' } }, '取消');
      cancelBtn.onclick = close;
      const saveBtn = el('button', { id: 'saveBtn', style: { padding: '6px 18px', border: 'none', background: '#5a7a3e', color: '#f6ecd2', borderRadius: '3px', cursor: 'pointer', fontSize: '13px' } }, isNew ? '创建' : '保存');
      saveBtn.onclick = () => {
        if (!draft.title.trim()) { toast('标题不能为空', { type: 'error' }); titleInput.focus(); return; }
        draft.progress = Math.max(0, Math.min(100, parseInt(draft.progress, 10) || 0));
        if (isNew) Store.addItem(draft); else Store.updateItem(itemId, draft);
        toast(isNew ? '已创建' : '已保存', { type: 'success' });
        close(); onSaved && onSaved();
      };
      right.appendChild(cancelBtn); right.appendChild(saveBtn);
      actions.appendChild(left); actions.appendChild(right);
      body.appendChild(actions);

      function updateSaveBtn() {
        saveBtn.disabled = !draft.title.trim();
        saveBtn.style.opacity = draft.title.trim() ? '1' : '0.5';
        saveBtn.style.cursor = draft.title.trim() ? 'pointer' : 'not-allowed';
      }
      updateSaveBtn();
      if (isNew) titleInput.focus();
    }
  });
}
