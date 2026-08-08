<template lang="pug">
.schedule-container(
  :class="themeStore.theme === 'light' ? 'sched-light' : 'sched-dark'"
)
  //- Header Banner
  .header-banner
    .banner-title-group
      span.banner-icon ⚔️
      .banner-titles
        h1.banner-main-title LỊCH TRÌNH BANG HỘI & CHIẾN KỲ
        p.banner-sub-desc
          | Lịch đánh ấn định 
          span.highlight-gold 20h00 Thứ 7 hàng tuần
          |  — Chu kỳ luân phiên 2 trận & 1 trận Bang Chiến

    RouterLink.btn-lineup-nav(to="/lineup")
      span 📜
      span XEM TRẬN PHÁI TÁC CHIẾN

  //- Hero Countdown Section
  .hero-countdown-box
    .countdown-header-row
      .countdown-tag-left
        span.ping-dot
        span.tag-title ĐẾM NGƯỢC ĐẾN TRẬN KẾ TIẾP (20:00 THỨ BẢY)

      .countdown-tag-right
        span.date-formatted 📅 {{ nextBattleDateFormatted }}
        span.cycle-pill(
          :class="isCurrentWeekTwoMatch ? 'pill-gold' : 'pill-blue'"
        ) {{ isCurrentWeekTwoMatch ? '⚔️⚔️ TUẦN 2 TRẬN BANG CHIẾN' : '⚔️ TUẦN 1 TRẬN BANG CHIẾN' }}

    .countdown-body-row
      .timer-desc-group
        h2.timer-main-title Thời Gian Còn Lại Cho Trận Chiến Tiếp Theo
        p.timer-sub-text
          | Tất cả đệ tử Thiên Thư Môn yêu cầu có mặt trước 15 phút tại Voice Discord để xếp đội hình và điểm danh an vị vị trí tác chiến!

      .digital-timer-grid
        .timer-box
          span.timer-val.val-gold {{ String(countdown.days).padStart(2, '0') }}
          span.timer-label Ngày
        .timer-box
          span.timer-val.val-gold {{ String(countdown.hours).padStart(2, '0') }}
          span.timer-label Giờ
        .timer-box
          span.timer-val.val-gold {{ String(countdown.minutes).padStart(2, '0') }}
          span.timer-label Phút
        .timer-box
          span.timer-val.val-red {{ String(countdown.seconds).padStart(2, '0') }}
          span.timer-label Giây

  //- Week Cycle Selector Tabs
  .tabs-section
    .tabs-header-row
      h3.tabs-section-title 🔄 CHU KỲ & LỊCH TRÌNH BANG HỘI
      .cycle-flow-badges
        span.flow-label Chu kỳ luân phiên:
        span.flow-pill.pill-gold 2 Trận
        span.flow-arrow ➔
        span.flow-pill.pill-blue 1 Trận
        span.flow-arrow ➔
        span.flow-pill.pill-gold 2 Trận

    .tabs-grid
      button.tab-btn(
        @click="selectedWeekTab = 0"
        :class="{ 'active': selectedWeekTab === 0 }"
      )
        span.tab-btn-title 📌 Tuần Này
        span.tab-btn-badge(
          :class="isTabTwoMatch(0) ? 'badge-gold' : 'badge-blue'"
        ) {{ isTabTwoMatch(0) ? '2 TRẬN BANG CHIẾN' : '1 TRẬN BANG CHIẾN' }}

      button.tab-btn(
        @click="selectedWeekTab = 1"
        :class="{ 'active': selectedWeekTab === 1 }"
      )
        span.tab-btn-title ⏩ Tuần Kế Tiếp
        span.tab-btn-badge(
          :class="isTabTwoMatch(1) ? 'badge-gold' : 'badge-blue'"
        ) {{ isTabTwoMatch(1) ? '2 TRẬN BANG CHIẾN' : '1 TRẬN BANG CHIẾN' }}

      button.tab-btn(
        @click="selectedWeekTab = 2"
        :class="{ 'active': selectedWeekTab === 2 }"
      )
        span.tab-btn-title ⏭️ Tuần Kế Nữa
        span.tab-btn-badge(
          :class="isTabTwoMatch(2) ? 'badge-gold' : 'badge-blue'"
        ) {{ isTabTwoMatch(2) ? '2 TRẬN BANG CHIẾN' : '1 TRẬN BANG CHIẾN' }}

  //- Active Selected Week Details
  .week-details-section
    //- Section 1: Weekday Activities (Thứ 2 - Thứ 6)
    .schedule-card
      .card-header-row
        span.card-icon 📅
        h4.card-sec-title LỊCH HOẠT ĐỘNG TRONG TUẦN (THỨ 2 — THỨ 6)

      .activities-grid
        .activity-item.item-blue
          .badge-box.box-cyan
            span.day-tag T2 - T3
            span.time-sub Cả ngày
          .act-content
            .act-header
              h5.act-title Đi Phó Bản Tuần
              span.act-tag.tag-cyan Phó Bản
            p.act-desc
              | Tập trung lực lượng các toán đi phó bản tuần cùng môn phái để thu thập nguyên liệu và nâng cấp trang bị.

        .activity-item.item-purple
          .badge-box.box-purple
            span.day-tag T5 - T6
            span.time-sub Buổi Tối
          .act-content
            .act-header
              h5.act-title Scrim Luyện Tập
              span.act-tag.tag-purple Giao Lưu
            p.act-desc
              | Scrim luyện tập cùng môn phái hàng xóm, rèn luyện kỹ năng combat và thử nghiệm đội hình tác chiến.

    //- Section 2: Saturday Main Event Detailed Schedule (Thứ 7 - 20:00)
    .schedule-card.saturday-card
      .saturday-header-row
        .saturday-title-group
          span.card-icon 🏆
          .saturday-titles
            h4.card-sec-title LỊCH THỨ 7 — ĐẠI CHIẾN BANG HỘI
            p.card-sub-info
              | Bắt đầu từ 
              span.highlight-gold 20h00
              |  tối Thứ 7

        span.week-mode-badge(
          :class="selectedWeekInfo.isTwoMatch ? 'badge-gold' : 'badge-blue'"
        ) {{ selectedWeekInfo.isTwoMatch ? '🔥 LỊCH TUẦN 2 TRẬN BANG CHIẾN' : '⚔️ LỊCH TUẦN 1 TRẬN BANG CHIẾN' }}

      //- 2-MATCH WEEK SCHEDULE
      .match-timeline(v-if="selectedWeekInfo.isTwoMatch")
        .event-row.event-red
          .event-left
            .time-box.box-red
              span.time-main 20:00
              span.time-label 8h00 Tối
            .event-info
              .event-title-row
                h5.event-title ⚔️ BANG CHIẾN TRẬN 1
                span.event-tag.tag-red Trận 1
              p.event-desc Mở màn trận Bang chiến lượt 1. Bắt buộc tập trung Voice Discord trước 15 phút.
          span.event-time-start.time-red Bắt đầu 20:00

        .event-row.event-gold
          .event-left
            .time-box.box-gold
              span.time-main 20:30
              span.time-label 8h30 Tối
            .event-info
              .event-title-row
                h5.event-title ⚔️ BANG CHIẾN TRẬN 2
                span.event-tag.tag-gold Trận 2
              p.event-desc Trận Bang chiến lượt 2 quyết định điểm số và thứ hạng môn phái.
          span.event-time-start.time-gold Bắt đầu 20:30

        .event-row.event-pink
          .event-left
            .time-box.box-pink
              span.time-main 21:00
              span.time-label 9h00 Tối
            .event-info
              .event-title-row
                h5.event-title 🌸 BANG HOA GIẢI CỨU MỸ NHÂN
                span.event-tag.tag-pink Hoạt Động Bang
              p.event-desc Giải cứu mỹ nhân khỏi Sơn Trại Vương Đỗ Tử Đằng, giải cứu môn phái.
          span.event-time-start.time-pink Bắt đầu 21:00

        .event-row.event-emerald
          .event-left
            .time-box.box-emerald
              span.time-main 21:15
              span.time-label 9h15 Tối
            .event-info
              .event-title-row
                h5.event-title 🎁 ĐỊNH THƯỞNG PHẠT & GIVE AWAY THẺ THÁNG
                span.event-tag.tag-emerald Phát Quà
              p.event-desc Tổng kết công trạng, định thưởng phạt kỷ luật và quay thưởng Give Away thẻ tháng cho đệ tử xuất sắc.
          span.event-time-start.time-emerald Bắt đầu 21:15

      //- 1-MATCH WEEK SCHEDULE
      .match-timeline(v-else)
        .event-row.event-blue
          .event-left
            .time-box.box-blue
              span.time-main 20:00
              span.time-label 8h00 Tối
            .event-info
              .event-title-row
                h5.event-title ⚔️ TRẬN BANG CHIẾN ĐỊNH BẢNG
                span.event-tag.tag-blue Định Bảng
              p.event-desc Trận Bang chiến duy nhất trong tuần, quyết định vị trí bảng xếp hạng. Tập trung Voice trước 15 phút.
          span.event-time-start.time-blue Bắt đầu 20:00

        .event-row.event-emerald
          .event-left
            .time-box.box-emerald
              span.time-main 20:30
              span.time-label 8h30 Tối
            .event-info
              .event-title-row
                h5.event-title 🎁 ĐỊNH THƯỞNG PHẠT & GIVE AWAY THẺ THÁNG
                span.event-tag.tag-emerald Phát Quà
              p.event-desc Tổng kết trận đấu, định thưởng phạt và quay thưởng Give Away thẻ tháng cho đệ tử môn phái.
          span.event-time-start.time-emerald Bắt đầu 20:30
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useThemeStore } from '../stores/themeStore';

