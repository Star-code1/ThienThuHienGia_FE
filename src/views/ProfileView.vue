<template lang="pug">
.profile-container(
  :class="themeStore.theme === 'light' ? 'prof-light' : 'prof-dark'"
)
  //- Header Page Banner
  .profile-header
    .header-titles
      .title-row
        span.header-icon 👤
        h1.header-title TIÊN MÔN HỒ SƠ — THIÊN THƯ MÔN
      p.header-subtitle Thông tin ấn định võ phái đệ tử và thẩm quyền tác chiến

    RouterLink.btn-home(to="/") 🏠 Trang Chủ

  //- Main Profile Card
  .profile-main-card
    .bg-watermark 📜

    //- Top Profile Overview
    .profile-top-row
      .avatar-wrapper
        img.avatar-img(
          :src="user?.avatar"
          :alt="user?.username"
        )
        span.status-check-badge(title="Trạng thái quy phục") ✓

      .profile-info
        .name-class-row
          h2.user-display-name {{ user?.nickname || user?.globalName || user?.username }}

          span.class-pill-badge(
            :style="{ backgroundColor: `${classHex}20`, borderColor: `${classHex}60`, color: classHex }"
            title="Môn Phái được đồng bộ tự động từ Discord Server"
          )
            img.class-icon(v-if="classIcon" :src="classIcon")
            span {{ user?.className || 'Bang Chúng' }}

        span.discord-handle Discord Handle: @{{ user?.username }}

        .roles-list
          span.role-pill.role-duong-gia(v-if="userPrimaryRole === 'Đương Gia'")
            span ⭐
            span ĐƯƠNG GIA (Chưởng Quản Môn Phái)

          span.role-pill.role-duong-chu(v-else-if="userPrimaryRole === 'Đường Chủ'")
            span 👑
            span ĐƯỜNG CHỦ (Chưởng Quản Trận Đồ)

          span.role-pill.role-bang-chung(v-else)
            span 📜
            span BANG CHÚNG (Xuất Trận Chiêm Ngưỡng)

    //- Information Details Grid
    .info-details-grid
      .info-card
        h3.info-card-title 🛡️ TIÊN MÔN THÂN PHẬN
        .info-rows-list
          .info-row
            span.info-label Tông Môn:
            span.info-val.val-emerald Thiên Thư Môn
          .info-row
            span.info-label Biệt Danh Xuất Trận:
            span.info-val {{ user?.nickname || 'Chưa đặt' }}
          .info-row.no-border
            span.info-label Võ Phái Thể Hiện:
            span.info-val.val-class(:style="{ color: classHex }")
              img.class-mini-icon(v-if="classIcon" :src="classIcon")
              span {{ user?.className || 'Bang Chúng' }}

      .info-card.card-blue
        h3.info-card-title.title-blue ⚔️ CHƯƠNG QUẢN & THẨM QUYỀN
        .info-rows-list
          .info-row
            span.info-label Quyền Tác Động Ma Trận:
            span.info-val.val-emerald(v-if="user?.canEdit") Toàn Quyền Định Đoạt
            span.info-val(v-else) Quan Sát Trận Đồ
          .info-row
            span.info-label Chức Vị Thẩm Quyền:
            span.info-val.val-gold {{ userPrimaryRole }}
          .info-row.no-border
            span.info-label Đồng Bộ Võ Phái:
            span.info-val.val-emerald ✅ Tự Động Từ Discord Server
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { getClassInfo } from '../theme/classColors';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const user = computed(() => authStore.user);

const classInfo = computed(() => getClassInfo(user.value?.className || ''));
const classHex = computed(() => classInfo.value.hex);
const classIcon = computed(() => classInfo.value.icon);

const userPrimaryRole = computed(() => {
  if (user.value?.primaryRole) return user.value.primaryRole;
  if (user.value?.roles && user.value.roles.includes('Đương Gia')) return 'Đương Gia';
  if (user.value?.roles && user.value.roles.includes('Đường Chủ')) return 'Đường Chủ';
  if (user.value?.canEdit) return 'Đương Gia';
  return 'Bang Chúng';
});
</script>

<style lang="stylus" scoped>
.profile-container
  position relative
  min-height calc(100vh - 57px)
  padding 1.5rem
  max-width 56rem
  margin 0 auto
  font-family var(--font-sans)
  user-select none
  display flex
  flex-direction column
  gap 1.5rem

.profile-header
  padding 1.25rem 1.5rem
  border-radius var(--radius-lg, 16px)
  border 1px solid var(--color-border)
  box-shadow var(--shadow-sm)
  background var(--color-surface)
  display flex
  flex-direction column
  gap 1rem

@media (min-width: 768px)
  .profile-header
    flex-direction row
    align-items center
    justify-content space-between

.title-row
  display flex
  align-items center
  gap 0.5rem

.header-icon
  font-size 1.5rem

.header-title
  font-size 1.1rem
  font-weight 800
  letter-spacing -0.01em
  text-transform uppercase
  font-family var(--font-heading)
  color var(--color-text)
  margin 0

.header-subtitle
  font-size 0.75rem
  letter-spacing 0.02em
  color var(--color-text-muted)
  margin-top 0.25rem

