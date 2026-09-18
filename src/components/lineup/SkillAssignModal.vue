<template lang="pug">
.assign-modal-overlay(v-if="visible" @click.self="$emit('close')")
  .assign-modal-container(
    :class="themeStore.theme === 'light' ? 'modal-light' : 'modal-dark'"
  )
    .modal-header
      .header-title-box
        span.header-icon 🎯
        .header-text-group
          h4.modal-title Phân Công Kỹ Năng / Tuyệt Kỹ
          span.modal-subtitle(v-if="targetInfo") {{ targetInfo.title }} ({{ targetInfo.memberName || 'Chưa xếp' }})
      button.btn-close(@click="$emit('close')") ✕

    .modal-body
      .current-skills-box(v-if="assignedSkills.length > 0")
        span.section-label Đang gán ({{ assignedSkills.length }}):
        .selected-skills-row
          .selected-skill-chip(
            v-for="s in assignedSkills"
            :key="s._id || s.id || s.name"
            @click="handleToggle(s)"
            title="Click để bỏ gán"
          )
            img.chip-img(:src="s.iconUrl" :alt="s.name")
            span.chip-name {{ s.name }}
            span.chip-remove ✕

      .available-skills-section
        span.section-label Chọn kỹ năng từ Database:
        .skills-grid(v-if="skillStore.allSkills.length > 0")
          .skill-pick-card(
            v-for="skill in skillStore.allSkills"
            :key="skill._id || skill.id"
            :class="{ 'is-selected': isSelected(skill) }"
            @click="handleToggle(skill)"
          )
            .pick-card-left
              img.skill-pick-img(:src="skill.iconUrl" :alt="skill.name")
              .skill-pick-info
                span.skill-pick-name {{ skill.name }}
                span.skill-pick-desc(v-if="skill.category") {{ skill.category }}
            .check-indicator(v-if="isSelected(skill)") ✓

        .empty-assign-box(v-else)
          span.empty-icon 📜
          p.empty-text Chưa có kỹ năng nào trong Database.
          button.btn-add-prompt(@click="$emit('openSkillManager')") ➕ Thêm kỹ năng mới ngay

    .modal-footer
      button.btn-manage-skills(@click="$emit('openSkillManager')") ⚙️ Quản lý danh mục kỹ năng
      button.btn-done(@click="$emit('close')") Hoàn tất
</template>

<script setup>
import { computed } from 'vue';
import { useSkillStore } from '../../stores/skillStore';
import { useThemeStore } from '../../stores/themeStore';

const props = defineProps({
  visible: { type: Boolean, default: false },
  targetInfo: { type: Object, default: null }, // { dIdx, tIdx, sIdx, title, memberName, skills: [] }
});

const emit = defineEmits(['close', 'toggleSkill', 'openSkillManager']);

const skillStore = useSkillStore();
const themeStore = useThemeStore();

const assignedSkills = computed(() => {
  return props.targetInfo?.skills || [];
});

const isSelected = (skill) => {
  const sId = skill._id || skill.id;
  return assignedSkills.value.some((s) => (s._id || s.id) === sId || s.name === skill.name);
};

const handleToggle = (skill) => {
  emit('toggleSkill', skill);
};
</script>

<style lang="stylus" scoped>
.assign-modal-overlay
  position fixed
  inset 0
  background rgba(0, 0, 0, 0.7)
  backdrop-filter blur(4px)
  z-index 9999
  display flex
  align-items center
  justify-content center
  padding 1rem

.assign-modal-container
  width 100%
  max-width 560px
  max-height 85vh
  border-radius var(--radius-xl, 20px)
  border 1px solid
  display flex
  flex-direction column
  overflow hidden
  box-shadow var(--shadow-modal)

  &.modal-light
    background #ffffff
    border-color #e2e8f0
    color #0f172a

  &.modal-dark
    background #0f172a
    border-color #1e293b
    color #f8fafc

.modal-header
  display flex
  justify-content space-between
  align-items center
  padding 1rem 1.25rem
  border-bottom 1px solid
  background var(--color-bg-subtle)

  .modal-light &
    border-color #e2e8f0

  .modal-dark &
    border-color #1e293b

.header-title-box
  display flex
  align-items center
  gap 0.5rem

.header-icon
  font-size 1.25rem

.modal-title
  font-family var(--font-heading)
  font-size 1rem
  font-weight 800
  margin 0

.modal-subtitle
  font-size 0.75rem
  font-weight 600
  color #3b82f6

  .modal-dark &
    color #60a5fa

