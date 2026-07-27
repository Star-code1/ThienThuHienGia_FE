<template>
  <div class="relative pl-3 pr-2 py-2 rounded-lg bg-[#12161f] border border-[#232a38] text-xs flex justify-between items-center gap-2 min-w-0">
    <!-- Vạch màu Phái -->
    <span
      class="absolute left-0 top-1 bottom-1 w-[3px] rounded-full"
      :style="{ backgroundColor: sectColor, boxShadow: `0 0 6px ${sectColor}` }"
    ></span>

    <span class="font-semibold text-[#e9e4d8] truncate">{{ displayName }}</span>

    <!-- <span
      class="text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap"
      :style="badgeStyle"
    >
      {{ className || 'N/A' }}
    </span> -->

    <!-- Nút xóa khỏi slot (chỉ hiện khi cho phép) -->
    <button
      v-if="removable"
      @click.stop="$emit('remove')"
      class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#1a1f29] border border-[#2a3140] text-[#ef5757] text-[10px] leading-none flex items-center justify-center hover:bg-[#ef5757]/20 hover:border-[#ef5757]/50 transition"
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