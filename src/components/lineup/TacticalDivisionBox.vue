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

    //- Right: Actions (Kéo Đoàn, + Team, Xóa Đoàn)
    .bar-right
      button.btn-bar-action.btn-reorder(
        v-if="isEditMode"
        title="Kéo thứ tự Đoàn"
      )
        span ⠿ Kéo Đoàn

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
  padding 0.4rem 0.75rem
  border-radius 0.375rem
  border 1.5px solid
  transition all 0.2s ease

  .div-light &
    background #f1f5f9
    border-color #cbd5e1
    box-shadow 0 2px 6px rgba(0, 0, 0, 0.04)

  .div-dark &
    background #0f172a
    border-color #1e293b
    box-shadow 0 3px 10px rgba(0, 0, 0, 0.4)

.bar-left
  display flex
  align-items center
  flex: 1

.btn-collapse-toggle
  background transparent
  border 1px solid #94a3b8
  border-radius 0.25rem
  width 24px
  height 24px
  display flex
  align-items center
  justify-content center
  font-size 0.7rem
  cursor pointer
  color inherit
  transition all 0.15s ease

  &:hover
    border-color #3b82f6
    background rgba(59, 130, 246, 0.1)

.bar-center
  flex: 2
  text-align center

.division-title
  font-family 'Lora', 'Cinzel', serif
  font-size 1.2rem
  font-weight 800
  letter-spacing 0.05em
  margin 0

  .div-light &
    color #0f172a

  .div-dark &
    color #f8fafc
    text-shadow 0 0 10px rgba(56, 189, 248, 0.4)

.division-title-input
  font-family 'Lora', serif
  font-size 1.1rem
  font-weight 800
  text-align center
  padding 0.2rem 0.5rem
  border-radius 0.25rem
  border 1px solid #3b82f6
  outline none
  background transparent
  color inherit

.bar-right
  flex: 1
  display flex
  align-items center
  justify-content flex-end
  gap 0.4rem

.btn-bar-action
  padding 0.25rem 0.5rem
  border-radius 0.25rem
  font-size 0.7rem
  font-weight 700
  font-family 'Chakra Petch', sans-serif
  border 1px solid
  cursor pointer
  transition all 0.15s ease
  display flex
  align-items center
  gap 0.25rem

  &.btn-reorder
    background rgba(148, 163, 184, 0.15)
    border-color #94a3b8
    color inherit

  &.btn-add-team
    background rgba(37, 99, 235, 0.15)
    border-color #3b82f6
    color #2563eb
    .div-dark &
      color #60a5fa
    &:hover
      background #2563eb
      color #ffffff

  &.btn-delete-div
    background rgba(239, 68, 68, 0.15)
    border-color #ef4444
    color #ef4444
    &:hover
      background #ef4444
      color #ffffff

.division-teams-grid
  display grid
  grid-template-columns repeat(5, minmax(0, 1fr))
  gap 0.65rem
  overflow-x auto
  padding-bottom 0.25rem

  @media (max-width: 1200px)
    grid-template-columns repeat(auto-fit, minmax(200px, 1fr))
</style>
