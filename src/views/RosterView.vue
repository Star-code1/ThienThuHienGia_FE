<template>
  <div class="relative min-h-[calc(100vh-57px)] text-[#e2e8f0] p-6 max-w-7xl mx-auto font-sans select-none space-y-6">
    <!-- Header -->
    <div class="border-b border-[#172439] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">👥</span>
          <h1 class="text-2xl font-extrabold uppercase font-serif tracking-wide bg-gradient-to-r from-[#fef08a] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent">
            TRỊ BANG HIỀN GIẢ — THIÊN THƯ MÔN
          </h1>
        </div>
        <p class="text-xs text-[#94a3b8] mt-1 font-serif">
          Danh sách ghi danh võ phái đệ tử trực thuộc Thiên Thư Môn
        </p>
      </div>

      <div class="flex items-center gap-2">
        <input
          v-model="search"
          type="text"
          placeholder="🔍 Tìm biệt danh / đệ tử..."
          class="bg-[#0f172a] text-xs text-white placeholder-[#64748b] px-3 py-2 rounded-xl border border-[#1e293b] focus:outline-none focus:border-[#3b82f6] w-56 font-serif"
        />
        <RouterLink
          to="/lineup"
          class="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold transition shadow-md font-serif"
        >
          Trận Phái ➔
        </RouterLink>
      </div>
    </div>

    <!-- Class Breakdown Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      <div
        v-for="c in CLASS_LIST"
        :key="c.name"
        @click="selectedClass = selectedClass === c.name ? 'all' : c.name"
        class="bg-[#080d19]/90 border rounded-xl p-3 flex flex-col items-center cursor-pointer transition select-none"
        :class="[
          selectedClass === c.name ? 'border-[#f5c518] bg-[#f5c518]/10 shadow-[0_0_12px_rgba(245,197,24,0.2)]' : 'border-[#17263c] hover:border-[#3b82f6]'
        ]"
      >
        <img v-if="c.icon" :src="c.icon" :alt="c.name" class="w-7 h-7 object-contain mb-1" />
        <span class="text-xs font-bold text-white font-serif">{{ c.name }}</span>
        <span class="text-[10px] text-[#f5c518] mt-0.5 font-mono font-bold">
          {{ getClassCount(c.name) }} đệ tử
        </span>
      </div>
    </div>

    <!-- Member Roster Table -->
    <div class="bg-[#080d19]/90 border border-[#17263c] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      <div class="p-4 border-b border-[#17263c] flex justify-between items-center bg-[#050810]">
        <h3 class="text-sm font-bold uppercase tracking-wider text-[#93c5fd] font-serif flex items-center gap-2">
          <span>📜 Danh Sách Đệ Tử Bang Chúng ({{ filteredMembers.length }} đệ tử)</span>
        </h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs font-serif">
          <thead class="bg-[#0f172a] text-[#64748b] uppercase text-[10px] tracking-wider border-b border-[#1e293b]">
            <tr>
              <th class="py-3 px-4">Biệt Danh / Tên Đệ Tử</th>
              <th class="py-3 px-4">Võ Phái</th>
              <th class="py-3 px-4">Chức Vị Bang Hoi</th>
              <th class="py-3 px-4">Trạng Thái</th>
              <th class="py-3 px-4 text-right">Tác Vụ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#17263c]">
            <tr v-for="m in filteredMembers" :key="m.userId" class="hover:bg-[#0f172a]/60 transition">
              <td class="py-3 px-4 font-bold text-white flex items-center gap-3">
                <img :src="m.avatar" class="w-8 h-8 rounded-lg object-cover border border-[#1e304d]" />
                <div>
                  <span class="text-xs font-bold text-white block font-serif">{{ m.displayName }}</span>
                  <span class="text-[10px] text-[#64748b] font-mono block">@{{ m.username }}</span>
                </div>
              </td>

              <td class="py-3 px-4">
                <span
                  class="px-2.5 py-0.5 rounded text-[11px] font-semibold border flex items-center gap-1.5 w-fit font-serif"
                  :style="{ borderColor: getClassHex(m.className), color: getClassHex(m.className), backgroundColor: `${getClassHex(m.className)}15` }"
                >
                  <img v-if="getClassIcon(m.className)" :src="getClassIcon(m.className)" class="w-3.5 h-3.5 object-contain" />
                  <span>{{ m.className }}</span>
                </span>
              </td>

              <td class="py-3 px-4">
                <span
                  v-if="getMemberPrimaryRole(m) === 'Đương Gia'"
                  class="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-[#f5c518]/20 text-[#f5c518] border border-[#f5c518]/40 font-serif"
                >
                  ⭐ Đương Gia
                </span>
                <span
                  v-else-if="getMemberPrimaryRole(m) === 'Đường Chủ'"
                  class="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40 font-serif"
                >
                  👑 Đường Chủ
                </span>
                <span
                  v-else
                  class="text-[10px] px-2.5 py-0.5 rounded-full font-medium uppercase bg-[#1e293b] text-[#94a3b8] border border-[#334155] font-serif"
                >
                  📜 Bang Chúng
                </span>
              </td>

              <td class="py-3 px-4">
                <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/30 font-serif">
                  Sẵn Sàng
                </span>
              </td>

              <td class="py-3 px-4 text-right">
                <RouterLink to="/lineup" class="text-[11px] text-[#60a5fa] hover:underline font-semibold font-serif">
                  An Vị Trận Đồ ➔
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { CLASS_LIST, getClassInfo, getClassIcon } from '../theme/classColors';
import { useLineupStore } from '../stores/lineupStore';
import { useAuthStore } from '../stores/authStore';

const lineupStore = useLineupStore();
const authStore = useAuthStore();

const search = ref('');
const selectedClass = ref('all');

onMounted(() => {
  authStore.fetchGuildStats();
});

const members = computed(() => {
  if (authStore.guildMembers && authStore.guildMembers.length > 0) {
    return authStore.guildMembers.map((m) => ({
      userId: m.userId || m.discordId,
      username: m.username,
      displayName: m.displayName || m.nickname || m.globalName || m.username,
      avatar: m.avatar,
      className: m.className || 'Huyết Hà',
      roleName: m.roleName || 'Bang Chúng'
    }));
  }

  return lineupStore.attendancePool.map((m) => ({
    userId: m.userId,
    username: m.username || 'member',
    displayName: m.displayName || m.username,
    avatar: m.avatar || `https://cdn.discordapp.com/embed/avatars/0.png`,
    className: m.className || m.class || 'Huyết Hà',
    roleName: m.roleName || 'Bang Chúng'
  }));
});

const getClassCount = (cName) => {
  return members.value.filter((m) => m.className.toLowerCase() === cName.toLowerCase()).length;
};

const getClassHex = (cName) => {
  return getClassInfo(cName).hex;
};

const getMemberPrimaryRole = (m) => {
  if (m.primaryRole) return m.primaryRole;
  if (m.roles && Array.isArray(m.roles)) {
    if (m.roles.includes('Đương Gia') || m.roles.includes('1438965974345842768')) return 'Đương Gia';
    if (m.roles.includes('Đường Chủ') || m.roles.includes('1438966724082012290')) return 'Đường Chủ';
  }
  if (m.roleName) {
    if (m.roleName.includes('Đương Gia')) return 'Đương Gia';
    if (m.roleName.includes('Đường Chủ')) return 'Đường Chủ';
  }
  return 'Bang Chúng';
};

const filteredMembers = computed(() => {
  return members.value.filter((m) => {
    const nameMatch =
      !search.value ||
      m.displayName.toLowerCase().includes(search.value.toLowerCase()) ||
      m.username.toLowerCase().includes(search.value.toLowerCase());
    const classMatch = selectedClass.value === 'all' || m.className.toLowerCase() === selectedClass.value.toLowerCase();
    return nameMatch && classMatch;
  });
});
</script>
