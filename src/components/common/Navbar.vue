<template lang="pug">
header.navbar-header(
  :class="themeStore.theme === 'light' ? 'nav-light' : 'nav-dark'"
)
  //- Left Section: Menu Toggle + Brand Logo
  .nav-left
    button.menu-btn(
      @click="$emit('toggleMenu')"
      title="Mở Bảng Chức Năng Tiên Môn"
    )
      span.menu-icon ☰
      span.menu-text Bảng Chức Năng

    RouterLink.brand-link(to="/")
      .brand-icon 📜
      .brand-text
        h1.brand-title THIÊN THƯ MÔN
        span.brand-subtitle QUẢN TRỊ TIÊN MÔN

  //- Right Section: Server Time & Discord User Login
  .nav-right
    .server-time
      span.time-label Ấn Định Khắc
      span.time-value {{ currentTime }}

    button.theme-toggle-btn(
      @click="themeStore.toggleTheme()"
      :title="themeStore.theme === 'dark' ? 'Chuyển sang Giao diện Sáng (Thanh Vân)' : 'Chuyển sang Giao diện Tối (Huyền Dạ)'"
    )
      span.theme-icon {{ themeStore.theme === 'dark' ? '☀️' : '🌙' }}
      span.theme-label {{ themeStore.theme === 'dark' ? 'Dạ Cảnh' : 'Bạch Nhật' }}

    .user-section(v-if="authStore.isAuthenticated" ref="userMenuRef")
      button.user-btn(@click.stop="isUserMenuOpen = !isUserMenuOpen")
        img.user-avatar(
          :src="authStore.user?.avatar"
          :alt="authStore.user?.username"
        )
        .user-info
          .user-header-row
            span.user-name {{ authStore.user?.nickname || authStore.user?.globalName || authStore.user?.username }}
            span.role-badge(
              :class="userRoleClass"
              :title="'Chức Vị: ' + userPrimaryRole"
            ) {{ userRoleBadgeText }}
          span.user-class(:style="{ color: userClassInfo.hex }")
            img.class-icon(v-if="userClassInfo.icon" :src="userClassInfo.icon")
            span {{ authStore.user?.className || 'Bang Chúng' }}
        span.arrow-down ▼

      Transition(name="dropdown")
        .user-dropdown(v-if="isUserMenuOpen")
          .dropdown-header
            .flex-row-between
              span.label-sub Biệt Danh Xuất Trận:
              span.role-badge(:class="userRoleClass") {{ userPrimaryRole }}
            span.user-name-highlight {{ authStore.user?.nickname || authStore.user?.username }}
            .flex-row-class
              span.label-sub Môn Phái:
              span.class-pill(
                :style="{ backgroundColor: `${userClassInfo.hex}20`, borderColor: `${userClassInfo.hex}50`, color: userClassInfo.hex }"
              )
                img.class-icon(v-if="userClassInfo.icon" :src="userClassInfo.icon")
                span {{ authStore.user?.className || 'Bang Chúng' }}

          RouterLink.dropdown-link(
            to="/profile"
            @click="isUserMenuOpen = false"
          )
            span 👤 Tiên Môn Hồ Sơ
            span ➔

          button.dropdown-link(
            @click="themeStore.toggleTheme()"
          )
            .flex-row-gap
              span {{ themeStore.theme === 'dark' ? '☀️' : '🌙' }}
              span Chế Độ: {{ themeStore.theme === 'dark' ? 'Sáng (Thanh Vân)' : 'Tối (Huyền Dạ)' }}
            span.theme-status-tag(
              :class="themeStore.theme === 'dark' ? 'tag-dark' : 'tag-light'"
            ) {{ themeStore.theme === 'dark' ? 'Tối' : 'Sáng' }}

          button.dropdown-link.logout-btn(
            @click="authStore.logout(); isUserMenuOpen = false;"
          )
            span Đăng Xuất
            span ➔

    button.login-btn(
      v-else
      @click="authStore.loginWithDiscord()"
    )
      span 👾
      span.btn-text Quy Nhập Discord
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { getClassInfo } from '../../theme/classColors';

defineEmits(['toggleMenu']);
const route = useRoute();
const authStore = useAuthStore();
const themeStore = useThemeStore();

const userClassInfo = computed(() => getClassInfo(authStore.user?.className || ''));

const userPrimaryRole = computed(() => {
  if (authStore.user?.primaryRole) return authStore.user.primaryRole;
  if (authStore.user?.roles && authStore.user.roles.includes('Đương Gia')) return 'Đương Gia';
  if (authStore.user?.roles && authStore.user.roles.includes('Đường Chủ')) return 'Đường Chủ';
  if (authStore.canEdit) return 'Đương Gia';
  return 'Bang Chúng';
});

const userRoleBadgeText = computed(() => {
  if (userPrimaryRole.value === 'Đương Gia') return '⭐ Đương Gia';
  if (userPrimaryRole.value === 'Đường Chủ') return '👑 Đường Chủ';
  return 'Bang Chúng';
});

