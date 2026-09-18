// src/utils/tacticalMap/tacticalBoard.js
import { NTHConfig, DEFAULTS } from './tacticalConfig';
import { NTHIcons } from './tacticalIcons';
import { uid } from './tacticalStore';

const CANVAS_RES = 2;      /* Độ phân giải lớp vẽ so với kích thước bản đồ. */
const MARKER_W = 44;
const MARKER_H = 58;
const MARKER_LOGO = 46;    /* Icon môn phái là ảnh vuông, neo ở tâm. */
const ERASER_RADIUS = 14;  /* Tính theo pixel bản đồ. */

export class TacticalBoard {
  constructor(opts) {
    this.viewport = opts.viewport;
    this.world = opts.world;
    this.image = opts.image;
    this.canvas = opts.canvas;
    this.layer = opts.markerLayer;
    this.store = opts.store;
    this.ctx = this.canvas.getContext('2d');

    this.zoom = 1;
    this.pan = { x: 0, y: 0 };
    this.mode = 'select';
    this.pen = { tool: 'pen', color: 'red', width: 'medium' };
    this.pendingIcon = null;
    this.pendingSide = 'red';
    this.selectedId = null;
    this.editable = true;
    this.spaceDown = false;

    this.drag = null;          /* Kéo marker đang diễn ra */
    this.panning = null;       /* Kéo nền để di chuyển khung nhìn */
    this.stroke = null;        /* Nét vẽ đang vẽ dở */
    this.erasing = null;
    this.markerNodes = {};     /* id -> phần tử DOM */

    this.handlers = opts.handlers || {};
    this._bind();
  }

  emit(name, payload) {
    if (typeof this.handlers[name] === 'function') {
      this.handlers[name](payload);
    }
  }

  destroy() {
    if (this._cleanups) {
      this._cleanups.forEach((fn) => fn());
    }
  }

  /* ---------- Chuyển đổi toạ độ ---------- */

  mapSize() {
    const m = this.store.state.map;
    return { w: m.width || 1600, h: m.height || 1000 };
  }

  toWorld(clientX, clientY) {
    const rect = this.viewport.getBoundingClientRect();
    return {
      x: (clientX - rect.left - this.pan.x) / this.zoom,
      y: (clientY - rect.top - this.pan.y) / this.zoom
    };
  }

  toNorm(clientX, clientY) {
    const p = this.toWorld(clientX, clientY);
    const s = this.mapSize();
    return { x: p.x / s.w, y: p.y / s.h };
  }

  applyTransform() {
    this.world.style.transform =
      `translate(${this.pan.x.toFixed(2)}px, ${this.pan.y.toFixed(2)}px) scale(${this.zoom})`;
    this.emit('view', { zoom: this.zoom });
  }

  fit() {
    const s = this.mapSize();
    const rect = this.viewport.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const z = Math.min(rect.width / s.w, rect.height / s.h) * 0.96;
    this.zoom = Math.max(DEFAULTS.minZoom, Math.min(DEFAULTS.maxZoom, z));
    this.pan.x = (rect.width - s.w * this.zoom) / 2;
    this.pan.y = (rect.height - s.h * this.zoom) / 2;
    this.applyTransform();
  }

  zoomAt(factor, clientX, clientY) {
    const rect = this.viewport.getBoundingClientRect();
    const cx = clientX == null ? rect.left + rect.width / 2 : clientX;
    const cy = clientY == null ? rect.top + rect.height / 2 : clientY;
    const before = this.toWorld(cx, cy);
    const next = Math.max(DEFAULTS.minZoom, Math.min(DEFAULTS.maxZoom, this.zoom * factor));
    if (next === this.zoom) return;
    this.zoom = next;
    this.pan.x = cx - rect.left - before.x * this.zoom;
    this.pan.y = cy - rect.top - before.y * this.zoom;
    this.applyTransform();
  }

  /* ---------- Vẽ lại ---------- */

  syncMapSize() {
    const s = this.mapSize();
    this.world.style.width = s.w + 'px';
    this.world.style.height = s.h + 'px';
    this.canvas.width = Math.round(s.w * CANVAS_RES);
    this.canvas.height = Math.round(s.h * CANVAS_RES);
    this.canvas.style.width = s.w + 'px';
    this.canvas.style.height = s.h + 'px';
    if (this.image.getAttribute('src') !== this.store.state.map.url) {
      this.image.setAttribute('src', this.store.state.map.url);
    }
  }

