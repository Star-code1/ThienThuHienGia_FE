<template>
  <div class="space-y-1.5 mt-2">
    <!-- Banner 1: Chú ý Tố Vấn -->
    <div
      class="bg-[#0b0c16]/90 border border-[#a855f7]/40 rounded-md py-1.5 px-4 text-center shadow-[0_0_12px_rgba(168,85,247,0.15)] flex items-center justify-center gap-2 group hover:border-[#a855f7]/70 transition"
    >
      <template v-if="!isEditMode">
        <span class="text-xs font-semibold text-[#c084fc] tracking-wide">
          {{ banner1Text }}
        </span>
      </template>

      <!-- Cho phép nhập tay nội dung Banner 1 khi ở chế độ Edit -->
      <template v-else>
        <input
          v-model="banner1.text"
          placeholder="Nhập ghi chú chiến thuật banner 1..."
          class="w-full bg-[#060a12] text-xs font-semibold text-[#c084fc] text-center px-2 py-0.5 rounded border border-[#a855f7]/50 focus:outline-none focus:border-[#a855f7]"
        />
      </template>
    </div>

    <!-- Banner 2: Trang bị Tank -->
    <div
      class="bg-[#0e0c14]/90 border border-[#eab308]/40 rounded-md py-1.5 px-4 text-center shadow-[0_0_12px_rgba(234,179,8,0.15)] flex items-center justify-center gap-2 group hover:border-[#eab308]/70 transition"
    >
      <template v-if="!isEditMode">
        <span class="text-xs font-semibold text-[#fde047] tracking-wide">
          {{ banner2Text }}
        </span>
      </template>

      <!-- Cho phép nhập tay nội dung Banner 2 khi ở chế độ Edit -->
      <template v-else>
        <input
          v-model="banner2.text"
          placeholder="Nhập ghi chú chiến thuật banner 2..."
          class="w-full bg-[#060a12] text-xs font-semibold text-[#fde047] text-center px-2 py-0.5 rounded border border-[#eab308]/50 focus:outline-none focus:border-[#eab308]"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  banners: { type: Array, default: () => [] },
  isEditMode: { type: Boolean, default: false }
});

const banner1 = computed(() => {
  if (!props.banners[0]) props.banners[0] = { id: 'b1', text: 'Các Tố Vấn mid build trâu nhiều chút nhé' };
  return props.banners[0];
});

const banner2 = computed(() => {
  if (!props.banners[1]) props.banners[1] = { id: 'b2', text: 'Tank cầm Thái Cực Đồ + Như Phong Tự Bế + Phong Tuyết Kinh Đào hoặc Chuông' };
  return props.banners[1];
});

const banner1Text = computed(() => banner1.value?.text || '');
const banner2Text = computed(() => banner2.value?.text || '');
</script>
