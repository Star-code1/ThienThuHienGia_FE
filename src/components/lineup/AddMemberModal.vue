<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none font-sans"
        @click.self="$emit('close')"
      >
        <div class="bg-[#080d19]/95 border border-[#f5c518]/40 rounded-2xl w-full max-w-md p-5 shadow-[0_0_40px_rgba(245,197,24,0.15)] relative overflow-hidden backdrop-blur-md">
          <!-- Ambient Glow Background -->
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-[#f5c518]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-[#3b82f6]/10 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Modal Header -->
          <div class="flex justify-between items-center pb-3 border-b border-[#1c2c47] mb-4 font-serif">
            <div class="flex items-center gap-2">
              <span class="text-xl">📜</span>
              <div>
                <h3 class="font-extrabold text-base bg-gradient-to-r from-[#fef08a] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent uppercase tracking-wider">
                  THÊM THÀNH VIÊN MỚI
                </h3>
                <span class="text-[10px] text-[#64748b] block font-mono">THÊM ĐỆ TỬ VÀO MA TRẬN ĐỘI HÌNH</span>
              </div>
            </div>
            <button
              @click="$emit('close')"
              class="w-7 h-7 rounded-lg bg-[#0f172a] border border-[#1e293b] text-[#94a3b8] hover:text-white hover:border-[#ef5757] flex items-center justify-center transition text-xs"
            >
              ✕
            </button>
          </div>

          <!-- Form Body -->
          <form @submit.prevent="handleSubmit" class="space-y-4 font-serif">
            <!-- Input Tên Đệ Tử -->
            <div>
              <label class="block text-xs font-bold text-[#e2e8f0] uppercase tracking-wider mb-1">
                Tên Đệ Tử / Biệt Danh <span class="text-[#ef5757]">*</span>
              </label>
              <input
                v-model="form.displayName"
                type="text"
                required
                placeholder="Nhập tên đệ tử..."
                class="w-full bg-[#050912] border border-[#1e293b] text-white text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#f5c518] focus:ring-1 focus:ring-[#f5c518] transition font-serif placeholder-[#475569]"
              />
            </div>

            <!-- Choose Class Grid -->
            <div>
              <label class="block text-xs font-bold text-[#e2e8f0] uppercase tracking-wider mb-1.5">
                Chọn Võ Phái <span class="text-[#ef5757]">*</span>
              </label>
              <div class="grid grid-cols-4 gap-2">
                <button
                  v-for="c in CLASS_LIST"
                  :key="c.name"
                  type="button"
                  @click="form.className = c.name"
                  class="flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center group"
                  :class="form.className === c.name
                    ? 'bg-[#18263e] border-[#f5c518] text-[#f5c518] shadow-[0_0_12px_rgba(245,197,24,0.25)] scale-105'
                    : 'bg-[#060a12]/80 border-[#142033] text-[#94a3b8] hover:border-[#2b4266] hover:text-white'"
                >
                  <img v-if="c.icon" :src="c.icon" :alt="c.name" class="w-6 h-6 object-contain mb-1 group-hover:scale-110 transition-transform" />
                  <span v-else class="w-3 h-3 rounded-full mb-1" :style="{ backgroundColor: c.hex }"></span>
                  <span class="text-[10px] font-bold truncate leading-none">{{ c.name }}</span>
                </button>
              </div>
            </div>

            <!-- Input Note / Vai Trò -->
            <div>
              <label class="block text-xs font-bold text-[#e2e8f0] uppercase tracking-wider mb-1">
                Ghi Chú / Vai Trò (Tùy chọn)
              </label>
              <input
                v-model="form.note"
                type="text"
                placeholder="VD: Tanker, Heal AOE, Tiên Phong..."
                class="w-full bg-[#050912] border border-[#1e293b] text-white text-xs font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:border-[#3b82f6] transition font-serif placeholder-[#475569]"
              />
            </div>

            <!-- Target Location Option if specified -->
            <div v-if="targetSlotInfo" class="bg-[#0f172a] border border-[#1e2a3e] rounded-xl p-2.5 text-xs text-[#94a3b8]">
              <span class="text-[10px] text-[#64748b] block font-bold uppercase">Vị Trí Đích:</span>
              <span class="font-bold text-[#f5c518] block mt-0.5">
                {{ targetSlotInfo.label }}
              </span>
            </div>

            <!-- Form Actions -->
            <div class="pt-3 border-t border-[#18263e] flex items-center justify-end gap-2.5">
              <button
                type="button"
                @click="$emit('close')"
                class="px-4 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-[#94a3b8] hover:text-white text-xs font-semibold border border-[#1e293b] transition"
              >
                Hủy
              </button>

              <button
                type="submit"
                class="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d97706] via-[#f5c518] to-[#b45309] hover:brightness-125 text-slate-950 text-xs font-extrabold shadow-[0_0_15px_rgba(245,197,24,0.3)] transition hover:scale-105"
              >
                ➕ Thêm Thành Viên
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { CLASS_LIST } from '../../theme/classColors';

const props = defineProps({
  visible: { type: Boolean, default: false },
  targetSlotInfo: { type: Object, default: null }
});

const emit = defineEmits(['close', 'add']);

const form = reactive({
  displayName: '',
  className: 'Long Ngâm',
  note: ''
});

watch(() => props.visible, (newVal) => {
  if (newVal) {
    form.displayName = '';
    form.className = 'Long Ngâm';
    form.note = '';
  }
});

const handleSubmit = () => {
  if (!form.displayName.trim()) return;

  emit('add', {
    displayName: form.displayName.trim(),
    className: form.className,
    note: form.note.trim()
  });

  emit('close');
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
