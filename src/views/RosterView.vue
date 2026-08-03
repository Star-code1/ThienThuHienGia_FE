<template>
  <div class="relative min-h-[calc(100vh-57px)] text-[#e2e8f0] p-6 max-w-7xl mx-auto font-sans select-none space-y-6">
    <!-- Header -->
    <div class="border-b border-[#172439] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-2xl">👥</span>
          <h1 class="text-2xl font-extrabold uppercase font-serif tracking-wide bg-gradient-to-r from-[#fef08a] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent">
            QUẢN LÝ BANG HỘI THIÊN THƯ MÔN
          </h1>
        </div>
        <p class="text-xs text-[#94a3b8] mt-1">Danh sách thành viên, võ phái & cơ cấu tổ chức bang hội</p>
      </div>

      <div class="flex items-center gap-2">
        <input
          v-model="search"
          type="text"
          placeholder="🔍 Tìm tên thành viên..."
          class="bg-[#0f172a] text-xs text-white placeholder-[#64748b] px-3 py-2 rounded-lg border border-[#1e293b] focus:outline-none focus:border-[#3b82f6] w-52"
        />
        <RouterLink
          to="/lineup"
          class="px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#3b82f6] text-white text-xs font-bold transition shadow-md"
        >
          Xếp Đội Hình ➔
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
          selectedClass === c.name ? 'border-[#f5c518] bg-[#f5c518]/10' : 'border-[#17263c] hover:border-[#3b82f6]'
        ]"
      >
        <img v-if="c.icon" :src="c.icon" :alt="c.name" class="w-6 h-6 object-contain mb-1" />
        <span class="text-xs font-bold text-white">{{ c.name }}</span>
        <span class="text-[10px] text-[#64748b] mt-0.5 font-mono">
          {{ getClassCount(c.name) }} người
        </span>
      </div>
    </div>

    <!-- Member Roster Table -->
    <div class="bg-[#080d19]/90 border border-[#17263c] rounded-2xl overflow-hidden shadow-2xl">
      <div class="p-4 border-b border-[#17263c] flex justify-between items-center bg-[#050810]">
        <h3 class="text-sm font-bold uppercase tracking-wider text-[#93c5fd]">
          Danh Sách Quân Số Bang Hội ({{ filteredMembers.length }} thành viên)
        </h3>
        <span class="text-xs text-[#64748b]" v-if="selectedClass !== 'all'">
          Đang lọc phái: <strong class="text-[#f5c518]">{{ selectedClass }}</strong>
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-[#0f172a] text-[#64748b] uppercase text-[10px] tracking-wider border-b border-[#1e293b]">
            <tr>
              <th class="py-3 px-4">Tên Nhân Vật</th>
              <th class="py-3 px-4">Võ Phái</th>
              <th class="py-3 px-4">Vai Trò</th>
              <th class="py-3 px-4">Trạng Thái</th>
              <th class="py-3 px-4 text-right">Tác Vụ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#17263c]">
            <tr v-for="m in filteredMembers" :key="m.userId" class="hover:bg-[#0f172a]/60 transition">
              <td class="py-3 px-4 font-bold text-white flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#34d399]"></span>
                {{ m.displayName }}
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded text-[11px] font-semibold border" :style="{ borderColor: getClassHex(m.className), color: getClassHex(m.className), backgroundColor: `${getClassHex(m.className)}15` }">
                  {{ m.className }}
                </span>
              </td>
              <td class="py-3 px-4 text-[#cbd5e1] font-mono">{{ m.roleName || 'Chiến Hữu' }}</td>
              <td class="py-3 px-4">
                <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/30">
                  Sẵn Sàng
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <RouterLink to="/lineup" class="text-[11px] text-[#60a5fa] hover:underline font-semibold">
                  Sắp Slot ➔
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
import { ref, computed } from 'vue';
import { CLASS_LIST, getClassInfo } from '../theme/classColors';
import { useLineupStore } from '../stores/lineupStore';

const store = useLineupStore();

const search = ref('');
const selectedClass = ref('all');

const members = computed(() => {
  return store.attendancePool.map((m) => ({
    userId: m.userId,
    displayName: m.displayName || m.username,
    className: m.className || m.class || 'Huyết Hà',
    roleName: m.roleName || m.role || 'DPS'
  }));
});

const getClassCount = (cName) => {
  return members.value.filter((m) => m.className.toLowerCase() === cName.toLowerCase()).length;
};

const getClassHex = (cName) => {
  return getClassInfo(cName).hex;
};

const filteredMembers = computed(() => {
  return members.value.filter((m) => {
    const nameMatch = !search.value || m.displayName.toLowerCase().includes(search.value.toLowerCase());
    const classMatch = selectedClass.value === 'all' || m.className.toLowerCase() === selectedClass.value.toLowerCase();
    return nameMatch && classMatch;
  });
});
</script>
