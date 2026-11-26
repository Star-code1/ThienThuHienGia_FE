<template lang="pug">
.presence-layer(aria-hidden="true")
  //- Khung viền "đang sửa" quanh mục người khác đang thao tác
  .focus-box(
    v-for="f in focusBoxes"
    :key="f.id"
    :style="{ left: f.left + 'px', top: f.top + 'px', width: f.width + 'px', height: f.height + 'px', borderColor: f.color }"
  )
    span.focus-tag(:style="{ backgroundColor: f.color }") {{ f.name }} đang sửa

  //- Con trỏ chuột của người khác
  .remote-cursor(
    v-for="c in cursors"
    :key="c.id"
    :style="{ transform: `translate(${c.x}px, ${c.y}px)` }"
  )
    svg.cursor-arrow(width="18" height="18" viewBox="0 0 24 24" :style="{ color: c.color }")
      path(d="M3 2l7.5 19 2.6-7.9L21 10.5z" fill="currentColor" stroke="#fff" stroke-width="1.5" stroke-linejoin="round")
    span.cursor-name(:style="{ backgroundColor: c.color }") {{ c.name }}
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useLineupStore } from '../../stores/lineupStore';

const props = defineProps({
  // Phần tử khung ma trận (.lineup-matrix-box) làm hệ quy chiếu toạ độ
  target: { type: Object, default: null },
});

const store = useLineupStore();
const boxSize = ref({ width: 0, height: 0 });
const focusBoxes = ref([]);

// x chuẩn hoá theo bề rộng (0..1) để khớp giữa các màn hình khác kích thước, y tính bằng px
const cursors = computed(() =>
  store.peers
    .filter((p) => p.cursor)
    .map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color,
      x: p.cursor.x * boxSize.value.width,
      y: p.cursor.y,
    }))
);

const measure = () => {
  const el = props.target;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  boxSize.value = { width: rect.width, height: rect.height };

  const boxes = [];
  store.peers.forEach((p) => {
    if (!p.focus) return;
    const node = el.querySelector(`[data-focus-key="${CSS.escape(p.focus)}"]`);
    if (!node) return;
    const r = node.getBoundingClientRect();
    if (!r.width || !r.height) return;
    boxes.push({
      id: p.id,
      name: p.name,
      color: p.color,
      left: r.left - rect.left + el.scrollLeft - 2,
      top: r.top - rect.top + el.scrollTop - 2,
      width: r.width + 4,
      height: r.height + 4,
    });
  });
  focusBoxes.value = boxes;
};

// ---- Gửi vị trí chuột của mình (giới hạn ~20 lần/giây) ----
let lastSend = 0;
let pendingTimer = null;
const sendPos = (pos) => store.sendCursor(pos);
const onPointerMove = (e) => {
  const el = props.target;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const pos = { x: (e.clientX - rect.left) / rect.width, y: e.clientY - rect.top };
  const now = performance.now();
  clearTimeout(pendingTimer);
  if (now - lastSend >= 50) {
    lastSend = now;
    sendPos(pos);
  } else {
    pendingTimer = setTimeout(() => { lastSend = performance.now(); sendPos(pos); }, 50);
  }
};
const onPointerLeave = () => { clearTimeout(pendingTimer); sendPos(null); };

// ---- Ô đang gõ: báo cho người khác (slot > team > division) ----
const onFocusIn = (e) => {
  const holder = e.target.closest && e.target.closest('[data-focus-key]');
  store.setFocus(holder ? holder.dataset.focusKey : null, 'input');
};
const onFocusOut = () => store.setFocus(null, 'input');

let interval = null;
const bind = (el) => {
  if (!el) return;
  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerleave', onPointerLeave);
  el.addEventListener('focusin', onFocusIn);
  el.addEventListener('focusout', onFocusOut);
};
const unbind = (el) => {
  if (!el) return;
  el.removeEventListener('pointermove', onPointerMove);
  el.removeEventListener('pointerleave', onPointerLeave);
  el.removeEventListener('focusin', onFocusIn);
  el.removeEventListener('focusout', onFocusOut);
};

watch(() => props.target, (el, old) => { unbind(old); bind(el); measure(); }, { immediate: true });
watch(() => store.peers.map((p) => p.focus).join('|'), measure);

onMounted(() => {
  measure();
  interval = setInterval(measure, 300); // bố cục có thể đổi (thu gọn đoàn, ghi chú...)
  window.addEventListener('resize', measure);
});
onBeforeUnmount(() => {
  unbind(props.target);
  clearInterval(interval);
  clearTimeout(pendingTimer);
  window.removeEventListener('resize', measure);
});
</script>

<style lang="stylus" scoped>
.presence-layer
  position absolute
  inset 0
  pointer-events none
  overflow hidden
  z-index 30

.focus-box
  position absolute
  border 2px solid
  border-radius 8px
  transition all 0.15s ease

.focus-tag
  position absolute
  top -1.35rem
  left -2px
  font-size 0.65rem
  font-weight 700
  color #fff
  padding 0.1rem 0.45rem
  border-radius 6px 6px 6px 0
  white-space nowrap

.remote-cursor
  position absolute
  left 0
  top 0
  transition transform 0.06s linear

.cursor-arrow
  display block
  filter drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35))

.cursor-name
  position absolute
  left 14px
  top 14px
  font-size 0.65rem
  font-weight 700
  color #fff
  padding 0.1rem 0.4rem
  border-radius 6px
  white-space nowrap
</style>
