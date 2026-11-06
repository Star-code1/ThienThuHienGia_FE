<template lang="pug">
.home(:class="themeStore.theme === 'light' ? 'home-light' : 'home-dark'")
  //- ===== HERO =====
  section.hero
    img.hero-logo(
      src="/assets/img/logo-512.webp"
      alt="Thiên Thư Môn"
      width="240" height="240"
      fetchpriority="high"
    )
    .hero-text
      span.hero-eyebrow 天 書 門 · BANG CHIẾN HỆ THỐNG
      h1.hero-title THIÊN THƯ MÔN
      p.hero-sub
        | Trung tâm điều hành Công Thành Chiến — xếp đội hình, ấn định giờ xuất trận và theo dõi uy danh đệ tử.
      .hero-actions
        RouterLink.btn.btn-main(to="/lineup") 📜 Xem đội hình
        RouterLink.btn.btn-ghost(to="/schedule") ⚔️ Chiến kỳ

  //- ===== CHỈ SỐ NHANH =====
  section.stats
    .stat
      span.stat-value {{ authStore.guildMemberCount || '—' }}
      span.stat-label Bang chúng
    .stat
      span.stat-value {{ CLASS_LIST.length }}
      span.stat-label Võ phái
    .stat
      span.stat-value 60
      span.stat-label Vị trí trận đồ

  //- ===== CHỨC NĂNG =====
  section.block
    h2.block-title
      span.title-mark
      | Thiên Thư Quyết Bảng
    .features
      RouterLink.feature(v-for="f in features" :key="f.to" :to="f.to")
        .feature-icon {{ f.icon }}
        .feature-body
          h3.feature-title {{ f.title }}
          p.feature-desc {{ f.desc }}
        span.feature-arrow ➔

  //- ===== BÁT ĐẠI VÕ PHÁI =====
  section.block
    h2.block-title
      span.title-mark
      | Bát Đại Võ Phái
    .sects
      .sect(v-for="c in CLASS_LIST" :key="c.name" :style="{ '--c': c.hex }")
        img.sect-img(v-if="c.icon" :src="c.icon" :alt="c.name" loading="lazy")
        span.sect-dot(v-else)
        span.sect-name {{ c.name }}
        span.sect-tag {{ c.short }}
    RouterLink.sects-link(to="/lineup") Vào xếp đội hình ➔
</template>

<script setup>
import { onMounted } from 'vue';
import { CLASS_LIST } from '../theme/classColors';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';

const authStore = useAuthStore();
const themeStore = useThemeStore();

const features = [
  { to: '/lineup', icon: '📜', title: 'Thiên Thư Trận Phái', desc: 'Xếp đội hình, phân vị trí và kỹ năng cho từng đệ tử.' },
  { to: '/tactical-map', icon: '🗺️', title: 'Bản Đồ Chiến Thuật', desc: 'Sa bàn tác chiến: kéo thả đội hình, vẽ hướng tấn công.' },
  { to: '/schedule', icon: '⚔️', title: 'Công Thành Chiến Kỳ', desc: 'Giờ xuất trận và điểm danh cho từng sự kiện.' },
  { to: '/match-analysis', icon: '📈', title: 'Dữ Liệu Trận Đấu', desc: 'Lưu kết quả, hình ảnh và rút kinh nghiệm sau trận.' },
  { to: '/roster', icon: '👥', title: 'Trị Bang Hiền Giả', desc: 'Danh sách đệ tử, võ phái và chức vị, đồng bộ Discord.' },
  { to: '/stats', icon: '📊', title: 'Uy Danh Thống Kê', desc: 'Chuyên cần, vắng mặt và phân bổ lực lượng theo phái.' },
];

onMounted(() => {
  authStore.fetchGuildStats();
});
</script>

<style lang="stylus" scoped>
.home
  width 100%
  max-width 72rem
  margin 0 auto
  padding 1.25rem 1rem 3rem
  display flex
  flex-direction column
  gap 1.75rem
  color var(--color-text)

/* ---------- Hero ---------- */
.hero
  display flex
  flex-direction column
  align-items center
  text-align center
  gap 1rem
  padding 1.5rem 1rem
  border 1px solid var(--color-border)
  border-radius var(--radius-2xl)
  background var(--color-surface)
  box-shadow var(--shadow-lg)
  position relative
  overflow hidden

  &::before
    content ''
    position absolute
    inset 0
    pointer-events none
    background radial-gradient(60% 55% at 50% 0%, rgba(226, 184, 87, 0.22), transparent 70%), radial-gradient(50% 50% at 100% 100%, rgba(155, 28, 49, 0.18), transparent 70%)

.hero-logo
  position relative
  width clamp(150px, 46vw, 240px)
  height auto
  aspect-ratio 1
  border-radius 50%
  object-fit cover
  border 2px solid var(--color-gold-leaf)
  box-shadow 0 0 0 5px rgba(226, 184, 87, 0.15), 0 12px 40px rgba(155, 28, 49, 0.35)

.hero-text
  position relative
  display flex
  flex-direction column
  align-items center
  gap 0.6rem

