<template>
  <header class="relative z-30 border-b border-[#172439] bg-[#090f1d]/90 backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-4 font-sans select-none">
    <!-- Left Section: Menu Toggle + Brand Logo -->
    <div class="flex items-center gap-3">
      <!-- Menu Button (Trái/Phải trigger) -->
      <button
        @click="$emit('toggleMenu')"
        class="bg-[#121c2d] hover:bg-[#1d2d48] border border-[#233758] text-[#f5c518] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm group"
        title="Mở Bảng Chức Năng Menu"
      >
        <span class="text-base group-hover:scale-110 transition-transform">☰</span>
        <span class="hidden sm:inline uppercase tracking-wider text-[11px]">Menu Chức Năng</span>
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
            Hệ Thống Quản Trị Bang Hội
          </span>
        </div>
      </RouterLink>
    </div>

    <!-- Center Section: Quick Nav Links (Desktop) -->
    <nav class="hidden md:flex items-center gap-1 bg-[#060a12]/80 border border-[#142033] p-1 rounded-xl">
      <RouterLink
        to="/"
        class="px-3 py-1 text-xs font-semibold rounded-lg transition"
        :class="route.path === '/' ? 'bg-[#1e293b] text-[#f5c518] shadow' : 'text-[#94a3b8] hover:text-white'"
      >
        🏠 Trang Chủ
      </RouterLink>
      <RouterLink
        to="/lineup"
        class="px-3 py-1 text-xs font-semibold rounded-lg transition flex items-center gap-1"
        :class="route.path.startsWith('/lineup') ? 'bg-[#1d4ed8] text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'text-[#94a3b8] hover:text-white'"
      >
        <span>📜 Sơ Đồ Bang Chiến</span>
        <span class="w-2 h-2 rounded-full bg-[#f5c518] animate-ping"></span>
      </RouterLink>
      <RouterLink
        to="/schedule"
        class="px-3 py-1 text-xs font-semibold rounded-lg transition"
        :class="route.path.startsWith('/schedule') ? 'bg-[#1e293b] text-[#f5c518] shadow' : 'text-[#94a3b8] hover:text-white'"
      >
        ⚔️ Lịch Chiến
      </RouterLink>
      <RouterLink
        to="/roster"
        class="px-3 py-1 text-xs font-semibold rounded-lg transition"
        :class="route.path.startsWith('/roster') ? 'bg-[#1e293b] text-[#f5c518] shadow' : 'text-[#94a3b8] hover:text-white'"
      >
        👥 Bang Hội
      </RouterLink>
    </nav>

    <!-- Right Section: Current Status & Drawer Trigger Button -->
    <div class="flex items-center gap-3">
      <!-- Live Server Time Badge -->
      <div class="hidden lg:flex flex-col items-end text-right">
        <span class="text-[10px] uppercase font-bold tracking-widest text-[#64748b]">Giờ Server</span>
        <span class="text-xs font-mono font-bold text-[#f5c518]">{{ currentTime }}</span>
      </div>

      <!-- Quick Action: Open Menu Drawer (Right icon) -->
      <button
        @click="$emit('toggleMenu')"
        class="bg-gradient-to-r from-[#1d4ed8]/20 to-[#3b82f6]/20 border border-[#3b82f6]/40 hover:border-[#3b82f6] text-[#60a5fa] hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
      >
        <span>⚡ Menu</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

defineEmits(['toggleMenu']);
const route = useRoute();

const currentTime = ref('');

let timer = null;
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