.btn-close
  background none
  border none
  font-size 1.1rem
  cursor pointer
  color inherit
  padding 0.2rem 0.4rem
  border-radius 50%
  transition all 0.2s ease

  &:hover
    background rgba(239, 68, 68, 0.15)
    color #ef4444

.modal-body
  padding 1.25rem
  overflow-y auto
  display flex
  flex-direction column
  gap 1rem

.section-label
  font-size 0.75rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.03em
  margin-bottom 0.4rem
  display block
  color var(--color-muted)

.selected-skills-row
  display flex
  flex-wrap wrap
  gap 0.4rem

.selected-skill-chip
  display flex
  align-items center
  gap 0.35rem
  padding 0.3rem 0.65rem
  border-radius var(--radius-full, 9999px)
  background #eff6ff
  border 1px solid #bfdbfe
  color #2563eb
  cursor pointer
  transition all 0.15s ease

  .modal-dark &
    background rgba(37, 99, 235, 0.2)
    border-color rgba(59, 130, 246, 0.4)
    color #93c5fd

  &:hover
    background #fef2f2
    border-color #fecaca
    color #ef4444
    .chip-remove
      color #ef4444

.chip-img
  width 18px
  height 18px
  border-radius 50%
  object-fit cover

.chip-name
  font-size 0.75rem
  font-weight 600

.chip-remove
  font-size 0.75rem
  color #64748b
  margin-left 0.2rem

.skills-grid
  display grid
  grid-template-columns repeat(auto-fill, minmax(220px, 1fr))
  gap 0.5rem

.skill-pick-card
  display flex
  align-items center
  justify-content space-between
  padding 0.5rem 0.75rem
  border-radius var(--radius-md, 12px)
  border 1px solid
  cursor pointer
  transition all 0.2s ease

  .modal-light &
    background #f8fafc
    border-color #e2e8f0

    &:hover
      background #ffffff
      border-color #3b82f6

    &.is-selected
      background #eff6ff
      border-color #3b82f6

  .modal-dark &
    background #141f32
    border-color #1e293b

    &:hover
      background #1e293b
      border-color #60a5fa

    &.is-selected
      background rgba(37, 99, 235, 0.2)
      border-color #60a5fa

.pick-card-left
  display flex
  align-items center
  gap 0.5rem
  overflow hidden

.skill-pick-img
  width 28px
  height 28px
  border-radius var(--radius-xs, 4px)
  object-fit cover
  border 1px solid rgba(56, 189, 248, 0.4)
  flex-shrink 0

.skill-pick-info
  display flex
  flex-direction column
  overflow hidden

.skill-pick-name
  font-size 0.8rem
  font-weight 700
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

.skill-pick-desc
  font-size 0.65rem
  color var(--color-muted)

.check-indicator
  font-size 0.85rem
  font-weight 900
  color #3b82f6

  .modal-dark &
    color #60a5fa

.modal-footer
  padding 0.75rem 1.25rem
  border-top 1px solid
  display flex
  justify-content space-between
  align-items center

  .modal-light &
    border-color #e2e8f0

  .modal-dark &
    border-color #1e293b

.btn-manage-skills
  background none
  border none
  color #3b82f6
  font-size 0.75rem
  font-weight 600
  cursor pointer
  padding 0.3rem 0.5rem

  .modal-dark &
    color #60a5fa

  &:hover
    text-decoration underline

.btn-done
  padding 0.45rem 1.25rem
  border-radius var(--radius-md, 12px)
  background #3b82f6
  color #ffffff
  border none
  font-family var(--font-body)
  font-size 0.8rem
  font-weight 600
  cursor pointer
  transition all 0.2s ease
  box-shadow var(--shadow-sm)

  &:hover
    background #2563eb

.empty-assign-box
  padding 2rem 1rem
  text-align center
  border 1px dashed var(--color-border)
  border-radius var(--radius-md, 12px)
  background var(--color-bg-subtle)
  display flex
  flex-direction column
  align-items center
  gap 0.5rem

.empty-icon
  font-size 2rem

.empty-text
  font-size 0.85rem
  color var(--color-text-muted)
  margin 0

.btn-add-prompt
  padding 0.4rem 0.85rem
  border-radius var(--radius-sm, 8px)
  background #3b82f6
  color #ffffff
  border none
  font-size 0.75rem
  font-weight 600
  cursor pointer
  transition all 0.2s ease

  &:hover
    background #2563eb
</style>
