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
  padding-bottom 1rem
  border-bottom 1px solid
  display flex
  align-items center
  justify-content space-between

  .prof-light &
    border-color #cbd5e1

  .prof-dark &
    border-color #172439

.title-row
  display flex
  align-items center
  gap 0.5rem

.header-icon
  font-size 1.5rem

.header-title
  font-size 1.25rem
  font-weight 900
  text-transform uppercase
  letter-spacing 0.05em
  margin 0

  .prof-light &
    background linear-gradient(to right, #b45309, #d97706)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

  .prof-dark &
    background linear-gradient(to right, #fef08a, #f5c518, #b45309)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

.header-subtitle
  font-size 0.75rem
  margin-top 0.25rem

  .prof-light &
    color #64748b

  .prof-dark &
    color #94a3b8

.btn-home
  padding 0.5rem 1rem
  border-radius 0.75rem
  font-size 0.75rem
  font-weight 700
  text-decoration none
  border 1px solid
  transition all 0.15s ease

  .prof-light &
    background #ffffff
    border-color #cbd5e1
    color #475569
    &:hover
      background #f1f5f9
      color #0f172a

  .prof-dark &
    background #121c2e
    border-color #1e304d
    color #94a3b8
    &:hover
      background #1b2b45
      color #ffffff

.profile-main-card
  position relative
  padding 1.5rem
  border-radius 1rem
  border 1px solid
  backdrop-filter blur(12px)
  display flex
  flex-direction column
  gap 1.5rem
  overflow hidden

  .prof-light &
    background #ffffff
    border-color #cbd5e1
    box-shadow 0 10px 30px rgba(0, 0, 0, 0.05)

  .prof-dark &
    background rgba(8, 13, 25, 0.9)
    border-color #1e304d
    box-shadow 0 20px 40px rgba(0, 0, 0, 0.4)

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
  border-bottom 1px solid

  .prof-light &
    border-color #e2e8f0

  .prof-dark &
    border-color #142033

@media (min-width: 768px)
  .profile-top-row
    flex-direction row
    align-items flex-start

.avatar-wrapper
  position relative

.avatar-img
  width 6rem
  height 6rem
  border-radius 1rem
  object-fit cover
  border 2px solid

  .prof-light &
    border-color #b45309
    box-shadow 0 0 20px rgba(180, 83, 9, 0.2)

  .prof-dark &
    border-color rgba(245, 197, 24, 0.6)
    box-shadow 0 0 25px rgba(245, 197, 24, 0.25)

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
  border-radius 9999px
  background #34d399
  color #000000
  display flex
  align-items center
  justify-content center
  font-size 0.625rem
  font-weight 800
  border 2px solid

  .prof-light &
    border-color #ffffff

  .prof-dark &
    border-color #080d19

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
  font-size 1.5rem
  font-weight 800
  margin 0

  .prof-light &
    color #0f172a

  .prof-dark &
    color #ffffff

.class-pill-badge
  padding 0.25rem 0.85rem
  border-radius 9999px
  font-size 0.75rem
  font-weight 700
  border 1px solid
  display flex
  align-items center
  gap 0.375rem

.class-icon
  width 1rem
  height 1rem
  object-fit contain

.discord-handle
  font-size 0.75rem
  font-family monospace

  .prof-light &
    color #64748b

  .prof-dark &
    color #64748b

.roles-list
  display flex
  flex-wrap wrap
  gap 0.5rem
  padding-top 0.25rem

.role-pill
  padding 0.25rem 0.75rem
  border-radius 0.375rem
  font-size 0.75rem
  font-weight 800
  display flex
  align-items center
  gap 0.375rem
  border 1px solid

  &.role-duong-gia
    .prof-light &
      background #fef3c7
      border-color #b45309
      color #b45309
    .prof-dark &
      background rgba(245, 197, 24, 0.2)
      border-color rgba(245, 197, 24, 0.5)
      color #f5c518
      box-shadow 0 0 10px rgba(245, 197, 24, 0.3)

  &.role-duong-chu
    .prof-light &
      background #e0f2fe
      border-color #0284c7
      color #0284c7
    .prof-dark &
      background rgba(56, 189, 248, 0.2)
      border-color rgba(56, 189, 248, 0.5)
      color #38bdf8
      box-shadow 0 0 10px rgba(56, 189, 248, 0.3)

  &.role-bang-chung
    .prof-light &
      background #f1f5f9
      border-color #cbd5e1
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
