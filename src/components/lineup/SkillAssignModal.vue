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
        .skills-grid
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
  border-radius 0.5rem
  border 2px solid
  display flex
  flex-direction column
  overflow hidden
  box-shadow 0 15px 35px rgba(0, 0, 0, 0.4)

  &.modal-light
    background #ffffff
    border-color #0284c7
    color #0f172a

  &.modal-dark
    background #0f172a
    border-color #38bdf8
    color #f8fafc

.modal-header
  display flex
  justify-content space-between
  align-items center
  padding 0.85rem 1.15rem
  border-bottom 2px solid
  background rgba(56, 189, 248, 0.08)

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
  font-family 'Chakra Petch', sans-serif
  font-size 1rem
  font-weight 700
  margin 0

.modal-subtitle
  font-size 0.75rem
  color #0284c7

  .modal-dark &
    color #38bdf8

.btn-close
  background none
  border none
  font-size 1.1rem
  cursor pointer
  color inherit
  padding 0.2rem 0.4rem
  border-radius 0.25rem

  &:hover
    background rgba(239, 68, 68, 0.2)
    color #ef4444

.modal-body
  padding 1.15rem
  overflow-y auto
  display flex
  flex-direction column
  gap 1rem

.section-label
  font-size 0.75rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em
  margin-bottom 0.4rem
  display block
  color #64748b

.selected-skills-row
  display flex
  flex-wrap wrap
  gap 0.4rem

.selected-skill-chip
  display flex
  align-items center
  gap 0.35rem
  padding 0.25rem 0.5rem
  border-radius 1rem
  background rgba(2, 132, 199, 0.15)
  border 1px solid #0284c7
  cursor pointer
  transition all 0.15s ease

  &:hover
    background rgba(239, 68, 68, 0.15)
    border-color #ef4444
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
  padding 0.5rem 0.65rem
  border-radius 0.375rem
  border 1px solid
  cursor pointer
  transition all 0.15s ease

  .modal-light &
    background #f8fafc
    border-color #cbd5e1

    &:hover
      background #f1f5f9
      border-color #0284c7

    &.is-selected
      background #e0f2fe
      border-color #0284c7

  .modal-dark &
    background #1e293b
    border-color #334155

    &:hover
      background #273549
      border-color #38bdf8

    &.is-selected
      background rgba(56, 189, 248, 0.18)
      border-color #38bdf8

.pick-card-left
  display flex
  align-items center
  gap 0.5rem
  overflow hidden

.skill-pick-img
  width 28px
  height 28px
  border-radius 0.25rem
  object-fit cover
  border 1px solid #38bdf8
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
  color #94a3b8

.check-indicator
  font-size 0.85rem
  font-weight 900
  color #0284c7

  .modal-dark &
    color #38bdf8

.modal-footer
  padding 0.75rem 1.15rem
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
  color #0284c7
  font-size 0.75rem
  font-weight 600
  cursor pointer
  padding 0.3rem 0.5rem

  .modal-dark &
    color #38bdf8

  &:hover
    text-decoration underline

.btn-done
  padding 0.4rem 1.15rem
  border-radius 0.25rem
  background #0284c7
  color #ffffff
  border none
  font-family 'Chakra Petch', sans-serif
  font-size 0.85rem
  font-weight 700
  cursor pointer

  &:hover
    background #0369a1
</style>
