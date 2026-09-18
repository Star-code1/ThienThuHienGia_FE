<template>
  <div
    class="tactical-container"
    :class="[themeStore.theme === 'light' ? 'tactical-light' : 'tactical-dark', { 'sidebar-hidden': isSidebarHidden }]"
  >
    <!-- ỨNG DỤNG BẢN ĐỒ CHIẾN THUẬT -->
    <div class="app">
      <div class="workspace">
        <!-- THANH CÔNG CỤ DỌC (RAIL) -->
        <nav class="rail" aria-label="Công cụ tệp và khung nhìn">
          <button
            class="rail-btn"
            @click="isSidebarHidden = !isSidebarHidden"
            title="Ẩn/hiện bảng đội hình"
            aria-label="Ẩn/hiện bảng đội hình"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><path d="M10 4.5v15"/></svg>
          </button>

          <span class="rail-sep"></span>

          <label class="rail-btn" title="Tải ảnh bản đồ lên">
            <input type="file" @change="onMapFileChange" accept="image/*" hidden />
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V8M8 12l4-4 4 4"/><path d="M4 20h16"/></svg>
          </label>

          <button
            class="rail-btn"
            @click="onMapUrlPrompt"
            title="Nhập URL ảnh bản đồ"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 14.5a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14.5 9.5a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>
          </button>

          <button
            class="rail-btn"
            @click="onMapReset"
            title="Đặt lại Guild War Map"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>
          </button>

          <span class="rail-sep"></span>

          <button class="rail-btn" @click="onExportPng" title="Xuất ảnh PNG">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M4.5 17l4.5-4.5 4 4 3-2.5 3.5 3"/></svg>
          </button>

          <button class="rail-btn" @click="onExportJson" title="Xuất file kế hoạch (.json)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v12M8 12l4 4 4-4"/><path d="M4 20h16"/></svg>
          </button>

          <label class="rail-btn" title="Nhập file kế hoạch">
            <input type="file" @change="onImportJson" accept="application/json,.json" hidden />
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V8M8 12l4-4 4 4"/><path d="M4 4h16"/></svg>
          </label>

          <button class="rail-btn" @click="onShareLink" title="Sao chép link chia sẻ">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.2 10.9 15.8 7.1M8.2 13.1l7.6 3.8"/></svg>
          </button>

          <span class="rail-spacer"></span>

          <div class="rail-group">
            <button class="rail-btn" @click="onClearStrokes" title="Xoá nét vẽ">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 20H20"/><path d="M15.5 4.5 4.5 15.5l4 4 11-11z"/></svg>
            </button>

            <button class="rail-btn" @click="onClearMarkers" title="Xoá icon">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><path d="M9.5 9.5l5 5M14.5 9.5l-5 5"/></svg>
            </button>

            <button class="rail-btn rail-btn-danger" @click="onClearAll" title="Xoá tất cả">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14"/><path d="M8.5 7V5h7v2"/><path d="M6.5 7l1 13h9l1-13"/></svg>
            </button>
          </div>
        </nav>

        <!-- SÂN KHẤU BẢN ĐỒ (STAGE) -->
        <section class="stage">
          <div
            ref="viewportRef"
            class="viewport"
            :data-mode="activeMode"
            :class="{ 'is-placing': !!pendingIcon }"
          >
            <div ref="worldRef" class="world">
              <img
                ref="mapImageRef"
                class="map-image"
                :src="currentMapUrl"
                alt="Bản đồ chiến trường"
                draggable="false"
                @load="onMapImageLoad"
              />
              <canvas ref="canvasRef" class="draw-layer"></canvas>
              <div ref="markerLayerRef" class="marker-layer"></div>
            </div>
          </div>

          <!-- THANH CÔNG CỤ THAO TÁC (DOCK TOP) -->
          <div class="dock dock-top">
            <div class="seg" role="group" aria-label="Chế độ thao tác">
              <button
                class="seg-btn"
                :class="{ 'is-active': activeMode === 'select' }"
                @click="setMode('select')"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3 19 11.5 12.6 13 9.5 19.5Z"/></svg>
                <span>Kéo Thả</span>
              </button>

              <button
                class="seg-btn"
                :class="{ 'is-active': activeMode === 'draw' }"
                @click="setMode('draw')"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1-4.5L16 4.5a2.1 2.1 0 0 1 3 3L8 18.5Z"/></svg>
                <span>Vẽ Nét</span>
              </button>

              <button
                class="seg-btn"
                :class="{ 'is-active': activeMode === 'pan' }"
                @click="setMode('pan')"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v8M12 21v-4M3 12h8M21 12h-4"/><circle cx="12" cy="12" r="2.4"/></svg>
                <span>Di Chuyển</span>
              </button>
            </div>

            <template v-if="activeMode === 'draw'">
              <span class="dock-sep"></span>
              <div class="dock-pen">
                <div class="seg" role="group" aria-label="Công cụ vẽ">
                  <button
                    class="seg-btn"
                    :class="{ 'is-active': penTool === 'pen' }"
                    @click="setPenTool('pen')"
                  >Bút</button>
                  <button
                    class="seg-btn"
                    :class="{ 'is-active': penTool === 'arrow' }"
                    @click="setPenTool('arrow')"
                  >Mũi Tên</button>
                  <button
                    class="seg-btn"
                    :class="{ 'is-active': penTool === 'eraser' }"
                    @click="setPenTool('eraser')"
                  >Tẩy</button>
                </div>

                <div class="dock-sep"></div>

                <div class="swatches" id="color-group" role="group" aria-label="Màu">
                  <button
                    v-for="c in penColors"
                    :key="c.id"
                    class="chip"
                    :class="{ 'is-active': penColor === c.id }"
                    :title="c.label"
                    @click="setPenColor(c.id)"
                  >
                    <i :style="{ background: c.color }"></i>
                    {{ c.label }}
                  </button>
                </div>

                <div class="dock-sep"></div>

                <div class="seg" id="width-group" role="group" aria-label="Độ dày nét">
                  <button
                    v-for="w in penWidths"
                    :key="w.id"
                    class="seg-btn"
                    :class="{ 'is-active': penWidth === w.id }"
                    @click="setPenWidth(w.id)"
                  >{{ w.label }}</button>
                </div>
              </div>
            </template>

            <!-- NÚT HOÀN TÁC / LÀM LẠI TRÊN DOCK TOP -->
            <span class="dock-sep"></span>
            <div class="seg history-tools">
              <button
                class="btn btn-icon"
                @click="handleUndo"
                :disabled="!canUndo"
                title="Hoàn tác (Ctrl+Z)"
                aria-label="Hoàn tác"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h11a5 5 0 0 1 0 10h-6"/><path d="M8 4.5 3.5 9 8 13.5"/></svg>
              </button>

              <button
                class="btn btn-icon"
                @click="handleRedo"
                :disabled="!canRedo"
                title="Làm lại (Ctrl+Shift+Z)"
                aria-label="Làm lại"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 9H9a5 5 0 0 0 0 10h6"/><path d="M16 4.5 20.5 9 16 13.5"/></svg>
              </button>
            </div>
          </div>

          <!-- BẢNG ĐỘI HÌNH & KÝ HIỆU (PANEL LEFT) -->
          <aside v-if="!isSidebarHidden" class="panel panel-left">
            <div class="panel-head">
              <h2>Đội hình</h2>
              <span class="count"><b>{{ markerCount }}</b> ký hiệu</span>
            </div>

            <p class="hint">
              Chọn icon rồi click lên bản đồ để thả nhanh, hoặc kéo trực tiếp. Giữ <kbd>Shift</kbd> khi thả để cắm liên tiếp.
            </p>

            <div class="panel-block">
              <div class="chips" role="group" aria-label="Phe">
                <button
                  v-for="sd in sides"
                  :key="sd.id"
                  class="chip"
                  :class="{ 'is-active': currentSide === sd.id }"
                  @click="onSelectSide(sd.id)"
                >
                  <i :style="{ background: sd.color }"></i>
                  {{ sd.label }}
                </button>
              </div>
            </div>

            <div class="palette">
              <div v-for="g in iconGroups" :key="g.name" class="panel-block">
                <div class="rule"><span>{{ g.name }}</span></div>
                <div class="icon-grid">
                  <button
                    v-for="icon in g.items"
                    :key="icon.id"
                    class="icon-tile"
                    :class="{ 'is-active': pendingIcon === icon.id }"
                    draggable="true"
                    @click="onIconTileClick(icon)"
                    @dragstart="onIconDragStart($event, icon)"
                  >
                    <span v-html="renderPaletteSvg(icon, currentSide)"></span>
                    <span>{{ icon.label }}</span>
                  </button>
                </div>
              </div>
            </div>

            <p class="map-name">{{ mapName }}</p>
          </aside>

          <!-- BẢNG THUỘC TÍNH KÝ HIỆU ĐANG CHỌN (PANEL RIGHT) -->
          <aside v-if="selectedMarker" class="panel panel-right">
            <div class="rule"><span>Ký hiệu</span></div>

            <div class="inspector-id">
              <span
                class="inspector-token"
                :style="{ borderColor: selectedMarkerSideColor }"
                v-html="renderPaletteSvg(selectedMarkerIcon, selectedMarker.side)"
              ></span>
              <span class="inspector-meta">
                <b>{{ selectedMarkerIcon?.label }}</b>
                <em>{{ selectedMarkerSideLabel }} · {{ Math.round((selectedMarker.scale || 1) * 100) }}%</em>
              </span>
            </div>

            <label class="field">
              <span>Nhãn</span>
              <input
                type="text"
                v-model="inspectorLabel"
                maxlength="40"
                :placeholder="selectedMarkerIcon?.label || 'VD: Tổ 1 giữ cầu'"
                @input="onInspectorLabelChange"
              />
            </label>

            <div class="field">
              <span>Phe</span>
              <div class="chips" role="group" aria-label="Đổi phe ký hiệu">
                <button
                  v-for="sd in sides"
                  :key="sd.id"
                  type="button"
                  class="chip"
                  :class="{ 'is-active': selectedMarker.side === sd.id }"
                  @click="onInspectorSideChange(sd.id)"
                >
                  <i :style="{ background: sd.color }"></i>
                  {{ sd.label }}
                </button>
              </div>
            </div>

            <label class="field">
              <span>Kích thước <b>{{ Math.round((selectedMarker.scale || 1) * 100) }}%</b></span>
              <input
                type="range"
                min="60"
                max="200"
                step="10"
                :value="Math.round((selectedMarker.scale || 1) * 100)"
                @input="onInspectorScaleChange($event.target.value)"
              />
            </label>

            <div class="inspector-actions">
              <button class="btn btn-ghost" @click="onDuplicateMarker">Nhân đôi</button>
              <button class="btn btn-ghost btn-warn" @click="onDeleteMarker">Xoá</button>
            </div>
          </aside>

          <!-- DOCK ZOOM BẢN ĐỒ -->
          <div class="dock dock-zoom">
            <button class="btn btn-icon" @click="zoomIn" title="Phóng to" aria-label="Phóng to">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6v12M6 12h12"/></svg>
            </button>
            <button class="btn btn-icon" @click="zoomOut" title="Thu nhỏ" aria-label="Thu nhỏ">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12"/></svg>
            </button>
            <button class="btn btn-icon" @click="fitView" title="Vừa màn hình (F)" aria-label="Vừa màn hình">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"/></svg>
            </button>
            <span class="zoom-readout">{{ Math.round(currentZoom * 100) }}%</span>
          </div>

          <!-- CHÚ GIẢI SỐ LƯỢNG QUÂN THEO PHE (LEGEND) -->
          <div v-if="hasLegend" class="legend">
            <span v-for="sd in sides" :key="sd.id" v-show="sideCounts[sd.id]">
              <i :style="{ background: sd.color }"></i>
              {{ sd.label }}: <b>{{ sideCounts[sd.id] || 0 }}</b>
            </span>
          </div>
        </section>
      </div>
    </div>

    <!-- THÔNG BÁO TOAST -->
    <div v-if="toastMsg" class="toast" :class="toastKind ? 'toast-' + toastKind : ''" role="status">
      {{ toastMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { NTHConfig, SIDES, PEN_COLORS, PEN_WIDTHS, DEFAULTS } from '../utils/tacticalMap/tacticalConfig';
import { NTHIcons } from '../utils/tacticalMap/tacticalIcons';
import { TacticalStore, uid, clone } from '../utils/tacticalMap/tacticalStore';
import { TacticalBoard } from '../utils/tacticalMap/tacticalBoard';
import { useThemeStore } from '../stores/themeStore';

const themeStore = useThemeStore();

// Board DOM refs
const viewportRef = ref(null);
const worldRef = ref(null);
const mapImageRef = ref(null);
const canvasRef = ref(null);
const markerLayerRef = ref(null);

let store = null;
let board = null;

// UI Reactive State
const activeMode = ref('select');
const penTool = ref('pen');
const penColor = ref('red');
const penWidth = ref('medium');
const currentSide = ref('red');
const pendingIcon = ref(null);
const selectedMarker = ref(null);
const inspectorLabel = ref('');
const isSidebarHidden = ref(false);
const currentZoom = ref(1);
const markerCount = ref(0);
const mapName = ref(DEFAULTS.mapName);
const currentMapUrl = ref(DEFAULTS.mapUrl);
const canUndo = ref(false);
const canRedo = ref(false);

const toastMsg = ref('');
const toastKind = ref('');
let toastTimeout = null;

const sides = SIDES;
const penColors = PEN_COLORS;
const penWidths = PEN_WIDTHS;
const iconGroups = NTHConfig.groups();

// --- COMPUTED ---
const selectedMarkerIcon = computed(() => {
  if (!selectedMarker.value) return null;
  return NTHConfig.icon(selectedMarker.value.icon);
});

const selectedMarkerSideLabel = computed(() => {
  if (!selectedMarker.value) return '';
  return NTHConfig.side(selectedMarker.value.side)?.label || '';
});

const selectedMarkerSideColor = computed(() => {
  if (!selectedMarker.value) return '#ffffff';
  return NTHConfig.side(selectedMarker.value.side)?.color || '#ffffff';
});

const sideCounts = computed(() => {
  const counts = { red: 0, blue: 0 };
  if (store && store.state && Array.isArray(store.state.markers)) {
    store.state.markers.forEach((m) => {
      if (counts[m.side] !== undefined) counts[m.side]++;
    });
  }
  return counts;
});

const hasLegend = computed(() => {
  return sideCounts.value.red > 0 || sideCounts.value.blue > 0;
});

// --- TIỆN ÍCH TOAST ---
const showToast = (msg, kind = '') => {
  toastMsg.value = msg;
  toastKind.value = kind;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastMsg.value = '';
  }, 2600);
};

