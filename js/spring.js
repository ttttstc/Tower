// spring.js — CRUD 后的方块过渡（x/y/w/h 4 个独立弹簧）
// const sa = new SpringAnimator({ stiffness, damping });
// sa.setTarget(id, {x,y,w,h});
// sa.start((id, cur) => writeDom(id, cur));

const DEFAULTS = { stiffness: 0.18, damping: 0.78, eps: 0.05, idleFrames: 2 };

export class SpringAnimator {
  constructor(opts = {}) {
    this.opts = { ...DEFAULTS, ...opts };
    this.state = new Map();   // id -> { cur:{x,y,w,h}, vel:{x,y,w,h}, target:{x,y,w,h} }
    this._raf = 0;
    this._cb = null;
    this._idle = 0;
  }

  setCurrent(id, rect) {
    let s = this.state.get(id);
    if (!s) {
      s = { cur: { ...rect }, vel: { x: 0, y: 0, w: 0, h: 0 }, target: { ...rect } };
      this.state.set(id, s);
    } else {
      s.cur = { ...rect };
    }
  }

  setTarget(id, rect) {
    let s = this.state.get(id);
    if (!s) {
      s = { cur: { ...rect }, vel: { x: 0, y: 0, w: 0, h: 0 }, target: { ...rect } };
      this.state.set(id, s);
    } else {
      s.target = { ...rect };
    }
  }

  remove(id) { this.state.delete(id); }

  start(onFrame) {
    this._cb = onFrame;
    if (this._raf) return;
    this._idle = 0;
    const tick = () => {
      const { stiffness, damping, eps, idleFrames } = this.opts;
      let maxDelta = 0;
      this.state.forEach((s, id) => {
        ['x', 'y', 'w', 'h'].forEach(k => {
          const dx = s.target[k] - s.cur[k];
          s.vel[k] = (s.vel[k] + dx * stiffness) * damping;
          s.cur[k] += s.vel[k];
          const d = Math.abs(dx);
          if (d > maxDelta) maxDelta = d;
        });
        this._cb && this._cb(id, s.cur);
      });
      if (maxDelta < eps) {
        this._idle++;
        if (this._idle >= idleFrames) {
          // 收敛，回拨到精确 target，停 RAF
          this.state.forEach((s, id) => {
            s.cur = { ...s.target };
            s.vel = { x: 0, y: 0, w: 0, h: 0 };
            this._cb && this._cb(id, s.cur);
          });
          this._raf = 0;
          return;
        }
      } else {
        this._idle = 0;
      }
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }

  stop() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = 0;
  }
}
