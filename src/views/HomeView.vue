<template lang="pug">
.home-container(:class="themeStore.theme === 'light' ? 'home-light' : 'home-dark'")
  //- Xianxia Hero Banner Section
  section.hero-section
    //- Top Badge
    .hero-badge
      span.badge-icon ⚔️
      span HIỀN GIẢ TRỊ BANG • THIÊN THƯ DIỄN VÕ
      span.badge-icon ⚔️

    //- Main Title
    .hero-title-group
      span.hero-sub-calligraphy 天 書 門 — CÔNG THÀNH CHIẾN HỆ THỐNG
      h1.hero-title THIÊN THƯ MÔN

    //- Subtitle
    p.hero-subtitle
      | Trung tâm điều hành tác chiến Công Thành Chiến — Thống lĩnh ma trận đội hình, ấn định giờ xuất trận và kiểm soát uy danh đệ tử.

    //- Action Buttons
    .hero-actions
      RouterLink.btn-hero-primary(to="/lineup")
        span.btn-icon 📜
        span.btn-text THIÊN THƯ TRẬN PHÁP
        span.btn-arrow ➔

      RouterLink.btn-hero-secondary(to="/schedule")
        span ⚔️ Công Thành Chiến Kỳ

      RouterLink.btn-hero-outline(to="/roster")
        span 👥 Trị Bang Hiền Giả

    //- Quick Stats Bar
    .stats-scroll-bar
      .stat-cell
        span.stat-value.gold {{ authStore.guildMemberCount }}
        span.stat-label Bang Chúng Trực Chiêu
      .stat-cell
        span.stat-value.cyan 60
        span.stat-label Vị Trí Trận Đồ
      .stat-cell
        span.stat-value.emerald 98%
        span.stat-label Ý Chí Xuất Trận
      .stat-cell
        span.stat-value.purple TOP 2
        span.stat-label Độc Bá Giang Hồ

  //- Main Features Grid
  section.features-section
    .section-header-row
      h2.section-title 📜 THIÊN THƯ QUYẾT BẢNG

    .features-grid
      //- Feature 1: Sơ Đồ Bang Chiến
      .feature-card.card-gold
        .bg-watermark 📜
        .card-body
          .icon-box.icon-gold 📜
          h3.card-title Thiên Thư Trận Phái
          p.card-desc
            | Bảng ma trận tác chiến Công Thành Chiến. Quy tụ các toán quân, hỗ trợ phân bổ lực lượng, gán vị trí Tiên Phong Trái/Phải và bảo mật chiến đồ.
        .card-footer
          span.footer-tag.tag-gold Trận Đồ Ma Trận
          RouterLink.footer-link.link-gold(to="/lineup")
            span Vào Trận Đồ
            span ➔

      //- Feature 2: Bản Đồ Chiến Thuật
      .feature-card.card-amber
        .bg-watermark 🗺️
        .card-body
          .icon-box.icon-amber 🗺️
          h3.card-title Bản Đồ Chiến Thuật
          p.card-desc
            | Sa bàn tác chiến trực quan thời gian thực. Kéo thả đội hình, vẽ mũi tên chỉ hướng tấn công, cắm cờ điểm tập kết và xuất ảnh chiến thuật.
        .card-footer
          span.footer-tag.tag-amber Sa Bàn Tác Chiến
          RouterLink.footer-link.link-amber(to="/tactical-map")
            span Mở Bản Đồ
            span ➔

      //- Feature 3: Lịch Bang Chiến
      .feature-card.card-cyan
        .bg-watermark ⚔️
        .card-body
          .icon-box.icon-cyan ⚔️
          h3.card-title Công Thành Chiến Kỳ
          p.card-desc
            | Chiến kỳ ấn định giờ xuất trận Công Thành Chiến, Tố Chiến bang hội và những thiên luật triệu tập bắt buộc đối với tất cả đệ tử.
        .card-footer
          span.footer-tag.tag-cyan Chiến Kỳ Sự Kiện
          RouterLink.footer-link.link-cyan(to="/schedule")
            span Xem Chiến Kỳ
            span ➔

      //- Feature 4: Dữ Liệu Trận Đấu
      .feature-card.card-rose
        .bg-watermark 📈
        .card-body
          .icon-box.icon-rose 📈
          h3.card-title Dữ Liệu Trận Đấu
          p.card-desc
            | Lưu trữ kết quả chiến trường, tổng hợp hình ảnh chi tiết và phân tích rút kinh nghiệm các lỗi sai nhằm hoàn thiện chiến thuật tương lai.
        .card-footer
          span.footer-tag.tag-rose Rút Kinh Nghiệm
          RouterLink.footer-link.link-rose(to="/match-analysis")
            span Xem Dữ Liệu
            span ➔

      //- Feature 5: Quản Lý Bang Hội
      .feature-card.card-emerald
        .bg-watermark 👥
        .card-body
          .icon-box.icon-emerald 👥
          h3.card-title Trị Bang Hiền Giả
          p.card-desc
            | Danh sách ghi danh võ phái đệ tử Thiên Thư Môn, quản lý chức vị Đương Gia, Đường Chủ, Bang Chúng và đồng bộ Discord.
        .card-footer
          span.footer-tag.tag-emerald Đệ Tử Bang Chúng
          RouterLink.footer-link.link-emerald(to="/roster")
            span Xem Bang Chúng
            span ➔

      //- Feature 6: Thống Kê Điểm Danh
      .feature-card.card-purple
        .bg-watermark 📊
        .card-body
          .icon-box.icon-purple 📊
          h3.card-title Uy Danh Thống Kê
          p.card-desc
            | Uy danh điểm danh, tổng hợp đệ tử xuất trận, theo dõi số lượng báo bận và phân bổ lực lượng Bát Đại Võ Phái theo từng sự kiện.
        .card-footer
          span.footer-tag.tag-purple Uy Danh Bảng
          RouterLink.footer-link.link-purple(to="/stats")
            span Xem Uy Danh
            span ➔

  //- Xianxia Martial Arts Sects Highlight Banner
  section.sects-section
    .sects-card
      .sects-header
        .sects-title-group
          h3.sects-title ⚔️ BÁT ĐẠI VÕ PHÁI — THIÊN THƯ MÔN
          p.sects-subtitle Cơ cấu lực lượng võ phái chính phục vụ Công Thành Chiến
        RouterLink.btn-lineup-link(to="/lineup")
          span Vào Xếp Đội Hình
          span ➔

      .sects-grid
        .sect-item(v-for="c in CLASS_LIST" :key="c.name")
          .sect-icon-box
            img.sect-img(v-if="c.icon" :src="c.icon" :alt="c.name")
            span.sect-dot(v-else :style="{ backgroundColor: c.hex, boxShadow: `0 0 10px ${c.hex}` }")
          span.sect-name {{ c.name }}
          span.sect-short-tag(:style="{ color: c.hex }") {{ c.short }}