// --- SVG RENDERERS CHO TEMPLATE ---
const renderPaletteSvg = (icon, side) => {
  if (!icon) return '';
  return NTHIcons.paletteSvg(icon, side);
};

// --- KHỞI TẠO BẢN ĐỒ CHIẾN THUẬT ---
const initTacticalBoard = () => {
  if (!viewportRef.value || !canvasRef.value) return;

  if (!store) {
    store = new TacticalStore();
    store.load();
    loadFromHash();
  }

  if (!board) {
    board = new TacticalBoard({
      viewport: viewportRef.value,
      world: worldRef.value,
      image: mapImageRef.value,
      canvas: canvasRef.value,
      markerLayer: markerLayerRef.value,
      store: store,
      handlers: {
        select: (m) => {
          selectedMarker.value = m;
          inspectorLabel.value = m?.label || '';
        },
        view: (v) => {
          currentZoom.value = v.zoom;
        },
        pending: (p) => {
          pendingIcon.value = p.icon;
        },
        rename: (m) => {
          if (!m) return;
          const next = window.prompt('Nhãn cho ký hiệu:', m.label || '');
          if (next === null) return;
          board.select(m.id);
          store.update((st) => {
            st.markers.forEach((item) => {
              if (item.id === m.id) item.label = next.slice(0, 40);
            });
          }, 'marker-edit');
          board.renderMarkers();
          selectedMarker.value = board.findMarker(m.id);
        },
        resize: () => {
          if (board) board.applyTransform();
        }
      }
    });

    store.subscribe((state, reason) => {
      markerCount.value = state.markers.length;
      mapName.value = state.map.name;
      currentMapUrl.value = state.map.url;
      canUndo.value = store.canUndo();
      canRedo.value = store.canRedo();

      if (reason === 'storage-error') {
        showToast('Không lưu được vào bộ nhớ trình duyệt — ảnh nền quá lớn. Hãy xuất file .json.', 'warn');
        return;
      }
      if (reason !== 'marker-move') board.renderMarkers();
      board.redrawStrokes();
    });
  }

  board.editable = true;
  board.render();
  board.fit();

  markerCount.value = store.state.markers.length;
  mapName.value = store.state.map.name;
  currentMapUrl.value = store.state.map.url;
  canUndo.value = store.canUndo();
  canRedo.value = store.canRedo();
};

