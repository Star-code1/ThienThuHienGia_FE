<template>
  <div class="relative min-h-[calc(100vh-57px)] text-[#e2e8f0] flex flex-col font-sans select-none overflow-x-hidden pb-12">
    <!-- Hero Banner Section -->
    <section class="relative z-10 pt-10 pb-16 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
      <!-- Top Badge -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e293b]/80 border border-[#f5c518]/40 text-[#f5c518] text-xs font-semibold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(245,197,24,0.15)] animate-pulse">
        <span>📜 HỆ THỐNG QUẢN TRỊ BANG HỘI HIGH-END</span>
      </div>

      <!-- Main Title -->
      <h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase font-serif bg-gradient-to-r from-[#fffbeb] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(245,197,24,0.3)]">
        THIÊN THƯ MÔN
      </h1>

      <p class="mt-4 text-base md:text-xl text-[#94a3b8] max-w-2xl font-medium leading-relaxed">
        Thiên Thư Diễn Võ — Hiền Giả Trị Bang — Độc Bá Thiên Hạ.
        Trung tâm điều hành tác chiến Công Thành Chiến, quản lý đội hình & thống kê điểm danh.
      </p>

      <!-- Action Buttons -->
      <div class="mt-8 flex flex-wrap justify-center items-center gap-4">
        <RouterLink
          to="/lineup"
          class="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#1d4ed8] hover:brightness-125 transition-all shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:scale-105"
        >
          <span class="text-lg">📜</span>
          <span>Vào Sơ Đồ Bang Chiến</span>
          <span class="text-xs transition-transform group-hover:translate-x-1">➔</span>
        </RouterLink>

        <RouterLink
          to="/schedule"
          class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-[#cbd5e1] bg-[#0f172a]/90 hover:bg-[#1e293b] border border-[#1e293b] hover:border-[#f5c518] transition-all hover:scale-105"
        >
          <span>⚔️ Xem Lịch Công Thành</span>
        </RouterLink>
      </div>

      <!-- Quick Stats Bar -->
      <div class="mt-12 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#080d19]/80 border border-[#17263c] backdrop-blur shadow-2xl">
        <div class="p-3 text-center border-r border-[#17263c] last:border-none">
          <span class="text-2xl font-extrabold text-[#f5c518] font-mono">120+</span>
          <span class="text-[11px] text-[#64748b] block font-medium uppercase mt-0.5">Thành Viên Bang</span>
        </div>
        <div class="p-3 text-center border-r border-[#17263c] last:border-none">
          <span class="text-2xl font-extrabold text-[#60a5fa] font-mono">60</span>
          <span class="text-[11px] text-[#64748b] block font-medium uppercase mt-0.5">Slot Trận Hình</span>
        </div>
        <div class="p-3 text-center border-r border-[#17263c] last:border-none">
          <span class="text-2xl font-extrabold text-[#34d399] font-mono">98%</span>
          <span class="text-[11px] text-[#64748b] block font-medium uppercase mt-0.5">Tỷ Lệ Tham Chiến</span>
        </div>
        <div class="p-3 text-center">
          <span class="text-2xl font-extrabold text-[#c084fc] font-mono">TOP 1</span>
          <span class="text-[11px] text-[#64748b] block font-medium uppercase mt-0.5">Thế Lực Sever</span>
        </div>
      </div>
    </section>

    <!-- Feature Cards Section -->
    <section class="relative z-10 px-6 max-w-7xl mx-auto w-full space-y-6">
      <div class="flex items-center justify-between border-b border-[#172439] pb-3">
        <h2 class="text-xl font-bold uppercase tracking-wider text-[#93c5fd] flex items-center gap-2">
          <span>⚡ Bảng Chức Năng Trung Tâm</span>
        </h2>
        <span class="text-xs text-[#64748b]">Chọn tính năng từ bảng bên dưới hoặc qua Menu Drawer</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Feature 1: Sơ Đồ Bang Chiến -->
        <div class="group relative bg-[#080d19]/90 border border-[#182842] hover:border-[#3b82f6] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between overflow-hidden">
          <div class="absolute -right-6 -bottom-6 text-7xl opacity-5 pointer-events-none group-hover:opacity-10 transition">
            📜
          </div>

          <div>
            <div class="w-12 h-12 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-2xl text-[#60a5fa] mb-4 group-hover:scale-110 transition-transform">
              📜
            </div>
            <h3 class="text-lg font-bold text-white group-hover:text-[#60a5fa] transition">
              Sơ Đồ Bang Chiến
            </h3>
            <p class="mt-2 text-xs text-[#94a3b8] leading-relaxed">
              Công cụ ma trận chiến thuật 60+ thành viên. Hỗ trợ kéo thả điểm danh, tự động nhận diện Phái, gán nhóm Rừng 1 / Rừng 2, viết ghi chú chiến thuật và xuất ảnh PNG chất lượng cao.
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-[#142033] flex items-center justify-between">
            <span class="text-[11px] font-bold text-[#f5c518] uppercase tracking-wider">Chức năng chính</span>
            <RouterLink
              to="/lineup"
              class="text-xs font-bold text-[#60a5fa] group-hover:text-white flex items-center gap-1 hover:underline"
            >
              <span>Mở Sơ Đồ Tác Chiến</span>
              <span>➔</span>
            </RouterLink>
          </div>
        </div>

        <!-- Feature 2: Lịch Bang Chiến -->
        <div class="group relative bg-[#080d19]/90 border border-[#182842] hover:border-[#f5c518] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between overflow-hidden">
          <div class="absolute -right-6 -bottom-6 text-7xl opacity-5 pointer-events-none group-hover:opacity-10 transition">
            ⚔️
          </div>

          <div>
            <div class="w-12 h-12 rounded-xl bg-[#f5c518]/10 border border-[#f5c518]/30 flex items-center justify-center text-2xl text-[#f5c518] mb-4 group-hover:scale-110 transition-transform">
              ⚔️
            </div>
            <h3 class="text-lg font-bold text-white group-hover:text-[#f5c518] transition">
              Lịch Công Thành Chiến
            </h3>
            <p class="mt-2 text-xs text-[#94a3b8] leading-relaxed">
              Theo dõi thời gian diễn ra Công Thành Chiến, Tố Chiến bang hội, thông báo triệu tập và quy định bắt buộc cho tất cả các thành viên tham gia bang chiến.
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-[#142033] flex items-center justify-between">
            <span class="text-[11px] font-bold text-[#f5c518] uppercase tracking-wider">Lịch Sự Kiện</span>
            <RouterLink
              to="/schedule"
              class="text-xs font-bold text-[#f5c518] group-hover:text-white flex items-center gap-1 hover:underline"
            >
              <span>Xem Lịch Chiến</span>
              <span>➔</span>
            </RouterLink>
          </div>
        </div>

        <!-- Feature 3: Quản Lý Bang Hội -->
        <div class="group relative bg-[#080d19]/90 border border-[#182842] hover:border-[#34d399] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between overflow-hidden">
          <div class="absolute -right-6 -bottom-6 text-7xl opacity-5 pointer-events-none group-hover:opacity-10 transition">
            👥
          </div>

          <div>
            <div class="w-12 h-12 rounded-xl bg-[#34d399]/10 border border-[#34d399]/30 flex items-center justify-center text-2xl text-[#34d399] mb-4 group-hover:scale-110 transition-transform">
              👥
            </div>
            <h3 class="text-lg font-bold text-white group-hover:text-[#34d399] transition">
              Danh Sách Bang Hội
            </h3>
            <p class="mt-2 text-xs text-[#94a3b8] leading-relaxed">
              Quản lý danh sách nhân vật, võ phái (Tố Vấn, Thần Tướng, Huyết Hà, Cửu Linh, Thiết Y, Long Ngâm, Toái Mộng), vai trò và thông tin liên lạc Discord.
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-[#142033] flex items-center justify-between">
            <span class="text-[11px] font-bold text-[#34d399] uppercase tracking-wider">Thành Viên</span>
            <RouterLink
              to="/roster"
              class="text-xs font-bold text-[#34d399] group-hover:text-white flex items-center gap-1 hover:underline"
            >
              <span>Xem Danh Sách</span>
              <span>➔</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Bang Class Roster Highlight Banner -->
    <section class="relative z-10 px-6 max-w-7xl mx-auto w-full mt-12">
      <div class="bg-[#080d19]/90 border border-[#17263c] rounded-2xl p-6 shadow-2xl">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#142033] pb-4 mb-4">
          <div>
            <h3 class="text-base font-bold uppercase tracking-wider text-[#f5c518]">
              Bát Đại Võ Phái — Thiên Thư Môn
            </h3>
            <p class="text-xs text-[#64748b]">Cơ cấu lực lượng phái chính phục vụ Công Thành Chiến</p>
          </div>
          <RouterLink
            to="/lineup"
            class="px-4 py-2 bg-[#1e293b] hover:bg-[#334155] text-xs font-semibold text-white rounded-lg border border-[#334155] transition"
          >
            Vào Xếp Đội Hình Phái ➔
          </RouterLink>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div
            v-for="c in CLASS_LIST"
            :key="c.name"
            class="bg-[#0c1424] border border-[#1b2b46] p-3 rounded-xl flex flex-col items-center text-center hover:border-[#3b82f6] transition group"
          >
            <img v-if="c.icon" :src="c.icon" :alt="c.name" class="w-8 h-8 object-contain mb-2 group-hover:scale-110 transition-transform" />
            <span v-else class="w-4 h-4 rounded-full mb-2" :style="{ backgroundColor: c.hex, boxShadow: `0 0 8px ${c.hex}` }"></span>
            <span class="text-xs font-bold text-[#e2e8f0]">{{ c.name }}</span>
            <span class="text-[10px] text-[#64748b] mt-0.5">{{ c.role || 'Lực Lượng' }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { CLASS_LIST } from '../theme/classColors';
</script>
