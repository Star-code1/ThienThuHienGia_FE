<template>
  <div class="relative min-h-[calc(100vh-57px)] text-[#e2e8f0] flex flex-col font-sans select-none overflow-x-hidden pb-16">
    <!-- Xianxia Blurred Background Layer with bg.png -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <img
        :src="bgImage"
        alt="Nền Tiên Hiệp Thiên Thư Môn"
        class="w-full h-full object-cover object-center filter blur-md scale-105 opacity-35 brightness-75 transition-all duration-700"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-[#060a12]/90 via-[#060a12]/75 to-[#060a12]/95"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(6,10,18,0.85)_100%)]"></div>

      <!-- Xianxia Celestial Aura Glows -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#f5c518]/10 rounded-full blur-[130px]"></div>
      <div class="absolute bottom-1/3 left-1/4 w-[450px] h-[450px] bg-[#3b82f6]/10 rounded-full blur-[110px]"></div>
    </div>

    <!-- Hero Banner Section -->
    <section class="relative z-10 pt-10 md:pt-14 pb-12 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
      <!-- Xianxia Celestial Top Badge -->
      <div class="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0d1526]/90 border border-[#f5c518]/50 text-[#f5c518] text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(245,197,24,0.2)] backdrop-blur-md animate-pulse font-serif">
        <span class="text-sm">⚔️</span>
        <span>HIỀN GIẢ TRỊ BANG • THIÊN THƯ DIỄN VÕ</span>
        <span class="text-sm">⚔️</span>
      </div>

      <!-- Main Title (Chinese Calligraphy + Vietnamese Xianxia Style) -->
      <div class="relative">
        <span class="block text-xs md:text-sm font-serif uppercase tracking-[0.35em] text-[#d97706] mb-1 font-semibold">
          天 書 門 — CÔNG THÀNH CHIẾN HỆ THỐNG
        </span>
        <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight uppercase font-serif bg-gradient-to-r from-[#fffbeb] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(245,197,24,0.35)]">
          THIÊN THƯ MÔN
        </h1>
      </div>

      <!-- Subtitle -->
      <p class="mt-5 text-sm md:text-lg text-[#94a3b8] max-w-2xl font-medium leading-relaxed font-serif">
        Trung tâm điều hành tác chiến Công Thành Chiến — Thống lĩnh ma trận đội hình, ấn định giờ xuất trận và kiểm soát uy danh đệ tử.
      </p>

      <!-- Action Buttons with Xianxia Aesthetics -->
      <div class="mt-8 flex flex-wrap justify-center items-center gap-4">
        <RouterLink
          to="/lineup"
          class="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-[#d97706] via-[#f5c518] to-[#b45309] hover:brightness-125 transition-all shadow-[0_0_25px_rgba(245,197,24,0.4)] hover:scale-105"
        >
          <span class="text-lg">📜</span>
          <span class="font-extrabold tracking-wide font-serif">THIÊN THƯ TRẬN PHÁP</span>
          <span class="text-xs transition-transform group-hover:translate-x-1">➔</span>
        </RouterLink>

        <RouterLink
          to="/schedule"
          class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-[#e2e8f0] bg-[#0d172a]/90 hover:bg-[#1e293b] border border-[#263750] hover:border-[#f5c518]/80 transition-all hover:scale-105 backdrop-blur-md shadow-lg font-serif"
        >
          <span>⚔️ Công Thành Chiến Kỳ</span>
        </RouterLink>

        <RouterLink
          to="/roster"
          class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-[#94a3b8] hover:text-white bg-[#080d19]/80 hover:bg-[#121c2e] border border-[#182840] hover:border-[#38bdf8]/60 transition-all hover:scale-105 backdrop-blur-md font-serif"
        >
          <span>👥 Trị Bang Hiền Giả</span>
        </RouterLink>
      </div>

      <!-- Quick Stats Bar (Xianxia Imperial Scroll Style) -->
      <div class="mt-12 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#080d19]/85 border border-[#1e304d] backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-[#f5c518]/5 via-transparent to-[#3b82f6]/5 pointer-events-none"></div>

        <div class="p-3 text-center border-r border-[#18263e] last:border-none relative z-10">
          <span class="text-2xl md:text-3xl font-extrabold text-[#f5c518] font-mono drop-shadow-sm">
            {{ authStore.guildMemberCount }}
          </span>
          <span class="text-[11px] text-[#64748b] block font-semibold uppercase tracking-wider mt-1 font-serif">Bang Chúng Trực Chiêu</span>
        </div>
        <div class="p-3 text-center border-r border-[#18263e] last:border-none relative z-10">
          <span class="text-2xl md:text-3xl font-extrabold text-[#38bdf8] font-mono drop-shadow-sm">60</span>
          <span class="text-[11px] text-[#64748b] block font-semibold uppercase tracking-wider mt-1 font-serif">Vị Trí Trận Đồ</span>
        </div>
        <div class="p-3 text-center border-r border-[#18263e] last:border-none relative z-10">
          <span class="text-2xl md:text-3xl font-extrabold text-[#34d399] font-mono drop-shadow-sm">98%</span>
          <span class="text-[11px] text-[#64748b] block font-semibold uppercase tracking-wider mt-1 font-serif">Ý Chí Xuất Trận</span>
        </div>
        <div class="p-3 text-center relative z-10">
          <span class="text-2xl md:text-3xl font-extrabold text-[#c084fc] font-mono drop-shadow-sm">TOP 1</span>
          <span class="text-[11px] text-[#64748b] block font-semibold uppercase tracking-wider mt-1 font-serif">Độc Bá Giang Hồ</span>
        </div>
      </div>
    </section>

    <!-- Main Features Grid (Xianxia Styled - Zero Code Explanations) -->
    <section class="relative z-10 px-6 max-w-7xl mx-auto w-full space-y-6">
      <div class="flex items-center justify-between border-b border-[#182740] pb-3">
        <h2 class="text-lg md:text-xl font-bold uppercase tracking-wider text-[#f5c518] flex items-center gap-2 font-serif">
          <span>📜 THIÊN THƯ QUYẾT BẢNG</span>
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Feature 1: Sơ Đồ Bang Chiến -->
        <div class="group relative bg-[#080d19]/85 border border-[#1c2e4a] hover:border-[#f5c518]/70 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between backdrop-blur-md overflow-hidden">
          <div class="absolute -right-6 -bottom-6 text-7xl opacity-5 pointer-events-none group-hover:opacity-15 transition">
            📜
          </div>

          <div>
            <div class="w-12 h-12 rounded-xl bg-[#f5c518]/10 border border-[#f5c518]/30 flex items-center justify-center text-2xl text-[#f5c518] mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,197,24,0.15)]">
              📜
            </div>
            <h3 class="text-base font-bold text-white group-hover:text-[#f5c518] transition font-serif">
              Thiên Thư Trận Phái
            </h3>
            <p class="mt-2 text-xs text-[#94a3b8] leading-relaxed">
              Bảng ma trận tác chiến Công Thành Chiến. Quy tụ các toán quân, hỗ trợ phân bổ lực lượng, gán vị trí Tiên Phong Trái/Phải và bảo mật chiến đồ.
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-[#142033] flex items-center justify-between">
            <span class="text-[10px] font-bold text-[#f5c518] uppercase tracking-wider font-serif">Trận Đồ Ma Trận</span>
            <RouterLink
              to="/lineup"
              class="text-xs font-bold text-[#f5c518] group-hover:text-white flex items-center gap-1 hover:underline font-serif"
            >
              <span>Vào Trận Đồ</span>
              <span>➔</span>
            </RouterLink>
          </div>
        </div>

        <!-- Feature 2: Lịch Bang Chiến -->
        <div class="group relative bg-[#080d19]/85 border border-[#1c2e4a] hover:border-[#38bdf8]/70 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between backdrop-blur-md overflow-hidden">
          <div class="absolute -right-6 -bottom-6 text-7xl opacity-5 pointer-events-none group-hover:opacity-15 transition">
            ⚔️
          </div>

          <div>
            <div class="w-12 h-12 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-2xl text-[#38bdf8] mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(56,189,248,0.15)]">
              ⚔️
            </div>
            <h3 class="text-base font-bold text-white group-hover:text-[#38bdf8] transition font-serif">
              Công Thành Chiến Kỳ
            </h3>
            <p class="mt-2 text-xs text-[#94a3b8] leading-relaxed">
              Chiến kỳ ấn định giờ xuất trận Công Thành Chiến, Tố Chiến bang hội và những thiên luật triệu tập bắt buộc đối với tất cả đệ tử.
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-[#142033] flex items-center justify-between">
            <span class="text-[10px] font-bold text-[#38bdf8] uppercase tracking-wider font-serif">Chiến Kỳ Sự Kiện</span>
            <RouterLink
              to="/schedule"
              class="text-xs font-bold text-[#38bdf8] group-hover:text-white flex items-center gap-1 hover:underline font-serif"
            >
              <span>Xem Chiến Kỳ</span>
              <span>➔</span>
            </RouterLink>
          </div>
        </div>

        <!-- Feature 3: Quản Lý Bang Hội -->
        <div class="group relative bg-[#080d19]/85 border border-[#1c2e4a] hover:border-[#34d399]/70 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between backdrop-blur-md overflow-hidden">
          <div class="absolute -right-6 -bottom-6 text-7xl opacity-5 pointer-events-none group-hover:opacity-15 transition">
            👥
          </div>

          <div>
            <div class="w-12 h-12 rounded-xl bg-[#34d399]/10 border border-[#34d399]/30 flex items-center justify-center text-2xl text-[#34d399] mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(52,211,153,0.15)]">
              👥
            </div>
            <h3 class="text-base font-bold text-white group-hover:text-[#34d399] transition font-serif">
              Trị Bang Hiền Giả
            </h3>
            <p class="mt-2 text-xs text-[#94a3b8] leading-relaxed">
              Danh sách ghi danh võ phái đệ tử Thiên Thư Môn, quản lý chức vị Đương Gia, Đường Chủ, Bang Chúng và đồng bộ Discord.
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-[#142033] flex items-center justify-between">
            <span class="text-[10px] font-bold text-[#34d399] uppercase tracking-wider font-serif">Đệ Tử Bang Chúng</span>
            <RouterLink
              to="/roster"
              class="text-xs font-bold text-[#34d399] group-hover:text-white flex items-center gap-1 hover:underline font-serif"
            >
              <span>Xem Bang Chúng</span>
              <span>➔</span>
            </RouterLink>
          </div>
        </div>

        <!-- Feature 4: Thống Kê Điểm Danh -->
        <div class="group relative bg-[#080d19]/85 border border-[#1c2e4a] hover:border-[#c084fc]/70 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between backdrop-blur-md overflow-hidden">
          <div class="absolute -right-6 -bottom-6 text-7xl opacity-5 pointer-events-none group-hover:opacity-15 transition">
            📊
          </div>

          <div>
            <div class="w-12 h-12 rounded-xl bg-[#c084fc]/10 border border-[#c084fc]/30 flex items-center justify-center text-2xl text-[#c084fc] mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(192,132,252,0.15)]">
              📊
            </div>
            <h3 class="text-base font-bold text-white group-hover:text-[#c084fc] transition font-serif">
              Uy Danh Thống Kê
            </h3>
            <p class="mt-2 text-xs text-[#94a3b8] leading-relaxed">
              Uy danh điểm danh, tổng hợp đệ tử xuất trận, theo dõi số lượng báo bận và phân bổ lực lượng Bát Đại Võ Phái theo từng sự kiện.
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-[#142033] flex items-center justify-between">
            <span class="text-[10px] font-bold text-[#c084fc] uppercase tracking-wider font-serif">Uy Danh Bảng</span>
            <RouterLink
              to="/stats"
              class="text-xs font-bold text-[#c084fc] group-hover:text-white flex items-center gap-1 hover:underline font-serif"
            >
              <span>Xem Uy Danh</span>
              <span>➔</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Xianxia Martial Arts Sects Highlight Banner (Bát Đại Võ Phái) -->
    <section class="relative z-10 px-6 max-w-7xl mx-auto w-full mt-10">
      <div class="bg-[#080d19]/85 border border-[#1e304d] rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#142033] pb-4 mb-5">
          <div>
            <h3 class="text-base font-bold uppercase tracking-wider text-[#f5c518] font-serif flex items-center gap-2">
              <span>⚔️ BÁT ĐẠI VÕ PHÁI — THIÊN THƯ MÔN</span>
            </h3>
            <p class="text-xs text-[#64748b] font-serif">Cơ cấu lực lượng võ phái chính phục vụ Công Thành Chiến</p>
          </div>
          <RouterLink
            to="/lineup"
            class="px-4 py-2 bg-[#17253b] hover:bg-[#253956] text-xs font-bold text-[#f5c518] rounded-xl border border-[#2b4266] transition flex items-center gap-1.5 shadow font-serif"
          >
            <span>Vào Xếp Đội Hình</span>
            <span>➔</span>
          </RouterLink>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div
            v-for="c in CLASS_LIST"
            :key="c.name"
            class="bg-[#091120]/90 border border-[#192b45] p-3.5 rounded-xl flex flex-col items-center text-center hover:border-[#f5c518]/60 transition-all duration-300 group hover:-translate-y-0.5"
          >
            <div class="relative mb-2">
              <img v-if="c.icon" :src="c.icon" :alt="c.name" class="w-9 h-9 object-contain group-hover:scale-110 transition-transform filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" />
              <span v-else class="w-5 h-5 rounded-full block" :style="{ backgroundColor: c.hex, boxShadow: `0 0 10px ${c.hex}` }"></span>
            </div>
            <span class="text-xs font-bold text-[#e2e8f0] group-hover:text-white font-serif">{{ c.name }}</span>
            <span class="text-[10px] font-semibold mt-0.5 px-2 py-0.5 rounded-full bg-[#050912] border border-[#142033]" :style="{ color: c.hex }">
              {{ c.short }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import bgImage from '@/assets/bg.png';
import { CLASS_LIST } from '../theme/classColors';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();

onMounted(() => {
  authStore.fetchGuildStats();
});
</script>