const onMapImageLoad = () => {
  if (board) {
    board.applyTransform();
  }
};

// --- CHẾ ĐỘ & CÔNG CỤ VẼ ---
const setMode = (mode) => {
  activeMode.value = mode;
  if (board) {
    board.setMode(mode);
    if (mode !== 'select') {
      board.setPending(null);
      pendingIcon.value = null;
    }
  }
};

const setPenTool = (tool) => {
  penTool.value = tool;
  if (board) board.setPen({ tool });
};

const setPenColor = (color) => {
  penColor.value = color;
  if (board) board.setPen({ color });
};

const setPenWidth = (width) => {
  penWidth.value = width;
  if (board) board.setPen({ width });
};

const onSelectSide = (sdId) => {
  currentSide.value = sdId;
  if (board) board.pendingSide = sdId;
};

const onIconTileClick = (icon) => {
  const next = pendingIcon.value === icon.id ? null : icon.id;
  pendingIcon.value = next;
  if (board) {
    board.setPending(next, currentSide.value);
  }
  if (next && window.innerWidth <= 900) {
    isSidebarHidden.value = true;
    showToast(`Chạm lên bản đồ để cắm "${icon.label}".`);
  }
};

const onIconDragStart = (ev, icon) => {
  ev.dataTransfer.setData('text/plain', `${icon.id}|${currentSide.value}`);
  ev.dataTransfer.effectAllowed = 'copy';
};