</template>

<script setup>
import { onMounted } from 'vue';
import { CLASS_LIST } from '../theme/classColors';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';

const authStore = useAuthStore();
const themeStore = useThemeStore();

onMounted(() => {
  authStore.fetchGuildStats();
});
</script>

<style lang="stylus" scoped>
.home-container
  position relative
  min-height calc(100vh - 57px)
  display flex
  flex-direction column
  font-family 'Lora', serif
  user-select none
  overflow-x hidden
  padding-bottom 4rem
  transition color 0.3s ease

  &.home-light
    color #0f172a

  &.home-dark
    color #e2e8f0

.hero-section
  position relative
  z-index 10
  padding-top 2.5rem
  padding-bottom 3rem
  padding-left 1.5rem
  padding-right 1.5rem
  max-width 80rem
  margin-left auto
  margin-right auto
  text-align center
  display flex
  flex-direction column
  align-items center

.hero-badge
  display inline-flex
  align-items center
  gap 0.5rem
  padding 0.35rem 0.85rem
  border-radius var(--radius, 2px)
  font-size 0.7rem
  font-weight 700
  letter-spacing 0.1em
  font-family var(--font-mono, monospace)
  width fit-content
  background var(--color-surface)
  color var(--color-brand)
  border 2px solid var(--color-border)
  box-shadow 2px 2px 0px var(--color-border)

.hero-title-group
  display flex
  flex-direction column
  align-items center

.hero-sub-calligraphy
  font-size 0.75rem
  letter-spacing 0.2em
  text-transform uppercase
  font-family var(--font-mono, monospace)
  color var(--color-brand)

.hero-title
  font-size 2.5rem
  font-weight 700
  letter-spacing 0.05em
  text-transform uppercase
  font-family var(--font-heading)
  color var(--color-text)
  margin 0.25rem 0

