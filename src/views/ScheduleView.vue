<template>
  <div class="relative min-h-[calc(100vh-57px)] text-[#e2e8f0] p-6 max-w-6xl mx-auto font-sans select-none space-y-6">
    <!-- Header -->
    <div class="border-b border-[#172439] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">⚔️</span>
          <h1 class="text-2xl font-extrabold uppercase font-serif tracking-wide bg-gradient-to-r from-[#fef08a] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent">
            CÔNG THÀNH CHIẾN KỲ — THIÊN THƯ MÔN
          </h1>
        </div>
        <p class="text-xs text-[#94a3b8] mt-1 font-serif">Ấn định giờ xuất trận, chiến kỳ hằng tuần và thiên luật triệu tập</p>
      </div>

      <RouterLink
        to="/lineup"
        class="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-blue-900/30 font-serif"
      >
        <span>📜 Thiên Thư Trận Phái</span>
      </RouterLink>
    </div>

    <!-- Active Upcoming War Card -->
    <div class="bg-gradient-to-r from-[#0c1424] via-[#09101f] to-[#120f24] border border-[#f5c518]/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden font-serif">
      <div class="absolute top-0 right-0 px-4 py-1.5 bg-[#f5c518] text-[#060a12] font-extrabold text-[11px] uppercase tracking-widest rounded-bl-xl shadow font-mono">
        CHIẾN KỲ XUẤT TRẬN KẾ TIẾP
      </div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-[#ef4444] animate-ping"></span>
            <span class="text-xs font-bold text-[#ef4444] uppercase tracking-wider font-serif">CÔNG THÀNH CHIẾN TOÀN THẾ LỰC</span>
          </div>
          <h2 class="text-2xl font-bold text-white font-serif">Thứ Sáu Hằng Tuần — 20:00 UTC+7</h2>
          <p class="text-xs text-[#94a3b8] max-w-xl font-serif leading-relaxed">
            Tất cả đệ tử bắt buộc tập trung trước 15 phút tại Voice Discord nghe chỉ huy gọi tên an vị ma trận tác chiến.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-[#060a12] border border-[#1e293b] rounded-xl p-3 text-center min-w-[75px]">
            <span class="text-2xl font-extrabold text-[#f5c518] font-mono block">20</span>
            <span class="text-[10px] text-[#64748b] font-bold uppercase font-serif">Giờ</span>
          </div>
          <span class="text-xl font-bold text-[#64748b]">:</span>
          <div class="bg-[#060a12] border border-[#1e293b] rounded-xl p-3 text-center min-w-[75px]">
            <span class="text-2xl font-extrabold text-[#f5c518] font-mono block">00</span>
            <span class="text-[10px] text-[#64748b] font-bold uppercase font-serif">Phút</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Schedule Timeline -->
    <div class="space-y-4">
      <h3 class="text-base font-bold uppercase tracking-wider text-[#93c5fd] flex items-center gap-2 font-serif">
        <span>📅 LỊCH TRÌNH DIỄN VÕ HẰNG TUẦN</span>
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-serif">
        <div
          v-for="item in scheduleItems"
          :key="item.day"
          class="bg-[#080d19]/90 border border-[#17263c] rounded-xl p-4 flex items-start gap-4 hover:border-[#3b82f6] transition shadow-lg"
        >
          <div class="w-12 h-12 rounded-xl bg-[#0f172a] border border-[#1e293b] flex flex-col items-center justify-center shrink-0">
            <span class="text-xs font-bold text-[#f5c518] uppercase font-serif">{{ item.shortDay }}</span>
            <span class="text-[10px] text-[#64748b] font-mono">{{ item.time }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-sm text-white font-serif">{{ item.title }}</h4>
              <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#1e293b] text-[#60a5fa] border border-[#3b82f6]/30 font-serif">
                {{ item.type }}
              </span>
            </div>
            <p class="text-xs text-[#94a3b8] mt-1 font-serif">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const scheduleItems = [
  {
    day: 'Thứ 2',
    shortDay: 'T2',
    time: '20:00',
    title: 'Tố Chiến Diễn Võ',
    type: 'Diễn Luyện',
    description: 'Tập trung luyện tập phối hợp các toán quân Mid và Tiên Phong Trái/Phải.'
  },
  {
    day: 'Thứ 4',
    shortDay: 'T4',
    time: '20:30',
    title: 'Tông Môn Thảo Phạt',
    type: 'Săn Boss',
    description: 'Thu thập vật tư bang, kiểm tra thần binh bảo vật của đệ tử.'
  },
  {
    day: 'Thứ 6',
    shortDay: 'T6',
    time: '20:00',
    title: 'Công Thành Chiến Khởi Trận',
    type: 'Đại Chiến',
    description: 'Trận đại chiến đoạt lãnh thổ quan trọng nhất tuần. Bắt buộc 100% đệ tử an vị.'
  },
  {
    day: 'Chủ Nhật',
    shortDay: 'CN',
    time: '21:00',
    title: 'Hội Nghị Vĩnh Danh & Thưởng Phạt',
    type: 'Hội Nghị',
    description: 'Hội nghị tổng kết công trạng, vinh danh đệ tử xuất sắc và cập nhật ma trận mới.'
  }
];
</script>
