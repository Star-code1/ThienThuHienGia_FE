<template lang="pug">
Teleport(to="body")
  //- Backdrop Overlay
  Transition(name="fade")
    .backdrop-overlay(
      v-if="isOpen"
      @click="$emit('close')"
    )

  //- Slide-out Drawer Box
  Transition(:name="drawerPosition === 'left' ? 'slide-left' : 'slide-right'")
    .drawer-box(
      v-if="isOpen"
      :class="[drawerPosition === 'left' ? 'pos-left' : 'pos-right', themeStore.theme === 'light' ? 'drawer-light' : 'drawer-dark']"
    )
      //- Header Menu
      .drawer-header
        .brand-group
          .brand-logo 📜
          .brand-info
            h2.brand-title THIÊN THƯ MÔN
            span.brand-subtitle THIÊN THƯ QUYẾT BẢNG

        button.close-btn(
          @click="$emit('close')"
          title="Đóng Menu"
        ) ✕

      //- Position & Theme Settings Bar
      .settings-bar
        .setting-row
          span.setting-label Vị trí Bảng:
          .btn-group-sm
            button.setting-btn(
              @click="setDrawerPosition('left')"
              :class="drawerPosition === 'left' ? 'btn-active' : 'btn-inactive'"
            ) ⬅️ Trái
            button.setting-btn(
              @click="setDrawerPosition('right')"
              :class="drawerPosition === 'right' ? 'btn-active' : 'btn-inactive'"
            ) Phải ➡️

        .setting-row.setting-border-top
          span.setting-label Giao Diện:
          .btn-group-sm
            button.setting-btn(
              @click="themeStore.setTheme('dark')"
              :class="themeStore.theme === 'dark' ? 'btn-dark-active' : 'btn-inactive'"
            ) 🌙 Tối (Dạ)
            button.setting-btn(
              @click="themeStore.setTheme('light')"
              :class="themeStore.theme === 'light' ? 'btn-light-active' : 'btn-inactive'"
            ) ☀️ Sáng (Nhật)

      //- Menu Links
      nav.drawer-nav
        RouterLink.nav-link-card(
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          @click="$emit('close')"
          :class="[isActive(item.path) ? 'link-active' : 'link-inactive']"
        )
          span.active-indicator(v-if="isActive(item.path)")
          span.link-icon {{ item.icon }}

          .link-content
            .link-title-row
              span.link-title {{ item.name }}
              span.item-badge(v-if="item.badge") {{ item.badge }}
            span.link-desc {{ item.desc }}

      //- Footer Drawer Auth / User Profile
      .drawer-footer
        .user-card(v-if="authStore.isAuthenticated")
          .user-main-row
            .user-avatar-group
              img.avatar-img(
                :src="authStore.user?.avatar"
                :alt="authStore.user?.username"
              )
              .user-details
                span.user-name {{ authStore.user?.nickname || authStore.user?.username }}
                span.user-class {{ authStore.user?.className || 'Bang Chúng' }}

            RouterLink.profile-btn(
              to="/profile"
              @click="$emit('close')"
            ) Hồ Sơ

          .user-sub-row
            span.sub-label Chức Vị Thẩm Quyền:
            span.role-value(
              :class="{ 'role-duong-gia': userRole === 'Đương Gia', 'role-duong-chu': userRole === 'Đường Chủ' }"
            ) {{ userRole }}

        button.discord-login-btn(
          v-else
          @click="authStore.loginWithDiscord()"
        )
          span 👾
          span Quy Nhập Discord
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';

const props = defineProps({
  isOpen: { type: Boolean, default: false }
});

defineEmits(['close']);

const route = useRoute();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const drawerPosition = ref(localStorage.getItem('ttm_drawer_pos') || 'left');

const setDrawerPosition = (pos) => {
  drawerPosition.value = pos;
  localStorage.setItem('ttm_drawer_pos', pos);
};

const userRole = computed(() => {
  return authStore.user?.primaryRole || (authStore.canEdit ? 'Đương Gia' : 'Bang Chúng');
});

const menuItems = [
  {
    name: 'Trang Chủ',
    path: '/',
    icon: '🏠',
    desc: 'Tổng quan môn phái',
    badge: null
  },
  {
    name: 'Tiên Môn Hồ Sơ',
    path: '/profile',
    icon: '👤',
    desc: 'Thông tin đệ tử & Võ phái',
    badge: null
  },
  {
    name: 'Thiên Thư Trận Phái',
    path: '/lineup',
    icon: '📜',
    desc: 'Ma trận xếp đội hình tác chiến',
    badge: 'HOT'
  },
  {
    name: 'Công Thành Chiến Kỳ',
    path: '/schedule',
    icon: '⚔️',
    desc: 'Thời gian ấn định xuất trận',
    badge: null
  },
  {
    name: 'Dữ Liệu Trận Đấu',
    path: '/match-analysis',
    icon: '📊',
    desc: 'Lưu trữ hình ảnh & rút kinh nghiệm sai sót',
    badge: 'MỚI'
  },
  {
    name: 'Trị Bang Hiền Giả',
    path: '/roster',
    icon: '👥',
    desc: 'Ghi danh võ phái đệ tử',
    badge: null
  },
  {
    name: 'Uy Danh Thống Kê',
    path: '/stats',
    icon: '📊',
    desc: 'Uy danh điểm danh & báo bận',
    badge: null
  }
];

