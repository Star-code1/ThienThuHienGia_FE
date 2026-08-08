<template lang="pug">
.group-card(
  :class="themeStore.theme === 'light' ? 'card-light' : 'card-dark'"
)
  //- Header của Nhóm
  .group-header
    template(v-if="!isEditMode")
      span.group-name {{ team.teamName }}
      span.group-tag(v-if="team.teamTag") {{ team.teamTag }}

    template(v-else)
      input.group-name-input(
        v-model="team.teamName"
        placeholder="Tên nhóm..."
      )
      input.group-tag-input(
        v-model="team.teamTag"
        placeholder="+ Tag"
      )

  //- Danh sách 6 Slot thành viên
  .slots-list
    .slot-item-wrapper(
      v-for="(slot, sIdx) in team.slots"
      :key="sIdx"
      :class="{ 'drag-over': isEditMode && dragOverIndex === sIdx, 'leader-divider': sIdx === 0 }"
      @dragover.prevent="dragOverIndex = sIdx"
      @dragleave="dragOverIndex = null"
      @drop="onDrop($event, sIdx)"
    )
      .slot-item-inner(
        :draggable="isEditMode && !!slot.userId"
        @dragstart="onDragStart($event, slot, sIdx)"
        :class="{ 'draggable': isEditMode && !!slot.userId }"
      )
        TacticalSlotRow(
          :slot="slot"
          :isEditMode="isEditMode"
          @toggleCheck="$emit('toggleCheck', sIdx)"
          @remove="$emit('removeSlot', sIdx)"
          @clickSlot="$emit('clickSlot', sIdx)"
          @deleteExternal="store.deleteExternalMember(slot.userId)"
        )

  //- Footer Tag của Nhóm
  .group-footer
    template(v-if="!isEditMode")
      .footer-badge(:class="footerBadgeClass") {{ team.footerTag || 'HEAL AOE' }}
    template(v-else)
      input.footer-tag-input(
        v-model="team.footerTag"
        placeholder="Tag nhóm (VD: HEAL AOE)"
      )
</template>

<script setup>
import { ref, computed } from 'vue';
import TacticalSlotRow from './TacticalSlotRow.vue';
import { useLineupStore } from '../../stores/lineupStore';
import { useThemeStore } from '../../stores/themeStore';

const props = defineProps({
  divisionIndex: { type: Number, required: true },
  teamIndex: { type: Number, required: true },
  team: { type: Object, required: true },
  isEditMode: { type: Boolean, default: false }
});

defineEmits(['toggleCheck', 'removeSlot', 'clickSlot']);

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
    } else if (data.source === 'leader') {
      store.assignLeaderToSlot({
        targetDIdx: props.divisionIndex,
        targetTIdx: props.teamIndex,
        targetSIdx: targetSIdx,
        leader: data.leader,
      });
    } else if (data.source === 'pool') {
      store.assignFromPool({
        targetDIdx: props.divisionIndex,
        targetTIdx: props.teamIndex,
        targetSIdx: targetSIdx,
        member: data.member,
      });
    }
  } catch (e) {
    console.error('Lỗi khi thả slot:', e);
  }
};

const footerBadgeClass = computed(() => {
  const tag = (props.team.footerTag || '').toLowerCase();
  if (tag.includes('heal')) {
    return 'badge-heal';
  } else if (tag.includes('call') || tag.includes('chủ')) {
    return 'badge-call';
  }
  return 'badge-default';
});
</script>

<style lang="stylus" scoped>
.group-card
  border-radius 0.375rem
  padding 0.5rem
  display flex
  flex-direction column
  justify-content space-between
  transition border-color 0.15s ease
  min-width 155px
  flex 1
  font-family 'Lora', serif

  &.card-light
    background #ffffff
    border 1px solid #cbd5e1
    box-shadow 0 4px 12px rgba(0, 0, 0, 0.03)

  &.card-dark
    background rgba(11, 18, 30, 0.9)
    border 1px solid #1a2942
    box-shadow 0 10px 25px rgba(0, 0, 0, 0.4)
    &:hover
      border-color #2a3f63

.group-header
  display flex
  justify-content space-between
  align-items center
  padding-bottom 0.35rem
  margin-bottom 0.25rem
  border-bottom 1px solid
  gap 0.25rem

  .card-light &
    border-color #e2e8f0

  .card-dark &
    border-color #1c2c47

.group-name
  font-size 0.75rem
  font-weight 600
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

  .card-light &
    color #0f172a

  .card-dark &
    color #cbd5e1

.group-tag
  font-size 0.55rem
  padding 0.1rem 0.35rem
  border-radius 0.25rem
  font-family monospace
  font-weight 700
  flex-shrink 0

  .card-light &
    background #fef3c7
    color #b45309
    border 1px solid #fde68a

  .card-dark &
    background #1e293b
    color #f5c518
    border 1px solid rgba(245, 197, 24, 0.3)

.group-name-input
  width 5rem
  font-size 0.75rem
  font-weight 700
  padding 0.1rem 0.25rem
  border-radius 0.25rem
  border 1px solid
  outline none

  .card-light &
    background #ffffff
    border-color #cbd5e1
    color #b45309

  .card-dark &
    background #060a12
    border-color #2a3f63
    color #f5c518

.group-tag-input
  width 3rem
  font-size 0.625rem
  padding 0.1rem 0.25rem
  border-radius 0.25rem
  border 1px solid
  outline none

  .card-light &
    background #ffffff
    border-color #cbd5e1
    color #2563eb

  .card-dark &
    background #060a12
    border-color #2a3f63
    color #60a5fa

.slots-list
  flex 1
  display flex
  flex-direction column
  gap 0.25rem
  min-height 160px

.slot-item-wrapper
  position relative
  border-radius 0.25rem
  transition all 0.15s ease

  &.drag-over
    outline 2px solid #3b82f6
    background rgba(59, 130, 246, 0.1)

  &.leader-divider
    border-bottom 1px solid rgba(245, 197, 24, 0.3)

.draggable
  cursor grab
  &:active
    cursor grabbing

.group-footer
  margin-top 0.5rem
  padding-top 0.25rem

.footer-badge
  font-size 0.625rem
  text-transform uppercase
  letter-spacing 0.05em
  text-align center
  padding 0.15rem 0.5rem
  border-radius 0.25rem
  border 1px solid
  font-weight 600
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

  &.badge-heal
    background rgba(239, 68, 68, 0.1)
    color #ef5757
    border-color rgba(239, 68, 68, 0.4)

  &.badge-call
    background rgba(234, 179, 8, 0.1)
    color #ef4444
    border-color rgba(234, 179, 8, 0.4)

  &.badge-default
    background rgba(59, 130, 246, 0.1)
    color #3b82f6
    border-color rgba(59, 130, 246, 0.4)

.footer-tag-input
  width 100%
  font-size 0.625rem
  text-align center
  text-transform uppercase
  letter-spacing 0.05em
  padding 0.15rem 0.25rem
  border-radius 0.25rem
  border 1px solid
  outline none
  box-sizing border-box

  .card-light &
    background #ffffff
    border-color #cbd5e1
    color #ef5757

  .card-dark &
    background #060a12
    border-color #2a3f63
    color #ef5757
</style>
