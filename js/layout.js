// layout.js — Squarified Treemap
// squarify({ items, width, height }) -> Map<id, {x, y, w, h}>
// items: [{ id, value }]，value > 0
// 参考：Bruls, Huijing & van Wijk (2000)

function worst(row, w) {
  const sum = row.reduce((s, r) => s + r.area, 0);
  const rmax = Math.max(...row.map(r => r.area));
  const rmin = Math.min(...row.map(r => r.area));
  return Math.max((w * w * rmax) / (sum * sum), (sum * sum) / (w * w * rmin));
}

function layoutRow(row, x, y, w, h, horizontal, out) {
  const sum = row.reduce((s, r) => s + r.area, 0);
  if (horizontal) {
    // 行沿 x 方向，宽度 = w，行高 = sum/w
    const rh = sum / w;
    let cx = x;
    row.forEach(r => {
      const rw = r.area / rh;
      out.set(r.id, { x: cx, y, w: rw, h: rh });
      cx += rw;
    });
    return { x, y: y + rh, w, h: h - rh };
  } else {
    const rw = sum / h;
    let cy = y;
    row.forEach(r => {
      const rh = r.area / rw;
      out.set(r.id, { x, y: cy, w: rw, h: rh });
      cy += rh;
    });
    return { x: x + rw, y, w: w - rw, h };
  }
}

export function squarify({ items, width, height }) {
  const out = new Map();
  if (!items.length || width <= 0 || height <= 0) return out;

  const total = items.reduce((s, i) => s + Math.max(0, i.value), 0);
  if (total <= 0) return out;
  const scale = (width * height) / total;
  const sorted = items
    .map(i => ({ id: i.id, area: Math.max(0.0001, i.value) * scale }))
    .sort((a, b) => b.area - a.area);

  let rect = { x: 0, y: 0, w: width, h: height };
  let row = [];
  let i = 0;

  while (i < sorted.length) {
    const horizontal = rect.w >= rect.h;
    const shortSide = horizontal ? rect.w : rect.h;
    const candidate = sorted[i];
    const newRow = row.concat(candidate);
    const oldWorst = row.length ? worst(row, shortSide) : Infinity;
    const newWorst = worst(newRow, shortSide);
    if (row.length === 0 || newWorst <= oldWorst) {
      row = newRow;
      i++;
    } else {
      rect = layoutRow(row, rect.x, rect.y, rect.w, rect.h, horizontal, out);
      row = [];
    }
  }
  if (row.length) {
    const horizontal = rect.w >= rect.h;
    layoutRow(row, rect.x, rect.y, rect.w, rect.h, horizontal, out);
  }
  return out;
}
