<template lang="pug">
.slot-row(
  :class="themeStore.theme === 'light' ? 'row-light' : 'row-dark'"
  @click="onRowClick"
)
  //- Checkbox tích chọn
  .checkbox-box(
    :class="{ 'checked': slot.isChecked }"
  )
    svg.check-svg(v-if="slot.isChecked" viewBox="0 0 20 20")
      path(d="M0 11l2-2 5 5L18 3l2 2L7 18z")

  //- Icon Phái
  .class-icon-box
    img.class-img(
      v-if="classInfo.icon"
      :src="classInfo.icon"
      :alt="classInfo.name"
    )
    .class-short-badge(
      v-else
      :style="{ borderColor: classInfo.hex, color: classInfo.hex, backgroundColor: `${classInfo.hex}15` }"
    ) {{ classInfo.short || '?' }}

  //- Tên & Chú thích
  .slot-info
    .slot-name-row
      span.slot-name(:style="{ color: nameColor }")
        | {{ slot.displayName || slot.username || '-- Cần xếp --' }}

      span.mercenary-tag(v-if="isExternalMember" title="Lính Đánh Thuê Ngoại Bang") ĐÁNH THUÊ

    .slot-note-wrapper(@click.stop)
      input.slot-note-input(
        v-if="isEditMode && slot.userId"
        v-model="slot.note"
        placeholder="Viết note..."
      )
      span.slot-note-text(v-else-if="slot.note") {{ slot.note }}

  //- Action buttons khi ở chế độ Edit
  .slot-actions(v-if="isEditMode && slot.userId")
    button.action-btn.btn-remove(
      @click.stop="$emit('remove')"
      title="Gạt khỏi vị trí (Trả về Pool)"
    ) ✕

    button.action-btn.btn-delete(
      v-if="isExternalMember"
      @click.stop="$emit('deleteExternal')"
      title="Xóa vĩnh viễn Lính Đánh Thuê này"
    ) 🗑️
</template>

<script setup>
import { computed } from 'vue';
import { getClassInfo } from '../../theme/classColors';
import { useThemeStore } from '../../stores/themeStore';

const props = defineProps({
  slot: { type: Object, required: true },
  isEditMode: { type: Boolean, default: false }
});

const emit = defineEmits(['toggleCheck', 'remove', 'clickSlot', 'deleteExternal']);
const themeStore = useThemeStore();

const isExternalMember = computed(() => {
  return !!(
    props.slot.isExternal ||
    (props.slot.userId && props.slot.userId.startsWith('ext_'))
  );
});

const classInfo = computed(() => {
  const cName = props.slot.className || props.slot.class || '';
  return getClassInfo(cName);
});

const nameColor = computed(() => {
  if (!props.slot.displayName && !props.slot.username) return '#64748b';
  return classInfo.value.hex || (themeStore.theme === 'light' ? '#0f172a' : '#e2e8f0');
});

const onRowClick = () => {
  if (props.isEditMode) {
    emit('clickSlot', props.slot);
  } else {
    emit('toggleCheck', props.slot);
  }
};
</script>

<style lang="stylus" scoped>
.slot-row
  position relative
  padding 0.25rem 0.375rem
  display flex
  align-items center
  gap 0.375rem
  border-bottom 1px dashed
  transition background 0.15s ease
  cursor pointer
  user-select none

  &.row-light
    border-color #e2e8f0
    &:hover
      background #f1f5f9

  &.row-dark
    border-color #1a273b
    &:hover
      background rgba(20, 32, 51, 0.6)

.checkbox-box
  width 0.875rem
  height 0.875rem
  border-radius 0.125rem
  border 1px solid
  display flex
  align-items center
  justify-content center
  flex-shrink 0
  transition all 0.15s ease

  .row-light &
    border-color #cbd5e1
    background #ffffff

  .row-dark &
    border-color #2e405e
    background #0c1322

  &.checked
    background #2563eb
    border-color #2563eb
    color #ffffff

.check-svg
  width 0.65rem
  height 0.65rem
  fill currentColor

.class-icon-box
  position relative
  flex-shrink 0
  display flex
  align-items center
  justify-content center

.class-img
  width 1.25rem
  height 1.25rem
  object-fit contain
  flex-shrink 0

.class-short-badge
  width 1.25rem
  height 1.25rem
  border-radius 9999px
  border 1px solid
  display flex
  align-items center
  justify-content center
  font-size 0.55rem
  font-weight 700

.slot-info
  flex 1
  min-width 0
  display flex
  flex-direction column
  justify-content center

.slot-name-row
  display flex
  align-items center
  gap 0.25rem
  min-width 0
  flex-wrap wrap

.slot-name
  font-size 0.75rem
  font-weight 600
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  line-height 1.2

.mercenary-tag
  font-size 0.5rem
  padding 0.05rem 0.25rem
  border-radius 0.125rem
  font-weight 700
  text-transform uppercase
  flex-shrink 0
  font-family 'Lora', serif

  .row-light &
    background #fef3c7
    color #b45309
    border 1px solid #fde68a

  .row-dark &
    background rgba(245, 197, 24, 0.2)
    color #f5c518
    border 1px solid rgba(245, 197, 24, 0.4)

.slot-note-wrapper
  margin-top 0.1rem

.slot-note-input
  width 100%
  font-size 0.625rem
  padding 0.1rem 0.25rem
  border-radius 0.25rem
  border 1px solid
  outline none
  box-sizing border-box

  .row-light &
    background #ffffff
    border-color #cbd5e1
    color #0f172a
    &::placeholder
      color #94a3b8

  .row-dark &
    background #090d16
    border-color #1e293b
    color #cbd5e1
    &::placeholder
      color #475569

.slot-note-text
  font-size 0.625rem
  display block
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

  .row-light &
    color #64748b

  .row-dark &
    color #94a3b8

.slot-actions
  display flex
  align-items center
  gap 0.25rem
  flex-shrink 0
  opacity 0
  transition opacity 0.15s ease

  .slot-row:hover &
    opacity 1

.action-btn
  width 1rem
  height 1rem
  border-radius 0.25rem
  font-size 0.625rem
  display flex
  align-items center
  justify-content center
  cursor pointer
  border 1px solid
  transition all 0.15s ease

  &.btn-remove
    .row-light &
      background #f1f5f9
      border-color #cbd5e1
      color #475569
    .row-dark &
      background rgba(51, 65, 85, 0.6)
      border-color #475569
      color #cbd5e1

    &:hover
      background #ef5757 !important
      color #ffffff !important
      border-color #ef5757 !important

  &.btn-delete
    background rgba(127, 29, 29, 0.4)
    border-color rgba(239, 68, 68, 0.6)
    color #ef5757
    &:hover
      background #ef5757
      color #ffffff
</style>