@media (min-width: 768px)
  .hero-title
    font-size 3.5rem

.hero-subtitle
  max-width 42rem
  font-size 0.875rem
  line-height 1.7
  font-family var(--font-body)
  color var(--color-text-secondary)

.hero-actions
  display flex
  flex-wrap wrap
  align-items center
  justify-content center
  gap 0.85rem
  margin-top 0.5rem

.btn-hero-primary
  padding 0.75rem 1.5rem
  border-radius var(--radius, 2px)
  font-size 0.8rem
  font-weight 700
  font-family var(--font-heading)
  cursor pointer
  display inline-flex
  align-items center
  gap 0.5rem
  text-decoration none
  background var(--color-brand)
  color #ffffff
  border 2px solid var(--color-border)
  box-shadow 3px 3px 0px var(--color-border)
  transition transform 0.1s ease, box-shadow 0.1s ease, background-color 0.15s ease

  &:hover
    background var(--color-brand-hover)
    transform translate(-1px, -1px)
    box-shadow 4px 4px 0px var(--color-border)

  &:active
    transform translate(1px, 1px)
    box-shadow 1px 1px 0px var(--color-border)

.btn-hero-secondary
  padding 0.75rem 1.25rem
  border-radius var(--radius, 2px)
  font-size 0.8rem
  font-weight 700
  font-family var(--font-heading)
  cursor pointer
  text-decoration none
  background var(--color-bg-subtle)
  color var(--color-text)
  border 2px solid var(--color-border)
  box-shadow 3px 3px 0px var(--color-border)
  transition transform 0.1s ease, box-shadow 0.1s ease

  &:hover
    transform translate(-1px, -1px)
    box-shadow 4px 4px 0px var(--color-border)

  &:active
    transform translate(1px, 1px)
    box-shadow 1px 1px 0px var(--color-border)

.btn-hero-outline
  padding 0.75rem 1.25rem
  font-size 0.8rem
  font-weight 700
  font-family 'Silkscreen', monospace
  cursor pointer
  text-decoration none
  transition all 0.15s ease

  .home-light &
    background #ffffff
    border 2px solid #cbd5e1
    box-shadow 3px 3px 0 #1c1917
    color #475569

    &:hover
      border-color #1c1917
      color #1c1917
      transform translate(-1px, -1px)

  .home-dark &
    background #0b1120
    border 2px solid #334155
    box-shadow 3px 3px 0 #000
    color #94a3b8

    &:hover
      border-color #f5c518
      color #f5c518
      transform translate(-1px, -1px)

.stats-scroll-bar
  display grid
  grid-template-columns repeat(2, minmax(0, 1fr))
  gap 0.75rem
  width 100%
  max-width 52rem
  padding 1rem
  border-radius 0px
  margin-top 1rem

  .home-light &
    background #fdfbf7
    border 2px solid #1c1917
    box-shadow 4px 4px 0 #1c1917

  .home-dark &
    background #0b1120
    border 2px solid #f5c518
    box-shadow 4px 4px 0 #000

@media (min-width: 640px)
  .stats-scroll-bar
    grid-template-columns repeat(4, minmax(0, 1fr))

.stat-cell
  text-align center
  position relative
  z-index 10
  padding 0.5rem
  border-right 2px solid

  .home-light &
    border-color #e2e8f0

  .home-dark &
    border-color #18263e

  &:last-child
    border-right none

.stat-value
  font-size 1.75rem
  font-weight 700
  font-family 'VT323', monospace
  display block
  letter-spacing 0.05em

  &.gold
    .home-light &
      color #b45309
    .home-dark &
      color #f5c518

  &.cyan
    .home-light &
      color #0284c7
    .home-dark &
      color #38bdf8

  &.emerald
    .home-light &
      color #059669
    .home-dark &
      color #34d399

  &.purple
    .home-light &
      color #7c3aed
    .home-dark &
      color #c084fc

.stat-label
  font-size 0.65rem
  display block
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em
  font-family 'Share Tech Mono', monospace
  margin-top 0.25rem

  .home-light &
    color #64748b

  .home-dark &
    color #64748b

.features-section
  position relative
  z-index 10
  padding 0 1.5rem
  max-width 80rem
  margin 0 auto
  width 100%
  display flex
  flex-direction column
  gap 1.5rem

.section-header-row
  display flex
  align-items center
  justify-content space-between
  border-bottom 3px solid
  padding-bottom 0.75rem

  .home-light &
    border-color #1c1917

  .home-dark &
    border-color #f5c518

