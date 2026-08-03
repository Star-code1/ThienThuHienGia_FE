<template>
  <div class="w-64 shrink-0 flex flex-col gap-2.5 select-none font-sans">


    <!-- Box 1: CHỐT ĐIỂM DANH & THỐNG KÊ PHÁI -->
    <div class="bg-[#080d17]/90 border border-[#17263c] rounded-lg p-3 shadow-lg flex flex-col justify-between">
      <div class="text-[11px] font-bold uppercase tracking-wider text-[#93c5fd] mb-2 border-b border-[#18263e] pb-1">
        {{ panels.rollCall?.title || 'CHỐT ĐIỂM DANH' }}
      </div>

      <!-- Donut Ring Chart SVG -->
      <div class="flex justify-center my-2 relative">
        <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
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
          <span class="text-xl font-extrabold text-white tracking-tighter">
            {{ store.totalAssigned }}
          </span>
          <span class="text-[9px] uppercase tracking-wider text-[#64748b] font-semibold">
            ĐÃ XẾP
          </span>
        </div>
      </div>

      <!-- Danh sách thống kê số lượng từng Phái (Không giới hạn chỉ tiêu) -->
      <div class="space-y-1.5 my-2">
        <div
          v-for="item in classStatsList"
          :key="item.name"
          class="flex items-center justify-between text-xs py-0.5 border-b border-[#111c2e]"
        >
          <div class="flex items-center gap-1.5">
            <img
              v-if="item.icon"
              :src="item.icon"
              :alt="item.name"
              class="w-4 h-4 object-contain shrink-0"
            />
            <span
              v-else
              class="w-2 h-2 rounded-full shrink-0"
              :style="{ backgroundColor: item.hex, boxShadow: `0 0 6px ${item.hex}` }"
            ></span>
            <span class="text-[#cbd5e1] font-medium text-[11px]">{{ item.name }}</span>
          </div>

          <!-- Hiển thị trực tiếp số lượng người thuộc phái trong đội hình -->
          <span class="font-mono text-[11px] font-bold text-[#f5c518] bg-[#f5c518]/10 px-1.5 py-0.2 rounded border border-[#f5c518]/20">
            {{ item.count }} người
          </span>
        </div>
      </div>

      <!-- Footer tổng quan Điểm Danh & Báo Bận -->
      <div class="pt-2 mt-1 border-t border-[#18263e] space-y-1 text-xs font-medium text-[#94a3b8]">
        <div class="flex justify-between items-center">
          <span class="text-[11px]">Điểm Danh</span>
          <span class="font-mono text-[#f5c518] font-bold">
            {{ store.totalAssigned }} / {{ store.totalAttendance || 62 }}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-[11px]">Báo Bận</span>
          <span class="font-mono text-[#ef5757] font-bold">
            {{ panels.rollCall?.totalBusy || 9 }} người
          </span>
        </div>
      </div>
    </div>

    <!-- Box 2: RỪNG 1 (TRÁI) -->
    <div
      class="bg-[#080d17]/90 border border-[#17263c] rounded-lg p-2.5 shadow-lg relative transition-all"
      :class="{ 'ring-2 ring-blue-500 bg-[#3b82f6]/10': isEditMode && dragOverRung === 'rung1' }"
      @dragover.prevent="dragOverRung = 'rung1'"
      @dragleave="dragOverRung = null"
      @drop="onDropToRung($event, 'rung1')"
    >
      <div class="text-[11px] font-bold uppercase tracking-wider text-[#ef5757] mb-2 border-b border-[#18263e] pb-1 flex justify-between items-center">
        <template v-if="!isEditMode">
          <span>{{ panels.rung1?.title || 'RỪNG 1 (TRÁI)' }}</span>
        </template>
        <template v-else>
          <input
            v-model="panels.rung1.title"
            placeholder="Tiêu đề Rừng 1..."
            class="bg-[#060a12] text-[11px] font-bold text-[#ef5757] px-1 py-0.5 rounded border border-[#2a3f63] w-full"
          />
        </template>
      </div>

      <!-- Thẻ Trưởng Rừng 1 -->
      <div
        :draggable="isEditMode && !!panels.rung1?.userId"
        @dragstart="onDragLeaderStart($event, panels.rung1, 'rung1')"
        class="bg-[#0e1626]/80 border border-[#1e2e4a] rounded p-2 flex items-center gap-2.5 transition relative group"
        :class="{
          'cursor-grab active:cursor-grabbing hover:border-[#3b82f6]': isEditMode && !!panels.rung1?.userId,
          'border-dashed border-[#3b82f6]/40': isEditMode && !panels.rung1?.userId
        }"
      >
        <div class="relative shrink-0">
          <div class="w-8 h-8 rounded-full bg-[#182740] border border-[#3b82f6]/50 flex items-center justify-center text-xs font-bold text-[#60a5fa]">
            <img
              v-if="getLeaderIcon(panels.rung1?.class)"
              :src="getLeaderIcon(panels.rung1?.class)"
              class="w-6 h-6 object-contain"
            />
            <span v-else>{{ panels.rung1?.leaderName?.charAt(0) || 'B' }}</span>
          </div>
          <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#5865F2] rounded-full flex items-center justify-center text-[8px] text-white">
            💬
          </span>
        </div>

        <div class="flex-1 min-w-0">
          <template v-if="panels.rung1?.leaderName">
            <div class="text-xs font-bold text-[#ef5757] truncate flex items-center gap-1">
              {{ panels.rung1.leaderName }}
            </div>
            <div class="text-[10px] text-[#64748b] truncate mt-0.5">
              {{ panels.rung1.subTag || 'Trưởng Rừng 1' }}
            </div>
          </template>

          <template v-else>
            <div class="text-[11px] text-[#475569] italic">
              + Kéo thành viên thả vào làm Trưởng Rừng 1
            </div>
          </template>
        </div>

        <button
          v-if="isEditMode && panels.rung1?.userId"
          @click.stop="store.clearRung('rung1')"
          class="opacity-0 group-hover:opacity-100 w-4 h-4 rounded bg-[#ef5757]/20 border border-[#ef5757]/50 text-[#ef5757] text-[10px] flex items-center justify-center hover:bg-[#ef5757] hover:text-white transition"
          title="Xóa khỏi Trưởng Rừng 1"
        >
          ✕
        </button>
      </div>
    </div>

        <!-- Box 3: RỪNG 2 (PHẢI) -->
    <div
      class="bg-[#080d17]/90 border border-[#17263c] rounded-lg p-2.5 shadow-lg relative transition-all"
      :class="{ 'ring-2 ring-blue-500 bg-[#3b82f6]/10': isEditMode && dragOverRung === 'rung2' }"
      @dragover.prevent="dragOverRung = 'rung2'"
      @dragleave="dragOverRung = null"
      @drop="onDropToRung($event, 'rung2')"
    >
      <div class="text-[11px] font-bold uppercase tracking-wider text-[#ef5757] mb-2 border-b border-[#18263e] pb-1 flex justify-between items-center">
        <template v-if="!isEditMode">
          <span>{{ panels.rung2?.title || 'RỪNG 2 (PHẢI)' }}</span>
        </template>
        <template v-else>
          <input
            v-model="panels.rung2.title"
            placeholder="Tiêu đề Rừng 2..."
            class="bg-[#060a12] text-[11px] font-bold text-[#60a5fa] px-1 py-0.5 rounded border border-[#2a3f63] w-full"
          />
        </template>
      </div>

      <!-- Thẻ Trưởng Rừng 2 -->
      <div
        :draggable="isEditMode && !!panels.rung2?.userId"
        @dragstart="onDragLeaderStart($event, panels.rung2, 'rung2')"
        class="bg-[#0e1626]/80 border border-[#1e2e4a] rounded p-2 flex items-center gap-2.5 transition relative group"
        :class="{
          'cursor-grab active:cursor-grabbing hover:border-[#3b82f6]': isEditMode && !!panels.rung2?.userId,
          'border-dashed border-[#3b82f6]/40': isEditMode && !panels.rung2?.userId
        }"
      >
        <div class="relative shrink-0">
          <div class="w-8 h-8 rounded-full bg-[#182740] border border-[#3b82f6]/50 flex items-center justify-center text-xs font-bold text-[#60a5fa]">
            <img
              v-if="getLeaderIcon(panels.rung2?.class)"
              :src="getLeaderIcon(panels.rung2?.class)"
              class="w-6 h-6 object-contain"
            />
            <span v-else>{{ panels.rung2?.leaderName?.charAt(0) || 'T' }}</span>
          </div>
          <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#5865F2] rounded-full flex items-center justify-center text-[8px] text-white">
            💬
          </span>
        </div>

        <div class="flex-1 min-w-0">
          <template v-if="panels.rung2?.leaderName">
            <div class="text-xs font-bold text-[#ef5757] truncate flex items-center gap-1">
              {{ panels.rung2.leaderName }}
            </div>
            <div class="text-[10px] text-[#64748b] truncate mt-0.5">
              {{ panels.rung2.subTag || 'Trưởng Rừng 2' }}
            </div>
          </template>

          <template v-else>
            <div class="text-[11px] text-[#475569] italic">
              + Kéo thành viên thả vào làm Trưởng Rừng 2
            </div>
          </template>
        </div>

        <button
          v-if="isEditMode && panels.rung2?.userId"
          @click.stop="store.clearRung('rung2')"
          class="opacity-0 group-hover:opacity-100 w-4 h-4 rounded bg-[#ef5757]/20 border border-[#ef5757]/50 text-[#ef5757] text-[10px] flex items-center justify-center hover:bg-[#ef5757] hover:text-white transition"
          title="Xóa khỏi Trưởng Rừng 2"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Box 4: LƯU Ý & CHIẾN THUẬT -->
    <div class="bg-[#080d17]/90 border border-[#17263c] rounded-lg p-3 shadow-lg">
      <div class="text-[11px] font-bold uppercase tracking-wider text-[#93c5fd] mb-2 border-b border-[#18263e] pb-1 flex justify-between items-center">
        <span>{{ panels.tactics?.title || 'LƯU Ý & CHIẾN THUẬT' }}</span>
        <button
          v-if="isEditMode"
          @click="addNote"
          class="text-[10px] bg-[#3b82f6]/20 text-[#60a5fa] px-1.5 py-0.5 rounded hover:bg-[#3b82f6] hover:text-white"
        >
          + Thêm
        </button>
      </div>

      <ul class="space-y-2 text-[11px] text-[#cbd5e1] leading-relaxed">
        <li v-for="(note, idx) in panels.tactics?.notes" :key="idx" class="flex items-start gap-1.5 group">
          <span class="text-[#3b82f6] shrink-0 font-bold mt-0.5">-</span>
          <template v-if="!isEditMode">
            <span class="flex-1">{{ note }}</span>
          </template>
          <template v-else>
            <input
              v-model="panels.tactics.notes[idx]"
              class="flex-1 bg-[#060a12] text-[11px] text-[#cbd5e1] px-1 py-0.5 rounded border border-[#2a3f63]"
            />
            <button
              @click="store.removeTacticNote(idx)"
              class="text-[#ef5757] hover:text-white px-1 text-xs"
              title="Xóa dòng này"
            >
              ✕
            </button>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useLineupStore } from '../stores/lineupStore';
