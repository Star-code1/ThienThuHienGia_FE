<template lang="pug">
.division-box(
  :class="themeStore.theme === 'light' ? 'div-light' : 'div-dark'"
)
  //- Header của Division
  .division-header
    .header-title-left
      span.accent-line
      template(v-if="!isEditMode")
        h2.division-name {{ division.divisionName }}
      template(v-else)
        input.division-name-input(
          v-model="division.divisionName"
          placeholder="Tên khối đoàn..."
        )

    .header-leader-right
      template(v-if="!isEditMode")
        span.leader-tag(v-if="division.leaderTag") {{ division.leaderTag }}
      template(v-else)
        input.leader-tag-input(
          v-model="division.leaderTag"
          placeholder="Tag chỉ huy..."
        )

  //- Lưới các Nhóm trong Division
  .groups-grid
    TacticalGroupCard(
      v-for="(team, tIdx) in division.teams"
      :key="tIdx"
      :divisionIndex="divisionIndex"
      :teamIndex="tIdx"
      :team="team"
      :isEditMode="isEditMode"
      @toggleCheck="(sIdx) => $emit('toggleCheck', { tIdx, sIdx })"
      @removeSlot="(sIdx) => $emit('removeSlot', { tIdx, sIdx })"
      @clickSlot="(sIdx) => $emit('clickSlot', { tIdx, sIdx })"
    )
</template>

<script setup>
import TacticalGroupCard from './TacticalGroupCard.vue';
import { useThemeStore } from '../../stores/themeStore';

defineProps({
  divisionIndex: { type: Number, required: true },
  division: { type: Object, required: true },
  isEditMode: { type: Boolean, default: false }
});

defineEmits(['toggleCheck', 'removeSlot', 'clickSlot']);

const themeStore = useThemeStore();
</script>

<style lang="stylus" scoped>
.division-box
  border-radius 0.5rem
  padding 0.65rem
  position relative
  font-family 'Lora', serif

  &.div-light
    background rgba(255, 255, 255, 0.95)
    border 1px solid #cbd5e1
    box-shadow 0 4px 15px rgba(0, 0, 0, 0.04)

  &.div-dark
    background rgba(8, 13, 23, 0.85)
    border 1px solid #17263c
    box-shadow 0 10px 25px rgba(0, 0, 0, 0.3)

.division-header
  display flex
  justify-content space-between
  align-items center
  margin-bottom 0.5rem
  padding-bottom 0.35rem
  padding-left 0.25rem
  padding-right 0.25rem
  border-bottom 1px solid
  gap 0.5rem

  .div-light &
    border-color #e2e8f0

  .div-dark &
    border-color #18263e

.header-title-left
  display flex
  align-items center
  gap 0.5rem
  flex 1

.accent-line
  width 0.375rem
  height 0.875rem
  border-radius 0.125rem
  background linear-gradient(to bottom, #60a5fa, #1d4ed8)
  flex-shrink 0

.division-name
  font-size 0.75rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  margin 0

  .div-light &
    color #1d4ed8

  .div-dark &
    color #93c5fd

.division-name-input
  flex 1
  font-size 0.75rem
  font-weight 700
  padding 0.15rem 0.5rem
  border-radius 0.25rem
  border 1px solid
  outline none

  .div-light &
    background #ffffff
    border-color #cbd5e1
    color #1d4ed8

  .div-dark &
    background #060a12
    border-color #2a3f63
    color #93c5fd

.header-leader-right
  flex-shrink 0

.leader-tag
  font-size 0.7rem
  font-weight 500
  letter-spacing 0.025em
  cursor pointer
  transition color 0.15s ease

  .div-light &
    color #64748b
    &:hover
      color #b45309

  .div-dark &
    color #94a3b8
    &:hover
      color #f5c518

.leader-tag-input
  width 7rem
  font-size 0.7rem
  padding 0.15rem 0.4rem
  border-radius 0.25rem
  border 1px solid
  outline none

  .div-light &
    background #ffffff
    border-color #cbd5e1
    color #b45309

  .div-dark &
    background #060a12
    border-color #2a3f63
    color #f5c518

.groups-grid
  display flex
  flex-wrap wrap
  gap 0.65rem
  align-items stretch
</style>