.hero-eyebrow
  font-size 0.7rem
  letter-spacing 0.2em
  font-weight 700
  color var(--color-brand)

.hero-title
  margin 0
  font-family var(--font-heading)
  font-weight 800
  letter-spacing 0.06em
  font-size clamp(1.8rem, 7vw, 3.1rem)
  line-height 1.1
  background linear-gradient(180deg, var(--color-gold-leaf), var(--color-crimson))
  -webkit-background-clip text
  background-clip text
  -webkit-text-fill-color transparent

.hero-sub
  margin 0
  max-width 34rem
  font-size 0.95rem
  line-height 1.6
  color var(--color-text-secondary)

.hero-actions
  display flex
  flex-wrap wrap
  justify-content center
  gap 0.6rem
  margin-top 0.4rem
  width 100%

.btn
  display inline-flex
  align-items center
  justify-content center
  min-height 44px
  padding 0 1.25rem
  border-radius var(--radius-full)
  font-weight 700
  font-size 0.9rem
  text-decoration none
  transition transform 0.15s ease, box-shadow 0.15s ease
  flex 1 1 9rem
  max-width 14rem

  &:hover
    transform translateY(-2px)

.btn-main
  background var(--color-crimson)
  color #fff4dc
  box-shadow 0 6px 18px rgba(155, 28, 49, 0.4)

.btn-ghost
  color var(--color-text)
  border 1.5px solid var(--color-gold-leaf)
  background transparent

/* ---------- Stats ---------- */
.stats
  display grid
  grid-template-columns repeat(3, 1fr)
  gap 0.6rem

.stat
  display flex
  flex-direction column
  align-items center
  padding 0.8rem 0.4rem
  border-radius var(--radius-lg)
  border 1px solid var(--color-border)
  background var(--color-surface)

.stat-value
  font-family var(--font-heading)
  font-size 1.5rem
  font-weight 800
  color var(--color-brand)

.stat-label
  font-size 0.7rem
  color var(--color-muted)
  text-transform uppercase
  letter-spacing 0.06em
  text-align center

/* ---------- Block ---------- */
.block
  display flex
  flex-direction column
  gap 0.9rem

.block-title
  display flex
  align-items center
  gap 0.6rem
  margin 0
  font-family var(--font-heading)
  font-size 1.1rem
  font-weight 700
  letter-spacing 0.04em
  text-transform uppercase
  color var(--color-text)

.title-mark
  width 4px
  height 1.1em
  border-radius 2px
  background linear-gradient(var(--color-gold-leaf), var(--color-crimson))

/* ---------- Features ---------- */
.features
  display grid
  grid-template-columns 1fr
  gap 0.6rem

.feature
  display flex
  align-items center
  gap 0.9rem
  padding 0.9rem 1rem
  min-height 64px
  border-radius var(--radius-lg)
  border 1px solid var(--color-border)
  background var(--color-surface)
  text-decoration none
  color inherit
  transition transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease

  &:hover
    transform translateY(-2px)
    border-color var(--color-gold-leaf)
    box-shadow var(--shadow-md)

.feature-icon
  flex-shrink 0
  width 2.6rem
  height 2.6rem
  display grid
  place-items center
  font-size 1.35rem
  border-radius var(--radius-md)
  background var(--color-brand-subtle)

.feature-body
  flex 1
  min-width 0

.feature-title
  margin 0
  font-size 0.95rem
  font-weight 700
  font-family var(--font-heading)

.feature-desc
  margin 0.15rem 0 0
  font-size 0.78rem
  line-height 1.4
  color var(--color-text-secondary)

.feature-arrow
  color var(--color-brand)
  font-size 0.9rem

/* ---------- Bát phái ---------- */
.sects
  display grid
  grid-template-columns repeat(4, 1fr)
  gap 0.5rem

.sect
  display flex
  flex-direction column
  align-items center
  gap 0.25rem
  padding 0.7rem 0.2rem
  border-radius var(--radius-lg)
  border 1px solid var(--color-border)
  border-top 3px solid var(--c)
  background var(--color-surface)

.sect-img
  width 2.4rem
  height 2.4rem
  object-fit contain

.sect-dot
  width 1rem
  height 1rem
  border-radius 50%
  background var(--c)

.sect-name
  font-size 0.7rem
  font-weight 700
  text-align center

.sect-tag
  font-size 0.6rem
  font-weight 700
  color var(--c)

.sects-link
  align-self flex-end
  font-size 0.85rem
  font-weight 700
  color var(--color-brand)
  text-decoration none

/* ---------- Tablet / Desktop ---------- */
@media (min-width: 640px)
  .home
    padding 1.75rem 1.5rem 3rem

  .features
    grid-template-columns repeat(2, 1fr)

  .sects
    grid-template-columns repeat(8, 1fr)

@media (min-width: 1024px)
  .hero
    flex-direction row
    text-align left
    gap 2.5rem
    padding 2.5rem 3rem

  .hero-text
    align-items flex-start

  .hero-actions
    justify-content flex-start
    width auto

  .btn
    flex 0 0 auto

  .features
    grid-template-columns repeat(3, 1fr)
</style>