const themeStore = useThemeStore();
const selectedWeekTab = ref(0);
const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 });
const nextBattleDateFormatted = ref('');
let timerInterval = null;

const ANCHOR_DATE = new Date('2026-08-03T00:00:00+07:00');

const getWeekOffsetFromAnchor = (d = new Date()) => {
  const diffTime = d.getTime() - ANCHOR_DATE.getTime();
  return Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
};

const isTwoMatchWeekByIndex = (weekIndex) => {
  return Math.abs(weekIndex) % 2 === 0;
};

const currentWeekOffset = computed(() => getWeekOffsetFromAnchor(new Date()));

const isCurrentWeekTwoMatch = computed(() => {
  return isTwoMatchWeekByIndex(currentWeekOffset.value);
});

const isTabTwoMatch = (tabIndex) => {
  return isTwoMatchWeekByIndex(currentWeekOffset.value + tabIndex);
};

const selectedWeekInfo = computed(() => {
  const targetWeekOffset = currentWeekOffset.value + selectedWeekTab.value;
  const isTwoMatch = isTwoMatchWeekByIndex(targetWeekOffset);
  return {
    weekIndex: targetWeekOffset,
    isTwoMatch
  };
});

const updateCountdown = () => {
  const now = new Date();

  const day = now.getDay();
  let daysUntilSaturday = (6 - day + 7) % 7;

  if (day === 6) {
    const today20 = new Date(now);
    today20.setHours(20, 0, 0, 0);
    if (now >= today20) {
      daysUntilSaturday = 7;
    }
  }

  const nextSat = new Date(now);
  nextSat.setDate(now.getDate() + daysUntilSaturday);
  nextSat.setHours(20, 0, 0, 0);

  nextBattleDateFormatted.value = nextSat.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }) + ' — 20:00';

  const diffMs = nextSat.getTime() - now.getTime();
  if (diffMs <= 0) {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return;
  }

  countdown.value.days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  countdown.value.hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  countdown.value.minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  countdown.value.seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
};

