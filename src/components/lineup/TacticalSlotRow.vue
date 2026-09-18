<template lang="pug">
.tactical-slot-row(
  :class="[themeStore.theme === 'light' ? 'row-light' : 'row-dark', { 'has-member': !!slot.userId }]"
)
  //- Cột Ingame (Chiếm ~55% bề rộng)
  .col-ingame(
    @click="onIngameClick"
    :title="slot.userId ? `${slot.displayName} (${classInfo.name})` : 'Trống - Kéo thả hoặc click để xếp'"
  )
    //- Member pill badge khi đã có người
    .member-pill(
      v-if="slot.userId"
      :style="pillStyle"
    )
      //- Icon phái nhỏ bên trong pill
      img.pill-class-icon(v-if="classInfo.icon" :src="classInfo.icon" :alt="classInfo.name")
      span.pill-name {{ slot.displayName || slot.username }}
      span.pill-ext-badge(v-if="isExternalMember" title="Ngoại bang") ⭐

    //- Ô trống khi chưa xếp
    .empty-pill(v-else)
      span.empty-icon ➕
      span.empty-text Trống

  //- Cột Phân công (Chiếm ~45% bề rộng)
  .col-skills(
    @click="onSkillsClick"
    :title="isEditMode ? 'Click để gán/đổi kỹ năng' : ''"
  )
    //- Danh sách các icon kỹ năng đã gán
    .skills-icons-row(v-if="slot.skills && slot.skills.length > 0")
      .skill-mini-badge(
        v-for="(skill, sIdx) in slot.skills"
        :key="sIdx"
        :title="skill.name"
      )
        img.skill-mini-icon(:src="skill.iconUrl" :alt="skill.name")

    //- Nút thêm skill khi chưa có hoặc ở chế độ edit
    .add-skill-placeholder(v-else-if="isEditMode && slot.userId")
      span.plus-hint ⚡ + Skill

  //- Nút gạt / xoá nhanh khi ở chế độ edit
  .slot-quick-actions(v-if="isEditMode && slot.userId")
    button.btn-quick-remove(
      @click.stop="$emit('remove')"
      title="Gạt về danh sách chờ (Pool)"
    ) ✕
</template>

<script setup>
import { computed } from 'vue';
import { getClassInfo } from '../../theme/classColors';
import { useThemeStore } from '../../stores/themeStore';

const props = defineProps({
  slot: { type: Object, required: true },
  isEditMode: { type: Boolean, default: false },
});

const emit = defineEmits(['toggleCheck', 'remove', 'clickSlot', 'openSkillAssign', 'deleteExternal']);
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

const pillStyle = computed(() => {
  const hex = classInfo.value.hex || '#3b82f6';
  
  // Tùy chỉnh màu chữ để tương phản cao nhất
  // Thiết Y (vàng), Toái Mộng (cyan) dùng chữ đậm
  const isYellowOrCyan = hex === '#f5c518' || hex === '#22d3ee' || hex === '#eab308';
  const textColor = isYellowOrCyan ? '#0f172a' : '#ffffff';

  return {
    backgroundColor: hex,
    color: textColor,
    borderColor: hex,
  };
});

const onIngameClick = () => {
  if (props.isEditMode) {
    emit('clickSlot', props.slot);
  } else {
    emit('toggleCheck', props.slot);
  }
};

const onSkillsClick = () => {
  if (props.isEditMode) {
    emit('openSkillAssign', props.slot);
  }
};
</script>

<style lang="stylus" scoped>
.tactical-slot-row
  display flex
  align-items center
  min-height 38px
  border-bottom 1px solid
  padding 0.25rem 0.35rem
  gap 0.35rem
  position relative
  transition background 0.15s ease

  &.row-light
    border-color #dbeafe
    background #f8fafc
    &:hover
      background #f1f5f9

  &.row-dark
    border-color #1e293b
    background #0b1120
    &:hover
      background #141f32

  &:last-child
    border-bottom none

.col-ingame
  flex 1.2
  min-width 0
  display flex
  align-items center
  cursor pointer

.col-skills
  flex 0.9
  min-width 0
  display flex
  align-items center
  justify-content flex-start
  min-height 30px
  cursor pointer

.member-pill
  width 100%
  height 28px
  border-radius 14px
  display flex
  align-items center
  justify-content center
  padding 0 0.5rem
  gap 0.35rem
  font-family 'Be Vietnam Pro', sans-serif
  font-size 0.75rem
  font-weight 700
  box-shadow 0 2px 5px rgba(0, 0, 0, 0.15)
  border 1px solid transparent
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
  transition transform 0.15s ease

  &:hover
    transform scale(1.02)

.pill-class-icon
  width 16px
  height 16px
  border-radius 50%
  object-fit cover
  flex-shrink 0

.pill-name
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
  flex 1
  text-align center

.pill-ext-badge
  font-size 0.7rem
  flex-shrink 0

.empty-pill
  width 100%
  height 26px
  border-radius 13px
  border 1px dashed #94a3b8
  display flex
  align-items center
  justify-content center
  gap 0.25rem
  color #94a3b8
  font-size 0.7rem
  font-weight 600
  background rgba(148, 163, 184, 0.05)
  transition all 0.15s ease

  &:hover
    border-color #0284c7
    color #0284c7
    background rgba(2, 132, 199, 0.08)

.empty-icon
  font-size 0.65rem

.skills-icons-row
  display flex
  align-items center
  flex-wrap wrap
  gap 0.25rem

.skill-mini-badge
  width 24px
  height 24px
  border-radius 4px
  border 1px solid #38bdf8
  overflow hidden
  background #000
  flex-shrink 0
  box-shadow 0 1px 3px rgba(0, 0, 0, 0.2)
  transition transform 0.15s ease

  &:hover
    transform scale(1.15)
    border-color #e0b854

.skill-mini-icon
  width 100%
  height 100%
  object-fit cover

.add-skill-placeholder
  font-size 0.65rem
  font-weight 600
  color #0284c7
  opacity 0.7
  padding 0.15rem 0.35rem
  border-radius 3px
  border 1px dashed rgba(2, 132, 199, 0.4)
  transition all 0.15s ease

  .row-dark &
    color #38bdf8
    border-color rgba(56, 189, 248, 0.4)

  &:hover
    opacity 1
    background rgba(2, 132, 199, 0.1)

.slot-quick-actions
  position absolute
  right 2px
  top 50%
  transform translateY(-50%)
  display flex
  align-items center
  z-index 2

.btn-quick-remove
  background rgba(239, 68, 68, 0.15)
  border 1px solid #ef4444
  color #ef4444
  width 18px
  height 18px
  border-radius 50%
  font-size 0.65rem
  display flex
  align-items center
  justify-content center
  cursor pointer
  opacity 0.6
  transition all 0.15s

  &:hover
    opacity 1
    background #ef4444
    color #ffffff
</style>
