<template lang="pug">
.stats-container(
  :class="themeStore.theme === 'light' ? 'stats-light' : 'stats-dark'"
)
  //- Header
  .stats-header
    .header-title-group
      .title-row
        span.header-icon 📊
        h1.header-title UY DANH THỐNG KÊ & HIỆU SUẤT BANG CHIẾN
      p.header-subtitle Báo cáo tham chiến, danh sách đệ tử cáo bận và lực lượng võ phái

    RouterLink.btn-lineup-link(to="/lineup") Thiên Thư Trận Phái ➔

  //- Event Selector Bar
  .event-selector-bar
    .event-info-left
      .event-icon-box ⚔️
      .event-meta
        span.event-label Chọn Công Thành Chiến Kỳ:
        span.event-current-title {{ currentEventTitle }}

    .event-select-right
      label.select-label(for="stats-event-select") Sự kiện:
      select.event-select(
        id="stats-event-select"
        v-model="selectedMessageId"
        @change="handleEventChange"
      )
        option(value="" disabled) -- Chọn sự kiện xuất trận --
        option(
          v-for="event in store.events"
          :key="event.messageId"
          :value="event.messageId"
        ) {{ event.name || event.title }}

  //- Summary Metrics Grid
  .metrics-grid
    .metric-card
      span.metric-label Tổng Đệ Tử Trực Trận
      .metric-val.val-gold {{ store.totalAssigned }} / {{ store.totalAttendance || 62 }}
      span.metric-sub.sub-emerald ✓ Đã an vị trong {{ currentEventTitle }}

    .metric-card
      span.metric-label Đệ Tử Cáo Bận
      .metric-val.val-red {{ store.totalBusyCount }} đệ tử
      span.metric-sub.sub-red Danh sách đệ tử không thể xuất trận

    .metric-card
      span.metric-label Tỷ Lệ Lấp Đầy Trận Đồ
      .metric-val.val-blue {{ fillRatio }}%
      span.metric-sub.sub-blue Ma trận sẵn sàng nghênh chiến

  //- Absent Members Detail Section if any
  .absent-section(v-if="store.absentUsers && store.absentUsers.length > 0")
    h3.absent-title 🚫 DANH SÁCH ĐỆ TỬ CÁO BẬN XUẤT TRẬN
    .absent-grid
      .absent-card(v-for="user in store.absentUsers" :key="user.userId || user.id")
        .absent-avatar {{ (user.displayName || user.username || 'B').charAt(0) }}
        .absent-info
          span.absent-name {{ user.displayName || user.username }}
          span.absent-reason {{ user.reason || user.note || 'Cáo bận không thể tham chiến' }}

  //- Class Stats Section
  .class-stats-card
    .class-stats-header
      h3.class-stats-title ⚔️ THỐNG KÊ LỰC LƯỢNG VÕ PHÁI TRỰC CHIẾN
      span.total-assigned-badge Tổng: {{ store.totalAssigned }} đệ tử

    .class-stats-body
      //- Donut Chart
      .chart-box
        .chart-circle-wrapper
          svg.chart-svg(viewBox="0 0 100 100")
            circle.chart-bg(cx="50" cy="50" r="38")
            circle.chart-progress(
              cx="50"
              cy="50"
              r="38"
              stroke-dasharray="238.76"
              :stroke-dashoffset="dashOffset"
            )
          .chart-center-overlay
            span.chart-number {{ store.totalAssigned }}
            span.chart-text ĐÃ AN VỊ
        span.chart-ratio-text Tỷ lệ lấp đầy: {{ fillRatio }}%

      //- Class List
      .class-list
        .class-stat-row(v-for="item in classStatsList" :key="item.name")
          .class-name-left
            img.class-icon(v-if="item.icon" :src="item.icon" :alt="item.name")
            span.class-dot(v-else :style="{ backgroundColor: item.hex, boxShadow: `0 0 6px ${item.hex}` }")
            span.class-title {{ item.name }}

          .class-bar-right
            .progress-track
              .progress-fill(:style="{ width: `${item.percent}%`, backgroundColor: item.hex }")
            span.count-badge {{ item.count }} người
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useLineupStore } from '../stores/lineupStore';
import { useThemeStore } from '../stores/themeStore';
import { CLASS_LIST } from '../theme/classColors';

const store = useLineupStore();
const themeStore = useThemeStore();
const selectedMessageId = ref('');