.btn-home
  padding 0.5rem 1rem
  border-radius var(--radius-md, 10px)
  background var(--color-bg-subtle)
  color var(--color-text)
  font-size 0.8rem
  font-weight 700
  font-family var(--font-heading)
  border 1px solid var(--color-border)
  box-shadow var(--shadow-sm)
  text-decoration none
  transition all 0.2s ease

  &:hover
    transform translateY(-1px)
    box-shadow var(--shadow-md)
    background var(--color-surface-hover)

.profile-main-card
  position relative
  padding 1.75rem
  border-radius var(--radius-xl, 20px)
  border 1px solid var(--color-border)
  box-shadow var(--shadow-md)
  background var(--color-surface)
  color var(--color-text)
  display flex
  flex-direction column
  gap 1.5rem
  overflow hidden

@media (min-width: 768px)
  .profile-main-card
    padding 2rem

.bg-watermark
  position absolute
  right -2.5rem
  bottom -2.5rem
  font-size 8rem
  opacity 0.04
  pointer-events none

.profile-top-row
  display flex
  flex-direction column
  align-items center
  gap 1.5rem
  padding-bottom 1.5rem
  border-bottom 1px solid var(--color-border)

@media (min-width: 768px)
  .profile-top-row
    flex-direction row
    align-items flex-start

.avatar-wrapper
  position relative

.avatar-img
  width 6rem
  height 6rem
  border-radius var(--radius-lg, 16px)
  object-fit cover
  border 2px solid var(--color-border)
  box-shadow var(--shadow-sm)

@media (min-width: 768px)
  .avatar-img
    width 7rem
    height 7rem

.status-check-badge
  position absolute
  right -0.35rem
  bottom -0.35rem
  width 1.5rem
  height 1.5rem
  border-radius var(--radius-full, 9999px)
  background #10b981
  color #ffffff
  display flex
  align-items center
  justify-content center
  font-size 0.75rem
  font-weight 800
  border 2px solid var(--color-surface)
  box-shadow var(--shadow-sm)

.profile-info
  display flex
  flex-direction column
  align-items center
  gap 0.5rem
  flex 1

@media (min-width: 768px)
  .profile-info
    align-items flex-start

.name-class-row
  display flex
  align-items center
  justify-content center
  flex-wrap wrap
  gap 0.65rem

@media (min-width: 768px)
  .name-class-row
    justify-content flex-start

.user-display-name
  font-size 1.35rem
  font-weight 800
  font-family var(--font-heading)
  color var(--color-text)
  margin 0

.class-pill-badge
  padding 0.3rem 0.85rem
  border-radius var(--radius-full, 9999px)
  font-size 0.75rem
  font-weight 700
  font-family var(--font-heading)
  border 1px solid
  display flex
  align-items center
  gap 0.375rem

.class-icon
  width 1.1rem
  height 1.1rem
  object-fit contain

.discord-handle
  font-size 0.8rem
  color var(--color-text-muted)

.roles-list
  display flex
  flex-wrap wrap
  gap 0.5rem
  padding-top 0.25rem

.role-pill
  padding 0.35rem 0.85rem
  border-radius var(--radius-full, 9999px)
  font-size 0.75rem
  font-weight 700
  font-family var(--font-heading)
  display flex
  align-items center
  gap 0.375rem
  border 1px solid

  &.role-duong-gia
    background #fef3c7
    border-color #fde68a
    color #92400e
    .prof-dark &
      background rgba(245, 197, 24, 0.15)
      border-color rgba(245, 197, 24, 0.3)
      color #fbbf24

  &.role-duong-chu
    background #e0f2fe
    border-color #bae6fd
    color #0284c7
    .prof-dark &
      background rgba(56, 189, 248, 0.15)
      border-color rgba(56, 189, 248, 0.3)
      color #38bdf8

  &.role-bang-chung
    background #f1f5f9
    border-color #e2e8f0
    color #475569
    .prof-dark &
      background rgba(148, 163, 184, 0.12)
      border-color rgba(148, 163, 184, 0.25)
      color #94a3b8

.info-details-grid
  display grid
  grid-template-columns 1fr
  gap 1.5rem

@media (min-width: 768px)
  .info-details-grid
    grid-template-columns repeat(2, minmax(0, 1fr))

.info-card
  padding 1.25rem
  border-radius var(--radius-lg, 16px)
  border 1px solid var(--color-border)
  background var(--color-bg-subtle)
  display flex
  flex-direction column
  gap 0.75rem

.info-card-title
  font-size 0.8rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.03em
  font-family var(--font-heading)
  margin 0
  color #b45309

  .prof-dark &
    color #fbbf24

  &.title-blue
    color #0284c7
    .prof-dark &
      color #38bdf8

.info-rows-list
  display flex
  flex-direction column
  font-size 0.8rem

.info-row
  display flex
  justify-content space-between
  padding 0.5rem 0
  border-bottom 1px solid var(--color-border)

  &.no-border
    border-bottom none

.info-label
  color var(--color-text-muted)

.info-val
  font-weight 600
  color var(--color-text)

  &.val-emerald
    color #10b981

  &.val-gold
    font-weight 700
    color #d97706
    .prof-dark &
      color #fbbf24

.val-class
  display flex
  align-items center
  gap 0.35rem
  font-weight 700

.class-mini-icon
  width 0.95rem
  height 0.95rem
  object-fit contain
</style>
