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
  max-width 22.5rem
  border-radius 0.75rem
  box-shadow 0 25px 50px -12px rgba(0, 0, 0, 0.5)
  overflow hidden

  &.card-light
    background #ffffff
    border 1px solid #cbd5e1
    color #0f172a

  &.card-dark
    background #0d1017
    border 1px solid #2a3140
    color #e2e8f0

.top-gold-bar
  height 4px
  background linear-gradient(to right, #f3d78a, #d4af37, #a8792f)

.card-body
  padding 1.25rem

.title-row
  display flex
  align-items center
  gap 0.5rem
  margin-bottom 0.375rem

.check-badge
  width 1.5rem
  height 1.5rem
  border-radius 9999px
  background rgba(52, 211, 153, 0.15)
  border 1px solid rgba(52, 211, 153, 0.4)
  color #34d399
  display flex
  align-items center
  justify-content center
  font-size 0.75rem
  font-weight 700

.confirm-title
  font-size 1rem
  font-weight 700
  margin 0

  .card-light &
    color #b45309

  .card-dark &
    color #e0b854

.confirm-desc
  font-size 0.875rem
  line-height 1.6
  margin-bottom 1rem

  .card-light &
    color #475569

  .card-dark &
    color #9aa1b8

.actions-row
  display flex
  justify-content flex-end
  gap 0.5rem

.btn-cancel
  padding 0.375rem 0.875rem
  border-radius 0.5rem
  font-size 0.875rem
  cursor pointer
  transition all 0.15s ease

  .card-light &
    background #f1f5f9
    border 1px solid #cbd5e1
    color #475569
    &:hover
      background #e2e8f0
      color #0f172a

  .card-dark &
    background transparent
    border 1px solid #2a3140
    color #9aa1b8
    &:hover
      background #171c26
      color #ffffff

  &:disabled
    opacity 0.5

.btn-confirm
  padding 0.375rem 0.875rem
  border-radius 0.5rem
  font-size 0.875rem
  font-weight 600
  color #ffffff
  background linear-gradient(to bottom, #3a7bd5, #2f63ac)
  border none
  cursor pointer
  display flex
  align-items center
  gap 0.375rem
  transition all 0.15s ease

  &:hover
    filter brightness(1.1)

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