.section-title
  font-size 1.1rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em
  font-family 'Silkscreen', monospace
  margin 0

  .home-light &
    color #92400e

  .home-dark &
    color #f5c518
    text-shadow 1px 1px 0 #000

.features-grid
  display grid
  grid-template-columns 1fr
  gap 1.5rem

@media (min-width: 640px)
  .features-grid
    grid-template-columns repeat(2, minmax(0, 1fr))

@media (min-width: 1024px)
  .features-grid
    grid-template-columns repeat(3, minmax(0, 1fr))

.feature-card
  position relative
  display flex
  flex-direction column
  justify-content space-between
  padding 1.5rem
  border-radius 0.75rem
  border 1px solid
  overflow hidden
  transition transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease

  .home-light &
    background #ffffff
    border-color #cbd5e1
    box-shadow 0 4px 15px rgba(0, 0, 0, 0.04)

  .home-dark &
    background rgba(8, 13, 25, 0.85)
    border 1px solid #1c2e4a
    box-shadow 0 10px 25px rgba(0, 0, 0, 0.3)

  &:hover
    transform translateY(-4px)

    .home-light &
      border-color #b45309
      box-shadow 0 10px 25px rgba(0, 0, 0, 0.08)

    .home-dark &
      border-color rgba(245, 197, 24, 0.7)

.bg-watermark
  position absolute
  right -1.5rem
  bottom -1.5rem
  font-size 4.5rem
  opacity 0.05
  pointer-events none

.icon-box
  width 3rem
  height 3rem
  border-radius 0.75rem
  display flex
  align-items center
  justify-content center
  font-size 1.5rem
  margin-bottom 1rem
  transition transform 0.2s ease

  &.icon-gold
    .home-light &
      background #fef3c7
      border 1px solid #fde68a
      color #b45309
    .home-dark &
      background rgba(245, 197, 24, 0.1)
      border 1px solid rgba(245, 197, 24, 0.3)
      color #f5c518

  &.icon-amber
    .home-light &
      background #ffedd5
      border 1px solid #fed7aa
      color #ea580c
    .home-dark &
      background rgba(249, 115, 22, 0.1)
      border 1px solid rgba(249, 115, 22, 0.3)
      color #fb923c

  &.icon-cyan
    .home-light &
      background #e0f2fe
      border 1px solid #bae6fd
      color #0284c7
    .home-dark &
      background rgba(56, 189, 248, 0.1)
      border 1px solid rgba(56, 189, 248, 0.3)
      color #38bdf8

  &.icon-rose
    .home-light &
      background #ffe4e6
      border 1px solid #fecdd3
      color #e11d48
    .home-dark &
      background rgba(244, 63, 94, 0.1)
      border 1px solid rgba(244, 63, 94, 0.3)
      color #fb7185

  &.icon-emerald
    .home-light &
      background #d1fae5
      border 1px solid #a7f3d0
      color #059669
    .home-dark &
      background rgba(52, 211, 153, 0.1)
      border 1px solid rgba(52, 211, 153, 0.3)
      color #34d399

  &.icon-purple
    .home-light &
      background #f3e8ff
      border 1px solid #e9d5ff
      color #7c3aed
    .home-dark &
      background rgba(192, 132, 252, 0.1)
      border 1px solid rgba(192, 132, 252, 0.3)
      color #c084fc

.card-title
  font-size 1.05rem
  font-weight 700
  margin 0

  .home-light &
    color #0f172a

  .home-dark &
    color #ffffff

.card-desc
  margin-top 0.5rem
  font-size 0.775rem
  line-height 1.6

  .home-light &
    color #475569

  .home-dark &
    color #94a3b8

.card-footer
  margin-top 1.5rem
  padding-top 1rem
  border-top 1px solid
  display flex
  align-items center
  justify-content space-between

  .home-light &
    border-color #e2e8f0

  .home-dark &
    border-color #142033

.footer-tag
  font-size 0.6rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em

  &.tag-gold
    .home-light &
      color #b45309
    .home-dark &
      color #f5c518

  &.tag-amber
    .home-light &
      color #ea580c
    .home-dark &
      color #fb923c

  &.tag-cyan
    .home-light &
      color #0284c7
    .home-dark &
      color #38bdf8

  &.tag-rose
    .home-light &
      color #e11d48
    .home-dark &
      color #fb7185

  &.tag-emerald
    .home-light &
      color #059669
    .home-dark &
      color #34d399

  &.tag-purple
    .home-light &
      color #7c3aed
    .home-dark &
      color #c084fc