const currentEventTitle = computed(() => {
  if (!selectedMessageId.value || !store.events) return store.title || 'Công Thành Chiến';
  const found = store.events.find((e) => e.messageId === selectedMessageId.value);
  return found ? (found.name || found.title) : (store.title || 'Công Thành Chiến');
});

const handleEventChange = () => {
  if (selectedMessageId.value) {
    store.fetchEventData(selectedMessageId.value);
  }
};

onMounted(async () => {
  await store.fetchEventsList();

  if (store.events && store.events.length > 0) {
    selectedMessageId.value = store.events[0].messageId;
    store.fetchEventData(selectedMessageId.value);
  }
});

const fillRatio = computed(() => {
  const total = store.totalAttendance || 62;
  const current = store.totalAssigned;
  return Math.round((current / total) * 100);
});

const dashOffset = computed(() => {
  const total = store.totalAttendance || 62;
  const current = store.totalAssigned;
  const ratio = Math.min(current / total, 1);
  const circumference = 238.76;
  return circumference * (1 - ratio);
});

const classStatsList = computed(() => {
  const counts = store.classCounts;
  const total = store.totalAssigned || 1;

  return CLASS_LIST.map((c) => {
    const count = counts[c.name] || 0;
    return {
      name: c.name,
      hex: c.hex,
      icon: c.icon,
      count: count,
      percent: Math.round((count / total) * 100)
    };
  });
});
</script>

<style lang="stylus" scoped>
.stats-container
  position relative
  min-height calc(100vh - 57px)
  padding 1.5rem
  max-width 72rem
  margin 0 auto
  font-family 'Lora', serif
  user-select none
  display flex
  flex-direction column
  gap 1.5rem

.stats-header
  padding-bottom 1rem
  border-bottom 1px solid
  display flex
  flex-direction column
  gap 1rem

  .stats-light &
    border-color #cbd5e1

  .stats-dark &
    border-color #172439