const userRoleClass = computed(() => {
  if (userPrimaryRole.value === 'Đương Gia') return 'role-duong-gia';
  if (userPrimaryRole.value === 'Đường Chủ') return 'role-duong-chu';
  return 'role-bang-chung';
});

const currentTime = ref('');
const isUserMenuOpen = ref(false);
const userMenuRef = ref(null);

let timer = null;
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const handleOutsideClick = (e) => {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
  authStore.fetchUser();
  window.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
  window.removeEventListener('click', handleOutsideClick);
});
</script>

<style lang="stylus" scoped>
.navbar-header
  position relative
  z-index 30
  padding 0.65rem 1rem
  display flex
  align-items center
  justify-content space-between
  gap 1rem
  user-select none
  backdrop-filter blur(12px)
  transition background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease

  &.nav-light
    background rgba(255, 255, 255, 0.92)
    border-bottom 1px solid #e2e8f0
    box-shadow 0 4px 15px rgba(0, 0, 0, 0.03)

  &.nav-dark
    background rgba(9, 15, 29, 0.92)
    border-bottom 1px solid #172439
    box-shadow 0 4px 20px rgba(0, 0, 0, 0.4)

.nav-left
  display flex
  align-items center
  gap 0.75rem

.menu-btn
  padding 0.4rem 0.75rem
  border-radius 0.5rem
  font-size 0.75rem
  font-weight 700
  cursor pointer
  display flex
  align-items center
  gap 0.5rem
  transition all 0.2s ease
  font-family 'Lora', serif

  .nav-light &
    background #f1f5f9
    border 1px solid #cbd5e1
    color #b45309

    &:hover
      background #e2e8f0
      color #78350f

  .nav-dark &
    background #121c2d
    border 1px solid #233758
    color #f5c518

    &:hover
      background #1d2d48
      color #ffffff

.menu-icon
  font-size 1rem

@media (max-width: 639px)
  .menu-text
    display none

.brand-link
  display flex
  align-items center
  gap 0.65rem
  text-decoration none

.brand-icon
  width 2rem
  height 2rem
  border-radius 0.5rem
  display flex
  align-items center
  justify-content center
  font-size 1.1rem
  transition transform 0.2s ease

  .nav-light &
    background linear-gradient(135deg, rgba(217, 119, 6, 0.15), rgba(180, 83, 9, 0.25))
    border 1px solid rgba(217, 119, 6, 0.4)

  .nav-dark &
    background linear-gradient(135deg, rgba(245, 197, 24, 0.2), rgba(180, 83, 9, 0.4))
    border 1px solid rgba(245, 197, 24, 0.5)
    box-shadow 0 0 10px rgba(245, 197, 24, 0.2)

