<template lang="pug">
.roster-container(
  :class="themeStore.theme === 'light' ? 'roster-light' : 'roster-dark'"
)
  //- Header
  .roster-header
    .header-title-group
      .title-row
        span.header-icon 👥
        h1.header-title TRỊ BANG HIỀN GIẢ — THIÊN THƯ MÔN
      p.header-subtitle Danh sách ghi danh võ phái đệ tử trực thuộc Thiên Thư Môn

    .header-actions
      input.search-input(
        v-model="search"
        type="text"
        placeholder="🔍 Tìm biệt danh / đệ tử..."
      )
      RouterLink.btn-lineup(to="/lineup") Trận Phái ➔

  //- Class Breakdown Grid
  .class-breakdown-grid
    .class-card(
      v-for="c in CLASS_LIST"
      :key="c.name"
      @click="selectedClass = selectedClass === c.name ? 'all' : c.name"
      :class="{ 'selected': selectedClass === c.name }"
    )
      img.class-card-icon(v-if="c.icon" :src="c.icon" :alt="c.name")
      span.class-card-name {{ c.name }}
      span.class-card-count {{ getClassCount(c.name) }} đệ tử

  //- Member Roster Table Card
  .table-card
    .table-header
      h3.table-title 📜 Danh Sách Đệ Tử Bang Chúng ({{ filteredMembers.length }} đệ tử)

    .table-wrapper
      table.roster-table
        thead.table-head
          tr
            th.th-cell Biệt Danh / Tên Đệ Tử
            th.th-cell Võ Phái
            th.th-cell Chức Vị Bang Hội
            th.th-cell Trạng Thái
            th.th-cell.text-right Tác Vụ
        tbody.table-body
          tr.tr-row(v-for="m in filteredMembers" :key="m.userId")
            td.td-cell.user-td
              img.avatar-img(:src="m.avatar")
              .user-meta
                span.user-display-name {{ m.displayName }}
                span.user-username @{{ m.username }}

            td.td-cell
              span.class-pill(
                :style="{ borderColor: getClassHex(m.className), color: getClassHex(m.className), backgroundColor: `${getClassHex(m.className)}15` }"
              )
                img.pill-icon(v-if="getClassIcon(m.className)" :src="getClassIcon(m.className)")
                span {{ m.className }}

            td.td-cell
              span.role-badge.role-duong-gia(v-if="getMemberPrimaryRole(m) === 'Đương Gia'") ⭐ Đương Gia
              span.role-badge.role-duong-chu(v-else-if="getMemberPrimaryRole(m) === 'Đường Chủ'") 👑 Đường Chủ
              span.role-badge.role-bang-chung(v-else) 📜 Bang Chúng

            td.td-cell
              span.status-pill.ready-pill Sẵn Sàng

            td.td-cell.text-right
              RouterLink.link-assign(to="/lineup") An Vị Trận Đồ ➔
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { CLASS_LIST, getClassInfo, getClassIcon } from '../theme/classColors';
import { useLineupStore } from '../stores/lineupStore';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';

const lineupStore = useLineupStore();
const authStore = useAuthStore();
const themeStore = useThemeStore();

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

<style lang="stylus" scoped>
.roster-container
  position relative
  min-height calc(100vh - 57px)
  padding 1.5rem
  max-width 80rem
  margin 0 auto
  font-family 'Lora', serif
  user-select none
  display flex
  flex-direction column
  gap 1.5rem

.roster-header
  padding-bottom 1rem
  border-bottom 1px solid
  display flex
  flex-direction column
  gap 1rem

  .roster-light &
    border-color #cbd5e1

  .roster-dark &
    border-color #172439

@media (min-width: 640px)
  .roster-header
    flex-direction row
    align-items center
    justify-content space-between

.title-row
  display flex
  align-items center
  gap 0.5rem

.header-icon
  font-size 1.5rem

