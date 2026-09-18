<template lang="pug">
.tactical-group-card(
  :class="themeStore.theme === 'light' ? 'card-light' : 'card-dark'"
)
  //- Header của Team
  .team-card-header
    .header-left
      .team-emblem-badge ⚔️
      template(v-if="!isEditMode")
        h3.team-title {{ team.teamName }}
      template(v-else)
        input.team-name-input(
          v-model="team.teamName"
          placeholder="Tên Team..."
        )

    .header-actions
      button.btn-header-action.btn-clear(
        v-if="isEditMode"
        @click="handleClearTeam"
        title="Xoá tất cả thành viên trong Team về Pool"
      ) Xoá

      button.btn-header-action.btn-del-team(
        v-if="isEditMode"
        @click="$emit('deleteTeam')"
        title="Xoá luôn Team này"
      ) ✕

  //- Table Column Headers (Ingame | Phân công)
  .team-table-header
    .th-col.th-ingame Ingame
    .th-col.th-skills Phân công

  //- 6 Slot Rows
  .slots-container
    .slot-row-wrapper(
      v-for="(slot, sIdx) in team.slots"
      :key="sIdx"
      :class="{ 'drag-over': isEditMode && dragOverIndex === sIdx }"
      @dragover.prevent="dragOverIndex = sIdx"
      @dragleave="dragOverIndex = null"
      @drop="onDrop($event, sIdx)"
    )
      .slot-draggable(
        :draggable="isEditMode && !!slot.userId"
        @dragstart="onDragStart($event, slot, sIdx)"
        :class="{ 'is-draggable': isEditMode && !!slot.userId }"
      )
        TacticalSlotRow(
          :slot="slot"
          :isEditMode="isEditMode"
          @toggleCheck="$emit('toggleCheck', sIdx)"
          @remove="$emit('removeSlot', sIdx)"
          @clickSlot="$emit('clickSlot', sIdx)"
          @openSkillAssign="$emit('openSkillAssign', sIdx)"
          @deleteExternal="store.deleteExternalMember(slot.userId)"
        )
</template>

<script setup>
import { ref } from 'vue';
import TacticalSlotRow from './TacticalSlotRow.vue';
import { useLineupStore } from '../../stores/lineupStore';
import { useThemeStore } from '../../stores/themeStore';
import Swal from 'sweetalert2';

const props = defineProps({
  divisionIndex: { type: Number, required: true },
  teamIndex: { type: Number, required: true },
  team: { type: Object, required: true },
  isEditMode: { type: Boolean, default: false },
});

const emit = defineEmits(['toggleCheck', 'removeSlot', 'clickSlot', 'openSkillAssign', 'deleteTeam']);

const store = useLineupStore();
const themeStore = useThemeStore();
const dragOverIndex = ref(null);

const onDragStart = (evt, slot, sIdx) => {
  if (!slot.userId) return;
  const payload = {
    source: 'slot',
    dIdx: props.divisionIndex,
    tIdx: props.teamIndex,
    sIdx: sIdx,
  };
  evt.dataTransfer.setData('application/json', JSON.stringify(payload));
};

const onDrop = (evt, targetSIdx) => {
  dragOverIndex.value = null;
  try {
    const raw = evt.dataTransfer.getData('application/json');
    if (!raw) return;
    const data = JSON.parse(raw);

    if (data.source === 'slot') {
      store.moveOrSwapSlot({
        srcDIdx: data.dIdx,
        srcTIdx: data.tIdx,
        srcSIdx: data.sIdx,
        targetDIdx: props.divisionIndex,
        targetTIdx: props.teamIndex,
        targetSIdx: targetSIdx,
      });
    } else if (data.source === 'pool') {
      store.assignFromPool({
        targetDIdx: props.divisionIndex,
        targetTIdx: props.teamIndex,
        targetSIdx: targetSIdx,
        member: data.member,
      });
    } else if (data.source === 'leader') {
      store.assignLeaderToSlot({
        targetDIdx: props.divisionIndex,
        targetTIdx: props.teamIndex,
        targetSIdx: targetSIdx,
        leader: data.leader,
      });
    }
  } catch (e) {
    console.error('Lỗi khi thả vào slot:', e);
  }
};

