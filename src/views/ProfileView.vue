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

  //- Thẻ bài tu sĩ: cảnh giới, thành tích & huy hiệu
  .cultivator-card(:style="{ '--c': classHex, '--r': realm.hex }")
    .cc-head
      .cc-avatar-wrap
        img.cc-avatar(:src="user?.avatar" :alt="user?.username")
        img.cc-class-icon(v-if="classIcon" :src="classIcon" :alt="user?.className")
      .cc-id
        h2.cc-name {{ user?.nickname || user?.globalName || user?.username }}
        .cc-tags
          span.cc-tag(:style="{ color: classHex, borderColor: classHex }") {{ user?.className || 'Bang Chúng' }}
          span.cc-tag.cc-role {{ userPrimaryRole }}
    .cc-realm
      .cc-realm-top
        span.cc-realm-name {{ realm.icon }} {{ realm.name }}
        span.cc-realm-next(v-if="realm.next") còn {{ realm.remaining }} trận lên {{ realm.next.name }}
        span.cc-realm-next(v-else) Đã đạt cảnh giới cao nhất
      .cc-bar
        .cc-bar-fill(:style="{ width: Math.round(realm.progress * 100) + '%' }")
    .cc-stats(v-if="myStats")
      .cc-stat
        span.cc-stat-val {{ myStats.attendedCount }}
        span.cc-stat-label Trận tham chiến
      .cc-stat
        span.cc-stat-val {{ attendRate }}%
        span.cc-stat-label Chuyên cần
      .cc-stat
        span.cc-stat-val(:class="myStats.reputationScore < 0 ? 'neg' : 'pos'") {{ myStats.reputationScore > 0 ? '+' : '' }}{{ myStats.reputationScore }}
        span.cc-stat-label Điểm công tội
      .cc-stat
        span.cc-stat-val {{ myStats.totalAbsentCount }}
        span.cc-stat-label Lần vắng
    p.cc-empty(v-else-if="statsLoaded") Chưa có dữ liệu điểm danh cho đạo hữu.
    p.cc-empty(v-else) Đang tải thành tích...
    .cc-badges(v-if="badges.length")
      span.cc-badge(v-for="b in badges" :key="b.name" :title="b.desc")
        | {{ b.icon }} {{ b.name }}

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
import { computed, ref, onMounted } from 'vue';
import api from '../services/api';
import { getRealm, getBadges } from '../utils/cultivation';
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
// Thành tích điểm danh của chính mình (lấy từ bảng xếp hạng, khớp theo Discord ID)
const myStats = ref(null);
const statsLoaded = ref(false);
const realm = computed(() => getRealm(myStats.value?.attendedCount || 0));
const badges = computed(() => (myStats.value ? getBadges(myStats.value) : []));
const attendRate = computed(() => {
  const m = myStats.value;
  return m && m.totalEvents > 0 ? Math.round((m.attendedCount / m.totalEvents) * 100) : 0;
});

onMounted(async () => {
  try {
    const res = await api.getAbsentRankings({ limit: 500 });
    const list = res.data?.data || [];
    myStats.value = list.find((m) => m.userId === user.value?.discordId) || null;
  } catch (e) {
    myStats.value = null;
  } finally {
    statsLoaded.value = true;
  }
});
</script>

<style lang="stylus" scoped>
.profile-container
  position relative
  width 100%
  box-sizing border-box
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
  overflow hidden
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
    background #f3e3c0
    border-color #ecd49e
    color #92400e
    .prof-dark &
      background rgba(245, 197, 24, 0.15)
      border-color rgba(245, 197, 24, 0.3)
      color #fbbf24

  &.role-duong-chu
    background var(--color-brand-subtle)
    border-color var(--color-brand-subtle)
    color var(--color-brand)
    .prof-dark &
      background rgba(56, 189, 248, 0.15)
      border-color rgba(56, 189, 248, 0.3)
      color var(--color-brand)

  &.role-bang-chung
    background var(--color-bg-subtle)
    border-color var(--color-border)
    color var(--color-text-secondary)
    .prof-dark &
      background rgba(148, 163, 184, 0.12)
      border-color rgba(148, 163, 184, 0.25)
      color var(--color-text-secondary)

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
  color #9b1c31

  .prof-dark &
    color #fbbf24

  &.title-blue
    color var(--color-brand)
    .prof-dark &
      color var(--color-brand)

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
    color #9b1c31
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

.cultivator-card
  position relative
  padding 1.1rem
  border-radius var(--radius-2xl)
  border 1px solid var(--color-border)
  border-top 4px solid var(--c)
  background linear-gradient(160deg, var(--color-surface), var(--color-bg-subtle))
  box-shadow var(--shadow-lg)
  display flex
  flex-direction column
  gap 1rem

.cc-head
  display flex
  align-items center
  gap 0.9rem

.cc-avatar-wrap
  position relative
  flex-shrink 0

.cc-avatar
  width 4.5rem
  height 4.5rem
  border-radius 50%
  object-fit cover
  border 3px solid var(--c)
  background var(--color-bg-subtle)

.cc-class-icon
  position absolute
  right -4px
  bottom -4px
  width 1.7rem
  height 1.7rem
  padding 2px
  border-radius 50%
  background var(--color-surface)
  border 1px solid var(--color-border)

.cc-id
  min-width 0

.cc-name
  margin 0
  font-family var(--font-heading)
  font-size 1.25rem
  font-weight 800
  overflow hidden
  text-overflow ellipsis
  white-space nowrap

.cc-tags
  display flex
  flex-wrap wrap
  gap 0.4rem
  margin-top 0.35rem

.cc-tag
  padding 0.1rem 0.6rem
  border-radius 999px
  border 1px solid var(--color-border)
  font-size 0.72rem
  font-weight 700

.cc-role
  color var(--color-text-secondary)

.cc-realm-top
  display flex
  justify-content space-between
  align-items baseline
  gap 0.5rem
  flex-wrap wrap
  margin-bottom 0.35rem

.cc-realm-name
  font-family var(--font-heading)
  font-weight 800
  font-size 1rem
  color var(--r)

.cc-realm-next
  font-size 0.72rem
  color var(--color-muted)

.cc-bar
  height 0.6rem
  border-radius 999px
  background var(--color-bg-subtle)
  overflow hidden

.cc-bar-fill
  height 100%
  border-radius 999px
  background linear-gradient(90deg, var(--r), var(--color-gold-leaf))
  transition width 0.6s ease

.cc-stats
  display grid
  grid-template-columns repeat(2, 1fr)
  gap 0.5rem

.cc-stat
  display flex
  flex-direction column
  align-items center
  padding 0.6rem 0.3rem
  border-radius var(--radius-md)
  background var(--color-bg-subtle)

.cc-stat-val
  font-family var(--font-heading)
  font-size 1.35rem
  font-weight 800
  color var(--color-text)

  &.pos
    color #10b981

  &.neg
    color #ef4444

.cc-stat-label
  font-size 0.68rem
  color var(--color-muted)
  text-transform uppercase
  letter-spacing 0.05em

.cc-empty
  margin 0
  font-size 0.8rem
  color var(--color-muted)

.cc-badges
  display flex
  flex-wrap wrap
  gap 0.4rem

.cc-badge
  padding 0.25rem 0.7rem
  border-radius 999px
  font-size 0.75rem
  font-weight 700
  background var(--color-brand-subtle)
  color var(--color-brand)
  border 1px solid var(--color-gold-leaf)

@media (min-width: 640px)
  .cc-stats
    grid-template-columns repeat(4, 1fr)
</style>