@media (min-width: 640px)
  .stats-header
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
  font-size 1.25rem
  font-weight 900
  text-transform uppercase
  letter-spacing 0.05em
  margin 0

  .stats-light &
    background linear-gradient(to right, #b45309, #d97706)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

  .stats-dark &
    background linear-gradient(to right, #fef08a, #f5c518, #b45309)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

.header-subtitle
  font-size 0.75rem
  margin-top 0.25rem

  .stats-light &
    color #64748b

  .stats-dark &
    color #94a3b8

.btn-lineup-link
  padding 0.5rem 1rem
  border-radius 0.75rem
  background #2563eb
  color #ffffff
  font-size 0.75rem
  font-weight 700
  text-decoration none
  transition all 0.15s ease
  &:hover
    background #3b82f6

.event-selector-bar
  padding 1rem
  border-radius 1rem
  border 1px solid
  backdrop-filter blur(12px)
  display flex
  flex-direction column
  gap 1rem

  .stats-light &
    background rgba(255, 255, 255, 0.95)
    border-color #cbd5e1
    box-shadow 0 4px 15px rgba(0, 0, 0, 0.04)

  .stats-dark &
    background rgba(8, 13, 25, 0.9)
    border-color #1e304d
    box-shadow 0 10px 25px rgba(0, 0, 0, 0.3)

@media (min-width: 640px)
  .event-selector-bar
    flex-direction row
    align-items center
    justify-content space-between

.event-info-left
  display flex
  align-items center
  gap 0.75rem

.event-icon-box
  width 2.25rem
  height 2.25rem
  border-radius 0.75rem
  display flex
  align-items center
  justify-content center
  font-size 1.125rem

  .stats-light &
    background #fef3c7
    border 1px solid #fde68a
    color #b45309

  .stats-dark &
    background rgba(245, 197, 24, 0.1)
    border 1px solid rgba(245, 197, 24, 0.3)
    color #f5c518

.event-meta
  display flex
  flex-direction column

.event-label
  font-size 0.6rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em

  .stats-light &
    color #64748b

  .stats-dark &
    color #64748b

.event-current-title
  font-size 0.75rem
  font-weight 700

  .stats-light &
    color #b45309

  .stats-dark &
    color #f5c518

.event-select-right
  display flex
  align-items center
  gap 0.5rem
  width 100%

@media (min-width: 640px)
  .event-select-right
    width auto

.select-label
  font-size 0.75rem
  font-weight 600
  flex-shrink 0

  .stats-light &
    color #64748b

  .stats-dark &
    color #94a3b8

.event-select
  width 100%
  padding 0.5rem 0.85rem
  border-radius 0.75rem
  border 1px solid
  font-size 0.75rem
  font-weight 700
  outline none
  cursor pointer
  font-family 'Lora', serif

  .stats-light &
    background #ffffff
    border-color #cbd5e1
    color #b45309

  .stats-dark &
    background #0f172a
    border-color #1e293b
    color #f5c518

@media (min-width: 640px)
  .event-select
    width 16rem

.metrics-grid
  display grid
  grid-template-columns 1fr
  gap 1.5rem

@media (min-width: 640px)
  .metrics-grid
    grid-template-columns repeat(3, minmax(0, 1fr))

.metric-card
  padding 1.25rem
  border-radius 1rem
  border 1px solid

  .stats-light &
    background #ffffff
    border-color #cbd5e1
    box-shadow 0 4px 15px rgba(0, 0, 0, 0.04)

  .stats-dark &
    background rgba(8, 13, 25, 0.9)
    border-color #17263c
    box-shadow 0 10px 25px rgba(0, 0, 0, 0.3)

.metric-label
  font-size 0.75rem
  font-weight 700
  text-transform uppercase

  .stats-light &
    color #64748b

  .stats-dark &
    color #64748b

.metric-val
  font-size 1.75rem
  font-weight 800
  font-family monospace
  margin-top 0.5rem

  &.val-gold
    .stats-light &
      color #b45309
    .stats-dark &
      color #f5c518

  &.val-red
    color #ef5757

  &.val-blue
    .stats-light &
      color #2563eb
    .stats-dark &
      color #60a5fa

.metric-sub
  font-size 0.7rem
  margin-top 0.25rem
  display block

  &.sub-emerald
    .stats-light &
      color #059669
    .stats-dark &
      color #34d399

  &.sub-red
    color #ef5757

  &.sub-blue
    .stats-light &
      color #2563eb
    .stats-dark &
      color #60a5fa

.absent-section
  padding 1.5rem
  border-radius 1rem
  border 1px solid
  backdrop-filter blur(12px)
  display flex
  flex-direction column
  gap 0.75rem

  .stats-light &
    background #fef2f2
    border-color #fca5a5

  .stats-dark &
    background rgba(8, 13, 25, 0.9)
    border-color rgba(127, 29, 29, 0.6)

.absent-title
  font-size 0.75rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.05em
  color #ef5757
  margin 0

.absent-grid
  display grid
  grid-template-columns 1fr
  gap 0.75rem

@media (min-width: 640px)
  .absent-grid
    grid-template-columns repeat(2, minmax(0, 1fr))

@media (min-width: 768px)
  .absent-grid
    grid-template-columns repeat(3, minmax(0, 1fr))

.absent-card
  padding 0.75rem
  border-radius 0.75rem
  border 1px solid
  display flex
  align-items center
  gap 0.75rem

  .stats-light &
    background #ffffff
    border-color #fca5a5

  .stats-dark &
    background #170d12
    border-color rgba(127, 29, 29, 0.4)

.absent-avatar
  width 2rem
  height 2rem
  border-radius 9999px
  background rgba(127, 29, 29, 0.3)
  border 1px solid rgba(239, 68, 68, 0.5)
  color #ef5757
  display flex
  align-items center
  justify-content center
  font-size 0.75rem
  font-weight 700

.absent-info
  display flex
  flex-direction column

.absent-name
  font-size 0.75rem
  font-weight 700

  .stats-light &
    color #0f172a

  .stats-dark &
    color #ffffff

.absent-reason
  font-size 0.625rem
  color #fca5a5

.class-stats-card
  padding 1.5rem
  border-radius 1rem
  border 1px solid
  backdrop-filter blur(12px)
  display flex
  flex-direction column
  gap 1.25rem

  .stats-light &
    background #ffffff
    border-color #cbd5e1
    box-shadow 0 4px 15px rgba(0, 0, 0, 0.04)

  .stats-dark &
    background rgba(8, 13, 25, 0.9)
    border-color #17263c
    box-shadow 0 20px 40px rgba(0, 0, 0, 0.4)

.class-stats-header
  display flex
  align-items center
  justify-content space-between
  padding-bottom 0.75rem
  border-bottom 1px solid

  .stats-light &
    border-color #e2e8f0

  .stats-dark &
    border-color #142033

.class-stats-title
  font-size 0.875rem
  font-weight 800
  text-transform uppercase
  margin 0

  .stats-light &
    color #1d4ed8

  .stats-dark &
    color #93c5fd

.total-assigned-badge
  font-family monospace
  font-size 0.75rem
  font-weight 700
  padding 0.25rem 0.65rem
  border-radius 0.5rem
  border 1px solid

  .stats-light &
    background #fef3c7
    color #b45309
    border-color #fde68a

  .stats-dark &
    background rgba(245, 197, 24, 0.1)
    color #f5c518
    border-color rgba(245, 197, 24, 0.3)

.class-stats-body
  display grid
  grid-template-columns 1fr
  gap 1.5rem
  align-items center

@media (min-width: 768px)
  .class-stats-body
    grid-template-columns repeat(3, minmax(0, 1fr))

.chart-box
  padding 1rem
  border-radius 0.75rem
  border 1px solid
  display flex
  flex-direction column
  align-items center
  justify-content center

  .stats-light &
    background #f8fafc
    border-color #cbd5e1

  .stats-dark &
    background #050810
    border-color #142033

.chart-circle-wrapper
  position relative
  width 9rem
  height 9rem
  display flex
  align-items center
  justify-content center

.chart-svg
  width 9rem
  height 9rem
  transform rotate(-90deg)

.chart-bg
  stroke #17263c
  stroke-width 8
  fill transparent

  .stats-light &
    stroke #e2e8f0

.chart-progress
  stroke #3b82f6
  stroke-width 8
  fill transparent
  stroke-linecap round
  transition stroke-dashoffset 0.7s ease-out

.chart-center-overlay
  position absolute
  inset 0
  display flex
  flex-direction column
  align-items center
  justify-content center

.chart-number
  font-size 1.75rem
  font-weight 800
  font-family monospace

  .stats-light &
    color #0f172a

  .stats-dark &
    color #ffffff

.chart-text
  font-size 0.6rem
  font-weight 700
  text-transform uppercase

  .stats-light &
    color #64748b

  .stats-dark &
    color #64748b

.chart-ratio-text
  font-size 0.75rem
  margin-top 0.75rem
  font-weight 600

  .stats-light &
    color #475569

  .stats-dark &
    color #94a3b8

.class-list
  display flex
  flex-direction column
  gap 0.5rem

@media (min-width: 768px)
  .class-list
    grid-column span 2 / span 2

.class-stat-row
  padding 0.5rem 0.75rem
  border-radius 0.5rem
  border 1px solid
  display flex
  align-items center
  justify-content space-between
  transition all 0.15s ease

  .stats-light &
    background #ffffff
    border-color #cbd5e1
    &:hover
      border-color #2563eb

  .stats-dark &
    background #0c1424
    border-color #17253b
    &:hover
      border-color rgba(59, 130, 246, 0.5)

.class-name-left
  display flex
  align-items center
  gap 0.65rem

.class-icon
  width 1.25rem
  height 1.25rem
  object-fit contain
  flex-shrink 0

.class-dot
  width 0.625rem
  height 0.625rem
  border-radius 9999px
  flex-shrink 0

.class-title
  font-size 0.75rem
  font-weight 700

  .stats-light &
    color #0f172a

  .stats-dark &
    color #ffffff

.class-bar-right
  display flex
  align-items center
  gap 0.75rem

.progress-track
  width 8rem
  height 0.5rem
  border-radius 9999px
  overflow hidden
  border 1px solid
  display none

  .stats-light &
    background #f1f5f9
    border-color #cbd5e1

  .stats-dark &
    background #050810
    border-color #1e293b

@media (min-width: 640px)
  .progress-track
    display block

.progress-fill
  height 100%
  border-radius 9999px
  transition width 0.5s ease

.count-badge
  font-family monospace
  font-size 0.75rem
  font-weight 700
  padding 0.15rem 0.5rem
  border-radius 0.25rem
  border 1px solid
  min-width 70px
  text-align right

  .stats-light &
    background #fef3c7
    color #b45309
    border-color #fde68a

  .stats-dark &
    background rgba(245, 197, 24, 0.1)
    color #f5c518
    border-color rgba(245, 197, 24, 0.2)
</style>
