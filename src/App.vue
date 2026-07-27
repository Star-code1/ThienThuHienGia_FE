<template>
  <div class="min-h-screen bg-[#0a0d13] text-[#e9e4d8] flex flex-col font-body relative">
    <!-- Ambient glow nền -->
    <div class="pointer-events-none fixed inset-0 opacity-40"
         style="background: radial-gradient(60rem 30rem at 15% -10%, rgba(212,175,55,0.08), transparent), radial-gradient(50rem 30rem at 100% 10%, rgba(77,143,234,0.06), transparent);">
    </div>

    <!-- Header -->
    <header class="relative border-b border-[#232a38] bg-[#0d1017]/90 backdrop-blur px-5 py-4 flex flex-wrap justify-between items-center gap-3">
      <div class="flex items-baseline gap-3">
        <h1 class="font-display text-2xl tracking-wide bg-gradient-to-r from-[#f3d78a] via-[#d4af37] to-[#a8792f] bg-clip-text text-transparent">
          {{ store.title || 'Thiên Thư Hiền Giả' }}
        </h1>
        <span class="text-[11px] uppercase tracking-[0.2em] text-[#6b7280]">Sắp Xếp Đội Hình Chiến</span>
      </div>

      <div class="flex items-center gap-3">
        <!-- Dropdown Chọn Event -->
        <div class="flex items-center gap-2">
          <label for="event-select" class="text-sm text-[#9aa1b0]">Sự kiện</label>
          <select
            id="event-select"
            v-model="selectedMessageId"
            @change="handleEventChange"
            class="bg-[#12161f] border border-[#2a3140] text-[#e0b854] text-sm rounded-lg focus:ring-2 focus:ring-[#d4af37]/50 focus:border-[#d4af37] outline-none cursor-pointer px-3 py-2"
          >
            <option value="" disabled>-- Chọn sự kiện --</option>
            <option
              v-for="event in store.events"
              :key="event.messageId"
              :value="event.messageId"
            >
              {{ event.name || event.title }}
            </option>
          </select>
        </div>

        <!-- Nút Lưu -->
        <button
          @click="handleSave"
          :disabled="isSaving"
          class="bg-gradient-to-b from-[#3a7bd5] to-[#2f63ac] hover:brightness-110 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg shadow-black/30 transition disabled:opacity-60"
        >
          {{ isSaving ? 'Đang lưu...' : 'Lưu Đội Hình' }}
        </button>
      </div>
    </header>

    <!-- Chú giải màu Phái -->
    <div class="relative border-b border-[#1c2129] bg-[#0b0e14] px-5 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 overflow-x-auto">
      <span class="text-[11px] uppercase tracking-[0.15em] text-[#5b6472] mr-1">Phái</span>
      <div v-for="c in CLASS_LIST" :key="c.name" class="flex items-center gap-1.5 shrink-0">
        <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: c.hex, boxShadow: `0 0 6px ${c.hex}` }"></span>
        <span class="text-xs text-[#c7cbd4]">{{ c.name }}</span>
      </div>
    </div>

    <!-- Main Workspace -->
    <div class="relative flex-1 flex p-4 gap-4 overflow-x-auto">
      <!-- Cột Trái: Sidebar Danh sách Điểm Danh (Pool) -->
      <div class="w-64 flex-shrink-0">
        <AttendancePool :pool="store.attendancePool" />
      </div>

      <!-- Cột Phải: Ma trận Đội Hình (Các Đoàn & Team) -->
      <div ref="lineupCaptureRef" class="flex-1 space-y-5 overflow-y-auto pr-2">
        <div
          v-for="(division, dIdx) in store.divisions"
          :key="dIdx"
          class="bg-[#0d1017]/70 border border-[#1e2430] rounded-xl p-4"
        >
          <!-- Tiêu đề Đoàn -->
          <div class="flex items-center gap-3 mb-3">
            <span class="w-1 h-5 rounded bg-gradient-to-b from-[#f3d78a] to-[#a8792f]"></span>
            <span class="font-display text-sm tracking-[0.15em] uppercase text-[#e0b854]">
              {{ division.divisionName }}
            </span>
            <span class="flex-1 h-px bg-[#1e2430]"></span>
            <span class="text-[11px] text-[#5b6472]">{{ division.teams?.length || 0 }} team</span>
          </div>

          <!-- Lưới các Team thuộc Đoàn -->
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <TeamCard
              v-for="(team, tIdx) in division.teams"
              :key="tIdx"
              :team="team"
              @removeSlot="(sIdx) => store.clearSlot(dIdx, tIdx, sIdx)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal hỏi có muốn chụp ảnh đội hình sau khi lưu -->
    <SaveConfirmModal
      :visible="showScreenshotPrompt"
      :capturing="isCapturing"
      @confirm="captureScreenshot"
      @cancel="showScreenshotPrompt = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { toPng } from 'html-to-image';
import { useLineupStore } from './stores/lineupStore';
import AttendancePool from './components/AttendancePool.vue';
import TeamCard from './components/TeamCard.vue';
import SaveConfirmModal from './components/SaveConfirmModal.vue';
import { CLASS_LIST } from './theme/classColors';


const store = useLineupStore();

const selectedMessageId = ref('');
const lineupCaptureRef = ref(null);

const isSaving = ref(false);
const isCapturing = ref(false);
const showScreenshotPrompt = ref(false);

const handleEventChange = () => {
  if (selectedMessageId.value) {
    store.fetchEventData(selectedMessageId.value);
  }
};

// Lưu đội hình, sau đó hỏi người dùng có muốn chụp ảnh lại không
const handleSave = async () => {
  isSaving.value = true;
  try {
    await store.saveCurrentLineup();
    showScreenshotPrompt.value = true;
  } finally {
    isSaving.value = false;
  }
};

// Chụp ảnh khu vực ma trận đội hình và tải về máy dạng PNG

const captureScreenshot = async () => {
  if (!lineupCaptureRef.value) {
    showScreenshotPrompt.value = false;
    return;
  }

  isCapturing.value = true;
  try {
    // Chuyển element thành ảnh PNG với tỷ lệ sắc nét pixelRatio: 2
    const dataUrl = await toPng(lineupCaptureRef.value, {
      backgroundColor: '#0a0d13',
      pixelRatio: 2,
      cacheBust: true,
    });

    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    link.download = `doi-hinh-${timestamp}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Chụp ảnh đội hình thất bại:', err);
  } finally {
    isCapturing.value = false;
    showScreenshotPrompt.value = false;
  }
};

onMounted(async () => {
  await store.fetchEventsList();

  if (store.events && store.events.length > 0) {
    selectedMessageId.value = store.events[0].messageId;
    store.fetchEventData(selectedMessageId.value);
  }
});
</script>

<style>
/* Font: Noto Serif cho tiêu đề (đậm chất "thiên thư"),
   Be Vietnam Pro cho phần chữ nội dung — tối ưu dấu tiếng Việt */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

.font-display { font-family: 'Noto Serif', serif; }
.font-body { font-family: 'Be Vietnam Pro', system-ui, sans-serif; }

/* Thanh cuộn tinh gọn, hợp tông tối */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #2a3140; border-radius: 8px; }
::-webkit-scrollbar-thumb:hover { background: #3a4358; }
</style>