const isActive = (path) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};
</script>

<style lang="stylus" scoped>
.backdrop-overlay
  position fixed
  inset 0
  z-index 50
  background rgba(0, 0, 0, 0.7)
  backdrop-filter blur(4px)

.drawer-box
  position fixed
  top 0
  bottom 0
  z-index 50
  width 20rem
  display flex
  flex-direction column
  justify-content space-between
  user-select none
  font-family 'Lora', serif
  box-shadow 0 25px 50px -12px rgba(0, 0, 0, 0.5)

  &.pos-left
    left 0
    border-right 1px solid

  &.pos-right
    right 0
    border-left 1px solid

  &.drawer-light
    background rgba(255, 255, 255, 0.98)
    border-color #cbd5e1
    color #0f172a

  &.drawer-dark
    background rgba(8, 13, 25, 0.96)
    border-color #1b2b46
    color #e2e8f0

.drawer-header
  padding 1.25rem
  border-bottom 1px solid
  display flex
  align-items center
  justify-content space-between

  .drawer-light &
    border-color #e2e8f0

  .drawer-dark &
    border-color #18263e

.brand-group
  display flex
  align-items center
  gap 0.75rem

.brand-logo
  width 2.5rem
  height 2.5rem
  border-radius 0.75rem
  display flex
  align-items center
  justify-content center
  font-size 1.25rem

  .drawer-light &
    background linear-gradient(135deg, rgba(217, 119, 6, 0.15), rgba(180, 83, 9, 0.25))
    border 1px solid rgba(217, 119, 6, 0.4)

  .drawer-dark &
    background linear-gradient(135deg, rgba(245, 197, 24, 0.2), rgba(180, 83, 9, 0.3))
    border 1px solid rgba(245, 197, 24, 0.4)

