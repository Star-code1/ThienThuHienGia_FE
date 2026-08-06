<template>
  <header class="relative z-30 border-b border-[#172439] bg-[#090f1d]/90 backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-4 font-sans select-none">
    <!-- Left Section: Menu Toggle + Brand Logo -->
    <div class="flex items-center gap-3">
      <!-- Menu Button -->
      <button
        @click="$emit('toggleMenu')"
        class="bg-[#121c2d] hover:bg-[#1d2d48] border border-[#233758] text-[#f5c518] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm group font-serif"
        title="Mở Bảng Chức Năng Tiên Môn"
      >
        <span class="text-base group-hover:scale-110 transition-transform">☰</span>
        <span class="hidden sm:inline uppercase tracking-wider text-[11px]">Bảng Chức Năng</span>
      </button>

      <!-- Brand Logo & Title -->
      <RouterLink to="/" class="flex items-center gap-2.5 group">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f5c518]/20 to-[#b45309]/40 border border-[#f5c518]/50 flex items-center justify-center text-lg group-hover:scale-105 transition-transform shadow-[0_0_10px_rgba(245,197,24,0.2)]">
          📜
        </div>
        <div>
          <h1 class="font-extrabold text-base tracking-wide bg-gradient-to-r from-[#fef08a] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent uppercase font-serif">
            THIÊN THƯ MÔN
          </h1>
          <span class="text-[9px] uppercase tracking-widest text-[#64748b] block font-mono">
            QUẢN TRỊ TIÊN MÔN
          </span>
        </div>
      </RouterLink>
    </div>

    <!-- Center Section: Quick Nav Links (Desktop) -->
    <nav class="hidden lg:flex items-center gap-1 bg-[#060a12]/90 border border-[#17253b] p-1 rounded-xl font-serif backdrop-blur-md">
      <RouterLink
        to="/"
        class="px-2.5 py-1 text-xs font-semibold rounded-lg transition"
        :class="route.path === '/' ? 'bg-[#1e293b] text-[#f5c518] shadow' : 'text-[#94a3b8] hover:text-white'"
      >
        🏠 Thánh Điện
      </RouterLink>

      <RouterLink
        to="/lineup"
        class="px-2.5 py-1 text-xs font-semibold rounded-lg transition flex items-center gap-1"
        :class="route.path.startsWith('/lineup') ? 'bg-[#1d4ed8] text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'text-[#94a3b8] hover:text-white'"
      >
        <span>📜 Trận Phái</span>
      </RouterLink>

      <RouterLink
        to="/schedule"
        class="px-2.5 py-1 text-xs font-semibold rounded-lg transition"
        :class="route.path.startsWith('/schedule') ? 'bg-[#1e293b] text-[#f5c518] shadow' : 'text-[#94a3b8] hover:text-white'"
      >
        ⚔️ Chiến Kỳ
      </RouterLink>

      <RouterLink
        to="/match-analysis"
        class="px-2.5 py-1 text-xs font-semibold rounded-lg transition"
        :class="route.path.startsWith('/match-analysis') ? 'bg-[#1e293b] text-[#f5c518] shadow' : 'text-[#94a3b8] hover:text-white'"
      >
        📊 Dữ Liệu Trận Đấu
      </RouterLink>

      <RouterLink
        to="/roster"
        class="px-2.5 py-1 text-xs font-semibold rounded-lg transition"
        :class="route.path.startsWith('/roster') ? 'bg-[#1e293b] text-[#f5c518] shadow' : 'text-[#94a3b8] hover:text-white'"
      >
        👥 Trị Bang Hiền Giả
      </RouterLink>

      <RouterLink
        to="/stats"
        class="px-2.5 py-1 text-xs font-semibold rounded-lg transition"
        :class="route.path.startsWith('/stats') ? 'bg-[#1e293b] text-[#f5c518] shadow' : 'text-[#94a3b8] hover:text-white'"
      >
        📈 Uy Danh
      </RouterLink>
    </nav>

    <!-- Right Section: Server Time & Discord User Login -->
    <div class="flex items-center gap-3">
      <!-- Live Server Time Badge -->
      <div class="hidden xl:flex flex-col items-end text-right font-serif">
        <span class="text-[10px] uppercase font-bold tracking-widest text-[#64748b]">Ấn Định Khắc</span>
        <span class="text-xs font-mono font-bold text-[#f5c518]">{{ currentTime }}</span>
      </div>

      <!-- Theme Switcher Toggle Button -->
      <button
        @click="themeStore.toggleTheme()"
        class="px-2.5 py-1.5 rounded-xl border text-xs font-bold font-serif transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105"
        :class="themeStore.theme === 'dark'
          ? 'bg-[#0c1424] hover:bg-[#16233b] border-[#1e304d] text-[#f5c518] hover:border-[#f5c518]/60'
          : 'bg-amber-50/90 hover:bg-amber-100 border-amber-300 text-amber-800 hover:border-amber-500'"
        :title="themeStore.theme === 'dark' ? 'Chuyển sang Giao diện Sáng (Thanh Vân)' : 'Chuyển sang Giao diện Tối (Huyền Dạ)'"
      >
        <span class="text-sm">
          {{ themeStore.theme === 'dark' ? '☀️' : '🌙' }}
        </span>
        <span class="hidden sm:inline text-[11px] font-bold">
          {{ themeStore.theme === 'dark' ? 'Dạ Cảnh' : 'Bạch Nhật' }}
        </span>
      </button>

      <!-- Auth State: User Profile or Login Button -->
      <div v-if="authStore.isAuthenticated" ref="userMenuRef" class="relative">
        <button
          @click.stop="isUserMenuOpen = !isUserMenuOpen"
          class="flex items-center gap-2 bg-[#0c1424] hover:bg-[#16233b] border border-[#1e304d] hover:border-[#f5c518]/60 p-1.5 pr-3 rounded-xl transition cursor-pointer"
        >
          <img
            :src="authStore.user?.avatar"
            :alt="authStore.user?.username"
            class="w-7 h-7 rounded-lg object-cover border border-[#f5c518]/50"
          />
          <div class="text-left hidden sm:block font-serif">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-white block max-w-[110px] truncate leading-tight">
                {{ authStore.user?.nickname || authStore.user?.globalName || authStore.user?.username }}
              </span>
              <!-- Explicit User Role Badge (Đương Gia, Đường Chủ, Bang Chúng) -->
              <span
                v-if="userPrimaryRole === 'Đương Gia'"
                class="text-[9px] px-1.5 py-0.2 rounded bg-[#f5c518]/20 text-[#f5c518] border border-[#f5c518]/40 font-bold shrink-0"
                title="Chức Vị: Đương Gia"
              >
                ⭐ Đương Gia
              </span>
              <span
                v-else-if="userPrimaryRole === 'Đường Chủ'"
                class="text-[9px] px-1.5 py-0.2 rounded bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40 font-bold shrink-0"
                title="Chức Vị: Đường Chủ"
              >
                👑 Đường Chủ
              </span>
              <span
                v-else
                class="text-[9px] px-1.5 py-0.2 rounded bg-[#1e293b] text-[#94a3b8] border border-[#334155] font-medium shrink-0"
              >
                Bang Chúng
              </span>
            </div>
            <span
              class="text-[9px] font-bold block leading-none mt-0.5 flex items-center gap-1"
              :style="{ color: userClassInfo.hex }"
            >
              <img v-if="userClassInfo.icon" :src="userClassInfo.icon" class="w-3 h-3 object-contain inline-block" />
              <span>{{ authStore.user?.className || 'Bang Chúng' }}</span>
            </span>
          </div>
          <span class="text-[10px] text-[#94a3b8] ml-1">▼</span>
        </button>

        <!-- User Dropdown Menu (Only opens on click, closes when clicking outside) -->
        <Transition name="dropdown">
          <div
            v-if="isUserMenuOpen"
            class="absolute right-0 top-full mt-1.5 w-56 bg-[#080d19] border border-[#1e304d] rounded-xl shadow-2xl p-2.5 z-50 font-serif"
          >
            <div class="px-3 py-2 border-b border-[#18263e] mb-1.5 space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-[#64748b] block font-serif">Biệt Danh Xuất Trận:</span>
                <span
                  class="text-[9px] font-bold px-1.5 py-0.2 rounded"
                  :class="{
                    'bg-[#f5c518]/20 text-[#f5c518] border border-[#f5c518]/40': userPrimaryRole === 'Đương Gia',
                    'bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40': userPrimaryRole === 'Đường Chủ',
                    'bg-[#1e293b] text-[#94a3b8] border border-[#334155]': userPrimaryRole === 'Bang Chúng'
                  }"
                >
                  {{ userPrimaryRole }}
                </span>
              </div>
              <span class="text-xs font-bold text-[#f5c518] truncate block">
                {{ authStore.user?.nickname || authStore.user?.username }}
              </span>
              <div class="flex items-center gap-1.5 pt-0.5">
                <span class="text-[10px] text-[#94a3b8]">Môn Phái:</span>
                <span
                  class="text-[10px] font-bold px-2 py-0.2 rounded-full border flex items-center gap-1"
                  :style="{ backgroundColor: `${userClassInfo.hex}20`, borderColor: `${userClassInfo.hex}50`, color: userClassInfo.hex }"
                >
                  <img v-if="userClassInfo.icon" :src="userClassInfo.icon" class="w-3 h-3 object-contain" />
                  <span>{{ authStore.user?.className || 'Bang Chúng' }}</span>
                </span>
              </div>
            </div>

            <RouterLink
              to="/profile"
              @click="isUserMenuOpen = false"
              class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#e2e8f0] hover:bg-[#1e293b] hover:text-[#f5c518] transition flex items-center justify-between mb-1"
            >
              <span>👤 Tiên Môn Hồ Sơ</span>
              <span>➔</span>
            </RouterLink>

            <button
              @click="themeStore.toggleTheme()"
              class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#e2e8f0] hover:bg-[#1e293b] hover:text-[#f5c518] transition flex items-center justify-between mb-1 cursor-pointer font-serif"
            >
              <div class="flex items-center gap-2">
                <span>{{ themeStore.theme === 'dark' ? '☀️' : '🌙' }}</span>
                <span>Chế Độ: {{ themeStore.theme === 'dark' ? 'Sáng (Thanh Vân)' : 'Tối (Huyền Dạ)' }}</span>
              </div>
              <span class="text-[9px] px-1.5 py-0.5 rounded font-bold"
                    :class="themeStore.theme === 'dark' ? 'bg-[#f5c518]/20 text-[#f5c518]' : 'bg-amber-500 text-white'">
                {{ themeStore.theme === 'dark' ? 'Tối' : 'Sáng' }}
              </span>
            </button>

            <button
              @click="authStore.logout(); isUserMenuOpen = false;"
              class="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#f87171] hover:bg-[#7f1d1d]/30 hover:text-white transition flex items-center justify-between cursor-pointer"
            >
              <span>Đăng Xuất</span>
              <span>➔</span>
            </button>
          </div>
        </Transition>
      </div>

      <!-- Login Button -->
      <button
        v-else
        @click="authStore.loginWithDiscord()"
        class="bg-gradient-to-r from-[#5865F2] to-[#404EED] hover:brightness-110 border border-[#5865F2]/60 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-[0_0_15px_rgba(88,101,242,0.3)] hover:scale-105 font-serif"
      >
        <span class="text-base">👾</span>
        <span class="hidden sm:inline">Quy Nhập Discord</span>
        <span class="sm:hidden">Quy Nhập</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { getClassInfo } from '../../theme/classColors';

defineEmits(['toggleMenu']);
const route = useRoute();
const authStore = useAuthStore();
const themeStore = useThemeStore();

const userClassInfo = computed(() => getClassInfo(authStore.user?.className || ''));

const userPrimaryRole = computed(() => {
  if (authStore.user?.primaryRole) return authStore.user.primaryRole;
  if (authStore.user?.roles && authStore.user.roles.includes('Đương Gia')) return 'Đương Gia';
  if (authStore.user?.roles && authStore.user.roles.includes('Đường Chủ')) return 'Đường Chủ';
  if (authStore.canEdit) return 'Đương Gia';
  return 'Bang Chúng';
});

const currentTime = ref('');
const isUserMenuOpen = ref(false);
const userMenuRef = ref(null);

let timer = null;
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const handleOutsideClick = (e) => {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
  authStore.fetchUser();
  window.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
  window.removeEventListener('click', handleOutsideClick);
});
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