// --- INSPECTOR ACTIONS ---
const onInspectorLabelChange = () => {
  if (!selectedMarker.value) return;
  const id = selectedMarker.value.id;
  const label = inspectorLabel.value.slice(0, 40);
  store.update((st) => {
    st.markers.forEach((m) => {
      if (m.id === id) m.label = label;
    });
  }, 'marker-edit');
  board.renderMarkers();
};

const onInspectorSideChange = (sideId) => {
  if (!selectedMarker.value) return;
  const id = selectedMarker.value.id;
  store.update((st) => {
    st.markers.forEach((m) => {
      if (m.id === id) m.side = sideId;
    });
  }, 'marker-edit');
  board.renderMarkers();
  selectedMarker.value = board.findMarker(id);
};

const onInspectorScaleChange = (val) => {
  if (!selectedMarker.value) return;
  const id = selectedMarker.value.id;
  const scale = Number(val) / 100;
  store.update((st) => {
    st.markers.forEach((m) => {
      if (m.id === id) m.scale = scale;
    });
  }, 'marker-edit');
  board.renderMarkers();
  selectedMarker.value = board.findMarker(id);
};

const onDuplicateMarker = () => {
  if (!selectedMarker.value) return;
  const copy = clone(selectedMarker.value);
  copy.id = uid('mk');
  copy.x = Math.min(1, copy.x + 0.03);
  copy.y = Math.min(1, copy.y + 0.03);
  store.update((st) => {
    st.markers.push(copy);
  }, 'marker-duplicate');
  board.select(copy.id);
  selectedMarker.value = copy;
  inspectorLabel.value = copy.label || '';
};

const onDeleteMarker = () => {
  if (!selectedMarker.value) return;
  board.removeMarker(selectedMarker.value.id);
  selectedMarker.value = null;
};

// --- ZOOM CONTROLS ---
const zoomIn = () => {
  if (board) board.zoomAt(1.2);
};

const zoomOut = () => {
  if (board) board.zoomAt(1 / 1.2);
};

const fitView = () => {
  if (board) board.fit();
};

// --- UNDO / REDO ---
const handleUndo = () => {
  if (store && store.undo()) {
    if (board) board.render();
    showToast('Đã hoàn tác.');
  }
};

const handleRedo = () => {
  if (store && store.redo()) {
    if (board) board.render();
    showToast('Đã làm lại.');
  }
};

// --- THAO TÁC BẢN ĐỒ & FILE ---
const measureImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth || DEFAULTS.mapWidth,
        height: img.naturalHeight || DEFAULTS.mapHeight
      });
    };
    img.onerror = () => reject(new Error('Không tải được ảnh bản đồ.'));
    img.src = url;
  });
};

