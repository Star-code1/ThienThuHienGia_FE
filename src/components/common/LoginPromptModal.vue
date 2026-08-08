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
  border-radius 1rem
  padding 1.5rem
  text-align center
  display flex
  flex-direction column
  gap 1.5rem
  font-family 'Lora', serif

  &.modal-light
    background #ffffff
    border 1px solid #cbd5e1
    box-shadow 0 20px 40px rgba(0, 0, 0, 0.15)
    color #0f172a

  &.modal-dark
    background #080d19
    border 1px solid rgba(245, 197, 24, 0.4)
    box-shadow 0 0 40px rgba(245, 197, 24, 0.2)
    color #e2e8f0

.icon-circle
  width 4rem
  height 4rem
  border-radius 9999px
  display flex
  align-items center
  justify-content center
  font-size 2rem
  margin 0 auto
  animation pulse 2s infinite

  .modal-light &
    background rgba(217, 119, 6, 0.1)
    border 1px solid rgba(217, 119, 6, 0.4)

  .modal-dark &
    background rgba(245, 197, 24, 0.1)
    border 1px solid rgba(245, 197, 24, 0.4)
    box-shadow 0 0 20px rgba(245, 197, 24, 0.3)

.modal-body
  display flex
  flex-direction column
  gap 0.35rem

.modal-tag
  font-size 0.65rem
  font-weight 700
  letter-spacing 0.15em
  text-transform uppercase
  display block

  .modal-light &
    color #b45309

  .modal-dark &
    color #d97706

.modal-title
  font-size 1.25rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em
  margin 0

  .modal-light &
    color #0f172a

  .modal-dark &
    color #ffffff

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
  border-radius 0.75rem
  font-weight 700
  font-size 0.75rem
  background linear-gradient(to right, #5865F2, #404EED)
  color #ffffff
  border none
  cursor pointer
  display flex
  align-items center
  justify-content center
  gap 0.5rem
  transition all 0.2s ease
  box-shadow 0 4px 15px rgba(88, 101, 242, 0.3)

  &:hover
    filter brightness(1.1)

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
