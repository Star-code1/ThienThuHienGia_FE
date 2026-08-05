<template>
  <div class="relative min-h-[calc(100vh-57px)] text-[#e2e8f0] p-6 max-w-6xl mx-auto font-sans select-none space-y-6">
    <!-- Header -->
    <div class="border-b border-[#172439] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">📊</span>
          <h1 class="text-2xl font-extrabold uppercase font-serif tracking-wide bg-gradient-to-r from-[#fef08a] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent">
            UY DANH THỐNG KÊ & HIỆU SUẤT BANG CHIẾN
          </h1>
        </div>
        <p class="text-xs text-[#94a3b8] mt-1 font-serif">Báo cáo tham chiến, danh sách đệ tử cáo bận và lực lượng võ phái</p>
      </div>

      <RouterLink
        to="/lineup"
        class="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold transition shadow-md font-serif"
      >
        Thiên Thư Trận Phái ➔
      </RouterLink>
    </div>

    <!-- Event Selector Bar -->
    <div class="bg-[#080d19]/90 border border-[#1e304d] rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-[#f5c518]/10 border border-[#f5c518]/30 flex items-center justify-center text-lg text-[#f5c518]">
          ⚔️
        </div>
        <div>
          <span class="text-[10px] uppercase font-bold tracking-widest text-[#64748b] block font-serif">Chọn Công Thành Chiến Kỳ:</span>
          <span class="text-xs font-bold text-[#f5c518] font-serif">{{ currentEventTitle }}</span>
        </div>
      </div>

      <!-- Select Dropdown -->
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <label for="stats-event-select" class="text-xs font-semibold text-[#94a3b8] shrink-0 font-serif">Sự kiện:</label>
        <select
          id="stats-event-select"
          v-model="selectedMessageId"
          @change="handleEventChange"
          class="bg-[#0f172a] border border-[#1e293b] text-[#f5c518] text-xs font-bold rounded-xl px-3.5 py-2 focus:ring-1 focus:ring-[#f5c518] outline-none cursor-pointer w-full sm:w-64 font-serif"
        >
          <option value="" disabled>-- Chọn sự kiện xuất trận --</option>
          <option
            v-for="event in store.events"
            :key="event.messageId"
            :value="event.messageId"
          >
            {{ event.name || event.title }}
          </option>
        </select>
      </div>
    </div>

    <!-- Summary Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-[#080d19]/90 border border-[#17263c] rounded-2xl p-5 shadow-xl">
        <span class="text-xs text-[#64748b] font-bold uppercase font-serif">Tổng Đệ Tử Trực Trận</span>
        <div class="text-3xl font-extrabold text-[#f5c518] font-mono mt-2">
          {{ store.totalAssigned }} / {{ store.totalAttendance || 62 }}
        </div>
        <span class="text-[11px] text-[#34d399] mt-1 block font-serif">✓ Đã an vị trong {{ currentEventTitle }}</span>
      </div>

      <!-- Member Bận -->
      <div class="bg-[#080d19]/90 border border-[#17263c] rounded-2xl p-5 shadow-xl">
        <span class="text-xs text-[#64748b] font-bold uppercase font-serif">Đệ Tử Cáo Bận</span>
        <div class="text-3xl font-extrabold text-[#ef5757] font-mono mt-2">
          {{ store.totalBusyCount }} đệ tử
        </div>
        <span class="text-[11px] text-[#ef5757] mt-1 block font-serif">Danh sách đệ tử không thể xuất trận</span>
      </div>

      <div class="bg-[#080d19]/90 border border-[#17263c] rounded-2xl p-5 shadow-xl">
        <span class="text-xs text-[#64748b] font-bold uppercase font-serif">Tỷ Lệ Lấp Đầy Trận Đồ</span>
        <div class="text-3xl font-extrabold text-[#60a5fa] font-mono mt-2">
          {{ fillRatio }}%
        </div>
        <span class="text-[11px] text-[#60a5fa] mt-1 block font-serif">Ma trận sẵn sàng nghênh chiến</span>
      </div>
    </div>

    <!-- Absent Members Detail Section if any -->
    <div v-if="store.absentUsers && store.absentUsers.length > 0" class="bg-[#080d19]/90 border border-[#7f1d1d]/60 rounded-2xl p-6 shadow-2xl space-y-3 backdrop-blur-md">
      <h3 class="text-xs font-bold uppercase tracking-wider text-[#ef5757] font-serif flex items-center gap-2">
        <span>🚫 DANH SÁCH ĐỆ TỬ CÁO BẬN XUẤT TRẬN</span>
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div v-for="user in store.absentUsers" :key="user.userId || user.id" class="p-3 bg-[#170d12] border border-[#7f1d1d]/40 rounded-xl flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-[#7f1d1d]/30 border border-[#ef5757]/50 flex items-center justify-center text-xs font-bold text-[#ef5757]">
            {{ (user.displayName || user.username || 'B').charAt(0) }}
          </div>
          <div>
            <span class="text-xs font-bold text-white block font-serif">{{ user.displayName || user.username }}</span>
            <span class="text-[10px] text-[#fca5a5] block font-serif">{{ user.reason || user.note || 'Cáo bận không thể tham chiến' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Class Stats Section (RightTacticalPanels classStatsList Style) -->
    <div class="bg-[#080d19]/90 border border-[#17263c] rounded-2xl p-6 shadow-2xl space-y-5 backdrop-blur-md">
      <div class="flex items-center justify-between border-b border-[#142033] pb-3">
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider text-[#93c5fd] font-serif flex items-center gap-2">
            <span>⚔️ THỐNG KÊ LỰC LƯỢNG VÕ PHÁI TRỰC CHIẾN</span>
          </h3>
        </div>
        <span class="text-xs font-mono font-bold text-[#f5c518] bg-[#f5c518]/10 px-2.5 py-1 rounded-lg border border-[#f5c518]/30">
          Tổng: {{ store.totalAssigned }} đệ tử
        </span>
      </div>

      <!-- Donut Chart & Class List Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <!-- Donut Chart -->
        <div class="flex flex-col items-center justify-center p-4 bg-[#050810] border border-[#142033] rounded-xl">
          <div class="relative w-36 h-36 flex items-center justify-center">
            <svg class="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" stroke="#17263c" stroke-width="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#3b82f6"
                stroke-width="8"
                fill="transparent"
                stroke-dasharray="238.76"
                :stroke-dashoffset="dashOffset"
                stroke-linecap="round"
                class="transition-all duration-700 ease-out"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-extrabold text-white tracking-tighter font-mono">
                {{ store.totalAssigned }}
              </span>
              <span class="text-[10px] uppercase tracking-wider text-[#64748b] font-bold font-serif">
                ĐÃ AN VỊ
              </span>
            </div>
          </div>
          <span class="text-xs text-[#94a3b8] font-medium mt-3 font-serif">Tỷ lệ lấp đầy: {{ fillRatio }}%</span>
        </div>

        <!-- Class List -->
        <div class="md:col-span-2 space-y-2">
          <div
            v-for="item in classStatsList"
            :key="item.name"
            class="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-[#0c1424] border border-[#17253b] hover:border-[#3b82f6]/50 transition"
          >
            <div class="flex items-center gap-2.5">
              <img
                v-if="item.icon"
                :src="item.icon"
                :alt="item.name"
                class="w-5 h-5 object-contain shrink-0"
              />
              <span
                v-else
                class="w-2.5 h-2.5 rounded-full shrink-0"
                :style="{ backgroundColor: item.hex, boxShadow: `0 0 6px ${item.hex}` }"
              ></span>
              <span class="text-white font-bold text-xs font-serif">{{ item.name }}</span>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-32 bg-[#050810] h-2 rounded-full overflow-hidden border border-[#1e293b] hidden sm:block">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ width: `${item.percent}%`, backgroundColor: item.hex }"
                ></div>
              </div>
              <span class="font-mono text-xs font-bold text-[#f5c518] bg-[#f5c518]/10 px-2 py-0.5 rounded border border-[#f5c518]/20 min-w-[70px] text-right">
                {{ item.count }} người
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useLineupStore } from '../stores/lineupStore';
import { CLASS_LIST } from '../theme/classColors';

const store = useLineupStore();
const selectedMessageId = ref('');

const currentEventTitle = computed(() => {
  if (!selectedMessageId.value || !store.events) return store.title || 'Công Thành Chiến';
  const found = store.events.find((e) => e.messageId === selectedMessageId.value);
  return found ? (found.name || found.title) : (store.title || 'Công Thành Chiến');
});

const handleEventChange = () => {
  if (selectedMessageId.value) {
    store.fetchEventData(selectedMessageId.value);
  }
};

onMounted(async () => {
  await store.fetchEventsList();

  if (store.events && store.events.length > 0) {
    selectedMessageId.value = store.events[0].messageId;
    store.fetchEventData(selectedMessageId.value);
  }
});

const fillRatio = computed(() => {
  const total = store.totalAttendance || 62;
  const current = store.totalAssigned;
  return Math.round((current / total) * 100);
});

const dashOffset = computed(() => {
  const total = store.totalAttendance || 62;
  const current = store.totalAssigned;
  const ratio = Math.min(current / total, 1);
  const circumference = 238.76;
  return circumference * (1 - ratio);
});

const classStatsList = computed(() => {
  const counts = store.classCounts;
  const total = store.totalAssigned || 1;

  return CLASS_LIST.map((c) => {
    const count = counts[c.name] || 0;
    return {
      name: c.name,
      hex: c.hex,
      icon: c.icon,
      count: count,
      percent: Math.round((count / total) * 100)
    };
  });
});
</script>