const setMap = async (url, name) => {
  try {
    const dim = await measureImage(url);
    store.update((st) => {
      st.map = { url, width: dim.width, height: dim.height, name };
    }, 'map-change');
    currentMapUrl.value = url;
    mapName.value = name;
    if (board) {
      board.render();
      board.fit();
    }
    showToast(`Đã đổi bản đồ: ${name}`);
  } catch (err) {
    showToast(err.message, 'error');
  }
};

const onMapFileChange = (ev) => {
  const file = ev.target.files && ev.target.files[0];
  ev.target.value = '';
  if (!file) return;
  if (file.size > 6 * 1024 * 1024) {
    showToast('Ảnh lớn hơn 6MB có thể không lưu được vào bộ nhớ trình duyệt.', 'warn');
  }
  const reader = new FileReader();
  reader.onload = () => {
    setMap(String(reader.result), file.name);
  };
  reader.readAsDataURL(file);
};

const onMapUrlPrompt = () => {
  const url = window.prompt('Dán URL ảnh bản đồ (http/https):', '');
  if (!url) return;
  if (!/^https?:\/\//i.test(url)) {
    showToast('URL phải bắt đầu bằng http:// hoặc https://', 'error');
    return;
  }
  setMap(url.trim(), 'Bản đồ từ URL');
};

const onMapReset = () => {
  setMap(DEFAULTS.mapUrl, DEFAULTS.mapName);
};

// --- XUẤT / NHẬP KẾ HOẠCH & CHIA SẺ ---
const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const getTimeStamp = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
};

const onExportJson = () => {
  const blob = new Blob([JSON.stringify(store.state, null, 2)], { type: 'application/json' });
  downloadFile(blob, `nth-tactical-${getTimeStamp()}.json`);
  showToast('Đã xuất file kế hoạch.');
};

const onImportJson = (ev) => {
  const file = ev.target.files && ev.target.files[0];
  ev.target.value = '';
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      store.replace(JSON.parse(String(reader.result)), 'import');
      if (board) {
        board.render();
        board.fit();
      }
      showToast('Đã nhập kế hoạch.');
    } catch (err) {
      showToast('File không hợp lệ.', 'error');
    }
  };
  reader.readAsText(file);
};

const onExportPng = async () => {
  if (location.protocol === 'file:') {
    showToast('Xuất PNG cần mở trang qua http:// — mở file trực tiếp thì trình duyệt chặn đọc ảnh nền.', 'warn');
    return;
  }
  try {
    const canvas = await board.exportPng();
    canvas.toBlob((blob) => {
      if (!blob) {
        showToast('Không tạo được ảnh.', 'error');
        return;
      }
      downloadFile(blob, `nth-tactical-${getTimeStamp()}.png`);
      showToast('Đã xuất ảnh PNG.');
    }, 'image/png');
  } catch (err) {
    showToast('Không xuất được ảnh: ảnh nền không cho phép đọc (CORS).', 'error');
  }
};

const onShareLink = () => {
  const payload = clone(store.state);
  if (/^data:/.test(payload.map.url)) {
    payload.map = { url: DEFAULTS.mapUrl, width: DEFAULTS.mapWidth, height: DEFAULTS.mapHeight, name: DEFAULTS.mapName };
    showToast('Ảnh tải lên không kèm được trong link — link dùng bản đồ mặc định.', 'warn');
  }
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  const link = `${location.origin}${location.pathname}#plan=${encoded}`;
  if (link.length > 30000) {
    showToast('Kế hoạch quá lớn để tạo link. Hãy xuất file .json.', 'error');
    return;
  }
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(link).then(
      () => showToast('Đã sao chép link chia sẻ.'),
      () => window.prompt('Sao chép link:', link)
    );
  } else {
    window.prompt('Sao chép link:', link);
  }
};

const loadFromHash = () => {
  const m = /#plan=(.+)$/.exec(location.hash);
  if (!m) return false;
  try {
    const json = decodeURIComponent(escape(atob(m[1])));
    store.replace(JSON.parse(json), 'share-link');
    showToast('Đã mở kế hoạch từ link chia sẻ.');
    return true;
  } catch (err) {
    showToast('Link chia sẻ không hợp lệ.', 'error');
    return false;
  }
};

// --- XOÁ HÀNG LOẠT ---
const onClearStrokes = () => {
  if (!store.state.strokes.length) return;
  store.update((st) => { st.strokes = []; }, 'clear-strokes');
  showToast('Đã xoá toàn bộ nét vẽ. Ctrl+Z để hoàn tác.');
};

const onClearMarkers = () => {
  if (!store.state.markers.length) return;
  store.update((st) => { st.markers = []; }, 'clear-markers');
  selectedMarker.value = null;
  showToast('Đã xoá toàn bộ ký hiệu. Ctrl+Z để hoàn tác.');
};

const onClearAll = () => {
  if (!window.confirm('Xoá toàn bộ ký hiệu và nét vẽ trên bản đồ?')) return;
  store.update((st) => { st.markers = []; st.strokes = []; }, 'clear-all');
  selectedMarker.value = null;
  showToast('Đã xoá tất cả. Ctrl+Z để hoàn tác.');
};

