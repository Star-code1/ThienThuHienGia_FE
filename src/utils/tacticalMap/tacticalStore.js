// src/utils/tacticalMap/tacticalStore.js
import { NTHConfig, DEFAULTS } from './tacticalConfig';

const HISTORY_LIMIT = 60;

export function uid(prefix) {
  return (prefix || 'id') + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

export function blank() {
  return {
    version: 1,
    map: { url: DEFAULTS.mapUrl, width: DEFAULTS.mapWidth, height: DEFAULTS.mapHeight, name: DEFAULTS.mapName },
    markers: [],
    strokes: [],
    updatedAt: Date.now()
  };
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/* Chấp nhận dữ liệu ngoài (localStorage / file nhập) một cách phòng thủ. */
export function sanitize(raw) {
  const base = blank();
  if (!raw || typeof raw !== 'object') return base;

  if (raw.map && typeof raw.map === 'object' && typeof raw.map.url === 'string') {
    base.map = {
      url: raw.map.url,
      width: Number(raw.map.width) > 0 ? Number(raw.map.width) : DEFAULTS.mapWidth,
      height: Number(raw.map.height) > 0 ? Number(raw.map.height) : DEFAULTS.mapHeight,
      name: typeof raw.map.name === 'string' ? raw.map.name.slice(0, 120) : 'Bản đồ tuỳ chỉnh'
    };
  }

  if (Array.isArray(raw.markers)) {
    base.markers = raw.markers.reduce((acc, m) => {
      if (!m || !NTHConfig.icon(m.icon)) return acc;
      acc.push({
        id: typeof m.id === 'string' ? m.id : uid('mk'),
        icon: m.icon,
        side: NTHConfig.side(m.side).id,
        x: Math.min(1, Math.max(0, Number(m.x) || 0)),
        y: Math.min(1, Math.max(0, Number(m.y) || 0)),
        label: typeof m.label === 'string' ? m.label.slice(0, 60) : '',
        scale: Number(m.scale) > 0 ? Math.min(3, Number(m.scale)) : 1
      });
      return acc;
    }, []);
  }

  if (Array.isArray(raw.strokes)) {
    base.strokes = raw.strokes.reduce((acc, s) => {
      if (!s || !Array.isArray(s.points) || s.points.length < 2) return acc;
      const pts = s.points.reduce((ps, p) => {
        if (Array.isArray(p) && p.length >= 2 && isFinite(p[0]) && isFinite(p[1])) {
          ps.push([Number(p[0]), Number(p[1])]);
        }
        return ps;
      }, []);
      if (pts.length < 2) return acc;
      acc.push({
        id: typeof s.id === 'string' ? s.id : uid('st'),
        tool: s.tool === 'arrow' ? 'arrow' : 'pen',
        color: NTHConfig.penColor(s.color).id,
        width: NTHConfig.penWidth(s.width).id,
        points: pts
      });
      return acc;
    }, []);
  }

  base.updatedAt = Number(raw.updatedAt) || Date.now();
  return base;
}

export class TacticalStore {
  constructor() {
    this.state = blank();
    this.past = [];
    this.future = [];
    this.listeners = [];
    this.saveTimer = null;
  }

  load() {
    try {
      const raw = NTHConfig.readMigrated(DEFAULTS.storageKey, DEFAULTS.legacyStorageKey);
      if (raw) this.state = sanitize(JSON.parse(raw));
    } catch (err) {
      console.warn('Không đọc được dữ liệu đã lưu:', err);
      this.state = blank();
    }
    return this.state;
  }

  save() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(DEFAULTS.storageKey, JSON.stringify(this.state));
      } catch (err) {
        this.emit('storage-error', err);
      }
    }, 250);
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      const i = this.listeners.indexOf(fn);
      if (i >= 0) this.listeners.splice(i, 1);
    };
  }

  emit(reason, payload) {
    for (let i = 0; i < this.listeners.length; i++) {
      this.listeners[i](this.state, reason, payload);
    }
  }

  update(mutate, reason, opts = {}) {
    if (opts.history !== false) {
      this.past.push(clone(this.state));
      if (this.past.length > HISTORY_LIMIT) this.past.shift();
      this.future.length = 0;
    }
    mutate(this.state);
    this.state.updatedAt = Date.now();
    this.save();
    this.emit(reason || 'update');
  }

  undo() {
    if (!this.past.length) return false;
    this.future.push(clone(this.state));
    this.state = this.past.pop();
    this.save();
    this.emit('undo');
    return true;
  }

  redo() {
    if (!this.future.length) return false;
    this.past.push(clone(this.state));
    this.state = this.future.pop();
    this.save();
    this.emit('redo');
    return true;
  }

  canUndo() {
    return this.past.length > 0;
  }

  canRedo() {
    return this.future.length > 0;
  }

  replace(raw, reason) {
    this.past.push(clone(this.state));
    this.future.length = 0;
    this.state = sanitize(raw);
    this.save();
    this.emit(reason || 'replace');
  }
}
