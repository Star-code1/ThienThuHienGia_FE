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
  border-radius var(--radius-lg, 4px)
  padding 1.5rem
  text-align center
  display flex
  flex-direction column
  gap 1.5rem
  font-family var(--font-body)
  background var(--color-surface)
  color var(--color-text)
  border 2px solid var(--color-border)
  box-shadow 4px 4px 0px var(--color-border)

.icon-circle
  width 4rem
  height 4rem
  border-radius var(--radius, 2px)
  display flex
  align-items center
  justify-content center
  font-size 2rem
  margin 0 auto
  background var(--color-bg-subtle)
  border 2px solid var(--color-border)
  box-shadow 2px 2px 0px var(--color-border)

.modal-body
  display flex
  flex-direction column
  gap 0.35rem

.modal-tag
  font-size 0.65rem
  font-weight 700
  letter-spacing 0.15em
  text-transform uppercase
  font-family var(--font-mono, monospace)
  color var(--color-brand)
  display block

.modal-title
  font-size 1.15rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em
  font-family var(--font-heading)
  color var(--color-text)
  margin 0

.modal-desc
  font-size 0.75rem
  line-height 1.6
  margin-top 0.5rem

  .modal-light &
    color #475569

  .modal-dark &
    color #94a3b8

.highlight-text
  font-weight 700

  .modal-light &
    color #b45309

  .modal-dark &
    color #f5c518

.modal-actions
  display flex
  flex-direction column
  gap 0.75rem

.discord-btn
  width 100%
  padding 0.75rem
  border-radius 0px
  font-weight 700
  font-size 0.75rem
  font-family 'Silkscreen', monospace
  background #5865F2
  color #ffffff
  border 2px solid #1c1917
  box-shadow 3px 3px 0 #1c1917
  cursor pointer
  display flex
  align-items center
  justify-content center
  gap 0.5rem
  transition all 0.15s ease

  &:hover
    filter brightness(1.1)
    transform translate(-1px, -1px)
    box-shadow 4px 4px 0 #1c1917

  &:active
    transform translate(1px, 1px)
    box-shadow 1px 1px 0 #1c1917

.close-btn
  width 100%
  padding 0.65rem
  border-radius 0.75rem
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
