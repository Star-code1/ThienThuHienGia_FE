<template lang="pug">
.chart
  .row(v-for="r in sortedRows" :key="r.name" :style="{ '--c': r.hex }")
    .label
      img.icon(v-if="r.icon" :src="r.icon" :alt="r.name")
      span.name {{ r.name }}
    .track
      .fill(:style="{ width: pct(r.value) + '%' }")
    .value {{ r.display }}
    .sub {{ r.sub }}
  p.empty(v-if="!sortedRows.length") Chưa có dữ liệu.
</template>

<script setup>
import { computed } from 'vue';

// rows: [{ name, hex, icon, value (số để vẽ cột), display (chuỗi hiển thị), sub (chú thích nhỏ) }]
const props = defineProps({
  rows: { type: Array, default: () => [] },
  max: { type: Number, default: 0 }, // 0 = tự lấy giá trị lớn nhất
});

const sortedRows = computed(() => [...props.rows].sort((a, b) => b.value - a.value));
const top = computed(() => props.max || Math.max(1, ...props.rows.map((r) => r.value)));
const pct = (v) => Math.max(2, Math.min(100, (v / top.value) * 100));
</script>

<style scoped>
.chart { display: flex; flex-direction: column; gap: 0.65rem; }

/* Mobile: nhãn + số trên một dòng, thanh cột bên dưới */
.row {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas: "label value" "track track" "sub sub";
  gap: 0.2rem 0.6rem;
  align-items: center;
}
.label { grid-area: label; display: flex; align-items: center; gap: 0.5rem; min-width: 0; }
.icon { width: 1.4rem; height: 1.4rem; object-fit: contain; }
.name { font-size: 0.85rem; font-weight: 700; color: var(--color-text); }
.track { grid-area: track; height: 0.7rem; border-radius: 999px; background: var(--color-bg-subtle); overflow: hidden; }
.fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--c), color-mix(in srgb, var(--c) 55%, #fff));
  transition: width 0.5s ease;
}
.value { grid-area: value; font-weight: 800; font-size: 0.9rem; color: var(--c); }
.sub { grid-area: sub; font-size: 0.7rem; color: var(--color-muted); }
.empty { margin: 0; color: var(--color-muted); font-size: 0.85rem; }

@media (min-width: 768px) {
  .row {
    grid-template-columns: 9rem 1fr 4.5rem 9rem;
    grid-template-areas: "label track value sub";
    gap: 0.8rem;
  }
  .sub { text-align: right; }
}
</style>