// --- PHÍM TẮT ---
const handleKeyDown = (ev) => {
  const t = ev.target;
  const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
  if (typing) return;

  const mod = ev.ctrlKey || ev.metaKey;
  if (mod && ev.key.toLowerCase() === 'z') {
    ev.preventDefault();
    if (ev.shiftKey) handleRedo();
    else handleUndo();
    return;
  }
  if (mod) return;

  if (ev.key === 'Delete' || ev.key === 'Backspace') {
    if (selectedMarker.value) {
      ev.preventDefault();
      onDeleteMarker();
    }
    return;
  }
  if (ev.key === 'Escape') {
    if (board) {
      board.setPending(null);
      pendingIcon.value = null;
      board.select(null);
      selectedMarker.value = null;
    }
    return;
  }
  if (ev.key === '1') setMode('select');
  if (ev.key === '2') setMode('draw');
  if (ev.key === '3') setMode('pan');
  if (ev.key === 'f' || ev.key === 'F') fitView();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  nextTick(() => {
    initTacticalBoard();
  });
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  if (board) {
    board.destroy();
    board = null;
  }
});
</script>

<style scoped>
/* =========================================================================
   SYNCHRONIZED NEO-BRUTALIST KIẾM HIỆP DESIGN TOKENS (LIGHT & DARK MODES)
   ========================================================================= */

.tactical-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 58px);
  min-height: 550px;
  overflow: hidden;
  user-select: none;
  font-family: var(--font-body, 'Be Vietnam Pro', sans-serif);
  font-size: 13.5px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* Light Theme Tokens */
.tactical-container.tactical-light {
  --tm-bg: #f8fafc;
  --tm-surface: #ffffff;
  --tm-subtle: #f1f5f9;
  --tm-border: #e2e8f0;
  --tm-text: #0f172a;
  --tm-text-secondary: #475569;
  --tm-muted: #64748b;
  --tm-brand: #3b82f6;
  --tm-brand-hover: #2563eb;
  --tm-panel-bg: rgba(255, 255, 255, 0.95);
  --tm-dock-bg: rgba(255, 255, 255, 0.92);
  --tm-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  --tm-shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.08);
  --tm-active-btn: #3b82f6;
  --tm-active-text: #ffffff;
  --tm-stage-bg: #f1f5f9;
  color: var(--tm-text);
  background: var(--tm-bg);
}

/* Dark Theme Tokens */
.tactical-container.tactical-dark {
  --tm-bg: #0b1120;
  --tm-surface: #0f172a;
  --tm-subtle: #1e293b;
  --tm-border: #1e293b;
  --tm-text: #f8fafc;
  --tm-text-secondary: #94a3b8;
  --tm-muted: #64748b;
  --tm-brand: #60a5fa;
  --tm-brand-hover: #93c5fd;
  --tm-panel-bg: rgba(15, 23, 42, 0.95);
  --tm-dock-bg: rgba(15, 23, 42, 0.92);
  --tm-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
  --tm-shadow-lg: 0 12px 30px rgba(0, 0, 0, 0.5);
  --tm-active-btn: #3b82f6;
  --tm-active-text: #ffffff;
  --tm-stage-bg: #060911;
  color: var(--tm-text);
  background: var(--tm-bg);
}

* { box-sizing: border-box; }

kbd {
  background: var(--tm-subtle);
  border: 1px solid var(--tm-border);
  border-radius: var(--radius-xs, 4px);
  padding: 2px 6px;
  font-family: monospace;
  font-size: 10px;
}

/* NÚT BẤM (MODERN BUTTONS) */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  border: 1px solid var(--tm-border);
  border-radius: var(--radius-md, 12px);
  background: var(--tm-surface);
  color: var(--tm-text);
  font-family: var(--font-body, sans-serif);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--tm-shadow);
  transition: all 0.2s ease;
}
.btn svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.btn:hover:not(:disabled) {
  background: var(--tm-subtle);
  transform: translateY(-1px);
  border-color: var(--tm-brand);
}
.btn:active:not(:disabled) {
  transform: translateY(0);
}
.btn:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-ghost {
  background: transparent;
  box-shadow: none;
  border: 1px solid var(--tm-border);
}
.btn-ghost:hover:not(:disabled) {
  background: var(--tm-subtle);
}

.btn-warn {
  color: #ef4444 !important;
  border-color: rgba(239, 68, 68, 0.4) !important;
  background: rgba(239, 68, 68, 0.1) !important;
}
.btn-warn:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.2) !important;
}

.btn-icon {
  width: 34px;
  height: 34px;
  padding: 0;
  justify-content: center;
}

/* FORM FIELDS */
.field { display: grid; gap: 6px; border: 0; padding: 0; margin: 0; min-inline-size: 0; }
.field > span {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--tm-muted);
}
.field > span b { color: var(--tm-brand); font-weight: 700; }
.field input[type="text"] {
  width: 100%;
  height: 36px;
  padding: 0 12px;
  background: var(--tm-surface);
  border: 1px solid var(--tm-border);
  border-radius: var(--radius-md, 10px);
  color: var(--tm-text);
  font-family: var(--font-sans);
  font-size: 13px;
  outline: none;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}
.field input:focus {
  border-color: var(--tm-brand) !important;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15) !important;
}
.field input[type="range"] {
  width: 100%;
  accent-color: var(--tm-brand);
  cursor: pointer;
}

/* APP STRUCTURE */
.app { height: 100%; display: flex; flex-direction: column; }
.workspace { flex-grow: 1; display: flex; min-height: 0; position: relative; }

