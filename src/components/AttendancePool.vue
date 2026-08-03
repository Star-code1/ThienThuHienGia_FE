<template>
  <div
    class="bg-[#080d17]/95 border border-[#17263c] rounded-lg p-3 text-white h-full flex flex-col shadow-2xl transition-all font-sans select-none"
    @dragover.prevent
    @drop="onDropToPool"
  >
    <!-- Header Drawer -->
    <div class="pb-2 mb-2 border-b border-[#18263e] flex justify-between items-center">
      <h3 class="font-bold text-xs uppercase tracking-wider text-[#f5c518] flex items-center gap-1.5">
        <span>Chờ Xếp Đội Hình</span>
      </h3>
      <span class="bg-[#f5c518]/10 text-[#f5c518] border border-[#f5c518]/30 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
        {{ filteredPool.length }} / {{ pool.length }}
      </span>
    </div>

    <!-- Thanh Tìm Kiếm Thành Viên -->
    <div class="mb-2 relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Tìm tên thành viên..."
        class="w-full bg-[#060a12] text-xs text-[#e2e8f0] placeholder-[#64748b] px-2.5 py-1.5 rounded-md border border-[#1e293b] focus:outline-none focus:border-[#3b82f6] transition"
      />
      <button
        v-if="searchQuery"
        @click="searchQuery = ''"
        class="absolute right-2 top-1.5 text-xs text-[#64748b] hover:text-white"
      >
        ✕
      </button>
    </div>

    <!-- Bộ Lọc Class & Role -->
    <div class="grid grid-cols-2 gap-1.5 mb-2">
      <!-- Lọc Theo Phái (Class) -->
      <div>
        <select
          v-model="selectedClass"
          class="w-full bg-[#060a12] border border-[#1e293b] text-[#cbd5e1] text-[11px] rounded px-1.5 py-1 focus:outline-none focus:border-[#3b82f6] cursor-pointer"
        >
          <option value="all">Tất cả Phái</option>
          <option v-for="c in CLASS_LIST" :key="c.name" :value="c.name">
            {{ c.name }}
          </option>
        </select>
      </div>

      <!-- Lọc Theo Role (Vai trò) -->
      <div>
        <select
          v-model="selectedRole"
          class="w-full bg-[#060a12] border border-[#1e293b] text-[#cbd5e1] text-[11px] rounded px-1.5 py-1 focus:outline-none focus:border-[#3b82f6] cursor-pointer"
        >
          <option value="all">Tất cả Role</option>
          <option v-for="role in availableRoles" :key="role" :value="role">
            {{ role }}
          </option>
        </select>
      </div>
    </div>

    <!-- Nút Đặt Lại Bộ Lọc khi có lọc -->
    <div v-if="hasActiveFilter" class="mb-2 flex justify-between items-center text-[10px] text-[#3b82f6]">
      <span>Đang lọc: {{ filteredPool.length }} kết quả</span>
      <button @click="resetFilters" class="hover:underline font-semibold text-[#ef5757]">
        Xóa bộ lọc
      </button>
    </div>

    <!-- Danh sách thành viên đã lọc -->
    <div class="space-y-1.5 overflow-y-auto pr-1 flex-1 min-h-[100px]">
      <div
        v-for="element in filteredPool"
        :key="element.userId"
        draggable="true"
        @dragstart="onDragStart($event, element)"
        class="cursor-grab active:cursor-grabbing hover:brightness-125 transition rounded"
      >
        <TacticalSlotRow
          :slot="element"
          :isEditMode="true"
        />
      </div>

      <!-- Khi không tìm thấy kết quả phù hợp -->
      <div v-if="filteredPool.length === 0" class="py-8 text-center text-xs text-[#475569] italic">
        <template v-if="pool.length === 0">
          Đã xếp hết thành viên vào đội hình!
        </template>
        <template v-else>
          Không tìm thấy thành viên phù hợp với bộ lọc!
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TacticalSlotRow from './TacticalSlotRow.vue';
import { useLineupStore } from '../stores/lineupStore';
import { CLASS_LIST } from '../theme/classColors';

const props = defineProps({
  pool: { type: Array, default: () => [] }
});

const store = useLineupStore();

const searchQuery = ref('');
const selectedClass = ref('all');
const selectedRole = ref('all');

// Lấy danh sách các Role duy nhất có trong Pool
const availableRoles = computed(() => {
  const roles = new Set();
  props.pool.forEach((m) => {
    const r = m.roleName || m.role;
    if (r && r.trim()) roles.add(r.trim());
  });

  // Thêm các role phổ biến mặc định nếu chưa có
  ['Tank', 'DPS', 'Heal', 'Leader'].forEach((defaultRole) => {
    roles.add(defaultRole);
  });

  return Array.from(roles);
});

// Lọc danh sách thành viên theo Từ khóa tìm kiếm + Class + Role
const filteredPool = computed(() => {
  return props.pool.filter((member) => {
    // 1. Tìm kiếm tên (displayName hoặc username)
    const name = (member.displayName || member.username || '').toLowerCase();
    const query = searchQuery.value.trim().toLowerCase();
    if (query && !name.includes(query)) {
      return false;
    }

    // 2. Lọc theo Phái (Class)
    if (selectedClass.value && selectedClass.value !== 'all') {
      const cName = (member.className || member.class || '').toLowerCase();
      if (cName !== selectedClass.value.toLowerCase()) {
        return false;
      }
    }

    // 3. Lọc theo Vai trò (Role)
    if (selectedRole.value && selectedRole.value !== 'all') {
      const rName = (member.roleName || member.role || '').toLowerCase();
      if (!rName.includes(selectedRole.value.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
});

const hasActiveFilter = computed(() => {
  return searchQuery.value.trim() !== '' || selectedClass.value !== 'all' || selectedRole.value !== 'all';
});

const resetFilters = () => {
  searchQuery.value = '';
  selectedClass.value = 'all';
  selectedRole.value = 'all';
};

const onDragStart = (evt, member) => {
  const payload = {
    source: 'pool',
    member,
  };
  evt.dataTransfer.setData('application/json', JSON.stringify(payload));
};

const onDropToPool = (evt) => {
  try {
    const raw = evt.dataTransfer.getData('application/json');
    if (!raw) return;
    const data = JSON.parse(raw);

    if (data.source === 'slot') {
      store.clearSlot(data.dIdx, data.tIdx, data.sIdx);
    } else if (data.source === 'leader') {
      store.clearRung(data.leader.userId.includes('rung1') ? 'rung1' : 'rung2');
    }
  } catch (e) {
    console.error('Lỗi khi thả về pool:', e);
  }
};
</script>