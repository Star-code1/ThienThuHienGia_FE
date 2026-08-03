<template>
  <Transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      @click.self="$emit('cancel')"
    >
      <div class="w-full max-w-[360px] bg-[#0d1017] border border-[#2a3140] rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
        <!-- Vạch vàng trên đầu -->
        <div class="h-1 bg-gradient-to-r from-[#f3d78a] via-[#d4af37] to-[#a8792f]"></div>

        <div class="p-5">
          <div class="flex items-center gap-2 mb-1.5">
            <span class="w-6 h-6 rounded-full bg-[#34d399]/15 border border-[#34d399]/40 flex items-center justify-center text-[#34d399] text-xs font-bold">✓</span>
            <h3 class="font-display text-base text-[#e0b854] tracking-wide">Đã lưu đội hình</h3>
          </div>
          <p class="text-sm text-[#9aa1b0] leading-relaxed mb-4">
            Bạn có muốn chụp lại ảnh đội hình hiện tại để lưu về máy không?
          </p>

          <div class="flex justify-end gap-2">
            <button
              @click="$emit('cancel')"
              :disabled="capturing"
              class="px-3.5 py-1.5 rounded-lg text-sm text-[#9aa1b0] border border-[#2a3140] hover:bg-[#171c26] transition disabled:opacity-50"
            >
              Bỏ qua
            </button>
            <button
              @click="$emit('confirm')"
              :disabled="capturing"
              class="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-b from-[#3a7bd5] to-[#2f63ac] hover:brightness-110 transition disabled:opacity-60 flex items-center gap-1.5"
            >
              <span v-if="capturing" class="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>
              {{ capturing ? 'Đang chụp...' : 'Chụp ảnh' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  capturing: { type: Boolean, default: false }
});
defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