/* THANH DỌC (RAIL) */
.rail {
  width: 56px;
  flex-shrink: 0;
  background: var(--tm-subtle);
  border-right: 1px solid var(--tm-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  z-index: 10;
}
.rail-group { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.rail-spacer { flex-grow: 1; }
.rail-sep { width: 24px; height: 1px; background: var(--tm-border); margin: 4px 0; flex-shrink: 0; }

.rail-btn {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border: 1px solid var(--tm-border);
  border-radius: var(--radius-md, 10px);
  background: var(--tm-surface);
  color: var(--tm-text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}
.rail-btn svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.rail-btn:hover {
  background: var(--tm-brand);
  color: var(--tm-active-text);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.rail-btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
.rail-btn-danger:hover {
  background: #ef4444 !important;
  color: #ffffff !important;
}

/* STAGE & VIEWPORT */
.stage {
  flex-grow: 1;
  position: relative;
  min-width: 0;
  overflow: hidden;
  background: var(--tm-stage-bg);
}
.viewport {
  position: absolute;
  inset: 0;
  overflow: hidden;
  touch-action: none;
  cursor: default;
}
.viewport[data-mode="draw"] { cursor: crosshair; }
.viewport[data-mode="pan"] { cursor: grab; }
.viewport.is-panning { cursor: grabbing; }
.viewport.is-placing { cursor: copy; }

.world {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  background: var(--tm-stage-bg);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
.map-image {
  display: block;
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-user-drag: none;
}
.draw-layer, .marker-layer { position: absolute; inset: 0; pointer-events: none; }

/* DOCKS */
.dock {
  position: absolute;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: var(--radius-lg, 4px);
  background: var(--tm-dock-bg);
  border: 2px solid var(--tm-border);
  box-shadow: var(--tm-shadow);
  backdrop-filter: blur(8px);
}
.dock-top { left: 50%; top: 16px; transform: translateX(-50%); flex-wrap: wrap; justify-content: center; }
.dock-zoom { right: 16px; bottom: 16px; }
.dock-sep { width: 2px; height: 22px; background: var(--tm-border); margin: 0 2px; flex-shrink: 0; }
.dock-pen { display: flex; align-items: center; gap: 8px; }

.seg { display: flex; gap: 4px; align-items: center; }
.history-tools { gap: 4px; }

.seg-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border: 1px solid var(--tm-border);
  border-radius: var(--radius, 2px);
  background: var(--tm-subtle);
  color: var(--tm-text);
  font-family: var(--font-heading, sans-serif);
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}
.seg-btn svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.seg-btn[data-mode="select"] svg { fill: currentColor; stroke: none; }
.seg-btn:hover {
  background: var(--tm-surface);
  border-color: var(--tm-brand);
}
.seg-btn.is-active {
  background: var(--tm-brand);
  color: var(--tm-active-text);
  border-color: var(--tm-border);
  box-shadow: var(--shadow-sm);
}

.chips { display: flex; gap: 6px; flex-wrap: wrap; }
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid var(--tm-border);
  border-radius: var(--radius-full, 9999px);
  background: var(--tm-surface);
  color: var(--tm-text);
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.15s ease;
}
.chip i { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.chip:hover {
  border-color: var(--tm-brand);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.chip.is-active {
  border-color: var(--tm-brand);
  background: var(--tm-subtle);
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2);
}

#color-group .chip {
  width: 28px;
  padding: 0;
  justify-content: center;
  font-size: 0;
  gap: 0;
}
#color-group .chip i { width: 14px; height: 14px; border-radius: var(--radius-sm, 6px); }
#color-group .chip.is-active { box-shadow: 0 0 0 2px var(--tm-brand); }

#width-group .seg-btn {
  padding: 0 10px;
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  text-transform: uppercase;
}

.zoom-readout {
  min-width: 44px;
  text-align: center;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  color: var(--tm-brand);
}

/* PANELS */
.panel {
  position: absolute;
  z-index: 6;
  border-radius: var(--radius-lg, 4px);
  background: var(--tm-panel-bg);
  border: 2px solid var(--tm-border);
  box-shadow: var(--tm-shadow-lg);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
}
.panel-left {
  left: 16px;
  top: 16px;
  width: 300px;
  max-height: calc(100% - 32px);
  padding: 16px;
  gap: 12px;
}
.panel-right {
  right: 16px;
  top: 16px;
  width: 250px;
  padding: 16px;
  gap: 12px;
}

.panel-head {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid var(--tm-border);
  padding-bottom: 8px;
}
.panel-head h2 {
  margin: 0;
  font-family: var(--font-heading, sans-serif);
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--tm-brand);
}
.count {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--tm-muted);
}
.count b {
  font-family: var(--font-mono, monospace);
  font-size: 14px;
  color: var(--tm-brand);
  margin-right: 4px;
}

.hint {
  margin: 0;
  flex-shrink: 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--tm-text-secondary);
}

.panel-block { flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; }

.rule { display: flex; align-items: center; gap: 8px; }
.rule > span {
  font-family: var(--font-heading, sans-serif);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--tm-brand);
  white-space: nowrap;
}
.rule::after {
  content: "";
  flex-grow: 1;
  height: 1px;
  background: var(--tm-border);
}

.palette {
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  margin: 0 -4px;
  padding: 2px 4px;
  scrollbar-width: thin;
  scrollbar-color: var(--tm-border) transparent;
}

