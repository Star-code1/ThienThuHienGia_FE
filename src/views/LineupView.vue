<template>
  <div class="flex-1 flex flex-col min-h-[calc(100vh-57px)] font-sans relative overflow-x-auto selection:bg-[#3b82f6]/30">
    <!-- Sub-header Toolbar cho Lineup -->
    <div class="relative z-20 border-b border-[#172439] bg-[#070c18]/90 backdrop-blur px-4 py-2 flex flex-wrap justify-between items-center gap-3">
      <div class="flex items-center gap-3">
        <span class="text-lg">📜</span>
        <div>
          <h2 class="font-bold text-sm text-[#f5c518] uppercase tracking-wider font-serif">
            Ma Trận Sơ Đồ Bang Chiến
          </h2>
          <span class="text-[10px] text-[#64748b] font-mono">
            {{ store.title || 'Thiên Thư Hiền Giả' }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2.5">
        <!-- Mode Toggle Switch (Ma Trận / Chỉnh Sửa) -->
        <button
          @click="store.toggleViewMode()"
          class="text-xs px-3 py-1.5 rounded-md font-semibold transition border flex items-center gap-1.5"
          :class="store.viewMode === 'edit'
            ? 'bg-[#f5c518]/15 border-[#f5c518] text-[#f5c518]'
            : 'bg-[#1e293b] border-[#334155] text-[#94a3b8] hover:text-white'"
        >
          <span>{{ store.viewMode === 'edit' ? '✏️ Đang Sửa' : '👁️ Xem Chuẩn' }}</span>
        </button>

        <!-- Dropdown Chọn Event -->
        <div class="flex items-center gap-1.5">
          <select
            id="event-select"
            v-model="selectedMessageId"
            @change="handleEventChange"
            class="bg-[#0f172a] border border-[#1e293b] text-[#f5c518] text-xs rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-[#f5c518] outline-none cursor-pointer"
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

        <!-- Nút Xuất Ảnh PNG -->
        <button
          @click="captureScreenshot"
          :disabled="isCapturing"
          class="bg-[#1e293b] hover:bg-[#334155] border border-[#475569] text-white text-xs font-semibold px-3 py-1.5 rounded-md transition flex items-center gap-1 disabled:opacity-50"
        >
          <span>📷</span>
          <span>{{ isCapturing ? 'Đang Xuất...' : 'Xuất Ảnh' }}</span>
        </button>

        <!-- Nút Lưu Đội Hình -->
        <button
          @click="handleSave"
          :disabled="isSaving"
          class="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:brightness-110 text-white text-xs font-bold px-4 py-1.5 rounded-md shadow-md shadow-blue-900/40 transition disabled:opacity-60"
        >
          {{ isSaving ? 'Đang Lưu...' : '💾 Lưu Sơ Đồ' }}
        </button>
      </div>
    </div>

    <!-- Thanh Legend Phái -->
    <div class="relative z-10 border-b border-[#111c2e] bg-[#050810] px-4 py-1.5 flex items-center gap-4 overflow-x-auto">
      <span class="text-[10px] uppercase font-bold tracking-widest text-[#475569] shrink-0">Bát Đại Phái</span>
      <div v-for="c in CLASS_LIST" :key="c.name" class="flex items-center gap-1.5 shrink-0">
        <img v-if="c.icon" :src="c.icon" :alt="c.name" class="w-4 h-4 object-contain shrink-0" />
        <span v-else class="w-2 h-2 rounded-full" :style="{ backgroundColor: c.hex, boxShadow: `0 0 6px ${c.hex}` }"></span>
        <span class="text-xs text-[#cbd5e1] font-medium">{{ c.name }}</span>
      </div>
    </div>

    <!-- Workspace Khu vực Ma trận Đội hình chính -->
    <div class="relative z-10 flex-1 p-3 flex gap-3 overflow-x-auto">
      <!-- Cột Trái Drawer Pool khi ở chế độ Edit -->
      <div v-if="store.viewMode === 'edit'" class="w-60 shrink-0 transition-all">
        <AttendancePool :pool="store.attendancePool" />
      </div>

      <!-- Khối Ma Trận Tổng (Captured khi Xuất Ảnh PNG) -->
      <div
        ref="lineupCaptureRef"
        class="flex-1 bg-[#060a12] p-3 rounded-lg border border-[#131f33] flex flex-col md:flex-row gap-3 items-start min-w-[1050px]"
      >
        <!-- Cột Trái & Giữa: Các Division (MID, TRANG 1) + Băng rôn chiến thuật -->
        <div class="flex-1 flex flex-col justify-start gap-2.5 w-full">
          <!-- Top Row Division: NHÓM 6 - 7 - 8 - 9 - 10 MID (TRANG 2) -->
          <TacticalDivisionBox
            v-if="divMid"
            :divisionIndex="0"
            :division="divMid"
            :isEditMode="store.viewMode === 'edit'"
            @toggleCheck="({ tIdx, sIdx }) => store.toggleSlotCheck(0, tIdx, sIdx)"
            @removeSlot="({ tIdx, sIdx }) => store.clearSlot(0, tIdx, sIdx)"
          />

          <!-- Bottom Row Divisions: NHÓM 4 - 5 & NHÓM 1 - 2 - 3 -->
          <div class="flex flex-col xl:flex-row gap-2.5 items-stretch">
            <div class="flex-1">
              <TacticalDivisionBox
                v-if="divBotLeft"
                :divisionIndex="1"
                :division="divBotLeft"
                :isEditMode="store.viewMode === 'edit'"
                @toggleCheck="({ tIdx, sIdx }) => store.toggleSlotCheck(1, tIdx, sIdx)"
                @removeSlot="({ tIdx, sIdx }) => store.clearSlot(1, tIdx, sIdx)"
              />
            </div>

            <div class="flex-[1.4]">
              <TacticalDivisionBox
                v-if="divBotMid"
                :divisionIndex="2"
                :division="divBotMid"
                :isEditMode="store.viewMode === 'edit'"
                @toggleCheck="({ tIdx, sIdx }) => store.toggleSlotCheck(2, tIdx, sIdx)"
                @removeSlot="({ tIdx, sIdx }) => store.clearSlot(2, tIdx, sIdx)"
              />
            </div>
          </div>

          <!-- Dual Strategy Banners tại đáy khu vực giữa -->
          <TacticalBanners
            :banners="store.bannerNotes"
            :isEditMode="store.viewMode === 'edit'"
          />
        </div>

        <!-- Cột Phải: Panel Rừng 1, Rừng 2, Chốt Điểm Danh, Lưu Ý & Chiến Thuật -->
        <RightTacticalPanels
          :panels="store.rightPanels"
          :isEditMode="store.viewMode === 'edit'"
        />
      </div>
    </div>

    <!-- Modal confirm chụp ảnh -->
    <SaveConfirmModal
      :visible="showScreenshotPrompt"
      :capturing="isCapturing"
      @confirm="captureScreenshot"
      @cancel="showScreenshotPrompt = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { toPng } from 'html-to-image';
import { useLineupStore } from '../stores/lineupStore';
import AttendancePool from '../components/lineup/AttendancePool.vue';
import TacticalDivisionBox from '../components/lineup/TacticalDivisionBox.vue';
import TacticalBanners from '../components/lineup/TacticalBanners.vue';
import RightTacticalPanels from '../components/lineup/RightTacticalPanels.vue';
import SaveConfirmModal from '../components/lineup/SaveConfirmModal.vue';
import { CLASS_LIST } from '../theme/classColors';

const store = useLineupStore();

const selectedMessageId = ref('');
const lineupCaptureRef = ref(null);

const isSaving = ref(false);
const isCapturing = ref(false);
const showScreenshotPrompt = ref(false);

const divMid = computed(() => store.divisions[0]);
const divBotLeft = computed(() => store.divisions[1]);
const divBotMid = computed(() => store.divisions[2]);

const handleEventChange = () => {
  if (selectedMessageId.value) {
    store.fetchEventData(selectedMessageId.value);
  }
};

const handleSave = async () => {
  isSaving.value = true;
  try {
    await store.saveCurrentLineup();
    showScreenshotPrompt.value = true;
  } finally {
    isSaving.value = false;
  }
};

const captureScreenshot = async () => {
  if (!lineupCaptureRef.value) {
    showScreenshotPrompt.value = false;
    return;
  }

  isCapturing.value = true;
  try {
    const dataUrl = await toPng(lineupCaptureRef.value, {
      backgroundColor: '#060a12',
      pixelRatio: 2,
      cacheBust: true,
    });

    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    link.download = `so-do-bang-chien-${timestamp}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Lỗi khi xuất ảnh PNG:', err);
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
