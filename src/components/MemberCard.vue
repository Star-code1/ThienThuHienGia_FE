<template>
  <div class="relative group cursor-pointer pl-3 pr-2 py-2 rounded-lg bg-[#12161f] border border-[#232a38] text-xs flex justify-between items-center gap-2 min-w-0">
    <!-- Vạch màu Phái -->
    <span
      class="absolute left-0 top-1 bottom-1 w-[3px] rounded-full"
      :style="{ backgroundColor: sectColor, boxShadow: `0 0 6px ${sectColor}` }"
    ></span>

    <!-- Tên thành viên -->
    <span class="font-semibold text-[#e9e4d8] truncate">{{ displayName }}</span>

    <!-- Badge roleName: Hiển thị nổi lên phía trên khi hover -->
    <span
      class="pointer-events-none absolute top-auto left-30 opacity-0 group-hover:opacity-100 transition-all duration-200 text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap z-30 shadow-md "
      :style="badgeStyle"
    >
      {{ roleName || 'N/A' }}
    </span>

    <!-- Nút xóa khỏi slot -->
    <button
      v-if="removable"
      @click.stop="$emit('remove')"
      class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#1a1f29] border border-[#2a3140] text-[#ef5757] text-[10px] leading-none flex items-center justify-center hover:bg-[#ef5757]/20 hover:border-[#ef5757]/50 transition z-10"
      title="Xóa khỏi đội hình"
    >
      ✕
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getClassInfo, hexToRgba } from '../theme/classColors';

const props = defineProps({
  displayName: String,
  className: String,
  roleName: String,
  removable: { type: Boolean, default: false }
});
defineEmits(['remove']);

const sectColor = computed(() => getClassInfo(props.className).hex);
const badgeStyle = computed(() => ({
  backgroundColor: hexToRgba(sectColor.value, 0.14),
  color: sectColor.value,
  border: `1px solid ${hexToRgba(sectColor.value, 0.4)}`
}));
</script>