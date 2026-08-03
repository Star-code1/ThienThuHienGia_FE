<template>
  <div class="relative min-h-[calc(100vh-57px)] text-[#e2e8f0] p-6 max-w-6xl mx-auto font-sans select-none space-y-6">
    <!-- Header -->
    <div class="border-b border-[#172439] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">📊</span>
          <h1 class="text-2xl font-extrabold uppercase font-serif tracking-wide bg-gradient-to-r from-[#fef08a] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent">
            THỐNG KÊ ĐIỂM DANH & HIỆU SUẤT BANG CHIẾN
          </h1>
        </div>
        <p class="text-xs text-[#94a3b8] mt-1">Báo cáo tham chiến, danh sách báo bận và tỷ lệ có mặt theo Phái</p>
      </div>

      <RouterLink
        to="/lineup"
        class="px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold transition shadow-md"
      >
        Mở Sơ Đồ Ma Trận ➔
      </RouterLink>
    </div>

    <!-- Summary Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-[#080d19]/90 border border-[#17263c] rounded-2xl p-5 shadow-xl">
        <span class="text-xs text-[#64748b] font-bold uppercase">Tổng Quân Số Báo Danh</span>
        <div class="text-3xl font-extrabold text-[#f5c518] font-mono mt-2">
          {{ store.totalAssigned }} / {{ store.totalAttendance || 62 }}
        </div>
        <span class="text-[11px] text-[#34d399] mt-1 block">✓ Đã phân bổ hết các slot chính</span>
      </div>

      <div class="bg-[#080d19]/90 border border-[#17263c] rounded-2xl p-5 shadow-xl">
        <span class="text-xs text-[#64748b] font-bold uppercase">Danh Sách Báo Bận</span>
        <div class="text-3xl font-extrabold text-[#ef5757] font-mono mt-2">
          {{ store.rightPanels.rollCall?.totalBusy || 9 }} người
        </div>
        <span class="text-[11px] text-[#94a3b8] mt-1 block">Đã ghi nhận lý do bận</span>
      </div>

      <div class="bg-[#080d19]/90 border border-[#17263c] rounded-2xl p-5 shadow-xl">
        <span class="text-xs text-[#64748b] font-bold uppercase">Tỷ Lệ Lấp Đầy Ma Trận</span>
        <div class="text-3xl font-extrabold text-[#60a5fa] font-mono mt-2">
          {{ fillRatio }}%
        </div>
        <span class="text-[11px] text-[#60a5fa] mt-1 block">Trận hình sẵn sàng ra chiến trường</span>
      </div>
    </div>

    <!-- Class Breakdown Distribution -->
    <div class="bg-[#080d19]/90 border border-[#17263c] rounded-2xl p-6 shadow-2xl space-y-4">
      <h3 class="text-sm font-bold uppercase tracking-wider text-[#93c5fd]">
        Phân Bổ Tỷ Lệ Võ Phái Trực Chiến
      </h3>

      <div class="space-y-3">
        <div v-for="c in classStats" :key="c.name" class="space-y-1">
          <div class="flex justify-between text-xs font-semibold">
            <span class="flex items-center gap-2">
              <img v-if="c.icon" :src="c.icon" class="w-4 h-4 object-contain" />
              <span class="text-white">{{ c.name }}</span>
            </span>
            <span class="font-mono text-[#f5c518]">{{ c.count }} người</span>
          </div>

          <div class="w-full bg-[#0f172a] h-2.5 rounded-full overflow-hidden border border-[#1e293b]">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{ width: `${c.percent}%`, backgroundColor: c.hex }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useLineupStore } from '../stores/lineupStore';
import { CLASS_LIST } from '../theme/classColors';

const store = useLineupStore();

const fillRatio = computed(() => {
  const total = store.totalAttendance || 62;
  const current = store.totalAssigned;
  return Math.round((current / total) * 100);
});

const classStats = computed(() => {
  const counts = store.classCounts;
  const total = store.totalAssigned || 1;

  return CLASS_LIST.map((c) => {
    const count = counts[c.name] || 0;
    return {
      name: c.name,
      hex: c.hex,
      icon: c.icon,
      count,
      percent: Math.round((count / total) * 100)
    };
  });
});
</script>
