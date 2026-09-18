<template lang="pug">
Teleport(to="body")
  Transition(name="fade")
    .modal-overlay(
      v-if="authStore.showLoginPromptModal"
      @click.self="authStore.closeLoginPrompt()"
    )
      .modal-box(
        :class="themeStore.theme === 'light' ? 'modal-light' : 'modal-dark'"
      )
        .icon-circle
          span 📜

        .modal-body
          span.modal-tag 天 書 門 — TIÊN MÔN THẮP PHIẾU
          h3.modal-title YÊU CẦU QUY NẬP XÁC THỰC
          p.modal-desc
            | Để bảo hộ bí mật chiến trận và ma trận nội bộ Bang hội, các tiên phong khu vực yêu cầu đệ tử quy nhập xác thực tài khoản Discord mang chức vị 
            span.highlight-text Bang Chúng
            |  trong Thiên Thư Môn.

        .modal-actions
          button.discord-btn(@click="handleLogin")
            span 👾
            span Quy Nhập Xác Thực Discord

          button.close-btn(@click="authStore.closeLoginPrompt()")
            | Quán Chiêm Trang Chủ
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';

const authStore = useAuthStore();
const themeStore = useThemeStore();

const handleLogin = () => {
  authStore.closeLoginPrompt();
  authStore.loginWithDiscord();
};
</script>

<style lang="stylus" scoped>
.modal-overlay
  position fixed
  inset 0
  z-index 50
  display flex
  align-items center
  justify-content center
  padding 1rem
  background rgba(0, 0, 0, 0.75)
  backdrop-filter blur(6px)
  user-select none

.modal-box
  position relative
  width 100%
  max-width 28rem
  border-radius var(--radius-xl, 20px)
  padding 1.75rem
  text-align center
  display flex
  flex-direction column
  gap 1.5rem
  font-family var(--font-body)
  background var(--color-surface)
  color var(--color-text)
  border 1px solid var(--color-border)
  box-shadow var(--shadow-modal)

.icon-circle
  width 4.25rem
  height 4.25rem
  border-radius var(--radius-full, 9999px)
  display flex
  align-items center
  justify-content center
  font-size 2rem
  margin 0 auto
  background var(--color-brand-subtle)
  border 1px solid var(--color-border)
  box-shadow var(--shadow-sm)

.modal-body
  display flex
  flex-direction column
  gap 0.35rem

.modal-tag
  font-size 0.65rem
  font-weight 700
  letter-spacing 0.12em
  text-transform uppercase
  font-family var(--font-body)
  color var(--color-brand)
  display block

.modal-title
  font-size 1.2rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.03em
  font-family var(--font-heading)
  color var(--color-text)
  margin 0

.modal-desc
  font-size 0.8rem
  line-height 1.6
  margin-top 0.5rem

  .modal-light &
    color #475569

  .modal-dark &
    color #94a3b8

.highlight-text
  font-weight 700

  .modal-light &
    color #2563eb

  .modal-dark &
    color #60a5fa

.modal-actions
  display flex
  flex-direction column
  gap 0.75rem

.discord-btn
  width 100%
  padding 0.75rem 1rem
  border-radius var(--radius-md, 12px)
  font-weight 700
  font-size 0.8rem
  font-family var(--font-body)
  background #5865F2
  color #ffffff
  border 1px solid transparent
  box-shadow var(--shadow-sm)
  cursor pointer
  display flex
  align-items center
  justify-content center
  gap 0.5rem
  transition all 0.2s ease

  &:hover
    background #4752c4
    transform translateY(-1px)
    box-shadow var(--shadow-md)

  &:active
    transform translateY(0)

.close-btn
  width 100%
  padding 0.65rem
  border-radius var(--radius-md, 12px)
  font-weight 600
  font-size 0.75rem
  cursor pointer
  transition all 0.2s ease

  .modal-light &
    background #f1f5f9
    border 1px solid #cbd5e1
    color #475569
    &:hover
      background #e2e8f0
      color #0f172a

  .modal-dark &
    background #111c2e
    border 1px solid #1e304d
    color #94a3b8
    &:hover
      background #1b2b45
      color #ffffff

.fade-enter-active, .fade-leave-active
  transition opacity 0.25s ease

.fade-enter-from, .fade-leave-to
  opacity 0

@keyframes pulse
  0%, 100%
    opacity 1
  50%
    opacity 0.6
</style>
