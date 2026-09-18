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
  font-family 'Lora', serif
  user-select none
  display flex
  flex-direction column
  gap 1.5rem

.profile-header
  padding 1.25rem 1.5rem
  border-radius var(--radius-lg, 4px)
  border 2px solid var(--color-border)
  box-shadow 3px 3px 0px var(--color-border)
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
  font-size 1rem
  font-weight 700
  letter-spacing 0.05em
  text-transform uppercase
  font-family var(--font-heading)
  color var(--color-text)
  margin 0

.header-subtitle
  font-size 0.65rem
  letter-spacing 0.1em
  text-transform uppercase
  font-family var(--font-mono, monospace)
  color var(--color-brand)
  margin-top 0.25rem

.btn-home
  padding 0.5rem 1rem
  border-radius var(--radius, 2px)
  background var(--color-bg-subtle)
  color var(--color-text)
  font-size 0.7rem
  font-weight 700
  font-family var(--font-mono, monospace)
  border 2px solid var(--color-border)
  box-shadow 2px 2px 0px var(--color-border)
  text-decoration none
  transition transform 0.1s ease, box-shadow 0.1s ease

  &:hover
    transform translate(-1px, -1px)
    box-shadow 3px 3px 0px var(--color-border)

.profile-main-card
  position relative
  padding 1.5rem
  border-radius var(--radius-lg, 4px)
  border 2px solid var(--color-border)
  box-shadow 3px 3px 0px var(--color-border)
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
  opacity 0.05
  pointer-events none

.profile-top-row
  display flex
  flex-direction column
  align-items center
  gap 1.5rem
  padding-bottom 1.5rem
  border-bottom 2px solid

  .prof-light &
    border-color #1c1917

  .prof-dark &
    border-color #1e293b

@media (min-width: 768px)
  .profile-top-row
    flex-direction row
    align-items flex-start

.avatar-wrapper
  position relative

.avatar-img
  width 6rem
  height 6rem
  border-radius 0px
  object-fit cover
  border 2px solid #1c1917
  box-shadow 3px 3px 0 #1c1917

  .prof-dark &
    border-color #f5c518
    box-shadow 3px 3px 0 #000

@media (min-width: 768px)
  .avatar-img
    width 7rem
    height 7rem

.status-check-badge
  position absolute
  right -0.5rem
  bottom -0.5rem
  width 1.5rem
  height 1.5rem
  border-radius 0px
  background #34d399
  color #000000
  display flex
  align-items center
  justify-content center
  font-size 0.625rem
  font-weight 800
  border 2px solid #1c1917

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
  font-weight 700
  font-family 'Silkscreen', monospace
  margin 0

  .prof-light &
    color #1c1917

  .prof-dark &
    color #ffffff

.class-pill-badge
  padding 0.25rem 0.85rem
  border-radius 0px
  font-size 0.7rem
  font-weight 700
  font-family 'Silkscreen', monospace
  border 2px solid #1c1917
  box-shadow 2px 2px 0 #1c1917
  display flex
  align-items center
  gap 0.375rem

.class-icon
  width 1rem
  height 1rem
  object-fit contain

.discord-handle
  font-size 0.75rem
  font-family 'Share Tech Mono', monospace

  .prof-light &
    color #64748b

  .prof-dark &
    color #94a3b8

.roles-list
  display flex
  flex-wrap wrap
  gap 0.5rem
  padding-top 0.25rem

.role-pill
  padding 0.25rem 0.75rem
  border-radius 0px
  font-size 0.65rem
  font-weight 700
  font-family 'Silkscreen', monospace
  display flex
  align-items center
  gap 0.375rem
  border 2px solid #1c1917
  box-shadow 2px 2px 0 #1c1917

  &.role-duong-gia
    background #fef3c7
    color #92400e
    .prof-dark &
      background #172439
      color #f5c518
      border-color #f5c518
      box-shadow 2px 2px 0 #000

  &.role-duong-chu
    background #e0f2fe
    color #0284c7
    .prof-dark &
      background #0c203b
      color #38bdf8
      border-color #38bdf8
      box-shadow 2px 2px 0 #000

  &.role-bang-chung
    background #f1f5f9
    color #475569
    .prof-dark &
      background #1e293b
      border-color #334155
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
  border-radius 0.75rem
  border 1px solid
  display flex
  flex-direction column
  gap 0.75rem

  .prof-light &
    background #f8fafc
    border-color #cbd5e1

  .prof-dark &
    background #0c1424
    border-color #182840

.info-card-title
  font-size 0.75rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.05em
  margin 0

  .prof-light &
    color #b45309

  .prof-dark &
    color #f5c518

  &.title-blue
    .prof-light &
      color #0284c7
    .prof-dark &
      color #38bdf8

.info-rows-list
  display flex
  flex-direction column
  font-size 0.75rem

.info-row
  display flex
  justify-content space-between
  padding 0.4rem 0
  border-bottom 1px solid

  .prof-light &
    border-color #e2e8f0

  .prof-dark &
    border-color #142033

  &.no-border
    border-bottom none

.info-label
  .prof-light &
    color #64748b

  .prof-dark &
    color #64748b

.info-val
  font-weight 600

  .prof-light &
    color #0f172a

  .prof-dark &
    color #ffffff

  &.val-emerald
    .prof-light &
      color #059669
    .prof-dark &
      color #34d399

  &.val-gold
    font-family monospace
    font-weight 700
    .prof-light &
      color #b45309
    .prof-dark &
      color #f5c518

.val-class
  display flex
  align-items center
  gap 0.25rem
  font-weight 700

.class-mini-icon
  width 0.875rem
  height 0.875rem
  object-fit contain
</style>