const handleClearTeam = async () => {
  const result = await Swal.fire({
    title: 'Xoá thành viên Team?',
    text: `Bạn có muốn gạt tất cả thành viên trong ${props.team.teamName} về danh sách chờ?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Đồng ý',
    cancelButtonText: 'Huỷ',
    confirmButtonColor: '#ef4444',
  });

  if (result.isConfirmed) {
    store.clearTeam(props.divisionIndex, props.teamIndex);
  }
};
</script>

<style lang="stylus" scoped>
.tactical-group-card
  border-radius var(--radius-md, 12px)
  border 1px solid
  display flex
  flex-direction column
  overflow hidden
  min-width 205px
  flex 1
  transition all 0.2s ease
  box-shadow var(--shadow-sm)

  &.card-light
    background #ffffff
    border-color #e2e8f0

  &.card-dark
    background #0b1120
    border-color #1e293b
    box-shadow var(--shadow-md)

.team-card-header
  display flex
  align-items center
  justify-content space-between
  padding 0.4rem 0.65rem
  border-bottom 1px solid
  gap 0.35rem

  .card-light &
    background #f8fafc
    border-color #e2e8f0

  .card-dark &
    background #141f32
    border-color #1e293b

.header-left
  display flex
  align-items center
  gap 0.35rem
  overflow hidden

.team-emblem-badge
  font-size 0.85rem
  display flex
  align-items center
  justify-content center
  width 22px
  height 22px
  border-radius 50%
  background rgba(234, 179, 8, 0.15)
  border 1px solid rgba(234, 179, 8, 0.4)
  flex-shrink 0

.team-title
  font-family var(--font-body)
  font-size 0.85rem
  font-weight 700
  letter-spacing 0.02em
  margin 0
  color #2563eb

  .card-dark &
    color #60a5fa

.team-name-input
  font-family var(--font-body)
  font-size 0.8rem
  font-weight 700
  padding 0.15rem 0.4rem
  border-radius var(--radius-xs, 4px)
  border 1px solid #bfdbfe
  width 90px
  outline none
  background var(--color-surface)

  .card-dark &
    background #1e293b
    border-color #3b82f6
    color #ffffff

.header-actions
  display flex
  align-items center
  gap 0.25rem
  flex-shrink 0

.btn-header-action
  padding 0.2rem 0.4rem
  font-size 0.65rem
  font-weight 600
  border-radius var(--radius-xs, 4px)
  border 1px solid
  cursor pointer
  transition all 0.15s ease

  &.btn-clear
    background #fef2f2
    border-color #fecaca
    color #ef4444
    .card-dark &
      background rgba(239, 68, 68, 0.15)
      border-color rgba(239, 68, 68, 0.3)
    &:hover
      background #ef4444
      color #ffffff

  &.btn-del-team
    background transparent
    border-color transparent
    color #94a3b8
    padding 0.1rem 0.25rem
    &:hover
      color #ef4444

.team-table-header
  display flex
  align-items center
  padding 0.3rem 0.5rem
  font-size 0.7rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.04em
  border-bottom 1px solid

  .card-light &
    background #f1f5f9
    border-color #e2e8f0
    color #475569

  .card-dark &
    background #172554
    border-color #1e293b
    color #93c5fd

.th-col
  &.th-ingame
    flex 1.4
    text-align center

  &.th-skills
    flex 0.8
    text-align center

.slots-container
  display flex
  flex-direction column

.slot-row-wrapper
  &.drag-over
    background rgba(59, 130, 246, 0.15)
    outline 2px dashed #3b82f6

.slot-draggable
  &.is-draggable
    cursor grab
    &:active
      cursor grabbing
</style>
