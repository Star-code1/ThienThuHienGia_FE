<template>
  <div class="bg-[#080d17]/85 border border-[#17263c] rounded-lg p-2.5 shadow-xl relative">
    <!-- Header của Division (Khối Nhóm lớn) -->
    <div class="flex justify-between items-center mb-2 px-1 border-b border-[#18263e] pb-1.5 gap-2">
      <!-- Tên Đoàn / Khối -->
      <div class="flex items-center gap-2 flex-1">
        <span class="w-1.5 h-3.5 rounded-sm bg-gradient-to-b from-[#60a5fa] to-[#1d4ed8] shrink-0"></span>
        <template v-if="!isEditMode">
          <h2 class="font-bold text-xs uppercase tracking-wider text-[#93c5fd] font-sans truncate">
            {{ division.divisionName }}
          </h2>
        </template>
        <!-- Cho phép nhập tay Tên Đoàn / Khối khi ở chế độ Edit -->
        <template v-else>
          <input
            v-model="division.divisionName"
            placeholder="Tên khối đoàn..."
            class="flex-1 bg-[#060a12] text-xs font-bold text-[#93c5fd] px-2 py-0.5 rounded border border-[#2a3f63] focus:outline-none focus:border-[#3b82f6]"
          />
        </template>
      </div>

      <!-- Tag Leader Đoàn (Góc phải header) -->
      <div class="shrink-0">
        <template v-if="!isEditMode">
          <span
            v-if="division.leaderTag"
            class="text-[11px] font-medium text-[#94a3b8] tracking-wide hover:text-[#f5c518] transition cursor-pointer"
          >
            {{ division.leaderTag }}
          </span>
        </template>
        <!-- Cho phép nhập tay Tag Leader Đoàn khi ở chế độ Edit -->
        <template v-else>
          <input
            v-model="division.leaderTag"
            placeholder="Tag chỉ huy..."
            class="w-28 bg-[#060a12] text-[11px] text-[#f5c518] px-1.5 py-0.5 rounded border border-[#2a3f63] focus:outline-none focus:border-[#f5c518]"
          />
        </template>
      </div>
    </div>

    <!-- Lưới các Nhóm trong Division -->
    <div class="flex flex-wrap gap-2.5 items-stretch">
      <TacticalGroupCard
        v-for="(team, tIdx) in division.teams"
        :key="tIdx"
        :divisionIndex="divisionIndex"
        :teamIndex="tIdx"
        :team="team"
        :isEditMode="isEditMode"
        @toggleCheck="(sIdx) => $emit('toggleCheck', { tIdx, sIdx })"
        @removeSlot="(sIdx) => $emit('removeSlot', { tIdx, sIdx })"
        @clickSlot="(sIdx) => $emit('clickSlot', { tIdx, sIdx })"
      />
    </div>
  </div>
</template>

<script setup>
import TacticalGroupCard from './TacticalGroupCard.vue';

defineProps({
  divisionIndex: { type: Number, required: true },
  division: { type: Object, required: true },
  isEditMode: { type: Boolean, default: false }
});

defineEmits(['toggleCheck', 'removeSlot', 'clickSlot']);
</script>
