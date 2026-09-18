<template lang="pug">
.tactical-division-box(
  :class="[themeStore.theme === 'light' ? 'div-light' : 'div-dark', { 'is-collapsed': division.isCollapsed }]"
)
  //- Division Header Bar
  .division-bar
    //- Left: Collapse toggle button
    .bar-left
      button.btn-collapse-toggle(
        @click="$emit('toggleCollapse')"
        :title="division.isCollapsed ? 'Mở rộng Đoàn' : 'Thu gọn Đoàn'"
      )
        span.toggle-symbol {{ division.isCollapsed ? '➕' : '➖' }}

    //- Center: Division Title
    .bar-center
      template(v-if="!isEditMode")
        h2.division-title {{ division.divisionName }}
      template(v-else)
        input.division-title-input(
          v-model="division.divisionName"
          placeholder="Tên Đoàn..."
        )

    //- Right: Actions (+ Team, Xóa Đoàn)
    .bar-right
      button.btn-bar-action.btn-add-team(
        v-if="isEditMode"
        @click="$emit('addTeam')"
        title="Thêm 1 Team mới vào Đoàn này"
      )
        span ➕ Team

      button.btn-bar-action.btn-delete-div(
        v-if="isEditMode"
        @click="handleDeleteDivision"
        title="Xoá toàn bộ Đoàn này"
      )
        span 🗑️

  //- Teams Grid (Khi không bị thu gọn)
  .division-teams-grid(v-show="!division.isCollapsed")
    TacticalGroupCard(
      v-for="(team, tIdx) in division.teams"
      :key="team.id || tIdx"
      :divisionIndex="divisionIndex"
      :teamIndex="tIdx"
      :team="team"
      :isEditMode="isEditMode"
      @toggleCheck="(sIdx) => $emit('toggleCheck', { tIdx, sIdx })"
      @removeSlot="(sIdx) => $emit('removeSlot', { tIdx, sIdx })"
      @clickSlot="(sIdx) => $emit('clickSlot', { tIdx, sIdx })"
      @openSkillAssign="(sIdx) => $emit('openSkillAssign', { tIdx, sIdx })"
      @deleteTeam="() => $emit('removeTeam', tIdx)"
    )
</template>

<script setup>
import TacticalGroupCard from './TacticalGroupCard.vue';
import { useThemeStore } from '../../stores/themeStore';
import Swal from 'sweetalert2';

const props = defineProps({
  divisionIndex: { type: Number, required: true },
  division: { type: Object, required: true },
  isEditMode: { type: Boolean, default: false },
});

const emit = defineEmits([
  'toggleCollapse',
  'toggleCheck',
  'removeSlot',
  'clickSlot',
  'openSkillAssign',
  'addTeam',
  'removeTeam',
  'deleteDivision',
]);

const themeStore = useThemeStore();

const handleDeleteDivision = async () => {
  const result = await Swal.fire({
    title: 'Xoá Đoàn này?',
    text: `Bạn có chắc muốn xoá toàn bộ "${props.division.divisionName}"? Các thành viên sẽ được trả về danh sách chờ.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xoá Đoàn',
    cancelButtonText: 'Huỷ',
    confirmButtonColor: '#ef4444',
  });

  if (result.isConfirmed) {
    emit('deleteDivision', props.divisionIndex);
  }
};
</script>

<style lang="stylus" scoped>
.tactical-division-box
  display flex
  flex-direction column
  gap 0.5rem
  margin-bottom 1.25rem

.division-bar
  display flex
  align-items center
  justify-content space-between
  padding 0.5rem 1rem
  border-radius var(--radius-md, 12px)
  border 1px solid
  box-shadow var(--shadow-sm)
  transition all 0.2s ease

  .div-light &
    background #f8fafc
    border-color #e2e8f0

  .div-dark &
    background #141f32
    border-color #1e293b

.bar-left
  display flex
  align-items center
  flex: 1

.btn-collapse-toggle
  background transparent
  border 1px solid var(--color-border)
  border-radius var(--radius-sm, 8px)
  width 28px
  height 28px
  display flex
  align-items center
  justify-content center
  font-size 0.75rem
  cursor pointer
  color inherit
  transition all 0.2s ease

  &:hover
    border-color #3b82f6
    background rgba(59, 130, 246, 0.1)

.bar-center
  flex: 2
  text-align center

.division-title
  font-family var(--font-heading)
  font-size 1.15rem
  font-weight 800
  letter-spacing 0.03em
  margin 0

  .div-light &
    color #0f172a

  .div-dark &
    color #f8fafc

.division-title-input
  font-family var(--font-heading)
  font-size 1.1rem
  font-weight 800
  text-align center
  padding 0.25rem 0.65rem
  border-radius var(--radius-sm, 8px)
  border 1px solid #3b82f6
  outline none
  background var(--color-surface)
  color inherit

.bar-right
  flex: 1
  display flex
  align-items center
  justify-content flex-end
  gap 0.4rem

.btn-bar-action
  padding 0.35rem 0.65rem
  border-radius var(--radius-sm, 8px)
  font-size 0.75rem
  font-weight 600
  font-family var(--font-body)
  border 1px solid
  cursor pointer
  transition all 0.2s ease
  display flex
  align-items center
  gap 0.25rem

  &.btn-add-team
    background #eff6ff
    border-color #bfdbfe
    color #2563eb
    .div-dark &
      background rgba(37, 99, 235, 0.2)
      border-color rgba(59, 130, 246, 0.4)
      color #93c5fd
    &:hover
      background #3b82f6
      color #ffffff

  &.btn-delete-div
    background #fef2f2
    border-color #fecaca
    color #ef4444
    .div-dark &
      background rgba(239, 68, 68, 0.15)
      border-color rgba(239, 68, 68, 0.3)
    &:hover
      background #ef4444
      color #ffffff

.division-teams-grid
  display grid
  grid-template-columns repeat(5, minmax(0, 1fr))
  gap 0.75rem
  overflow-x auto
  padding-bottom 0.25rem

  @media (max-width: 1200px)
    grid-template-columns repeat(auto-fit, minmax(200px, 1fr))
</style>
