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
  border-radius var(--radius-xl, 20px)
  border 1px solid
  display flex
  flex-direction column
  gap 1.25rem
  max-width 80rem
  margin 1rem auto
  font-family var(--font-body)
  user-select none
  box-shadow var(--shadow-md)

  .roster-light &
    background #ffffff
    border-color #e2e8f0
    color #0f172a

  .roster-dark &
    background #0f172a
    border-color #1e293b
    color #f8fafc

@media (min-width: 768px)
  .roster-header
    flex-direction row
    align-items center
    justify-content space-between

.roster-header
  padding-bottom 1rem
  border-bottom 1px solid var(--color-border)
  display flex
  flex-direction column
  gap 1rem

.title-row
  display flex
  align-items center
  gap 0.75rem

.header-icon
  font-size 1.5rem

.header-title
  font-size 1.15rem
  font-weight 800
  letter-spacing 0.03em
  text-transform uppercase
  font-family var(--font-heading)
  margin 0
  color var(--color-text)

.header-subtitle
  font-size 0.7rem
  font-weight 600
  letter-spacing 0.05em
  text-transform uppercase
  margin-top 0.25rem
  color var(--color-brand)

.header-actions
  display flex
  align-items center
  gap 0.75rem

.search-input
  width 14rem
  font-size 0.8rem
  padding 0.45rem 0.85rem
  border-radius var(--radius-md, 12px)
  border 1px solid var(--color-border)
  outline none
  font-family var(--font-body)
  background var(--color-surface)
  color var(--color-text)
  transition all 0.2s ease

  &:focus
    border-color var(--color-brand)
    box-shadow 0 0 0 3px var(--color-brand-subtle)

.btn-lineup
  padding 0.5rem 1.25rem
  border-radius var(--radius-md, 12px)
  background #3b82f6
  color #ffffff
  font-size 0.75rem
  font-weight 700
  font-family var(--font-body)
  border 1px solid transparent
  box-shadow var(--shadow-sm)
  text-decoration none
  transition all 0.2s ease
  &:hover
    background #2563eb
    transform translateY(-1px)
    box-shadow var(--shadow-md)

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
  padding 0.85rem
  border-radius var(--radius-md, 12px)
  border 1px solid var(--color-border)
  display flex
  flex-direction column
  align-items center
  cursor pointer
  transition all 0.2s ease
  box-shadow var(--shadow-sm)

  .roster-light &
    background #f8fafc
    &:hover
      background #ffffff
      border-color var(--color-brand)
      transform translateY(-2px)
      box-shadow var(--shadow-md)

  .roster-dark &
    background #141f32
    &:hover
      border-color var(--color-brand)
      transform translateY(-2px)
      box-shadow var(--shadow-md)

  &.selected
    .roster-light &
      background #eff6ff
      border-color #3b82f6

    .roster-dark &
      background rgba(37, 99, 235, 0.2)
      border-color #60a5fa

.class-card-icon
  width 2rem
  height 2rem
  object-fit contain
  margin-bottom 0.25rem

.class-card-name
  font-size 0.75rem
  font-weight 700
  font-family var(--font-body)
  color var(--color-text)

.class-card-count
  font-size 0.8rem
  font-family monospace
  font-weight 700
  margin-top 0.15rem
  color var(--color-brand)

.table-card
  border-radius var(--radius-lg, 16px)
  border 1px solid var(--color-border)
  box-shadow var(--shadow-sm)
  background var(--color-surface)
  overflow hidden

.table-header
  padding 1rem 1.25rem
  border-bottom 1px solid var(--color-border)
  background var(--color-bg-subtle)

.table-title
  font-size 0.85rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.03em
  font-family var(--font-body)
  color var(--color-text)
  margin 0

.table-wrapper
  overflow-x auto

.roster-table
  width 100%
  text-align left
  font-size 0.8rem
  border-collapse separate
  border-spacing 0
  background var(--color-surface)

.th-cell
  padding 10px 14px
  font-weight 700
  font-family var(--font-body)
  background var(--color-bg-subtle)
  color var(--color-text-secondary)
  border-bottom 1px solid var(--color-border)
  font-size 0.75rem
  text-transform uppercase
  letter-spacing 0.03em

.tr-row
  transition background 0.15s ease
  &:hover
    background var(--color-bg-subtle)

.td-cell
  padding 10px 14px
  color var(--color-text)
  border-bottom 1px solid var(--color-border-subtle)

.tr-row:last-child .td-cell
  border-bottom none

.user-td
  display flex
  align-items center
  gap 0.75rem
  font-weight 700

.avatar-img
  width 2.25rem
  height 2.25rem
  border-radius var(--radius-md, 12px)
  object-fit cover
  border 1px solid var(--color-border)

.user-display-name
  font-size 0.8rem
  font-weight 700
  display block
  color var(--color-text)

.user-username
  font-size 0.7rem
  font-family var(--font-body)
  display block
  color var(--color-text-secondary)

.class-pill
  padding 3px 10px
  border-radius var(--radius-full, 9999px)
  font-size 0.75rem
  font-weight 700
  font-family var(--font-body)
  border 1px solid var(--color-border)
  box-shadow var(--shadow-sm)
  display inline-flex
  align-items center
  gap 0.375rem

.pill-icon
  width 0.875rem
  height 0.875rem
  object-fit contain

.role-badge
  font-size 0.7rem
  padding 3px 10px
  border-radius var(--radius-full, 9999px)
  font-weight 700
  font-family var(--font-body)
  text-transform uppercase
  letter-spacing 0.03em
  border 1px solid var(--color-border)
  box-shadow var(--shadow-sm)
  display inline-block

  &.role-duong-gia
    .roster-light &
      background #fef3c7
      color #b45309
      border-color #fde68a
    .roster-dark &
      background rgba(245, 197, 24, 0.2)
      color #f5c518
      border-color rgba(245, 197, 24, 0.4)

  &.role-duong-chu
    .roster-light &
      background #e0f2fe
      color #0284c7
      border-color #bae6fd
    .roster-dark &
      background rgba(56, 189, 248, 0.2)
      color #38bdf8
      border-color rgba(56, 189, 248, 0.4)

  &.role-bang-chung
    .roster-light &
      background #f1f5f9
      color #475569
      border-color #cbd5e1
    .roster-dark &
      background #1e293b
      color #94a3b8
      border-color #334155

.status-pill
  font-size 0.65rem
  padding 0.2rem 0.65rem
  border-radius var(--radius-full, 9999px)
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
      border-color rgba(52, 211, 153, 0.3)

.text-right
  text-align right

.link-assign
  font-size 0.75rem
  font-weight 600
  text-decoration none
  color #2563eb

  &:hover
    text-decoration underline

  .roster-dark &
    color #60a5fa
</style>
