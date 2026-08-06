<template>
  <Teleport to="body">
    <!-- Backdrop Overlay -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity"
        @click="$emit('close')"
      ></div>
    </Transition>

    <!-- Slide-out Drawer Box -->
    <Transition :name="drawerPosition === 'left' ? 'slide-left' : 'slide-right'">
      <div
        v-if="isOpen"
        class="fixed top-0 bottom-0 z-50 w-80 bg-[#080d19]/95 border-[#1b2b46] shadow-2xl flex flex-col justify-between select-none font-sans"
        :class="[
          drawerPosition === 'left' ? 'left-0 border-r' : 'right-0 border-l'
        ]"
      >
        <!-- Header Menu -->
        <div class="p-5 border-b border-[#18263e] flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5c518]/20 to-[#b45309]/30 border border-[#f5c518]/40 flex items-center justify-center text-xl shadow-[0_0_12px_rgba(245,197,24,0.2)]">
              📜
            </div>
            <div>
              <h2 class="font-bold text-base bg-gradient-to-r from-[#fef08a] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent uppercase tracking-wider font-serif">
                THIÊN THƯ MÔN
              </h2>
              <span class="text-[10px] uppercase tracking-widest text-[#64748b] block font-mono">
                THIÊN THƯ QUYẾT BẢNG
              </span>
            </div>
          </div>

          <button
            @click="$emit('close')"
            class="w-8 h-8 rounded-lg bg-[#0f172a] border border-[#1e293b] text-[#94a3b8] hover:text-white hover:border-[#3b82f6] flex items-center justify-center transition"
            title="Đóng Menu"
          >
            ✕
          </button>
        </div>

        <!-- Position & Theme Settings Bar -->
        <div class="px-5 py-2.5 bg-[#050810] border-b border-[#131f33] flex flex-col gap-2 text-xs text-[#94a3b8] font-serif">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-[#64748b]">Vị trí Bảng:</span>
            <div class="flex bg-[#0f172a] p-0.5 rounded-lg border border-[#1e293b]">
              <button
                @click="setDrawerPosition('left')"
                class="px-2 py-0.5 text-[10px] rounded font-semibold transition cursor-pointer"
                :class="drawerPosition === 'left' ? 'bg-[#3b82f6] text-white shadow' : 'text-[#64748b] hover:text-white'"
              >
                ⬅️ Trái
              </button>
              <button
                @click="setDrawerPosition('right')"
                class="px-2 py-0.5 text-[10px] rounded font-semibold transition cursor-pointer"
                :class="drawerPosition === 'right' ? 'bg-[#3b82f6] text-white shadow' : 'text-[#64748b] hover:text-white'"
              >
                Phải ➡️
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between pt-1.5 border-t border-[#131f33]/60">
            <span class="text-[11px] font-medium text-[#64748b]">Giao Diện:</span>
            <div class="flex bg-[#0f172a] p-0.5 rounded-lg border border-[#1e293b]">
              <button
                @click="themeStore.setTheme('dark')"
                class="px-2 py-0.5 text-[10px] rounded font-semibold transition flex items-center gap-1 cursor-pointer"
                :class="themeStore.theme === 'dark' ? 'bg-[#f5c518]/20 text-[#f5c518] border border-[#f5c518]/40 shadow' : 'text-[#64748b] hover:text-white'"
              >
                🌙 Tối (Dạ)
              </button>
              <button
                @click="themeStore.setTheme('light')"
                class="px-2 py-0.5 text-[10px] rounded font-semibold transition flex items-center gap-1 cursor-pointer"
                :class="themeStore.theme === 'light' ? 'bg-amber-500 text-white shadow' : 'text-[#64748b] hover:text-white'"
              >
                ☀️ Sáng (Nhật)
              </button>
            </div>
          </div>
        </div>

        <!-- Menu Links -->
        <nav class="p-4 space-y-2 overflow-y-auto flex-1 font-serif">
          <RouterLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            @click="$emit('close')"
            class="group relative flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all border font-medium text-sm overflow-hidden"
            :class="[
              isActive(item.path)
                ? 'bg-gradient-to-r from-[#1d4ed8]/30 to-[#3b82f6]/10 border-[#3b82f6] text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                : 'bg-[#0a101d]/60 border-[#142033] text-[#94a3b8] hover:text-white hover:border-[#2b4166] hover:bg-[#101a2d]'
            ]"
          >
            <!-- Highlight indicator line -->
            <span
              v-if="isActive(item.path)"
              class="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#3b82f6] shadow-[0_0_8px_#3b82f6]"
            ></span>

            <span class="text-xl shrink-0 transition-transform group-hover:scale-110">
              {{ item.icon }}
            </span>

            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm tracking-wide" :class="isActive(item.path) ? 'text-white' : 'text-[#e2e8f0]'">
                  {{ item.name }}
                </span>
                <span v-if="item.badge" class="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#f5c518]/20 text-[#f5c518] border border-[#f5c518]/30">
                  {{ item.badge }}
                </span>
              </div>
              <span class="text-[11px] text-[#64748b] truncate block mt-0.5 group-hover:text-[#94a3b8] transition">
                {{ item.desc }}
              </span>
            </div>
          </RouterLink>
        </nav>

        <!-- Footer Drawer Auth / User Profile -->
        <div class="p-4 border-t border-[#18263e] bg-[#050912] space-y-3 font-serif">
          <div v-if="authStore.isAuthenticated" class="bg-[#0b1220] border border-[#1a2942] rounded-xl p-3 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <img :src="authStore.user?.avatar" :alt="authStore.user?.username" class="w-9 h-9 rounded-lg object-cover border border-[#f5c518]/50" />
                <div>
                  <span class="text-xs font-bold text-white block max-w-[120px] truncate">
                    {{ authStore.user?.nickname || authStore.user?.username }}
                  </span>
                  <span class="text-[10px] text-[#34d399] font-medium block">
                    {{ authStore.user?.className || 'Bang Chúng' }}
                  </span>
                </div>
              </div>

              <RouterLink
                to="/profile"
                @click="$emit('close')"
                class="px-2.5 py-1 bg-[#16233b] hover:bg-[#253956] text-[#38bdf8] border border-[#233859] rounded-lg text-[10px] font-bold transition"
              >
                Hồ Sơ
              </RouterLink>
            </div>

            <div class="flex items-center justify-between text-[11px] pt-1 border-t border-[#142033]">
              <span class="text-[#64748b]">Chức Vị Thẩm Quyền:</span>
              <span
                class="font-bold"
                :class="{
                  'text-[#f5c518]': authStore.user?.primaryRole === 'Đương Gia',
                  'text-[#38bdf8]': authStore.user?.primaryRole === 'Đường Chủ',
                  'text-[#94a3b8]': authStore.user?.primaryRole === 'Bang Chúng'
                }"
              >
                {{ authStore.user?.primaryRole || (authStore.canEdit ? 'Đương Gia' : 'Bang Chúng') }}
              </span>
            </div>
          </div>

          <button
            v-else
            @click="authStore.loginWithDiscord()"
            class="w-full py-2.5 bg-gradient-to-r from-[#5865F2] to-[#404EED] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(88,101,242,0.3)] hover:brightness-110"
          >
            <span>👾</span>
            <span>Quy Nhập Discord</span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';

const props = defineProps({
  isOpen: { type: Boolean, default: false }
});

defineEmits(['close']);

const route = useRoute();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const drawerPosition = ref(localStorage.getItem('ttm_drawer_pos') || 'left');

const setDrawerPosition = (pos) => {
  drawerPosition.value = pos;
  localStorage.setItem('ttm_drawer_pos', pos);
};

const menuItems = [
  {
    name: 'Trang Chủ',
    path: '/',
    icon: '🏠',
    desc: 'Tổng quan môn phái',
    badge: null
  },
  {
    name: 'Tiên Môn Hồ Sơ',
    path: '/profile',
    icon: '👤',
    desc: 'Thông tin đệ tử & Võ phái',
    badge: null
  },
  {
    name: 'Thiên Thư Trận Phái',
    path: '/lineup',
    icon: '📜',
    desc: 'Ma trận xếp đội hình tác chiến',
    badge: 'HOT'
  },
  {
    name: 'Công Thành Chiến Kỳ',
    path: '/schedule',
    icon: '⚔️',
    desc: 'Thời gian ấn định xuất trận',
    badge: null
  },
  {
    name: 'Dữ Liệu Trận Đấu',
    path: '/match-analysis',
    icon: '📊',
    desc: 'Lưu trữ hình ảnh & rút kinh nghiệm sai sót',
    badge: 'MỚI'
  },
  {
    name: 'Trị Bang Hiền Giả',
    path: '/roster',
    icon: '👥',
    desc: 'Ghi danh võ phái đệ tử',
    badge: null
  },
  {
    name: 'Uy Danh Thống Kê',
    path: '/stats',
    icon: '📊',
    desc: 'Uy danh điểm danh & báo bận',
    badge: null
  }
];

const isActive = (path) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-left-enter-active, .slide-left-leave-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-left-enter-from, .slide-left-leave-to { transform: translateX(-100%); }

.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }
</style>
