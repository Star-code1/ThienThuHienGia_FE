<template>
  <div
    class="relative group py-1 px-1.5 flex items-center gap-2 border-b border-dashed border-[#1a273b] hover:bg-[#142033]/60 transition cursor-pointer select-none"
    @click="onRowClick"
  >
    <!-- Checkbox tích chọn -->
    <div
      class="w-3.5 h-3.5 rounded-sm border border-[#2e405e] bg-[#0c1322] flex items-center justify-center shrink-0 transition"
      :class="{ 'border-[#3b82f6] bg-[#1d4ed8]/30 text-[#60a5fa]': slot.isChecked }"
    >
      <svg v-if="slot.isChecked" class="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
      </svg>
    </div>

    <!-- Icon Phái từ thư mục assets -->
    <div class="relative shrink-0 flex items-center justify-center">
      <img
        v-if="classInfo.icon"
        :src="classInfo.icon"
        :alt="classInfo.name"
        class="w-5 h-5 object-contain shrink-0 drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]"
      />
      <div
        v-else
        class="w-5 h-5 rounded-full bg-[#18263a] border flex items-center justify-center text-[9px] font-bold"
        :style="{ borderColor: classInfo.hex, color: classInfo.hex, backgroundColor: `${classInfo.hex}15` }"
      >
        {{ classInfo.short || '?' }}
      </div>
    </div>

    <!-- Tên & Chú thích (Note viết chay) -->
    <div class="flex-1 min-w-0 flex flex-col justify-center">
      <div class="flex items-center gap-1 min-w-0">
        <!-- Tên người chơi -->
        <span
          class="text-xs font-medium truncate leading-tight tracking-wide"
          :style="{ color: nameColor }"
        >
          {{ slot.displayName || slot.username || '-- Cần xếp --' }}
        </span>
      </div>

      <!-- Note viết chay dưới tên: Cho phép sửa khi bật chế độ Edit -->
      <div class="mt-0.5" @click.stop>
        <input
          v-if="isEditMode && slot.userId"
          v-model="slot.note"
          placeholder="Viết note..."
          class="w-full bg-[#090d16] text-[#cbd5e1] placeholder-[#475569] text-[10px] px-1 py-0.5 rounded border border-[#1e293b] focus:outline-none focus:border-[#3b82f6]"
        />
        <span
          v-else-if="slot.note"
          class="text-[10px] text-[#94a3b8] leading-tight truncate font-sans block"
        >
          {{ slot.note }}
        </span>
      </div>
    </div>

    <!-- Nút xóa slot khi ở chế độ Edit -->
    <button
      v-if="isEditMode && slot.userId"
      @click.stop="$emit('remove')"
      class="opacity-0 group-hover:opacity-100 w-4 h-4 rounded bg-[#ef5757]/20 border border-[#ef5757]/50 text-[#ef5757] text-[10px] flex items-center justify-center hover:bg-[#ef5757] hover:text-white transition shrink-0"
      title="Xóa khỏi slot"
    >
      ✕
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getClassInfo } from '../theme/classColors';

const props = defineProps({
  slot: { type: Object, required: true },
  isEditMode: { type: Boolean, default: false }
});

const emit = defineEmits(['toggleCheck', 'remove', 'clickSlot']);

const classInfo = computed(() => {
  const cName = props.slot.className || props.slot.class || '';
  return getClassInfo(cName);
});

const nameColor = computed(() => {
  if (!props.slot.displayName && !props.slot.username) return '#475569';
  return classInfo.value.hex || '#e2e8f0';
});

const onRowClick = () => {
  if (props.isEditMode) {
    emit('clickSlot', props.slot);
  } else {
    emit('toggleCheck', props.slot);
  }
};
</script>