  strokePath(ctx, stroke, s, opts = {}) {
    const color = opts.color || NTHConfig.penColor(stroke.color).color;
    const width = NTHConfig.penWidth(stroke.width).width * (opts.widthMul || 1);
    const pts = stroke.points;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(0,0,0,.55)';
    ctx.shadowBlur = width * 0.9;

    if (stroke.tool === 'arrow') {
      const a = { x: pts[0][0] * s.w, y: pts[0][1] * s.h };
      const b = { x: pts[pts.length - 1][0] * s.w, y: pts[pts.length - 1][1] * s.h };
      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      const head = Math.max(14, width * 3.2);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x - Math.cos(ang) * head * 0.6, b.y - Math.sin(ang) * head * 0.6);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - Math.cos(ang - 0.42) * head, b.y - Math.sin(ang - 0.42) * head);
      ctx.lineTo(b.x - Math.cos(ang + 0.42) * head, b.y - Math.sin(ang + 0.42) * head);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(pts[0][0] * s.w, pts[0][1] * s.h);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i][0] * s.w, pts[i][1] * s.h);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  redrawStrokes() {
    const s = this.mapSize();
    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.setTransform(CANVAS_RES, 0, 0, CANVAS_RES, 0, 0);
    const all = this.store.state.strokes;
    for (let i = 0; i < all.length; i++) {
      this.strokePath(ctx, all[i], s);
    }
    if (this.stroke && this.stroke.points.length > 1) {
      this.strokePath(ctx, this.stroke, s);
    }

    /* Vệt sáng ngắn trên nét vừa vẽ xong. */
    if (this.flash) {
      const el = Math.min(1, (Date.now() - this.flash.start) / 300);
      ctx.save();
      ctx.globalAlpha = (1 - el) * 0.55;
      ctx.globalCompositeOperation = 'lighter';
      this.strokePath(ctx, this.flash.stroke, s, { color: '#ffffff', widthMul: 1 + 0.9 * (1 - el) });
      ctx.restore();
    }
  }

  reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  flashStroke(stroke) {
    if (this.reducedMotion() || !window.requestAnimationFrame) return;
    this.flash = { stroke: stroke, start: Date.now() };
    if (this.flashRaf) return;
    const step = () => {
      if (!this.flash) {
        this.flashRaf = 0;
        return;
      }
      if (Date.now() - this.flash.start >= 300) {
        this.flash = null;
        this.flashRaf = 0;
        this.redrawStrokes();
        return;
      }
      this.redrawStrokes();
      this.flashRaf = window.requestAnimationFrame(step);
    };
    this.flashRaf = window.requestAnimationFrame(step);
  }

  renderMarkers() {
    const seen = {};
    this.store.state.markers.forEach((m) => {
      seen[m.id] = true;
      let node = this.markerNodes[m.id];
      if (!node) {
        node = document.createElement('div');
        node.className = 'marker';
        node.dataset.id = m.id;
        this.layer.appendChild(node);
        this.markerNodes[m.id] = node;
      }
      if (node.dataset.icon !== m.icon || node.dataset.side !== m.side) {
        const icon = NTHConfig.icon(m.icon);
        node.innerHTML = NTHIcons.markerSvg(icon, m.side) + '<span class="marker-label"></span>';
        node.dataset.icon = m.icon;
        node.dataset.side = m.side;
        node.title = icon.label;
      }
      const labelEl = node.querySelector('.marker-label');
      if (labelEl) {
        if (labelEl.textContent !== (m.label || '')) {
          labelEl.textContent = m.label || '';
        }
        labelEl.hidden = !m.label;
      }
      const isLogo = NTHIcons.isLogo(NTHConfig.icon(m.icon));
      node.classList.toggle('is-logo', isLogo);
      node.style.left = (m.x * 100) + '%';
      node.style.top = (m.y * 100) + '%';
      node.style.width = ((isLogo ? MARKER_LOGO : MARKER_W) * (m.scale || 1)) + 'px';
      node.style.height = ((isLogo ? MARKER_LOGO : MARKER_H) * (m.scale || 1)) + 'px';
      node.classList.toggle('is-selected', m.id === this.selectedId);
    });

    Object.keys(this.markerNodes).forEach((id) => {
      if (!seen[id]) {
        this.layer.removeChild(this.markerNodes[id]);
        delete this.markerNodes[id];
      }
    });
  }

  render() {
    this.syncMapSize();
    this.renderMarkers();
    this.redrawStrokes();
  }

  /* ---------- Chế độ & công cụ ---------- */

  setMode(mode) {
    this.mode = mode;
    if (mode !== 'select') this.select(null);
    this.viewport.dataset.mode = mode;
  }

  setPen(patch) {
    Object.assign(this.pen, patch);
  }

  setPending(iconId, side) {
    this.pendingIcon = iconId;
    if (side) this.pendingSide = side;
    this.viewport.classList.toggle('is-placing', !!iconId);
    this.emit('pending', { icon: iconId, side: this.pendingSide });
  }

  select(id) {
    if (this.selectedId === id) return;
    this.selectedId = id;
    this.renderMarkers();
    this.emit('select', id ? this.findMarker(id) : null);
  }

  findMarker(id) {
    return this.store.state.markers.find((m) => m.id === id) || null;
  }

  addMarker(iconId, side, nx, ny) {
    if (!this.editable || !NTHConfig.icon(iconId)) return null;
    const id = uid('mk');
    this.store.update((st) => {
      st.markers.push({
        id: id,
        icon: iconId,
        side: side,
        x: Math.min(1, Math.max(0, nx)),
        y: Math.min(1, Math.max(0, ny)),
        label: '',
        scale: 1
      });
    }, 'marker-add');
    return id;
  }

  removeMarker(id) {
    if (!this.editable) return;
    this.store.update((st) => {
      st.markers = st.markers.filter((m) => m.id !== id);
    }, 'marker-remove');
    if (this.selectedId === id) this.select(null);
  }

  eraseAt(nx, ny) {
    const s = this.mapSize();
    const r = ERASER_RADIUS / this.zoom;
    const hit = this.store.state.strokes.filter((st) => {
      return st.points.some((p) => {
        const dx = p[0] * s.w - nx * s.w;
        const dy = p[1] * s.h - ny * s.h;
        return Math.sqrt(dx * dx + dy * dy) <= r;
      });
    });
    if (!hit.length) return;
    const ids = hit.map((h) => h.id);
    this.store.update((st) => {
      st.strokes = st.strokes.filter((x) => ids.indexOf(x.id) < 0);
    }, 'stroke-erase');
  }

  /* ---------- Sự kiện chuột/cảm ứng ---------- */

  _bind() {
    const self = this;
    const cleanups = [];

    const onWheel = (ev) => {
      ev.preventDefault();
      self.zoomAt(ev.deltaY < 0 ? 1.12 : 1 / 1.12, ev.clientX, ev.clientY);
    };
    this.viewport.addEventListener('wheel', onWheel, { passive: false });
    cleanups.push(() => this.viewport.removeEventListener('wheel', onWheel));

    const onPointerDown = (ev) => {
      const markerEl = ev.target.closest ? ev.target.closest('.marker') : null;
      const wantsPan = ev.button === 1 || ev.button === 2 || self.spaceDown || self.mode === 'pan';

      if (wantsPan) {
        ev.preventDefault();
        self.panning = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, px: self.pan.x, py: self.pan.y, moved: false };
        self.viewport.setPointerCapture(ev.pointerId);
        self.viewport.classList.add('is-panning');
        return;
      }
      if (ev.button !== 0) return;

      if (self.mode === 'draw') {
        ev.preventDefault();
        const n = self.toNorm(ev.clientX, ev.clientY);
        if (!self.editable) return;
        if (self.pen.tool === 'eraser') {
          self.stroke = null;
          self.erasing = { id: ev.pointerId };
          self.viewport.setPointerCapture(ev.pointerId);
          self.eraseAt(n.x, n.y);
          return;
        }
        self.stroke = {
          id: uid('st'),
          tool: self.pen.tool,
          color: self.pen.color,
          width: self.pen.width,
          points: [[n.x, n.y], [n.x, n.y]],
          pointerId: ev.pointerId
        };
        self.viewport.setPointerCapture(ev.pointerId);
        return;
      }

      /* Chế độ kéo thả */
      if (markerEl) {
        const m = self.findMarker(markerEl.dataset.id);
        if (!m) return;
        self.select(m.id);
        if (!self.editable) return;
        ev.preventDefault();
        const start = self.toNorm(ev.clientX, ev.clientY);
        self.drag = {
          id: ev.pointerId,
          markerId: m.id,
          moved: false,
          offX: m.x - start.x,
          offY: m.y - start.y,
          startX: m.x,
          startY: m.y
        };
        self.viewport.setPointerCapture(ev.pointerId);
        return;
      }

      if (self.pendingIcon && self.editable) {
        const np = self.toNorm(ev.clientX, ev.clientY);
        if (np.x < 0 || np.x > 1 || np.y < 0 || np.y > 1) return;
        const newId = self.addMarker(self.pendingIcon, self.pendingSide, np.x, np.y);
        if (!ev.shiftKey) self.setPending(null);
        self.select(newId);
        return;
      }

      self.select(null);
      /* Kéo nền để di chuyển khung nhìn. */
      self.panning = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, px: self.pan.x, py: self.pan.y, moved: false };
      self.viewport.setPointerCapture(ev.pointerId);
      self.viewport.classList.add('is-panning');
    };
    this.viewport.addEventListener('pointerdown', onPointerDown);
    cleanups.push(() => this.viewport.removeEventListener('pointerdown', onPointerDown));

    const onPointerMove = (ev) => {
      if (self.panning && self.panning.id === ev.pointerId) {
        self.pan.x = self.panning.px + (ev.clientX - self.panning.x);
        self.pan.y = self.panning.py + (ev.clientY - self.panning.y);
        self.panning.moved = true;
        self.applyTransform();
        return;
      }
      if (self.drag && self.drag.id === ev.pointerId) {
        const n = self.toNorm(ev.clientX, ev.clientY);
        const m = self.findMarker(self.drag.markerId);
        if (!m) return;
        m.x = Math.min(1, Math.max(0, n.x + self.drag.offX));
        m.y = Math.min(1, Math.max(0, n.y + self.drag.offY));
        self.drag.moved = true;
        self.renderMarkers();
        return;
      }
      if (self.erasing && self.erasing.id === ev.pointerId) {
        const ne = self.toNorm(ev.clientX, ev.clientY);
        self.eraseAt(ne.x, ne.y);
        return;
      }
      if (self.stroke && self.stroke.pointerId === ev.pointerId) {
        const np = self.toNorm(ev.clientX, ev.clientY);
        if (self.stroke.tool === 'arrow') {
          self.stroke.points[1] = [np.x, np.y];
        } else {
          const last = self.stroke.points[self.stroke.points.length - 1];
          const s = self.mapSize();
          const dx = (np.x - last[0]) * s.w;
          const dy = (np.y - last[1]) * s.h;
          if (dx * dx + dy * dy > 2) {
            self.stroke.points.push([np.x, np.y]);
          }
        }
        self.redrawStrokes();
        return;
      }
      if (self.mode === 'select' && self.pendingIcon) {
        self.emit('hover', self.toNorm(ev.clientX, ev.clientY));
      }
    };
    this.viewport.addEventListener('pointermove', onPointerMove);
    cleanups.push(() => this.viewport.removeEventListener('pointermove', onPointerMove));

    const finishPointer = (ev) => {
      if (self.panning && self.panning.id === ev.pointerId) {
        self.panning = null;
        self.viewport.classList.remove('is-panning');
      }
      if (self.drag && self.drag.id === ev.pointerId) {
        const d = self.drag;
        self.drag = null;
        if (d.moved) {
          const m = self.findMarker(d.markerId);
          const nx = m ? m.x : d.startX;
          const ny = m ? m.y : d.startY;
          if (m) { m.x = d.startX; m.y = d.startY; }
          self.store.update((st) => {
            st.markers.forEach((mm) => {
              if (mm.id === d.markerId) { mm.x = nx; mm.y = ny; }
            });
          }, 'marker-move');
        }
      }
      if (self.erasing && self.erasing.id === ev.pointerId) {
        self.erasing = null;
      }
      if (self.stroke && self.stroke.pointerId === ev.pointerId) {
        const st = self.stroke;
        self.stroke = null;
        const s = self.mapSize();
        const a = st.points[0];
        const b = st.points[st.points.length - 1];
        const far = Math.abs(a[0] - b[0]) * s.w > 4 || Math.abs(a[1] - b[1]) * s.h > 4;
        if (st.points.length > 2 || far) {
          delete st.pointerId;
          self.store.update((state) => { state.strokes.push(st); }, 'stroke-add');
          self.flashStroke(st);
        } else {
          self.redrawStrokes();
        }
      }
    };

    this.viewport.addEventListener('pointerup', finishPointer);
    this.viewport.addEventListener('pointercancel', finishPointer);
    cleanups.push(() => {
      this.viewport.removeEventListener('pointerup', finishPointer);
      this.viewport.removeEventListener('pointercancel', finishPointer);
    });

    const onContextMenu = (ev) => ev.preventDefault();
    this.viewport.addEventListener('contextmenu', onContextMenu);
    cleanups.push(() => this.viewport.removeEventListener('contextmenu', onContextMenu));

    const onDblClick = (ev) => {
      const el = ev.target.closest ? ev.target.closest('.marker') : null;
      if (el) self.emit('rename', self.findMarker(el.dataset.id));
    };
    this.viewport.addEventListener('dblclick', onDblClick);
    cleanups.push(() => this.viewport.removeEventListener('dblclick', onDblClick));

    const onDragOver = (ev) => {
      if (!self.editable) return;
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'copy';
    };
    const onDrop = (ev) => {
      if (!self.editable) return;
      ev.preventDefault();
      const payload = ev.dataTransfer.getData('text/plain');
      if (!payload) return;
      const parts = payload.split('|');
      const n = self.toNorm(ev.clientX, ev.clientY);
      if (n.x < 0 || n.x > 1 || n.y < 0 || n.y > 1) return;
      const id = self.addMarker(parts[0], parts[1] || self.pendingSide, n.x, n.y);
      self.select(id);
    };
    this.viewport.addEventListener('dragover', onDragOver);
    this.viewport.addEventListener('drop', onDrop);
    cleanups.push(() => {
      this.viewport.removeEventListener('dragover', onDragOver);
      this.viewport.removeEventListener('drop', onDrop);
    });

    const onKeyDown = (ev) => {
      if (ev.code === 'Space') self.spaceDown = true;
    };
    const onKeyUp = (ev) => {
      if (ev.code === 'Space') self.spaceDown = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    cleanups.push(() => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    });

    this._cleanups = cleanups;
  }

  /* ---------- Xuất ảnh PNG ---------- */

  exportPng() {
    const self = this;
    const s = this.mapSize();
    const out = document.createElement('canvas');
    out.width = s.w;
    out.height = s.h;
    const ctx = out.getContext('2d');

    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Không tải được ảnh: ' + src.slice(0, 60)));
        img.src = src;
      });
    }

    function loadLogo(src) {
      return loadImage(src).catch(() => null);
    }

    return loadImage(this.store.state.map.url).then((bg) => {
      ctx.drawImage(bg, 0, 0, s.w, s.h);
      ctx.drawImage(self.canvas, 0, 0, s.w, s.h);

      const markers = self.store.state.markers;
      return Promise.all(markers.map((m) => {
        const icon = NTHConfig.icon(m.icon);
        const svg = NTHIcons.markerSvg(icon, m.side).replace(/<img[\s\S]*$/, '');
        const full = '<svg xmlns="http://www.w3.org/2000/svg" ' + svg.slice(4);
        return Promise.all([
          loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(full)),
          icon.image ? loadLogo(icon.image) : null
        ]).then((pair) => ({ img: pair[0], logo: pair[1], m: m }));
      })).then((items) => {
        ctx.textAlign = 'center';
        ctx.font = '600 13px system-ui, sans-serif';
        items.forEach((it) => {
          const sc = it.m.scale || 1;
          const isLogo = !!NTHConfig.icon(it.m.icon).image;
          const w = (isLogo ? MARKER_LOGO : MARKER_W) * sc;
          const h = (isLogo ? MARKER_LOGO : MARKER_H) * sc;
          const cx = it.m.x * s.w;
          const y = isLogo ? it.m.y * s.h - h / 2 : it.m.y * s.h - h;
          ctx.drawImage(it.img, cx - w / 2, y, w, h);

          if (isLogo && it.logo) {
            const box = w * 0.76;
            const ar = it.logo.naturalWidth / it.logo.naturalHeight || 1;
            const lw = ar >= 1 ? box : box * ar;
            const lh = ar >= 1 ? box / ar : box;
            ctx.drawImage(it.logo, cx - lw / 2, y + h / 2 - lh / 2, lw, lh);
          }

          const text = it.m.label;
          if (!text) return;
          const ty = y + h + (isLogo ? 13 : -1);
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(0,0,0,.8)';
          ctx.fillStyle = '#fff';
          ctx.strokeText(text, cx, ty);
          ctx.fillText(text, cx, ty);
        });
        return out;
      });
    });
  }
}
