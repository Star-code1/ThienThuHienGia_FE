<template>
  <div class="relative min-h-[calc(100vh-57px)] text-[#e2e8f0] p-4 sm:p-6 max-w-7xl mx-auto font-sans select-none space-y-6 pb-16">
    <!-- Ambient Background Glows -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#f5c518]/10 rounded-full blur-[130px]"></div>
      <div class="absolute bottom-1/3 left-1/4 w-[450px] h-[450px] bg-[#ef4444]/10 rounded-full blur-[110px]"></div>
    </div>

    <!-- Header Banner -->
    <div class="relative z-10 bg-[#080d19]/90 border border-[#1e304d] rounded-2xl p-5 md:p-6 shadow-2xl backdrop-blur-md font-serif flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="text-3xl">⚔️</span>
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold uppercase bg-gradient-to-r from-[#fffbeb] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent tracking-wide">
            LỊCH TRÌNH BANG HỘI & CHIẾN KỲ
          </h1>
          <p class="text-xs text-[#94a3b8] mt-0.5">
            Lịch đánh ấn định <span class="text-[#f5c518] font-bold">20h00 Thứ 7 hàng tuần</span> — Chu kỳ luân phiên 2 trận & 1 trận Bang Chiến
          </p>
        </div>
      </div>

      <RouterLink
        to="/lineup"
        class="w-full sm:w-auto px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:brightness-125 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-105 font-serif flex items-center justify-center gap-2"
      >
        <span>📜</span>
        <span>XEM TRẬN PHÁI TÁC CHIẾN</span>
      </RouterLink>
    </div>

    <!-- Hero Countdown Section -->
    <div class="relative z-10 bg-gradient-to-r from-[#0c1424]/95 via-[#09101f]/95 to-[#150f29]/95 border border-[#f5c518]/50 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(245,197,24,0.15)] backdrop-blur-md font-serif overflow-hidden">
      <!-- Top Tag Badge -->
      <div class="flex items-center justify-between flex-wrap gap-2 mb-4 border-b border-[#1c2e4a] pb-3">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-[#ef4444] animate-ping"></span>
          <span class="text-xs font-bold text-[#ef4444] uppercase tracking-wider">
            ĐẾM NGƯỢC ĐẾN TRẬN KẾ TIẾP (20:00 THỨ BẢY)
          </span>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-mono text-[#94a3b8]">
            📅 {{ nextBattleDateFormatted }}
          </span>
          <span
            class="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border shadow"
            :class="isCurrentWeekTwoMatch ? 'bg-[#d97706]/20 text-[#f5c518] border-[#f5c518]/40' : 'bg-[#3b82f6]/20 text-[#60a5fa] border-[#3b82f6]/40'"
          >
            {{ isCurrentWeekTwoMatch ? '⚔️⚔️ TUẦN 2 TRẬN BANG CHIẾN' : '⚔️ TUẦN 1 TRẬN BANG CHIẾN' }}
          </span>
        </div>
      </div>

      <!-- Main Timer Display -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-2 text-center md:text-left">
          <h2 class="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
            Thời Gian Còn Lại Cho Trận Chiến Tiếp Theo
          </h2>
          <p class="text-xs text-[#94a3b8] max-w-xl leading-relaxed">
            Tất cả đệ tử Thiên Thư Môn yêu cầu có mặt trước 15 phút tại Voice Discord để xếp đội hình và điểm danh an vị vị trí tác chiến!
          </p>
        </div>

        <!-- Digital Timer Boxes -->
        <div class="grid grid-cols-4 gap-2.5 sm:gap-3 text-center shrink-0">
          <div class="bg-[#050912] border border-[#1e304d] rounded-xl p-3 sm:p-4 min-w-[70px] sm:min-w-[85px] shadow-inner">
            <span class="text-2xl sm:text-3xl font-extrabold text-[#f5c518] font-mono block">
              {{ String(countdown.days).padStart(2, '0') }}
            </span>
            <span class="text-[10px] text-[#64748b] font-bold uppercase block mt-1">Ngày</span>
          </div>

          <div class="bg-[#050912] border border-[#1e304d] rounded-xl p-3 sm:p-4 min-w-[70px] sm:min-w-[85px] shadow-inner">
            <span class="text-2xl sm:text-3xl font-extrabold text-[#f5c518] font-mono block">
              {{ String(countdown.hours).padStart(2, '0') }}
            </span>
            <span class="text-[10px] text-[#64748b] font-bold uppercase block mt-1">Giờ</span>
          </div>

          <div class="bg-[#050912] border border-[#1e304d] rounded-xl p-3 sm:p-4 min-w-[70px] sm:min-w-[85px] shadow-inner">
            <span class="text-2xl sm:text-3xl font-extrabold text-[#f5c518] font-mono block">
              {{ String(countdown.minutes).padStart(2, '0') }}
            </span>
            <span class="text-[10px] text-[#64748b] font-bold uppercase block mt-1">Phút</span>
          </div>

          <div class="bg-[#050912] border border-[#1e304d] rounded-xl p-3 sm:p-4 min-w-[70px] sm:min-w-[85px] shadow-inner">
            <span class="text-2xl sm:text-3xl font-extrabold text-[#ef4444] font-mono block animate-pulse">
              {{ String(countdown.seconds).padStart(2, '0') }}
            </span>
            <span class="text-[10px] text-[#64748b] font-bold uppercase block mt-1">Giây</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Week Cycle Selector Tabs -->
    <div class="relative z-10 space-y-4 font-serif">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <h3 class="text-base font-extrabold uppercase tracking-wider text-[#93c5fd] flex items-center gap-2">
          <span>🔄 CHU KỲ & LỊCH TRÌNH BANG HỘI</span>
        </h3>

        <!-- Cycle Indicator Badges -->
        <div class="flex items-center gap-1.5 text-xs">
          <span class="text-[#64748b] font-bold">Chu kỳ luân phiên:</span>
          <span class="px-2 py-0.5 rounded bg-[#f5c518]/20 text-[#f5c518] border border-[#f5c518]/40 text-[10px] font-bold">
            2 Trận
          </span>
          <span class="text-[#64748b]">➔</span>
          <span class="px-2 py-0.5 rounded bg-[#3b82f6]/20 text-[#60a5fa] border border-[#3b82f6]/40 text-[10px] font-bold">
            1 Trận
          </span>
          <span class="text-[#64748b]">➔</span>
          <span class="px-2 py-0.5 rounded bg-[#f5c518]/20 text-[#f5c518] border border-[#f5c518]/40 text-[10px] font-bold">
            2 Trận
          </span>
        </div>
      </div>

      <!-- Tab Buttons -->
      <div class="grid grid-cols-3 gap-2 sm:gap-4">
        <button
          @click="selectedWeekTab = 0"
          class="p-3.5 sm:p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1"
          :class="selectedWeekTab === 0 ? 'bg-[#0f1d36] border-[#f5c518] text-white shadow-lg shadow-[#f5c518]/10 ring-1 ring-[#f5c518]/50' : 'bg-[#080d19]/80 border-[#1c2e4a] text-[#94a3b8] hover:text-white hover:border-[#334b73]'"
        >
          <span class="text-xs sm:text-sm font-extrabold uppercase">📌 Tuần Này</span>
          <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full" :class="isTabTwoMatch(0) ? 'bg-[#d97706]/20 text-[#f5c518]' : 'bg-[#3b82f6]/20 text-[#60a5fa]'">
            {{ isTabTwoMatch(0) ? '2 TRẬN BANG CHIẾN' : '1 TRẬN BANG CHIẾN' }}
          </span>
        </button>

        <button
          @click="selectedWeekTab = 1"
          class="p-3.5 sm:p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1"
          :class="selectedWeekTab === 1 ? 'bg-[#0f1d36] border-[#f5c518] text-white shadow-lg shadow-[#f5c518]/10 ring-1 ring-[#f5c518]/50' : 'bg-[#080d19]/80 border-[#1c2e4a] text-[#94a3b8] hover:text-white hover:border-[#334b73]'"
        >
          <span class="text-xs sm:text-sm font-extrabold uppercase">⏩ Tuần Kế Tiếp</span>
          <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full" :class="isTabTwoMatch(1) ? 'bg-[#d97706]/20 text-[#f5c518]' : 'bg-[#3b82f6]/20 text-[#60a5fa]'">
            {{ isTabTwoMatch(1) ? '2 TRẬN BANG CHIẾN' : '1 TRẬN BANG CHIẾN' }}
          </span>
        </button>

        <button
          @click="selectedWeekTab = 2"
          class="p-3.5 sm:p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1"
          :class="selectedWeekTab === 2 ? 'bg-[#0f1d36] border-[#f5c518] text-white shadow-lg shadow-[#f5c518]/10 ring-1 ring-[#f5c518]/50' : 'bg-[#080d19]/80 border-[#1c2e4a] text-[#94a3b8] hover:text-white hover:border-[#334b73]'"
        >
          <span class="text-xs sm:text-sm font-extrabold uppercase">⏭️ Tuần Kế Nữa</span>
          <span class="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full" :class="isTabTwoMatch(2) ? 'bg-[#d97706]/20 text-[#f5c518]' : 'bg-[#3b82f6]/20 text-[#60a5fa]'">
            {{ isTabTwoMatch(2) ? '2 TRẬN BANG CHIẾN' : '1 TRẬN BANG CHIẾN' }}
          </span>
        </button>
      </div>
    </div>

    <!-- Active Selected Week Details -->
    <div class="relative z-10 space-y-6 font-serif">
      <!-- Section 1: Weekday Activities (Thứ 2 - Thứ 6) -->
      <div class="bg-[#080d19]/90 border border-[#1e304d] rounded-2xl p-5 md:p-6 backdrop-blur-md space-y-4 shadow-xl">
        <div class="flex items-center gap-2 border-b border-[#17253b] pb-3">
          <span class="text-xl">📅</span>
          <h4 class="text-sm font-extrabold text-white uppercase tracking-wider">
            LỊCH HOẠT ĐỘNG TRONG TUẦN (THỨ 2 — THỨ 6)
          </h4>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Dungeon Card -->
          <div class="bg-[#050912] border border-[#1c2e4a] hover:border-[#38bdf8]/60 rounded-xl p-4 flex items-start gap-3.5 transition">
            <div class="w-12 h-12 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex flex-col items-center justify-center shrink-0 text-[#38bdf8]">
              <span class="text-xs font-bold font-serif uppercase">T2 - T3</span>
              <span class="text-[9px] font-mono">Cả ngày</span>
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h5 class="font-extrabold text-sm text-white">Đi Phó Bản Tuần</h5>
                <span class="px-2 py-0.2 text-[9px] font-bold bg-[#38bdf8]/20 text-[#38bdf8] rounded">Phó Bản</span>
              </div>
              <p class="text-xs text-[#94a3b8] leading-relaxed">
                Tập trung lực lượng các toán đi phó bản tuần cùng môn phái để thu thập nguyên liệu và nâng cấp trang bị.
              </p>
            </div>
          </div>

          <!-- Scrim Card -->
          <div class="bg-[#050912] border border-[#1c2e4a] hover:border-[#a855f7]/60 rounded-xl p-4 flex items-start gap-3.5 transition">
            <div class="w-12 h-12 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/30 flex flex-col items-center justify-center shrink-0 text-[#c084fc]">
              <span class="text-xs font-bold font-serif uppercase">T5 - T6</span>
              <span class="text-[9px] font-mono">Buổi Tối</span>
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h5 class="font-extrabold text-sm text-white">Scrim Luyện Tập</h5>
                <span class="px-2 py-0.2 text-[9px] font-bold bg-[#a855f7]/20 text-[#c084fc] rounded">Giao Lưu</span>
              </div>
              <p class="text-xs text-[#94a3b8] leading-relaxed">
                Scrim luyện tập cùng môn phái hàng xóm, rèn luyện kỹ năng combat và thử nghiệm đội hình tác chiến.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Saturday Main Event Detailed Schedule (Thứ 7 - 20:00) -->
      <div class="bg-[#080d19]/90 border border-[#f5c518]/40 rounded-2xl p-5 md:p-6 backdrop-blur-md space-y-4 shadow-2xl">
        <div class="flex items-center justify-between border-b border-[#1c2e4a] pb-3 flex-wrap gap-2">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🏆</span>
            <div>
              <h4 class="text-base font-extrabold text-white uppercase tracking-wider">
                LỊCH THỨ 7 — ĐẠI CHIẾN BANG HỘI
              </h4>
              <p class="text-xs text-[#94a3b8]">
                Bắt đầu từ <span class="text-[#f5c518] font-bold">20h00</span> tối Thứ 7
              </p>
            </div>
          </div>

          <span
            class="px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-wider border shadow"
            :class="selectedWeekInfo.isTwoMatch ? 'bg-[#d97706]/20 text-[#f5c518] border-[#f5c518]/50' : 'bg-[#3b82f6]/20 text-[#60a5fa] border-[#3b82f6]/50'"
          >
            {{ selectedWeekInfo.isTwoMatch ? '🔥 LỊCH TUẦN 2 TRẬN BANG CHIẾN' : '⚔️ LỊCH TUẦN 1 TRẬN BANG CHIẾN' }}
          </span>
        </div>

        <!-- 2-MATCH WEEK SCHEDULE -->
        <div v-if="selectedWeekInfo.isTwoMatch" class="space-y-3">
          <!-- Event 1: 20:00 -->
          <div class="bg-[#050912] border border-[#ef4444]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#ef4444] transition">
            <div class="flex items-center gap-3.5">
              <div class="w-16 h-12 rounded-xl bg-[#ef4444]/15 border border-[#ef4444]/40 flex flex-col items-center justify-center shrink-0">
                <span class="text-sm font-extrabold text-[#ef4444] font-mono">20:00</span>
                <span class="text-[9px] text-[#fca5a5] font-bold">8h00 Tối</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h5 class="font-extrabold text-sm text-white uppercase">⚔️ BANG CHIẾN TRẬN 1</h5>
                  <span class="px-2 py-0.2 text-[9px] font-bold bg-[#ef4444]/20 text-[#ef4444] rounded uppercase">Trận 1</span>
                </div>
                <p class="text-xs text-[#94a3b8] mt-0.5">
                  Mở màn trận Bang chiến lượt 1. Bắt buộc tập trung Voice Discord trước 15 phút.
                </p>
              </div>
            </div>
            <span class="text-xs font-mono text-[#ef4444] font-bold shrink-0">Bắt đầu 20:00</span>
          </div>

          <!-- Event 2: 20:30 -->
          <div class="bg-[#050912] border border-[#f5c518]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#f5c518] transition">
            <div class="flex items-center gap-3.5">
              <div class="w-16 h-12 rounded-xl bg-[#f5c518]/15 border border-[#f5c518]/40 flex flex-col items-center justify-center shrink-0">
                <span class="text-sm font-extrabold text-[#f5c518] font-mono">20:30</span>
                <span class="text-[9px] text-[#fef08a] font-bold">8h30 Tối</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h5 class="font-extrabold text-sm text-white uppercase">⚔️ BANG CHIẾN TRẬN 2</h5>
                  <span class="px-2 py-0.2 text-[9px] font-bold bg-[#f5c518]/20 text-[#f5c518] rounded uppercase">Trận 2</span>
                </div>
                <p class="text-xs text-[#94a3b8] mt-0.5">
                  Trận Bang chiến lượt 2 quyết định điểm số và thứ hạng môn phái.
                </p>
              </div>
            </div>
            <span class="text-xs font-mono text-[#f5c518] font-bold shrink-0">Bắt đầu 20:30</span>
          </div>

          <!-- Event 3: 21:00 -->
          <div class="bg-[#050912] border border-[#ec4899]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#ec4899] transition">
            <div class="flex items-center gap-3.5">
              <div class="w-16 h-12 rounded-xl bg-[#ec4899]/15 border border-[#ec4899]/40 flex flex-col items-center justify-center shrink-0">
                <span class="text-sm font-extrabold text-[#ec4899] font-mono">21:00</span>
                <span class="text-[9px] text-[#fbcfe8] font-bold">9h00 Tối</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h5 class="font-extrabold text-sm text-white uppercase">🌸 BANG HOA GIẢI CỨU MỸ NHÂN</h5>
                  <span class="px-2 py-0.2 text-[9px] font-bold bg-[#ec4899]/20 text-[#f472b6] rounded uppercase">Hoạt Động Bang</span>
                </div>
                <p class="text-xs text-[#94a3b8] mt-0.5">
                  Giải cứu mỹ nhân khỏi Sơn Trại Vương Đỗ Tử Đằng, giải cứu môn phái.
                </p>
              </div>
            </div>
            <span class="text-xs font-mono text-[#f472b6] font-bold shrink-0">Bắt đầu 21:00</span>
          </div>

          <!-- Event 4: 21:15 -->
          <div class="bg-[#050912] border border-[#10b981]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#10b981] transition">
            <div class="flex items-center gap-3.5">
              <div class="w-16 h-12 rounded-xl bg-[#10b981]/15 border border-[#10b981]/40 flex flex-col items-center justify-center shrink-0">
                <span class="text-sm font-extrabold text-[#10b981] font-mono">21:15</span>
                <span class="text-[9px] text-[#a7f3d0] font-bold">9h15 Tối</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h5 class="font-extrabold text-sm text-white uppercase">🎁 ĐỊNH THƯỞNG PHẠT & GIVE AWAY THẺ THÁNG</h5>
                  <span class="px-2 py-0.2 text-[9px] font-bold bg-[#10b981]/20 text-[#34d399] rounded uppercase">Phát Quà</span>
                </div>
                <p class="text-xs text-[#94a3b8] mt-0.5">
                  Tổng kết công trạng, định thưởng phạt kỷ luật và quay thưởng Give Away thẻ tháng cho đệ tử xuất sắc.
                </p>
              </div>
            </div>
            <span class="text-xs font-mono text-[#34d399] font-bold shrink-0">Bắt đầu 21:15</span>
          </div>
        </div>

        <!-- 1-MATCH WEEK SCHEDULE -->
        <div v-else class="space-y-3">
          <!-- Event 1: 20:00 -->
          <div class="bg-[#050912] border border-[#3b82f6]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#3b82f6] transition">
            <div class="flex items-center gap-3.5">
              <div class="w-16 h-12 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/40 flex flex-col items-center justify-center shrink-0">
                <span class="text-sm font-extrabold text-[#60a5fa] font-mono">20:00</span>
                <span class="text-[9px] text-[#93c5fd] font-bold">8h00 Tối</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h5 class="font-extrabold text-sm text-white uppercase">⚔️ TRẬN BANG CHIẾN ĐỊNH BẢNG</h5>
                  <span class="px-2 py-0.2 text-[9px] font-bold bg-[#3b82f6]/20 text-[#60a5fa] rounded uppercase">Định Bảng</span>
                </div>
                <p class="text-xs text-[#94a3b8] mt-0.5">
                  Trận Bang chiến duy nhất trong tuần, quyết định vị trí bảng xếp hạng. Tập trung Voice trước 15 phút.
                </p>
              </div>
            </div>
            <span class="text-xs font-mono text-[#60a5fa] font-bold shrink-0">Bắt đầu 20:00</span>
          </div>

          <!-- Event 2: 20:30 -->
          <div class="bg-[#050912] border border-[#10b981]/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#10b981] transition">
            <div class="flex items-center gap-3.5">
              <div class="w-16 h-12 rounded-xl bg-[#10b981]/15 border border-[#10b981]/40 flex flex-col items-center justify-center shrink-0">
                <span class="text-sm font-extrabold text-[#10b981] font-mono">20:30</span>
                <span class="text-[9px] text-[#a7f3d0] font-bold">8h30 Tối</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h5 class="font-extrabold text-sm text-white uppercase">🎁 ĐỊNH THƯỞNG PHẠT & GIVE AWAY THẺ THÁNG</h5>
                  <span class="px-2 py-0.2 text-[9px] font-bold bg-[#10b981]/20 text-[#34d399] rounded uppercase">Phát Quà</span>
                </div>
                <p class="text-xs text-[#94a3b8] mt-0.5">
                  Tổng kết trận đấu, định thưởng phạt và quay thưởng Give Away thẻ tháng cho đệ tử môn phái.
                </p>
              </div>
            </div>
            <span class="text-xs font-mono text-[#34d399] font-bold shrink-0">Bắt đầu 20:30</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const selectedWeekTab = ref(0);
const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
const nextBattleDateFormatted = ref('');
let timerInterval = null;

// Anchor Date for Week Cycle Calculation
// Monday Aug 3, 2026 is Week 0 (2-match week)
const ANCHOR_DATE = new Date('2026-08-03T00:00:00+07:00');

const getWeekOffsetFromAnchor = (d = new Date()) => {
  const diffTime = d.getTime() - ANCHOR_DATE.getTime();
  return Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
};

const isTwoMatchWeekByIndex = (weekIndex) => {
  return Math.abs(weekIndex) % 2 === 0;
};

const currentWeekOffset = computed(() => getWeekOffsetFromAnchor(new Date()));

const isCurrentWeekTwoMatch = computed(() => {
  return isTwoMatchWeekByIndex(currentWeekOffset.value);
});

const isTabTwoMatch = (tabIndex) => {
  return isTwoMatchWeekByIndex(currentWeekOffset.value + tabIndex);
};

const selectedWeekInfo = computed(() => {
  const targetWeekOffset = currentWeekOffset.value + selectedWeekTab.value;
  const isTwoMatch = isTwoMatchWeekByIndex(targetWeekOffset);
  return {
    weekIndex: targetWeekOffset,
    isTwoMatch
  };
});

const updateCountdown = () => {
  const now = new Date();

  // Find next Saturday 20:00:00
  const day = now.getDay();
  let daysUntilSaturday = (6 - day + 7) % 7;

  if (day === 6) {
    const today20 = new Date(now);
    today20.setHours(20, 0, 0, 0);
    if (now >= today20) {
      daysUntilSaturday = 7;
    }
  }

  const nextSat = new Date(now);
  nextSat.setDate(now.getDate() + daysUntilSaturday);
  nextSat.setHours(20, 0, 0, 0);

  nextBattleDateFormatted.value = nextSat.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ' — 20:00';

  const diffMs = nextSat.getTime() - now.getTime();
  if (diffMs <= 0) {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return;
  }

  countdown.value.days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  countdown.value.hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  countdown.value.minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  countdown.value.seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
};

onMounted(() => {
  updateCountdown();
  timerInterval = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>
