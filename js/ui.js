// ui.js — 通用 UI 组件：抽屉、模态、Toast、确认框
// 所有组件都用 DOM 直接渲染，无依赖。

let _toastWrap;
function ensureToastWrap() {
  if (_toastWrap) return _toastWrap;
  _toastWrap = document.createElement('div');
  _toastWrap.id = '__toast_wrap';
  Object.assign(_toastWrap.style, {
    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
    zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '8px',
    pointerEvents: 'none',
  });
  document.body.appendChild(_toastWrap);
  return _toastWrap;
}

export function toast(msg, opts = {}) {
  const { type = 'info', duration = 2200 } = opts;
  const wrap = ensureToastWrap();
  const el = document.createElement('div');
  const bg = type === 'error' ? '#a8302a' : type === 'success' ? '#5a7a3e' : '#3a2a1a';
  Object.assign(el.style, {
    background: bg, color: '#f6ecd2', padding: '10px 18px',
    borderRadius: '4px', fontSize: '13px', fontFamily: '"Noto Serif SC",serif',
    boxShadow: '0 4px 18px rgba(0,0,0,0.35)', letterSpacing: '0.04em',
    opacity: '0', transition: 'opacity .2s, transform .2s',
    transform: 'translateY(-8px)', pointerEvents: 'auto',
  });
  el.textContent = msg;
  wrap.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
  setTimeout(() => {
    el.style.opacity = '0'; el.style.transform = 'translateY(-8px)';
    setTimeout(() => el.remove(), 220);
  }, duration);
}

// ---------- Drawer ----------
// openDrawer({title, render(bodyEl), onClose})
// returns { close }
export function openDrawer({ title, width = 460, render, onClose }) {
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed', inset: 0, background: 'linear-gradient(180deg, rgba(14,7,3,0.52), rgba(14,7,3,0.66))',
    zIndex: 9000, opacity: '0', transition: 'opacity 240ms ease-out',
    backdropFilter: 'blur(1px)',
  });
  const drawer = document.createElement('div');
  Object.assign(drawer.style, {
    position: 'fixed', top: 0, right: 0, bottom: 0, width: width + 'px',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.24), rgba(243,228,198,0.12)), linear-gradient(180deg,#f8efde 0%, #f2e2bc 100%)',
    color: '#3a2a1a', borderLeft: '1px solid rgba(184,141,76,0.55)',
    zIndex: 9001, transform: 'translateX(100%)',
    transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
    display: 'flex', flexDirection: 'column',
    fontFamily: '"Noto Sans SC", -apple-system, sans-serif',
    boxShadow: '-18px 0 42px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,246,221,0.45)',
  });
  drawer.innerHTML = `
    <header style="padding:18px 22px;border-bottom:1px solid rgba(184,141,76,0.34);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:linear-gradient(180deg, rgba(126,84,37,0.9), rgba(90,58,24,0.9));box-shadow:inset 0 -1px 0 rgba(255,226,180,0.08)">
      <h2 style="margin:0;font-family:'Noto Serif SC',serif;font-weight:800;font-size:18px;color:#f9ecc7;letter-spacing:.08em">${title || ''}</h2>
      <button class="__close" style="background:none;border:none;font-size:22px;color:#f5deb0;cursor:pointer;line-height:1;padding:0 6px">×</button>
    </header>
    <div class="__body" style="flex:1;overflow-y:auto;padding:18px 22px"></div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    drawer.style.transform = 'translateX(0)';
  });
  const body = drawer.querySelector('.__body');
  function close() {
    overlay.style.opacity = '0';
    drawer.style.transform = 'translateX(100%)';
    setTimeout(() => { overlay.remove(); drawer.remove(); onClose && onClose(); }, 240);
  }
  drawer.querySelector('.__close').addEventListener('click', close);
  overlay.addEventListener('click', close);
  if (typeof render === 'function') render(body, { close });
  // ESC 关闭
  const esc = (e) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } };
  document.addEventListener('keydown', esc);
  return { close, body, drawer };
}

// ---------- Modal ----------
export function openModal({ title, width = 520, render, onClose }) {
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed', inset: 0, background: 'rgba(15,8,4,0.62)',
    zIndex: 9100, display: 'flex', alignItems: 'center', justifyContent: 'center',
    opacity: '0', transition: 'opacity 200ms',
    backdropFilter: 'blur(2px)',
  });
  const modal = document.createElement('div');
  Object.assign(modal.style, {
    width: width + 'px', maxWidth: '92vw', maxHeight: '88vh',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(243,228,198,0.1)), linear-gradient(180deg,#f8efde 0%, #f2e2bc 100%)',
    color: '#3a2a1a', borderRadius: '16px',
    border: '1px solid rgba(184,141,76,0.45)', display: 'flex', flexDirection: 'column',
    transform: 'scale(0.96)', transition: 'transform 200ms ease-out',
    fontFamily: '"Noto Sans SC", -apple-system, sans-serif',
    boxShadow: '0 18px 38px rgba(0,0,0,0.24), inset 0 0 0 1px rgba(255,247,226,0.4)',
  });
  modal.innerHTML = `
    <header style="padding:14px 20px;border-bottom:1px solid rgba(184,141,76,0.28);display:flex;align-items:center;justify-content:space-between;background:linear-gradient(180deg, rgba(123,82,36,0.92), rgba(90,58,24,0.92));border-radius:16px 16px 0 0">
      <h2 style="margin:0;font-family:'Noto Serif SC',serif;font-weight:800;font-size:17px;color:#f7e9c1">${title || ''}</h2>
      <button class="__close" style="background:none;border:none;font-size:22px;color:#f3dfae;cursor:pointer">×</button>
    </header>
    <div class="__body" style="flex:1;overflow-y:auto;padding:16px 20px"></div>
  `;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  requestAnimationFrame(() => { overlay.style.opacity = '1'; modal.style.transform = 'scale(1)'; });
  function close() {
    overlay.style.opacity = '0'; modal.style.transform = 'scale(0.96)';
    setTimeout(() => { overlay.remove(); onClose && onClose(); }, 200);
  }
  modal.querySelector('.__close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  if (typeof render === 'function') render(modal.querySelector('.__body'), { close });
  return { close };
}

// ---------- Confirm ----------
export function confirm({ title = '确认', message = '', okText = '确定', cancelText = '取消', danger = false }) {
  return new Promise(resolve => {
    openModal({
      title, width: 380, render: (body, { close }) => {
        body.innerHTML = `
          <p style="margin:0 0 18px 0;line-height:1.6;color:#3a2a1a;font-size:14px">${message}</p>
          <div style="display:flex;gap:10px;justify-content:flex-end">
            <button class="__cancel" style="padding:6px 16px;border:1px solid #b89868;background:transparent;color:#3a2a1a;border-radius:3px;cursor:pointer;font-size:13px">${cancelText}</button>
            <button class="__ok" style="padding:6px 16px;border:none;background:${danger ? '#a8302a' : '#5a7a3e'};color:#f6ecd2;border-radius:3px;cursor:pointer;font-size:13px">${okText}</button>
          </div>`;
        body.querySelector('.__cancel').onclick = () => { close(); resolve(false); };
        body.querySelector('.__ok').onclick = () => { close(); resolve(true); };
      }
    });
  });
}

// ---------- 简单 helpers ----------
export function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else if (k === 'class') e.className = v;
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v !== false && v != null) e.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (c == null) return;
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else e.appendChild(c);
  });
  return e;
}