import { CLASS_LIST, getClassIcon } from '../theme/classColors';

const props = defineProps({
  panels: { type: Object, default: () => ({}) },
  isEditMode: { type: Boolean, default: false }
});

const store = useLineupStore();
const dragOverRung = ref(null);

const onDragLeaderStart = (evt, leaderObj, key) => {
  if (!leaderObj || !leaderObj.userId) return;
  const payload = {
    source: 'leader',
    leader: {
      userId: leaderObj.userId,
      displayName: leaderObj.leaderName,
      className: leaderObj.class || 'Huyết Hà',
      roleName: leaderObj.subTag || 'Leader',
      note: leaderObj.subTag || 'Leader',
    }
  };
  evt.dataTransfer.setData('application/json', JSON.stringify(payload));
};

const onDropToRung = (evt, rungKey) => {
  dragOverRung.value = null;
  try {
    const raw = evt.dataTransfer.getData('application/json');
    if (!raw) return;
    const data = JSON.parse(raw);

    if (data.source === 'pool') {
      store.assignToRungFromPool({ rungKey, member: data.member });
    } else if (data.source === 'slot') {
      store.assignToRungFromSlot({ rungKey, srcDIdx: data.dIdx, srcTIdx: data.tIdx, srcSIdx: data.sIdx });
    }
  } catch (e) {
    console.error('Lỗi khi thả vào Trưởng Rừng:', e);
  }
};

const getLeaderIcon = (cName) => getClassIcon(cName);

const addNote = () => {
  store.addTacticNote('Ghi chú chiến thuật mới...');
};

const classStatsList = computed(() => {
  const counts = store.classCounts;

  return CLASS_LIST.map((c) => ({
    name: c.name,
    hex: c.hex,
    icon: c.icon,
    count: counts[c.name] || 0,
  }));
});

const dashOffset = computed(() => {
  const total = store.totalAttendance || 62;
  const current = store.totalAssigned;
  const ratio = Math.min(current / total, 1);
  const circumference = 238.76;
  return circumference * (1 - ratio);
});
</script>
