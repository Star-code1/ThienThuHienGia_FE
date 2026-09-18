<template lang="pug">
.pool-container(
  :class="themeStore.theme === 'light' ? 'pool-light' : 'pool-dark'"
  @dragover.prevent
  @drop="onDropToPool"
)
  //- Header Drawer
  .pool-header
    h3.pool-title Chờ An Vị Trận Đồ
    span.pool-counter {{ filteredPool.length }} / {{ pool.length }}

  //- Modal Thêm Đệ Tử
  AddMemberModal(
    :visible="showAddModal"
    @close="showAddModal = false"
    @add="handleAddMember"
  )

  //- Thanh Tìm Kiếm Đệ Tử
  .search-box
    input.search-input(
      v-model="searchQuery"
      type="text"
      placeholder="🔍 Tìm đệ tử..."
    )
    button.clear-search-btn(
      v-if="searchQuery"
      @click="searchQuery = ''"
    ) ✕

  //- Bộ Lọc Phái & Chức Vị
  .filter-grid
    select.filter-select(v-model="selectedClass")
      option(value="all") Tất cả Võ Phái
      option(v-for="c in CLASS_LIST" :key="c.name" :value="c.name") {{ c.name }}

    select.filter-select(v-model="selectedRole")
      option(value="all") Tất cả Chức Vị
      option(v-for="role in availableRoles" :key="role" :value="role") {{ role }}

  //- Nút Đặt Lại Bộ Lọc khi có lọc
  .active-filter-row(v-if="hasActiveFilter")
    span.filter-count Đang lọc: {{ filteredPool.length }} đệ tử
    button.reset-filter-btn(@click="resetFilters") Xóa bộ lọc

  //- Danh sách đệ tử chờ an vị
  .pool-list
    .pool-item(
      v-for="element in filteredPool"
      :key="element.userId"
      draggable="true"
      @dragstart="onDragStart($event, element)"
    )
      TacticalSlotRow(
        :slot="element"
        :isEditMode="true"
        @deleteExternal="store.deleteExternalMember(element.userId)"
      )

    //- Khi không tìm thấy kết quả phù hợp
    .empty-pool-text(v-if="filteredPool.length === 0")
      template(v-if="pool.length === 0") Tất cả đệ tử đã an vị trận đồ!
      template(v-else) Không tìm thấy đệ tử phù hợp bộ lọc!
</template>

<script setup>
import { ref, computed } from 'vue';
import TacticalSlotRow from './TacticalSlotRow.vue';
import AddMemberModal from './AddMemberModal.vue';
import { useLineupStore } from '../../stores/lineupStore';
import { useThemeStore } from '../../stores/themeStore';
import { CLASS_LIST } from '../../theme/classColors';

const props = defineProps({
  pool: { type: Array, default: () => [] }
});

const store = useLineupStore();
const themeStore = useThemeStore();

const showAddModal = ref(false);
const searchQuery = ref('');
const selectedClass = ref('all');
const selectedRole = ref('all');

const handleAddMember = (memberData) => {
  store.addExternalMember(memberData);
};

const availableRoles = computed(() => {
  const roles = new Set();
  props.pool.forEach((m) => {
    const r = m.roleName || m.role;
    if (r && r.trim()) roles.add(r.trim());
  });

  ['Tank', 'DPS', 'Heal', 'Leader'].forEach((defaultRole) => {
    roles.add(defaultRole);
  });

  return Array.from(roles);
});

const filteredPool = computed(() => {
  return props.pool.filter((member) => {
    const name = (member.displayName || member.username || '').toLowerCase();
    const query = searchQuery.value.trim().toLowerCase();
    if (query && !name.includes(query)) {
      return false;
    }

    if (selectedClass.value && selectedClass.value !== 'all') {
      const cName = (member.className || member.class || '').toLowerCase();
      if (cName !== selectedClass.value.toLowerCase()) {
        return false;
      }
    }

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

<style lang="stylus" scoped>
.pool-container
  border-radius 0px
  padding 1rem
  height 100%
  display flex
  flex-direction column
  user-select none
  font-family 'Be Vietnam Pro', sans-serif
  border 2px solid

  &.pool-light
    background #fdfbf7
    border-color #1c1917
    box-shadow 3px 3px 0 #1c1917
    color #1c1917

  &.pool-dark
    background #0b1120
    border-color #f5c518
    box-shadow 3px 3px 0 #000
    color #e2e8f0

.pool-header
  padding-bottom 0.65rem
  margin-bottom 0.75rem
  border-bottom 2px solid
  display flex
  justify-content space-between
  align-items center

  .pool-light &
    border-color #1c1917

  .pool-dark &
    border-color #1e293b

.pool-title
  font-size 0.75rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em
  font-family 'Chakra Petch', sans-serif
  margin 0

  .pool-light &
    color #92400e

  .pool-dark &
    color #f5c518

.pool-counter
  font-size 0.85rem
  padding 0.15rem 0.5rem
  border-radius 0px
  font-family 'VT323', monospace
  font-weight 700
  border 2px solid #1c1917

  .pool-light &
    background #fef3c7
    color #92400e
    box-shadow 2px 2px 0 #1c1917

  .pool-dark &
    background #172439
    color #f5c518
    border-color #f5c518
    box-shadow 2px 2px 0 #000

.search-box
  position relative
  margin-bottom 0.65rem

.search-input
  width 100%
  font-size 0.75rem
  padding 0.5rem 0.75rem
  border-radius 0px
  border 2px solid #1c1917
  box-shadow 2px 2px 0 #1c1917
  outline none
  box-sizing border-box
  font-family 'Be Vietnam Pro', sans-serif

  .pool-light &
    background #ffffff
    color #1c1917
    &::placeholder
      color #94a3b8

  .pool-dark &
    background #172439
    border-color #38bdf8
    color #ffffff
    &::placeholder
      color #94a3b8

.clear-search-btn
  position absolute
  right 0.5rem
  top 0.4rem
  font-size 0.75rem
  background none
  border none
  cursor pointer

  .pool-light &
    color #94a3b8
    &:hover
      color #0f172a

  .pool-dark &
    color #64748b
    &:hover
      color #ffffff

.filter-grid
  display grid
  grid-template-columns repeat(2, minmax(0, 1fr))
  gap 0.375rem
  margin-bottom 0.5rem

.filter-select
  width 100%
  border 1px solid
  font-size 0.65rem
  border-radius 0.25rem
  padding 0.25rem 0.4rem
  outline none
  cursor pointer

  .pool-light &
    background #ffffff
    border-color #cbd5e1
    color #0f172a

  .pool-dark &
    background #060a12
    border-color #1e293b
    color #cbd5e1

.active-filter-row
  margin-bottom 0.5rem
  display flex
  justify-content space-between
  align-items center
  font-size 0.65rem
  color #2563eb

.reset-filter-btn
  font-weight 600
  color #ef5757
  background none
  border none
  cursor pointer
  &:hover
    text-decoration underline

.pool-list
  display flex
  flex-direction column
  gap 0.375rem
  overflow-y auto
  padding-right 0.25rem
  flex 1
  min-height 100px

.pool-item
  cursor grab
  transition filter 0.15s ease
  border-radius 0.25rem

  &:active
    cursor grabbing

  &:hover
    filter brightness(1.15)

.empty-pool-text
  padding 2rem 0
  text-align center
  font-size 0.75rem
  font-style italic

  .pool-light &
    color #64748b

  .pool-dark &
    color #475569
</style>