onMounted(() => {
  updateCountdown();
  timerInterval = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style lang="stylus" scoped>
.schedule-container
  position relative
  min-height calc(100vh - 57px)
  padding 1.5rem
  max-width 80rem
  margin 0 auto
  font-family 'Lora', serif
  user-select none
  display flex
  flex-direction column
  gap 1.5rem
  padding-bottom 4rem

.header-banner
  position relative
  z-index 10
  padding 1.25rem 1.5rem
  border-radius 1rem
  border 1px solid
  backdrop-filter blur(12px)
  display flex
  flex-direction column
  gap 1rem

  .sched-light &
    background rgba(255, 255, 255, 0.95)
    border-color #cbd5e1
    box-shadow 0 4px 15px rgba(0, 0, 0, 0.04)

  .sched-dark &
    background rgba(8, 13, 25, 0.9)
    border-color #1e304d
    box-shadow 0 10px 30px rgba(0, 0, 0, 0.4)

@media (min-width: 768px)
  .header-banner
    flex-direction row
    align-items center
    justify-content space-between

.banner-title-group
  display flex
  align-items center
  gap 0.75rem

.banner-icon
  font-size 1.75rem

.banner-main-title
  font-size 1.25rem
  font-weight 900
  text-transform uppercase
  letter-spacing 0.05em
  margin 0

  .sched-light &
    background linear-gradient(to right, #78350f, #b45309, #d97706)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

  .sched-dark &
    background linear-gradient(to right, #fffbeb, #f5c518, #b45309)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

.banner-sub-desc
  font-size 0.75rem
  margin-top 0.15rem

  .sched-light &
    color #475569

  .sched-dark &
    color #94a3b8

.highlight-gold
  font-weight 700

  .sched-light &
    color #b45309

  .sched-dark &
    color #f5c518

.btn-lineup-nav
  padding 0.65rem 1.25rem
  border-radius 0.75rem
  font-size 0.75rem
  font-weight 800
  color #ffffff
  background linear-gradient(to right, #2563eb, #1d4ed8)
  text-decoration none
  display flex
  align-items center
  justify-content center
  gap 0.5rem
  transition all 0.2s ease
  box-shadow 0 0 20px rgba(37, 99, 235, 0.3)

  &:hover
    filter brightness(1.15)
    transform scale(1.03)

.hero-countdown-box
  position relative
  z-index 10
  padding 1.5rem
  border-radius 1rem
  border 1px solid
  backdrop-filter blur(12px)
  display flex
  flex-direction column
  gap 1rem

  .sched-light &
    background linear-gradient(to right, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95))
    border-color #b45309
    box-shadow 0 10px 30px rgba(0, 0, 0, 0.05)

  .sched-dark &
    background linear-gradient(to right, rgba(12, 20, 36, 0.95), rgba(9, 16, 31, 0.95), rgba(21, 15, 41, 0.95))
    border-color rgba(245, 197, 24, 0.5)
    box-shadow 0 0 50px rgba(245, 197, 24, 0.15)

.countdown-header-row
  display flex
  align-items center
  justify-content space-between
  flex-wrap wrap
  gap 0.5rem
  padding-bottom 0.75rem
  border-bottom 1px solid

  .sched-light &
    border-color #e2e8f0

  .sched-dark &
    border-color #1c2e4a

.countdown-tag-left
  display flex
  align-items center
  gap 0.5rem

.ping-dot
  width 0.75rem
  height 0.75rem
  border-radius 9999px
  background #ef4444
  animation ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite

.tag-title
  font-size 0.75rem
  font-weight 700
  color #ef4444
  text-transform uppercase
  letter-spacing 0.05em

.countdown-tag-right
  display flex
  align-items center
  gap 0.5rem

.date-formatted
  font-size 0.75rem
  font-family monospace

  .sched-light &
    color #475569

  .sched-dark &
    color #94a3b8

.cycle-pill
  padding 0.15rem 0.65rem
  border-radius 9999px
  font-size 0.65rem
  font-weight 800
  text-transform uppercase

  &.pill-gold
    .sched-light &
      background #fef3c7
      color #b45309
      border 1px solid #fde68a
    .sched-dark &
      background rgba(217, 119, 6, 0.2)
      color #f5c518
      border 1px solid rgba(245, 197, 24, 0.4)

  &.pill-blue
    .sched-light &
      background #e0f2fe
      color #0284c7
      border 1px solid #bae6fd
    .sched-dark &
      background rgba(59, 130, 246, 0.2)
      color #60a5fa
      border 1px solid rgba(59, 130, 246, 0.4)

.countdown-body-row
  display flex
  flex-direction column
  gap 1.5rem

@media (min-width: 768px)
  .countdown-body-row
    flex-direction row
    align-items center
    justify-content space-between

.timer-desc-group
  display flex
  flex-direction column
  gap 0.5rem

.timer-main-title
  font-size 1.25rem
  font-weight 700
  text-transform uppercase
  margin 0

  .sched-light &
    color #0f172a

  .sched-dark &
    color #ffffff

.timer-sub-text
  font-size 0.75rem
  line-height 1.6
  max-width 36rem

  .sched-light &
    color #475569

  .sched-dark &
    color #94a3b8

.digital-timer-grid
  display grid
  grid-template-columns repeat(4, minmax(0, 1fr))
  gap 0.5rem
  flex-shrink 0

.timer-box
  padding 0.75rem
  border-radius 0.75rem
  border 1px solid
  text-align center
  min-width 70px

  .sched-light &
    background #f8fafc
    border-color #cbd5e1

  .sched-dark &
    background #050912
    border-color #1e304d

.timer-val
  font-size 1.5rem
  font-weight 800
  font-family monospace
  display block

  &.val-gold
    .sched-light &
      color #b45309
    .sched-dark &
      color #f5c518

  &.val-red
    color #ef4444

.timer-label
  font-size 0.6rem
  font-weight 700
  text-transform uppercase
  display block
  margin-top 0.25rem

  .sched-light &
    color #64748b

  .sched-dark &
    color #64748b

.tabs-section
  display flex
  flex-direction column
  gap 1rem

.tabs-header-row
  display flex
  align-items center
  justify-content space-between
  flex-wrap wrap
  gap 0.75rem

.tabs-section-title
  font-size 1rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.05em
  margin 0

  .sched-light &
    color #1d4ed8

  .sched-dark &
    color #93c5fd

.cycle-flow-badges
  display flex
  align-items center
  gap 0.375rem
  font-size 0.75rem

.flow-label
  font-weight 700

  .sched-light &
    color #64748b

  .sched-dark &
    color #64748b

.flow-pill
  padding 0.15rem 0.5rem
  border-radius 0.25rem
  font-size 0.625rem
  font-weight 700

  &.pill-gold
    .sched-light &
      background #fef3c7
      color #b45309
      border 1px solid #fde68a
    .sched-dark &
      background rgba(245, 197, 24, 0.2)
      color #f5c518
      border 1px solid rgba(245, 197, 24, 0.4)

  &.pill-blue
    .sched-light &
      background #e0f2fe
      color #0284c7
      border 1px solid #bae6fd
    .sched-dark &
      background rgba(59, 130, 246, 0.2)
      color #60a5fa
      border 1px solid rgba(59, 130, 246, 0.4)

.flow-arrow
  .sched-light &
    color #94a3b8

  .sched-dark &
    color #64748b

.tabs-grid
  display grid
  grid-template-columns repeat(3, minmax(0, 1fr))
  gap 0.75rem

.tab-btn
  padding 1rem
  border-radius 0.75rem
  border 1px solid
  text-align center
  cursor pointer
  transition all 0.2s ease
  display flex
  flex-direction column
  align-items center
  justify-content center
  gap 0.25rem

  .sched-light &
    background #ffffff
    border-color #cbd5e1
    color #475569
    &:hover
      border-color #b45309
      color #0f172a

  .sched-dark &
    background rgba(8, 13, 25, 0.8)
    border-color #1c2e4a
    color #94a3b8
    &:hover
      border-color #334b73
      color #ffffff

  &.active
    .sched-light &
      background #fef3c7
      border-color #b45309
      color #b45309
      box-shadow 0 4px 15px rgba(180, 83, 9, 0.15)

    .sched-dark &
      background #0f1d36
      border-color #f5c518
      color #ffffff
      box-shadow 0 10px 25px rgba(245, 197, 24, 0.15)

.tab-btn-title
  font-size 0.75rem
  font-weight 800
  text-transform uppercase

.tab-btn-badge
  font-size 0.6rem
  font-weight 700
  font-family monospace
  padding 0.1rem 0.5rem
  border-radius 9999px

  &.badge-gold
    .sched-light &
      background #fde68a
      color #78350f
    .sched-dark &
      background rgba(217, 119, 6, 0.2)
      color #f5c518

  &.badge-blue
    .sched-light &
      background #bae6fd
      color #0369a1
    .sched-dark &
      background rgba(59, 130, 246, 0.2)
      color #60a5fa

.week-details-section
  display flex
  flex-direction column
  gap 1.5rem

.schedule-card
  padding 1.25rem
  border-radius 1rem
  border 1px solid
  backdrop-filter blur(12px)
  display flex
  flex-direction column
  gap 1rem

  .sched-light &
    background #ffffff
    border-color #cbd5e1
    box-shadow 0 4px 15px rgba(0, 0, 0, 0.04)

  .sched-dark &
    background rgba(8, 13, 25, 0.9)
    border-color #1e304d
    box-shadow 0 10px 25px rgba(0, 0, 0, 0.3)

  &.saturday-card
    .sched-dark &
      border-color rgba(245, 197, 24, 0.4)

.card-header-row
  display flex
  align-items center
  gap 0.5rem
  padding-bottom 0.75rem
  border-bottom 1px solid

  .sched-light &
    border-color #e2e8f0

  .sched-dark &
    border-color #17253b

.card-icon
  font-size 1.25rem

.card-sec-title
  font-size 0.875rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.05em
  margin 0

  .sched-light &
    color #0f172a

  .sched-dark &
    color #ffffff

.activities-grid
  display grid
  grid-template-columns 1fr
  gap 1rem

@media (min-width: 768px)
  .activities-grid
    grid-template-columns repeat(2, minmax(0, 1fr))

.activity-item
  padding 1rem
  border-radius 0.75rem
  border 1px solid
  display flex
  align-items flex-start
  gap 0.85rem
  transition all 0.2s ease

  .sched-light &
    background #f8fafc
    border-color #cbd5e1
    &:hover
      border-color #2563eb

  .sched-dark &
    background #050912
    border-color #1c2e4a
    &:hover
      border-color rgba(56, 189, 248, 0.6)

.badge-box
  width 3rem
  height 3rem
  border-radius 0.75rem
  display flex
  flex-direction column
  align-items center
  justify-content center
  flex-shrink 0

  &.box-cyan
    .sched-light &
      background #e0f2fe
      border 1px solid #bae6fd
      color #0284c7
    .sched-dark &
      background rgba(56, 189, 248, 0.1)
      border 1px solid rgba(56, 189, 248, 0.3)
      color #38bdf8

  &.box-purple
    .sched-light &
      background #f3e8ff
      border 1px solid #e9d5ff
      color #7c3aed
    .sched-dark &
      background rgba(168, 85, 247, 0.1)
      border 1px solid rgba(168, 85, 247, 0.3)
      color #c084fc

.day-tag
  font-size 0.75rem
  font-weight 800

.time-sub
  font-size 0.55rem
  font-family monospace

.act-content
  display flex
  flex-direction column
  gap 0.25rem

.act-header
  display flex
  align-items center
  gap 0.5rem

.act-title
  font-size 0.875rem
  font-weight 800
  margin 0

  .sched-light &
    color #0f172a

  .sched-dark &
    color #ffffff

.act-tag
  font-size 0.55rem
  font-weight 700
  padding 0.1rem 0.4rem
  border-radius 0.25rem

  &.tag-cyan
    .sched-light &
      background #e0f2fe
      color #0284c7
    .sched-dark &
      background rgba(56, 189, 248, 0.2)
      color #38bdf8

  &.tag-purple
    .sched-light &
      background #f3e8ff
      color #7c3aed
    .sched-dark &
      background rgba(168, 85, 247, 0.2)
      color #c084fc

.act-desc
  font-size 0.75rem
  line-height 1.6
  margin 0

  .sched-light &
    color #475569

  .sched-dark &
    color #94a3b8

.saturday-header-row
  display flex
  align-items center
  justify-content space-between
  flex-wrap wrap
  gap 0.75rem
  padding-bottom 0.75rem
  border-bottom 1px solid

  .sched-light &
    border-color #e2e8f0

  .sched-dark &
    border-color #1c2e4a

.saturday-title-group
  display flex
  align-items center
  gap 0.5rem

.card-sub-info
  font-size 0.75rem
  margin-top 0.1rem

  .sched-light &
    color #64748b

  .sched-dark &
    color #94a3b8

.week-mode-badge
  padding 0.35rem 0.85rem
  border-radius 0.75rem
  font-size 0.75rem
  font-weight 800
  text-transform uppercase

  &.badge-gold
    .sched-light &
      background #fef3c7
      color #b45309
      border 1px solid #fde68a
    .sched-dark &
      background rgba(217, 119, 6, 0.2)
      color #f5c518
      border 1px solid rgba(245, 197, 24, 0.5)

  &.badge-blue
    .sched-light &
      background #e0f2fe
      color #0284c7
      border 1px solid #bae6fd
    .sched-dark &
      background rgba(59, 130, 246, 0.2)
      color #60a5fa
      border 1px solid rgba(59, 130, 246, 0.5)

.match-timeline
  display flex
  flex-direction column
  gap 0.75rem

.event-row
  padding 1rem
  border-radius 0.75rem
  border 1px solid
  display flex
  flex-direction column
  gap 0.75rem
  transition all 0.2s ease

  .sched-light &
    background #f8fafc
    border-color #cbd5e1

  .sched-dark &
    background #050912

@media (min-width: 640px)
  .event-row
    flex-direction row
    align-items center
    justify-content space-between

.event-left
  display flex
  align-items center
  gap 0.85rem

.time-box
  width 4rem
  height 3rem
  border-radius 0.75rem
  display flex
  flex-direction column
  align-items center
  justify-content center
  flex-shrink 0
  border 1px solid

  &.box-red
    .sched-light &
      background #fee2e2
      border-color #fca5a5
      color #dc2626
    .sched-dark &
      background rgba(239, 68, 68, 0.15)
      border-color rgba(239, 68, 68, 0.4)
      color #ef4444

  &.box-gold
    .sched-light &
      background #fef3c7
      border-color #fde68a
      color #b45309
    .sched-dark &
      background rgba(245, 197, 24, 0.15)
      border-color rgba(245, 197, 24, 0.4)
      color #f5c518

  &.box-pink
    .sched-light &
      background #fce7f3
      border-color #fbcfe8
      color #db2777
    .sched-dark &
      background rgba(236, 72, 153, 0.15)
      border-color rgba(236, 72, 153, 0.4)
      color #ec4899

  &.box-emerald
    .sched-light &
      background #d1fae5
      border-color #a7f3d0
      color #059669
    .sched-dark &
      background rgba(16, 185, 129, 0.15)
      border-color rgba(16, 185, 129, 0.4)
      color #10b981

  &.box-blue
    .sched-light &
      background #e0f2fe
      border-color #bae6fd
      color #0284c7
    .sched-dark &
      background rgba(59, 130, 246, 0.15)
      border-color rgba(59, 130, 246, 0.4)
      color #60a5fa

.time-main
  font-size 0.875rem
  font-weight 800
  font-family monospace

.time-label
  font-size 0.55rem
  font-weight 700

.event-info
  display flex
  flex-direction column
  gap 0.15rem

.event-title-row
  display flex
  align-items center
  gap 0.5rem

.event-title
  font-size 0.875rem
  font-weight 800
  margin 0

  .sched-light &
    color #0f172a

  .sched-dark &
    color #ffffff

.event-tag
  font-size 0.55rem
  font-weight 700
  padding 0.1rem 0.4rem
  border-radius 0.25rem
  text-transform uppercase

  &.tag-red
    .sched-light &
      background #fee2e2
      color #dc2626
    .sched-dark &
      background rgba(239, 68, 68, 0.2)
      color #ef4444

  &.tag-gold
    .sched-light &
      background #fef3c7
      color #b45309
    .sched-dark &
      background rgba(245, 197, 24, 0.2)
      color #f5c518

  &.tag-pink
    .sched-light &
      background #fce7f3
      color #db2777
    .sched-dark &
      background rgba(236, 72, 153, 0.2)
      color #f472b6

  &.tag-emerald
    .sched-light &
      background #d1fae5
      color #059669
    .sched-dark &
      background rgba(16, 185, 129, 0.2)
      color #34d399

  &.tag-blue
    .sched-light &
      background #e0f2fe
      color #0284c7
    .sched-dark &
      background rgba(59, 130, 246, 0.2)
      color #60a5fa

.event-desc
  font-size 0.75rem
  margin 0

  .sched-light &
    color #475569

  .sched-dark &
    color #94a3b8

.event-time-start
  font-size 0.75rem
  font-family monospace
  font-weight 700
  flex-shrink 0

  &.time-red
    color #ef4444

  &.time-gold
    .sched-light &
      color #b45309
    .sched-dark &
      color #f5c518

  &.time-pink
    color #f472b6

  &.time-emerald
    .sched-light &
      color #059669
    .sched-dark &
      color #34d399

  &.time-blue
    .sched-light &
      color #0284c7
    .sched-dark &
      color #60a5fa

@keyframes ping
  75%, 100%
    transform scale(2)
    opacity 0
</style>
