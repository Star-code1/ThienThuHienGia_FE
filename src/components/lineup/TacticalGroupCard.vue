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
      button.btn-header-action.btn-drag(
        v-if="isEditMode"
        title="Kéo thả vị trí Team"
      ) ⠿ Kéo

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
  border-radius 0.375rem
  border 2px solid
  display flex
  flex-direction column
  overflow hidden
  min-width 190px
  flex 1
  transition all 0.2s ease
  box-shadow 0 3px 10px rgba(0, 0, 0, 0.06)

  &.card-light
    background #ffffff
    border-color #93c5fd

  &.card-dark
    background #0b1120
    border-color #1e3a8a
    box-shadow 0 4px 15px rgba(0, 0, 0, 0.3)

.team-card-header
  display flex
  align-items center
  justify-content space-between
  padding 0.35rem 0.5rem
  border-bottom 1px solid
  gap 0.35rem

  .card-light &
    background #eff6ff
    border-color #bfdbfe

  .card-dark &
    background #0f172a
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
  background rgba(234, 179, 8, 0.2)
  border 1px solid #eab308
  flex-shrink 0

.team-title
  font-family 'Chakra Petch', sans-serif
  font-size 0.85rem
  font-weight 700
  letter-spacing 0.03em
  margin 0
  color #1e40af

  .card-dark &
    color #60a5fa

.team-name-input
  font-family 'Chakra Petch', sans-serif
  font-size 0.8rem
  font-weight 700
  padding 0.15rem 0.35rem
  border-radius 0.2rem
  border 1px solid #93c5fd
  width 90px
  outline none

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
  padding 0.15rem 0.35rem
  font-size 0.65rem
  font-weight 600
  border-radius 0.2rem
  border 1px solid
  cursor pointer
  transition all 0.15s ease

  &.btn-drag
    background rgba(59, 130, 246, 0.1)
    border-color #93c5fd
    color #2563eb
    .card-dark &
      border-color #3b82f6
      color #93c5fd

  &.btn-clear
    background rgba(239, 68, 68, 0.1)
    border-color #fca5a5
    color #ef4444
    &:hover
      background #ef4444
      color #ffffff

  &.btn-del-team
    background transparent
    border-color transparent
    color #64748b
    padding 0.1rem 0.25rem
    &:hover
      color #ef4444

.team-table-header
  display flex
  align-items center
  padding 0.25rem 0.5rem
  font-size 0.7rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em
  border-bottom 1px solid

  .card-light &
    background #dbeafe
    border-color #bfdbfe
    color #1e40af

  .card-dark &
    background #172554
    border-color #1e3a8a
    color #93c5fd

.th-col
  &.th-ingame
    flex 1.2
    text-align center

  &.th-skills
    flex 0.9
    text-align center

.slots-container
  display flex
  flex-direction column

.slot-row-wrapper
  &.drag-over
    background rgba(59, 130, 246, 0.25)
    outline 2px dashed #2563eb

.slot-draggable
  &.is-draggable
    cursor grab
    &:active
      cursor grabbing
</style>