.icon-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.icon-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 8px 4px 6px;
  border: 1px solid var(--tm-border);
  border-radius: var(--radius-md, 10px);
  background: var(--tm-surface);
  color: var(--tm-text);
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  cursor: grab;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}
.icon-tile:hover {
  transform: translateY(-2px);
  border-color: var(--tm-brand);
  background: var(--tm-subtle);
  box-shadow: var(--shadow-md);
}
.icon-tile:active { cursor: grabbing; transform: translateY(0); }
.icon-tile.is-active {
  border-color: var(--tm-brand);
  background: var(--tm-subtle);
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2);
}

.icon-tile :deep(.icon-emblem) { width: 28px; height: 28px; }
.icon-tile :deep(.emblem-ring) { width: 28px; height: 28px; }
.icon-tile :deep(.emblem-logo) {
  position: absolute;
  top: 8px;
  left: 50%;
  width: 28px;
  height: 28px;
  transform: translateX(-50%);
  object-fit: contain;
  pointer-events: none;
}

.map-name {
  margin: 0;
  flex-shrink: 0;
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--tm-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.inspector-id { display: flex; align-items: center; gap: 10px; }
.inspector-token {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: var(--radius, 2px);
  border: 2px solid var(--tm-border);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--tm-subtle);
}
.inspector-token :deep(.icon-emblem),
.inspector-token :deep(.emblem-ring) { width: 28px; height: 28px; }
.inspector-token :deep(.emblem-logo) {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 26px;
  height: 26px;
  transform: translate(-50%, -50%);
  object-fit: contain;
}
.inspector-meta { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.inspector-meta b {
  font-family: var(--font-heading, sans-serif);
  font-size: 14px;
  font-weight: 700;
  color: var(--tm-brand);
}
.inspector-meta em {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  font-style: normal;
  text-transform: uppercase;
  color: var(--tm-muted);
}
.inspector-actions { display: flex; gap: 6px; }
.inspector-actions .btn { flex: 1; justify-content: center; height: 30px; font-size: 11px; }

.legend {
  position: absolute;
  z-index: 5;
  left: 16px;
  bottom: 16px;
  display: flex;
  gap: 14px;
  padding: 6px 12px;
  border-radius: var(--radius, 2px);
  background: var(--tm-dock-bg);
  border: 2px solid var(--tm-border);
  box-shadow: var(--tm-shadow);
  backdrop-filter: blur(8px);
  font-family: var(--font-mono, monospace);
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--tm-text);
}
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.legend i { width: 8px; height: 8px; border-radius: 50%; }
.legend b { color: var(--tm-brand); }

/* TOAST */
.toast {
  position: absolute;
  left: 50%;
  bottom: 26px;
  z-index: 70;
  transform: translateX(-50%);
  max-width: min(520px, 90vw);
  padding: 10px 16px;
  background: var(--tm-surface);
  border: 2px solid var(--tm-border);
  border-left: 5px solid var(--tm-brand);
  border-radius: var(--radius, 2px);
  box-shadow: var(--tm-shadow-lg);
  font-family: var(--font-heading, sans-serif);
  font-size: 12.5px;
  font-weight: 700;
  color: var(--tm-text);
}
.toast-warn { border-left-color: #f59e0b; }
.toast-error { border-left-color: #ef4444; }

/* GLOBAL MARKER STYLES TRONG LAYER */
:deep(.marker) {
  position: absolute;
  width: 44px;
  height: 58px;
  transform: translate(-50%, -100%);
  pointer-events: auto;
  cursor: grab;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
  transition: filter 0.15s ease;
}
:deep(.marker.is-logo) { transform: translate(-50%, -50%); }
:deep(.marker:active) { cursor: grabbing; }
:deep(.marker-svg) { width: 100%; height: 100%; }
:deep(.marker-ring) { width: 100%; height: 100%; }
:deep(.marker-logo) {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 76%;
  height: 76%;
  transform: translate(-50%, -50%);
  object-fit: contain;
  pointer-events: none;
}
:deep(.marker.logo-missing .marker-logo) { display: none; }

:deep(.marker-label) {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 3px;
  padding: 3px 8px;
  border-radius: var(--radius-sm, 6px);
  background: rgba(15, 23, 42, 0.92);
  border: 1px solid var(--tm-border);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: var(--shadow-sm);
}

:deep(.marker.is-selected) { filter: drop-shadow(0 0 8px rgba(245, 197, 24, 0.7)); }
:deep(.marker.is-selected::after) {
  content: "";
  position: absolute;
  inset: -8px;
  pointer-events: none;
  border: 2px dashed var(--tm-brand);
  border-radius: var(--radius-md, 8px);
}

@media (max-width: 1180px) {
  .dock-top { left: 16px; top: 16px; transform: none; justify-content: flex-start; max-width: calc(100% - 32px); }
  .panel-left { top: 78px; }
  .panel-right { top: 78px; }
}

@media (max-width: 900px) {
  .rail { width: 48px; }
  .rail-btn { width: 34px; height: 34px; }
  .panel-left { width: min(280px, calc(100% - 32px)); max-height: calc(100% - 150px); }
  .panel-right { width: min(230px, calc(100% - 32px)); }
  .legend { display: none; }
}

@media (max-width: 620px) {
  .dock-top { flex-wrap: wrap; }
  .panel-right { top: auto; bottom: 76px; }
}
</style>
