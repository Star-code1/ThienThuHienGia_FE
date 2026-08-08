<template lang="pug">
.callback-container(
  :class="themeStore.theme === 'light' ? 'auth-light' : 'auth-dark'"
)
  .auth-card
    //- Loading State
    .state-box(v-if="loading")
      .spinner-wrapper
        .spinner-ring
        span.spinner-icon 📜
      .state-text-group
        h2.state-title ĐANG TRA ẤN ĐỊNH DANH TÍNH
        p.state-desc Đang tra cứu tiên sổ đệ tử trực thuộc Thiên Thư Môn...

    //- Success State
    .state-box(v-else-if="success")
      .success-icon-box ✨
      .state-text-group
        h2.state-title.title-emerald QUY NHẬP THÀNH CÔNG!
        p.success-msg
          | Chào mừng đệ tử 
          span.highlight-name {{ user?.nickname || user?.globalName || user?.username }}
          |  an vị!
        p.state-desc Đang chuyển về Trang Chủ...

    //- Error / Rejected State
    .state-box(v-else)
      .error-icon-box 🛑
      .state-text-group
        h2.state-title.title-red TỪ CHỐI QUY NẬP
        .error-reason-box
          span.error-reason-label ⚠️ Nguyên do:
          span.error-reason-msg {{ errorMessage || 'Tài khoản của bạn chưa có Role Bang Chúng trong Thiên Thư Môn.' }}

      .actions-group
        button.btn-retry(@click="authStore.loginWithDiscord()") 🔄 Thử Quy Nhập Lại
        RouterLink.btn-home-link(to="/") 🏠 Trở Về Trang Chủ
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();

const loading = ref(true);
const success = ref(false);
const errorMessage = ref('');
const user = ref(null);

onMounted(async () => {
  const code = route.query.code;
  const error = route.query.error;

  if (error) {
    loading.value = false;
    errorMessage.value = 'Đệ tử chưa đồng ý ủy quyền từ Discord.';
    return;
  }

  if (!code) {
    loading.value = false;
    errorMessage.value = 'Thiếu chứng thư xác thực quy nhập.';
    return;
  }

  const result = await authStore.handleCallback(code);

  loading.value = false;
  if (result.success) {
    success.value = true;
    user.value = result.user;
    setTimeout(() => {
      router.push('/');
    }, 1500);
  } else {
    success.value = false;
    errorMessage.value = result.message;
  }
});
</script>

<style lang="stylus" scoped>
.callback-container
  position relative
  min-height calc(100vh - 57px)
  display flex
  align-items center
  justify-content center
  padding 1.5rem
  user-select none
  font-family 'Lora', serif

.auth-card
  position relative
  z-index 10
  width 100%
  max-width 28rem
  border-radius 1rem
  padding 2rem
  text-align center
  backdrop-filter blur(12px)

  .auth-light &
    background #ffffff
    border 1px solid #cbd5e1
    box-shadow 0 20px 40px rgba(0, 0, 0, 0.1)

  .auth-dark &
    background rgba(8, 13, 25, 0.9)
    border 1px solid #1e304d
    box-shadow 0 20px 40px rgba(0, 0, 0, 0.5)

.state-box
  display flex
  flex-direction column
  gap 1.5rem
  padding 1rem 0

.spinner-wrapper
  position relative
  width 5rem
  height 5rem
  margin 0 auto
  display flex
  align-items center
  justify-content center

.spinner-ring
  position absolute
  inset 0
  border-radius 9999px
  border 2px solid
  border-top-color #f5c518
  border-bottom-color #38bdf8
  border-left-color transparent
  border-right-color transparent
  animation spin 1s linear infinite

.spinner-icon
  font-size 1.75rem

.state-text-group
  display flex
  flex-direction column
  gap 0.35rem

.state-title
  font-size 1.25rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.05em
  margin 0

  .auth-light &
    background linear-gradient(to right, #b45309, #d97706)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

  .auth-dark &
    background linear-gradient(to right, #fffbeb, #f5c518, #b45309)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

  &.title-emerald
    color #059669
    -webkit-text-fill-color #059669
    .auth-dark &
      color #34d399
      -webkit-text-fill-color #34d399

  &.title-red
    color #dc2626
    -webkit-text-fill-color #dc2626
    .auth-dark &
      color #ef4444
      -webkit-text-fill-color #ef4444

.state-desc
  font-size 0.75rem

  .auth-light &
    color #64748b

  .auth-dark &
    color #94a3b8

.success-icon-box
  width 4rem
  height 4rem
  border-radius 9999px
  display flex
  align-items center
  justify-content center
  font-size 2rem
  margin 0 auto

  .auth-light &
    background #d1fae5
    border 1px solid #a7f3d0
    color #059669

  .auth-dark &
    background rgba(52, 211, 153, 0.2)
    border 1px solid rgba(52, 211, 153, 0.5)
    color #34d399
    box-shadow 0 0 20px rgba(52, 211, 153, 0.3)

.success-msg
  font-size 0.875rem
  font-weight 700

  .auth-light &
    color #0f172a

  .auth-dark &
    color #ffffff

.highlight-name
  .auth-light &
    color #b45309

  .auth-dark &
    color #f5c518

.error-icon-box
  width 4rem
  height 4rem
  border-radius 9999px
  display flex
  align-items center
  justify-content center
  font-size 2rem
  margin 0 auto
  animation bounce 1s infinite

  .auth-light &
    background #fee2e2
    border 1px solid #fca5a5

  .auth-dark &
    background rgba(239, 68, 68, 0.2)
    border 1px solid rgba(239, 68, 68, 0.5)

.error-reason-box
  padding 0.85rem
  border-radius 0.75rem
  border 1px solid
  font-size 0.75rem
  text-align left
  line-height 1.6
  margin-top 0.5rem

  .auth-light &
    background #fef2f2
    border-color #fca5a5
    color #991b1b

  .auth-dark &
    background #180d12
    border-color rgba(127, 29, 29, 0.6)
    color #fca5a5

.error-reason-label
  font-weight 700
  display block
  margin-bottom 0.25rem

  .auth-light &
    color #dc2626

  .auth-dark &
    color #f87171

.actions-group
  display flex
  flex-direction column
  gap 0.75rem
  margin-top 0.5rem

.btn-retry
  padding 0.75rem
  border-radius 0.75rem
  font-size 0.75rem
  font-weight 800
  border none
  cursor pointer
  transition all 0.2s ease

  .auth-light &
    background linear-gradient(to right, #b45309, #d97706)
    color #ffffff

  .auth-dark &
    background linear-gradient(to right, #d97706, #f5c518)
    color #020617

.btn-home-link
  padding 0.65rem
  border-radius 0.75rem
  font-size 0.75rem
  font-weight 600
  text-decoration none
  border 1px solid
  transition all 0.15s ease

  .auth-light &
    background #f1f5f9
    border-color #cbd5e1
    color #475569

  .auth-dark &
    background #111c2e
    border-color #1e304d
    color #94a3b8

@keyframes spin
  to
    transform rotate(360deg)

@keyframes bounce
  0%, 100%
    transform translateY(-10%)
    animation-timing-function cubic-bezier(0.8, 0, 1, 1)
  50%
    transform translateY(0)
    animation-timing-function cubic-bezier(0, 0, 0.2, 1)
</style>
