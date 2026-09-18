<template lang="pug">
Transition(name="fade")
  .modal-backdrop(
    v-if="visible"
    @click.self="$emit('cancel')"
  )
    .confirm-card(
      :class="themeStore.theme === 'light' ? 'card-light' : 'card-dark'"
    )
      .top-gold-bar
      .card-body
        .title-row
          span.check-badge ✓
          h3.confirm-title Đã lưu đội hình

        p.confirm-desc Bạn có muốn chụp lại ảnh đội hình hiện tại để lưu về máy không?

        .actions-row
          button.btn-cancel(
            @click="$emit('cancel')"
            :disabled="capturing"
          ) Bỏ qua

          button.btn-confirm(
            @click="$emit('confirm')"
            :disabled="capturing"
          )
            span.spinner(v-if="capturing")
            span {{ capturing ? 'Đang chụp...' : 'Chụp ảnh' }}
</template>

<script setup>
import { useThemeStore } from '../../stores/themeStore';

defineProps({
  visible: { type: Boolean, default: false },
  capturing: { type: Boolean, default: false }
});

defineEmits(['confirm', 'cancel']);
const themeStore = useThemeStore();
</script>

<style lang="stylus" scoped>
.modal-backdrop
  position fixed
  inset 0
  z-index 50
  display flex
  align-items center
  justify-content center
  background rgba(0, 0, 0, 0.6)
  backdrop-filter blur(4px)
  padding 1rem
  font-family 'Lora', serif

.confirm-card
  width 100%
  max-width 24rem
  border-radius var(--radius-xl, 20px)
  box-shadow var(--shadow-modal)
  overflow hidden

  &.card-light
    background #ffffff
    border 1px solid #e2e8f0
    color #0f172a

  &.card-dark
    background #0f172a
    border 1px solid #1e293b
    color #f8fafc

.top-gold-bar
  height 3px
  background linear-gradient(to right, #60a5fa, #3b82f6)

.card-body
  padding 1.5rem

.title-row
  display flex
  align-items center
  gap 0.5rem
  margin-bottom 0.5rem

.check-badge
  width 1.75rem
  height 1.75rem
  border-radius var(--radius-full, 9999px)
  background #ecfdf5
  border 1px solid #a7f3d0
  color #10b981
  display flex
  align-items center
  justify-content center
  font-size 0.85rem
  font-weight 700

  .card-dark &
    background rgba(16, 185, 129, 0.2)
    border-color rgba(52, 211, 153, 0.4)
    color #34d399

.confirm-title
  font-size 1.05rem
  font-weight 800
  margin 0
  color var(--color-text)

.confirm-desc
  font-size 0.85rem
  line-height 1.6
  margin-bottom 1.25rem
  color var(--color-text-secondary)

.actions-row
  display flex
  justify-content flex-end
  gap 0.65rem

.btn-cancel
  padding 0.45rem 1rem
  border-radius var(--radius-md, 12px)
  font-size 0.8rem
  font-weight 600
  cursor pointer
  transition all 0.2s ease
  background var(--color-bg-subtle)
  border 1px solid var(--color-border)
  color var(--color-text)

  &:hover
    border-color var(--color-brand)

  &:disabled
    opacity 0.5

.btn-confirm
  padding 0.45rem 1.15rem
  border-radius var(--radius-md, 12px)
  font-size 0.8rem
  font-weight 600
  color #ffffff
  background #3b82f6
  border none
  cursor pointer
  display flex
  align-items center
  gap 0.375rem
  transition all 0.2s ease
  box-shadow var(--shadow-sm)

  &:hover
    background #2563eb

  &:disabled
    opacity 0.6

.spinner
  width 0.75rem
  height 0.75rem
  border-radius 9999px
  border 2px solid rgba(255, 255, 255, 0.4)
  border-top-color #ffffff
  animation spin 1s linear infinite

.fade-enter-active, .fade-leave-active
  transition opacity 0.15s ease

.fade-enter-from, .fade-leave-to
  opacity 0

@keyframes spin
  to
    transform rotate(360deg)
</style>