.brand-title
  font-size 1rem
  font-weight 800
  letter-spacing 0.05em
  text-transform uppercase
  font-family 'Lora', serif
  margin 0

  .nav-light &
    background linear-gradient(to right, #b45309, #d97706, #78350f)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

  .nav-dark &
    background linear-gradient(to right, #fef08a, #f5c518, #b45309)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

.brand-subtitle
  font-size 0.55rem
  letter-spacing 0.15em
  text-transform uppercase
  font-family monospace
  display block

  .nav-light &
    color #64748b

  .nav-dark &
    color #94a3b8

.nav-right
  display flex
  align-items center
  gap 0.75rem

.server-time
  display none
  flex-direction column
  align-items flex-end
  text-align right
  font-family 'Lora', serif

@media (min-width: 1280px)
  .server-time
    display flex

.time-label
  font-size 0.6rem
  text-transform uppercase
  font-weight 700
  letter-spacing 0.15em

  .nav-light &
    color #64748b

  .nav-dark &
    color #94a3b8

.time-value
  font-size 0.75rem
  font-family monospace
  font-weight 700

  .nav-light &
    color #b45309

  .nav-dark &
    color #f5c518

.theme-toggle-btn
  padding 0.35rem 0.65rem
  border-radius 0.75rem
  font-size 0.75rem
  font-weight 700
  cursor pointer
  display flex
  align-items center
  gap 0.4rem
  transition all 0.3s ease
  font-family 'Lora', serif

  .nav-light &
    background #fef3c7
    border 1px solid #fde68a
    color #92400e

    &:hover
      background #fde68a

  .nav-dark &
    background #0c1424
    border 1px solid #1e304d
    color #f5c518

    &:hover
      background #16233b
      border-color rgba(245, 197, 24, 0.6)

.user-section
  position relative

.user-btn
  display flex
  align-items center
  gap 0.5rem
  padding 0.35rem
  padding-right 0.75rem
  border-radius 0.75rem
  cursor pointer
  transition all 0.2s ease

  .nav-light &
    background #ffffff
    border 1px solid #cbd5e1

    &:hover
      border-color #b45309

  .nav-dark &
    background #0c1424
    border 1px solid #1e304d

    &:hover
      border-color rgba(245, 197, 24, 0.6)

.user-avatar
  width 1.75rem
  height 1.75rem
  border-radius 0.5rem
  object-fit cover

  .nav-light &
    border 1px solid rgba(180, 83, 9, 0.5)

  .nav-dark &
    border 1px solid rgba(245, 197, 24, 0.5)

.user-info
  text-align left
  display none
  font-family 'Lora', serif

@media (min-width: 640px)
  .user-info
    display block

.user-header-row
  display flex
  align-items center
  gap 0.35rem

.user-name
  font-size 0.75rem
  font-weight 700
  max-width 110px
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  line-height 1.2

  .nav-light &
    color #0f172a

  .nav-dark &
    color #ffffff

.role-badge
  font-size 0.55rem
  padding 0.1rem 0.35rem
  border-radius 0.25rem
  font-weight 700
  flex-shrink 0

  &.role-duong-gia
    background rgba(245, 197, 24, 0.2)
    color #b45309
    border 1px solid rgba(180, 83, 9, 0.4)
    .nav-dark &
      color #f5c518
      border-color rgba(245, 197, 24, 0.4)

  &.role-duong-chu
    background rgba(56, 189, 248, 0.2)
    color #0284c7
    border 1px solid rgba(2, 132, 199, 0.4)
    .nav-dark &
      color #38bdf8
      border-color rgba(56, 189, 248, 0.4)

  &.role-bang-chung
    .nav-light &
      background #e2e8f0
      color #475569
      border 1px solid #cbd5e1
    .nav-dark &
      background #1e293b
      color #94a3b8
      border 1px solid #334155

.user-class
  font-size 0.55rem
  font-weight 700
  display flex
  align-items center
  gap 0.25rem
  margin-top 0.1rem

.class-icon
  width 0.75rem
  height 0.75rem
  object-fit contain
  display inline-block

.arrow-down
  font-size 0.6rem
  margin-left 0.25rem

  .nav-light &
    color #64748b

  .nav-dark &
    color #94a3b8

.user-dropdown
  position absolute
  right 0
  top 100%
  margin-top 0.35rem
  width 14rem
  border-radius 0.75rem
  padding 0.65rem
  z-index 50
  font-family 'Lora', serif

  .nav-light &
    background #ffffff
    border 1px solid #cbd5e1
    box-shadow 0 10px 25px rgba(0, 0, 0, 0.1)

  .nav-dark &
    background #080d19
    border 1px solid #1e304d
    box-shadow 0 15px 30px rgba(0, 0, 0, 0.5)

.dropdown-header
  padding 0.5rem
  border-bottom 1px solid rgba(148, 163, 184, 0.2)
  margin-bottom 0.5rem

.flex-row-between
  display flex
  align-items center
  justify-content space-between

.flex-row-class
  display flex
  align-items center
  gap 0.35rem
  margin-top 0.25rem

.flex-row-gap
  display flex
  align-items center
  gap 0.5rem

.label-sub
  font-size 0.6rem

  .nav-light &
    color #64748b

  .nav-dark &
    color #94a3b8

.user-name-highlight
  font-size 0.75rem
  font-weight 700
  display block

  .nav-light &
    color #b45309

  .nav-dark &
    color #f5c518

.class-pill
  font-size 0.6rem
  font-weight 700
  padding 0.1rem 0.5rem
  border-radius 9999px
  border 1px solid
  display flex
  align-items center
  gap 0.25rem

.dropdown-link
  width 100%
  text-align left
  padding 0.5rem 0.65rem
  border-radius 0.5rem
  font-size 0.75rem
  font-weight 600
  display flex
  align-items center
  justify-content space-between
  margin-bottom 0.25rem
  text-decoration none
  background none
  border none
  cursor pointer
  transition all 0.15s ease

  .nav-light &
    color #0f172a

    &:hover
      background #f1f5f9
      color #b45309

  .nav-dark &
    color #e2e8f0

    &:hover
      background #1e293b
      color #f5c518

.theme-status-tag
  font-size 0.55rem
  padding 0.1rem 0.35rem
  border-radius 0.25rem
  font-weight 700

  &.tag-dark
    background rgba(245, 197, 24, 0.2)
    color #f5c518

  &.tag-light
    background #f59e0b
    color #ffffff

.logout-btn
  color #ef4444 !important

  &:hover
    background rgba(239, 68, 68, 0.15) !important
    color #dc2626 !important

.login-btn
  background linear-gradient(to right, #5865F2, #404EED)
  border 1px solid rgba(88, 101, 242, 0.6)
  color #ffffff
  padding 0.35rem 0.85rem
  border-radius 0.75rem
  font-size 0.75rem
  font-weight 700
  display flex
  align-items center
  gap 0.5rem
  cursor pointer
  transition all 0.2s ease
  font-family 'Lora', serif

  &:hover
    filter brightness(1.1)
    transform scale(1.02)

@media (max-width: 639px)
  .btn-text
    display none

.dropdown-enter-active, .dropdown-leave-active
  transition all 0.15s ease

.dropdown-enter-from, .dropdown-leave-to
  opacity 0
  transform translateY(-6px)
</style>
