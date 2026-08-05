<template>
  <div class="relative min-h-[calc(100vh-57px)] text-[#e2e8f0] p-6 max-w-4xl mx-auto font-sans select-none space-y-6">
    <!-- Header Page Banner -->
    <div class="border-b border-[#172439] pb-4 flex items-center justify-between">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">👤</span>
          <h1 class="text-2xl font-extrabold uppercase font-serif tracking-wide bg-gradient-to-r from-[#fef08a] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent">
            TIÊN MÔN HỒ SƠ — THIÊN THƯ MÔN
          </h1>
        </div>
        <p class="text-xs text-[#94a3b8] mt-1 font-serif">Thông tin ấn định võ phái đệ tử và thẩm quyền tác chiến</p>
      </div>

      <RouterLink
        to="/"
        class="px-4 py-2 rounded-xl bg-[#121c2e] hover:bg-[#1b2b45] text-[#94a3b8] hover:text-white border border-[#1e304d] text-xs font-bold transition font-serif"
      >
        🏠 Trang Chủ
      </RouterLink>
    </div>

    <!-- Main Profile Card -->
    <div class="bg-[#080d19]/90 border border-[#1e304d] rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md space-y-6 relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 text-9xl opacity-5 pointer-events-none">
        📜
      </div>

      <!-- Top Profile Overview -->
      <div class="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-[#142033] pb-6">
        <!-- Avatar -->
        <div class="relative group">
          <img
            :src="user?.avatar"
            :alt="user?.username"
            class="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-2 border-[#f5c518]/60 shadow-[0_0_25px_rgba(245,197,24,0.25)]"
          />
          <span class="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-[#34d399] border-2 border-[#080d19] flex items-center justify-center text-[10px] text-black font-bold" title="Trạng thái quy phục">
            ✓
          </span>
        </div>

        <!-- Details -->
        <div class="text-center md:text-left space-y-2 flex-1 font-serif">
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <h2 class="text-2xl font-bold text-white tracking-wide">
              {{ user?.nickname || user?.globalName || user?.username }}
            </h2>

            <!-- Class Badge (Strictly Read-Only from Discord Server) -->
            <span
              class="px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border shadow"
              :style="{ backgroundColor: `${classHex}20`, borderColor: `${classHex}60`, color: classHex }"
              title="Môn Phái được đồng bộ tự động từ Discord Server"
            >
              <img v-if="classIcon" :src="classIcon" class="w-4 h-4 object-contain" />
              <span>{{ user?.className || 'Bang Chúng' }}</span>
            </span>
          </div>

          <span class="text-xs text-[#64748b] block font-mono">
            Discord Handle: @{{ user?.username }}
          </span>

          <!-- Role Badges -->
          <div class="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
            <span
              v-if="userPrimaryRole === 'Đương Gia'"
              class="px-3 py-1 rounded-md bg-[#f5c518]/20 border border-[#f5c518]/50 text-[#f5c518] text-xs font-extrabold shadow-[0_0_10px_rgba(245,197,24,0.3)] flex items-center gap-1.5"
            >
              <span>⭐</span>
              <span>ĐƯƠNG GIA (Chưởng Quản Môn Phái)</span>
            </span>

            <span
              v-else-if="userPrimaryRole === 'Đường Chủ'"
              class="px-3 py-1 rounded-md bg-[#38bdf8]/20 border border-[#38bdf8]/50 text-[#38bdf8] text-xs font-extrabold shadow-[0_0_10px_rgba(56,189,248,0.3)] flex items-center gap-1.5"
            >
              <span>👑</span>
              <span>ĐƯỜNG CHỦ (Chưởng Quản Trận Đồ)</span>
            </span>

            <span
              v-else
              class="px-3 py-1 rounded-md bg-[#1e293b] border border-[#334155] text-[#94a3b8] text-xs font-bold flex items-center gap-1.5"
            >
              <span>📜</span>
              <span>BANG CHÚNG (Xuất Trận Chiêm Ngưỡng)</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Information Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 font-serif">
        <!-- Card 1: Guild Status -->
        <div class="bg-[#0c1424] border border-[#182840] rounded-xl p-5 space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-[#f5c518] flex items-center gap-2">
            <span>🛡️ TIÊN MÔN THÂN PHẬN</span>
          </h3>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between py-1 border-b border-[#142033]">
              <span class="text-[#64748b]">Tông Môn:</span>
              <span class="text-[#34d399] font-bold">Thiên Thư Môn</span>
            </div>
            <div class="flex justify-between py-1 border-b border-[#142033]">
              <span class="text-[#64748b]">Biệt Danh Xuất Trận:</span>
              <span class="text-white font-semibold">{{ user?.nickname || 'Chưa đặt' }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-[#64748b]">Võ Phái Thể Hiện:</span>
              <span class="font-bold flex items-center gap-1" :style="{ color: classHex }">
                <img v-if="classIcon" :src="classIcon" class="w-3.5 h-3.5 object-contain" />
                <span>{{ user?.className || 'Bang Chúng' }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Card 2: Permissions Overview -->
        <div class="bg-[#0c1424] border border-[#182840] rounded-xl p-5 space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-[#38bdf8] flex items-center gap-2">
            <span>⚔️ CHƯƠNG QUẢN & THẨM QUYỀN</span>
          </h3>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between py-1 border-b border-[#142033]">
              <span class="text-[#64748b]">Quyền Tác Động Ma Trận:</span>
              <span v-if="user?.canEdit" class="text-[#34d399] font-bold">Toàn Quyền Định Đoạt</span>
              <span v-else class="text-[#94a3b8] font-bold">Quan Sát Trận Đồ</span>
            </div>
            <div class="flex justify-between py-1 border-b border-[#142033]">
              <span class="text-[#64748b]">Chức Vị Thẩm Quyền:</span>
              <span class="text-[#f5c518] font-mono font-bold">{{ userPrimaryRole }}</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-[#64748b]">Đồng Bộ Võ Phái:</span>
              <span class="text-[#34d399] font-medium">✅ Tự Động Từ Discord Server</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { getClassInfo } from '../theme/classColors';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const classInfo = computed(() => getClassInfo(user.value?.className || ''));
const classHex = computed(() => classInfo.value.hex);
const classIcon = computed(() => classInfo.value.icon);

const userPrimaryRole = computed(() => {
  if (user.value?.primaryRole) return user.value.primaryRole;
  if (user.value?.roles && user.value.roles.includes('Đương Gia')) return 'Đương Gia';
  if (user.value?.roles && user.value.roles.includes('Đường Chủ')) return 'Đường Chủ';
  if (user.value?.canEdit) return 'Đương Gia';
  return 'Bang Chúng';
});
</script>