.footer-link
  font-size 0.75rem
  font-weight 700
  display flex
  align-items center
  gap 0.25rem
  text-decoration none
  transition color 0.2s ease

  &.link-gold
    .home-light &
      color #b45309
    .home-dark &
      color #f5c518

  &.link-amber
    .home-light &
      color #ea580c
    .home-dark &
      color #fb923c

  &.link-cyan
    .home-light &
      color #0284c7
    .home-dark &
      color #38bdf8

  &.link-rose
    .home-light &
      color #e11d48
    .home-dark &
      color #fb7185

  &.link-emerald
    .home-light &
      color #059669
    .home-dark &
      color #34d399

  &.link-purple
    .home-light &
      color #7c3aed
    .home-dark &
      color #c084fc
      color #7c3aed
    .home-dark &
      color #c084fc

  &:hover
    text-decoration underline

.sects-section
  position relative
  z-index 10
  padding 0 1.5rem
  max-width 80rem
  margin 2.5rem auto 0
  width 100%

.sects-card
  border-radius 1rem
  padding 1.5rem
  backdrop-filter blur(12px)

  .home-light &
    background #ffffff
    border 1px solid #cbd5e1
    box-shadow 0 10px 30px rgba(0, 0, 0, 0.05)

  .home-dark &
    background rgba(8, 13, 25, 0.85)
    border 1px solid #1e304d
    box-shadow 0 20px 40px rgba(0, 0, 0, 0.4)

.sects-header
  display flex
  flex-direction column
  gap 1rem
  border-bottom 1px solid
  padding-bottom 1rem
  margin-bottom 1.25rem

  .home-light &
    border-color #e2e8f0

  .home-dark &
    border-color #142033

@media (min-width: 768px)
  .sects-header
    flex-direction row
    align-items center
    justify-content space-between

.sects-title
  font-size 1rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em
  margin 0

  .home-light &
    color #b45309

  .home-dark &
    color #f5c518

.sects-subtitle
  font-size 0.75rem
  margin-top 0.25rem

  .home-light &
    color #64748b

  .home-dark &
    color #64748b

.btn-lineup-link
  padding 0.5rem 1rem
  border-radius 0.75rem
  font-size 0.75rem
  font-weight 700
  text-decoration none
  display flex
  align-items center
  gap 0.4rem
  transition all 0.2s ease

  .home-light &
    background #fef3c7
    border 1px solid #fde68a
    color #b45309
    &:hover
      background #fde68a

  .home-dark &
    background #17253b
    border 1px solid #2b4266
    color #f5c518
    &:hover
      background #253956

.sects-grid
  display grid
  grid-template-columns repeat(2, minmax(0, 1fr))
  gap 0.75rem

@media (min-width: 640px)
  .sects-grid
    grid-template-columns repeat(4, minmax(0, 1fr))

@media (min-width: 1024px)
  .sects-grid
    grid-template-columns repeat(7, minmax(0, 1fr))

.sect-item
  padding 0.85rem
  border-radius 0.75rem
  display flex
  flex-direction column
  align-items center
  text-align center
  transition all 0.2s ease
  border 1px solid

  .home-light &
    background #f8fafc
    border-color #e2e8f0
    &:hover
      border-color #b45309
      background #ffffff
      transform translateY(-2px)

  .home-dark &
    background rgba(9, 17, 32, 0.9)
    border-color #192b45
    &:hover
      border-color rgba(245, 197, 24, 0.6)
      transform translateY(-2px)

.sect-icon-box
  margin-bottom 0.5rem

.sect-img
  width 2.25rem
  height 2.25rem
  object-fit contain

.sect-dot
  width 1.25rem
  height 1.25rem
  border-radius 9999px
  display block

.sect-name
  font-size 0.75rem
  font-weight 700

  .home-light &
    color #0f172a

  .home-dark &
    color #e2e8f0

.sect-short-tag
  font-size 0.65rem
  font-weight 700
  margin-top 0.25rem
  padding 0.1rem 0.5rem
  border-radius 9999px
  border 1px solid

  .home-light &
    background #ffffff
    border-color #cbd5e1

  .home-dark &
    background #050912
    border-color #142033
</style>