.header-title
  font-size 1.5rem
  font-weight 900
  text-transform uppercase
  letter-spacing 0.05em
  margin 0

  .roster-light &
    background linear-gradient(to right, #b45309, #d97706)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

  .roster-dark &
    background linear-gradient(to right, #fef08a, #f5c518, #b45309)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

.header-subtitle
  font-size 0.75rem
  margin-top 0.25rem

  .roster-light &
    color #64748b

  .roster-dark &
    color #94a3b8

.header-actions
  display flex
  align-items center
  gap 0.5rem

.search-input
  width 14rem
  font-size 0.75rem
  padding 0.5rem 0.85rem
  border-radius 0.75rem
  border 1px solid
  outline none
  font-family 'Lora', serif

  .roster-light &
    background #ffffff
    border-color #cbd5e1
    color #0f172a
    &::placeholder
      color #94a3b8

  .roster-dark &
    background #0f172a
    border-color #1e293b
    color #ffffff
    &::placeholder
      color #64748b

.btn-lineup
  padding 0.5rem 1rem
  border-radius 0.75rem
  background #2563eb
  color #ffffff
  font-size 0.75rem
  font-weight 700
  text-decoration none
  transition all 0.15s ease
  &:hover
    background #3b82f6

.class-breakdown-grid
  display grid
  grid-template-columns repeat(2, minmax(0, 1fr))
  gap 0.75rem

@media (min-width: 640px)
  .class-breakdown-grid
    grid-template-columns repeat(4, minmax(0, 1fr))

@media (min-width: 1024px)
  .class-breakdown-grid
    grid-template-columns repeat(7, minmax(0, 1fr))

.class-card
  padding 0.75rem
  border-radius 0.75rem
  border 1px solid
  display flex
  flex-direction column
  align-items center
  cursor pointer
  transition all 0.2s ease

  .roster-light &
    background #ffffff
    border-color #cbd5e1
    &:hover
      border-color #2563eb

  .roster-dark &
    background rgba(8, 13, 25, 0.9)
    border-color #17263c
    &:hover
      border-color #3b82f6

  &.selected
    .roster-light &
      background #fef3c7
      border-color #b45309
      box-shadow 0 0 12px rgba(180, 83, 9, 0.2)

    .roster-dark &
      background rgba(245, 197, 24, 0.1)
      border-color #f5c518
      box-shadow 0 0 12px rgba(245, 197, 24, 0.2)

.class-card-icon
  width 1.75rem
  height 1.75rem
  object-fit contain
  margin-bottom 0.25rem

.class-card-name
  font-size 0.75rem
  font-weight 700

  .roster-light &
    color #0f172a

  .roster-dark &
    color #ffffff

.class-card-count
  font-size 0.625rem
  font-family monospace
  font-weight 700
  margin-top 0.15rem

  .roster-light &
    color #b45309

  .roster-dark &
    color #f5c518

.table-card
  border-radius 1rem
  overflow hidden
  border 1px solid
  backdrop-filter blur(12px)

  .roster-light &
    background #ffffff
    border-color #cbd5e1
    box-shadow 0 10px 30px rgba(0, 0, 0, 0.05)

  .roster-dark &
    background rgba(8, 13, 25, 0.9)
    border-color #17263c
    box-shadow 0 20px 40px rgba(0, 0, 0, 0.4)

.table-header
  padding 1rem
  border-bottom 1px solid

  .roster-light &
    background #f8fafc
    border-color #e2e8f0

  .roster-dark &
    background #050810
    border-color #17263c

.table-title
  font-size 0.875rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em
  margin 0

  .roster-light &
    color #1d4ed8

  .roster-dark &
    color #93c5fd

.table-wrapper
  overflow-x auto

.roster-table
  width 100%
  text-align left
  font-size 0.75rem
  border-collapse collapse

.table-head
  font-size 0.625rem
  text-transform uppercase
  letter-spacing 0.05em
  border-bottom 1px solid

  .roster-light &
    background #f1f5f9
    border-color #cbd5e1
    color #64748b

  .roster-dark &
    background #0f172a
    border-color #1e293b
    color #64748b

.th-cell
  padding 0.75rem 1rem
  font-weight 700

.tr-row
  border-bottom 1px solid
  transition background 0.15s ease

  .roster-light &
    border-color #f1f5f9
    &:hover
      background #f8fafc

  .roster-dark &
    border-color #17263c
    &:hover
      background rgba(15, 23, 42, 0.6)

.td-cell
  padding 0.75rem 1rem

.user-td
  display flex
  align-items center
  gap 0.75rem
  font-weight 700

.avatar-img
  width 2rem
  height 2rem
  border-radius 0.5rem
  object-fit cover
  border 1px solid

  .roster-light &
    border-color #cbd5e1

  .roster-dark &
    border-color #1e304d

.user-display-name
  font-size 0.75rem
  font-weight 700
  display block

  .roster-light &
    color #0f172a

  .roster-dark &
    color #ffffff

.user-username
  font-size 0.625rem
  font-family monospace
  display block

  .roster-light &
    color #64748b

  .roster-dark &
    color #64748b

.class-pill
  padding 0.15rem 0.65rem
  border-radius 0.25rem
  font-size 0.7rem
  font-weight 600
  border 1px solid
  display inline-flex
  align-items center
  gap 0.375rem

.pill-icon
  width 0.875rem
  height 0.875rem
  object-fit contain

.role-badge
  font-size 0.625rem
  padding 0.15rem 0.65rem
  border-radius 9999px
  font-weight 700
  text-transform uppercase
  display inline-block

  &.role-duong-gia
    .roster-light &
      background #fef3c7
      color #b45309
      border 1px solid #fde68a
    .roster-dark &
      background rgba(245, 197, 24, 0.2)
      color #f5c518
      border 1px solid rgba(245, 197, 24, 0.4)

  &.role-duong-chu
    .roster-light &
      background #e0f2fe
      color #0284c7
      border 1px solid #bae6fd
    .roster-dark &
      background rgba(56, 189, 248, 0.2)
      color #38bdf8
      border 1px solid rgba(56, 189, 248, 0.4)

  &.role-bang-chung
    .roster-light &
      background #f1f5f9
      color #475569
      border 1px solid #cbd5e1
    .roster-dark &
      background #1e293b
      color #94a3b8
      border 1px solid #334155

.status-pill
  font-size 0.625rem
  padding 0.15rem 0.5rem
  border-radius 9999px
  font-weight 700
  text-transform uppercase

  &.ready-pill
    .roster-light &
      background #d1fae5
      color #059669
      border 1px solid #a7f3d0
    .roster-dark &
      background rgba(52, 211, 153, 0.2)
      color #34d399
      border 1px solid rgba(52, 211, 153, 0.3)

.text-right
  text-align right

.link-assign
  font-size 0.7rem
  font-weight 600
  text-decoration none

  .roster-light &
    color #2563eb
    &:hover
      text-decoration underline

  .roster-dark &
    color #60a5fa
    &:hover
      text-decoration underline
</style>