.brand-title
  font-size 1rem
  font-weight 800
  letter-spacing 0.05em
  text-transform uppercase
  margin 0

  .drawer-light &
    background linear-gradient(to right, #b45309, #d97706)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

  .drawer-dark &
    background linear-gradient(to right, #fef08a, #f5c518, #b45309)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

.brand-subtitle
  font-size 0.6rem
  letter-spacing 0.15em
  text-transform uppercase
  font-family monospace
  display block

  .drawer-light &
    color #64748b

  .drawer-dark &
    color #94a3b8

.close-btn
  width 2rem
  height 2rem
  border-radius 0.5rem
  display flex
  align-items center
  justify-content center
  cursor pointer
  transition all 0.2s ease

  .drawer-light &
    background #f1f5f9
    border 1px solid #cbd5e1
    color #64748b
    &:hover
      background #e2e8f0
      color #0f172a

  .drawer-dark &
    background #0f172a
    border 1px solid #1e293b
    color #94a3b8
    &:hover
      color #ffffff
      border-color #3b82f6

.settings-bar
  padding 0.65rem 1.25rem
  border-bottom 1px solid
  display flex
  flex-direction column
  gap 0.5rem
  font-size 0.75rem

  .drawer-light &
    background #f8fafc
    border-color #e2e8f0

  .drawer-dark &
    background #050810
    border-color #131f33

.setting-row
  display flex
  align-items center
  justify-content space-between

  &.setting-border-top
    padding-top 0.4rem
    border-top 1px solid
    .drawer-light &
      border-color #e2e8f0
    .drawer-dark &
      border-color rgba(19, 31, 51, 0.6)

.setting-label
  font-size 0.7rem
  font-weight 600

  .drawer-light &
    color #64748b

  .drawer-dark &
    color #94a3b8

.btn-group-sm
  display flex
  padding 0.15rem
  border-radius 0.5rem
  border 1px solid

  .drawer-light &
    background #ffffff
    border-color #cbd5e1

  .drawer-dark &
    background #0f172a
    border-color #1e293b

.setting-btn
  padding 0.15rem 0.5rem
  font-size 0.65rem
  font-weight 600
  border-radius 0.25rem
  border none
  cursor pointer
  transition all 0.15s ease

  &.btn-active
    background #2563eb
    color #ffffff

  &.btn-dark-active
    background rgba(245, 197, 24, 0.2)
    color #f5c518
    border 1px solid rgba(245, 197, 24, 0.4)

  &.btn-light-active
    background #f59e0b
    color #ffffff

  &.btn-inactive
    background transparent

    .drawer-light &
      color #64748b
      &:hover
        color #0f172a

    .drawer-dark &
      color #94a3b8
      &:hover
        color #ffffff

.drawer-nav
  padding 1rem
  display flex
  flex-direction column
  gap 0.5rem
  overflow-y auto
  flex 1

.nav-link-card
  position relative
  display flex
  align-items center
  gap 0.85rem
  padding 0.75rem 1rem
  border-radius 0.75rem
  border 1px solid
  text-decoration none
  transition all 0.2s ease
  overflow hidden

  &.link-active
    .drawer-light &
      background linear-gradient(to right, rgba(37, 99, 235, 0.1), rgba(59, 130, 246, 0.05))
      border-color #2563eb
      color #1d4ed8

    .drawer-dark &
      background linear-gradient(to right, rgba(29, 78, 216, 0.3), rgba(59, 130, 246, 0.1))
      border-color #3b82f6
      color #ffffff
      box-shadow 0 0 15px rgba(59, 130, 246, 0.2)

  &.link-inactive
    .drawer-light &
      background #ffffff
      border-color #e2e8f0
      color #475569
      &:hover
        background #f8fafc
        border-color #cbd5e1
        color #0f172a

    .drawer-dark &
      background rgba(10, 16, 29, 0.6)
      border-color #142033
      color #94a3b8
      &:hover
        background #101a2d
        border-color #2b4166
        color #ffffff

.active-indicator
  position absolute
  left 0
  top 0.5rem
  bottom 0.5rem
  width 4px
  border-top-right-radius 4px
  border-bottom-right-radius 4px
  background #3b82f6

.link-icon
  font-size 1.25rem
  flex-shrink 0

.link-content
  flex 1
  min-width 0

.link-title-row
  display flex
  align-items center
  justify-content space-between

.link-title
  font-weight 700
  font-size 0.85rem

.item-badge
  font-size 0.55rem
  padding 0.1rem 0.4rem
  border-radius 9999px
  font-weight 800
  text-transform uppercase

  .drawer-light &
    background #fef3c7
    color #b45309
    border 1px solid #fde68a

  .drawer-dark &
    background rgba(245, 197, 24, 0.2)
    color #f5c518
    border 1px solid rgba(245, 197, 24, 0.3)

.link-desc
  font-size 0.65rem
  display block
  margin-top 0.15rem
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

  .drawer-light &
    color #64748b

  .drawer-dark &
    color #64748b

.drawer-footer
  padding 1rem
  border-top 1px solid

  .drawer-light &
    background #f8fafc
    border-color #e2e8f0

  .drawer-dark &
    background #050912
    border-color #18263e

.user-card
  padding 0.75rem
  border-radius 0.75rem
  border 1px solid

  .drawer-light &
    background #ffffff
    border-color #cbd5e1

  .drawer-dark &
    background #0b1220
    border-color #1a2942

.user-main-row
  display flex
  align-items center
  justify-content space-between

.user-avatar-group
  display flex
  align-items center
  gap 0.65rem

.avatar-img
  width 2.25rem
  height 2.25rem
  border-radius 0.5rem
  object-fit cover

  .drawer-light &
    border 1px solid rgba(180, 83, 9, 0.5)

  .drawer-dark &
    border 1px solid rgba(245, 197, 24, 0.5)

.user-name
  font-size 0.75rem
  font-weight 700
  display block
  max-width 120px
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

  .drawer-light &
    color #0f172a

  .drawer-dark &
    color #ffffff

.user-class
  font-size 0.65rem
  font-weight 600
  display block
  color #10b981

.profile-btn
  padding 0.25rem 0.65rem
  border-radius 0.5rem
  font-size 0.65rem
  font-weight 700
  text-decoration none
  transition all 0.15s ease

  .drawer-light &
    background #e0f2fe
    color #0284c7
    border 1px solid #bae6fd
    &:hover
      background #bae6fd

  .drawer-dark &
    background #16233b
    color #38bdf8
    border 1px solid #233859
    &:hover
      background #253956

.user-sub-row
  display flex
  align-items center
  justify-content space-between
  font-size 0.65rem
  padding-top 0.4rem
  margin-top 0.4rem
  border-top 1px solid

  .drawer-light &
    border-color #e2e8f0

  .drawer-dark &
    border-color #142033

.sub-label
  .drawer-light &
    color #64748b

  .drawer-dark &
    color #94a3b8

.role-value
  font-weight 700

  &.role-duong-gia
    color #b45309
    .drawer-dark &
      color #f5c518

  &.role-duong-chu
    color #0284c7
    .drawer-dark &
      color #38bdf8

.discord-login-btn
  width 100%
  padding 0.65rem
  background linear-gradient(to right, #5865F2, #404EED)
  color #ffffff
  font-weight 700
  font-size 0.75rem
  border-radius 0.75rem
  border none
  cursor pointer
  display flex
  align-items center
  justify-content center
  gap 0.5rem
  transition all 0.2s ease
  box-shadow 0 0 15px rgba(88, 101, 242, 0.3)

  &:hover
    filter brightness(1.1)

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s ease
.fade-enter-from, .fade-leave-to
  opacity 0

.slide-left-enter-active, .slide-left-leave-active
  transition transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)
.slide-left-enter-from, .slide-left-leave-to
  transform translateX(-100%)

.slide-right-enter-active, .slide-right-leave-active
  transition transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)
.slide-right-enter-from, .slide-right-leave-to
  transform translateX(100%)
</style>
