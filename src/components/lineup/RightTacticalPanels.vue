<template lang="pug">
.panels-wrapper
  //- Box 1: CHỐT ĐIỂM DANH & THỐNG KÊ PHÁI
  .panel-box(
    :class="themeStore.theme === 'light' ? 'panel-light' : 'panel-dark'"
  )
    .panel-header-title {{ panels.rollCall?.title || 'CHỐT ĐIỂM DANH' }}

    //- Donut Ring Chart SVG
    .chart-container
      svg.chart-svg(viewBox="0 0 100 100")
        circle.chart-bg(cx="50" cy="50" r="38")
        circle.chart-progress(
          cx="50"
          cy="50"
          r="38"
          stroke-dasharray="238.76"
          :stroke-dashoffset="dashOffset"
        )

      .chart-overlay
        span.chart-number {{ store.totalAssigned }}
        span.chart-label ĐÃ XẾP

    //- Danh sách thống kê số lượng từng Phái
    .class-stats-list
      .class-stat-row(v-for="item in classStatsList" :key="item.name")
        .stat-name-group
          img.stat-icon(v-if="item.icon" :src="item.icon" :alt="item.name")
          span.stat-dot(v-else :style="{ backgroundColor: item.hex, boxShadow: `0 0 6px ${item.hex}` }")
          span.stat-name {{ item.name }}

        span.stat-count-badge {{ item.count }} người

    //- Footer tổng quan Điểm Danh & Báo Bận
    .rollcall-footer
      .footer-stat-row
        span.footer-stat-label Điểm Danh
        span.footer-stat-val.val-gold {{ store.totalAssigned }} / {{ store.totalAttendance || 62 }}
      .footer-stat-row
        span.footer-stat-label Báo Bận
        span.footer-stat-val.val-red {{ panels.rollCall?.totalBusy || 9 }} người

  //- Box 2: RỪNG 1 (TRÁI)
  .panel-box(
    :class="[themeStore.theme === 'light' ? 'panel-light' : 'panel-dark', { 'drag-over-ring': isEditMode && dragOverRung === 'rung1' }]"
    @dragover.prevent="dragOverRung = 'rung1'"
    @dragleave="dragOverRung = null"
    @drop="onDropToRung($event, 'rung1')"
  )
    .panel-header-title.title-red
      template(v-if="!isEditMode")
        span {{ panels.rung1?.title || 'RỪNG 1 (TRÁI)' }}
      template(v-else)
        input.title-input.input-red(
          v-model="panels.rung1.title"
          placeholder="Tiêu đề Rừng 1..."
        )

    .leader-card(
      :draggable="isEditMode && !!panels.rung1?.userId"
      @dragstart="onDragLeaderStart($event, panels.rung1, 'rung1')"
      :class="{ 'draggable': isEditMode && !!panels.rung1?.userId, 'dashed': isEditMode && !panels.rung1?.userId }"
    )
      .leader-avatar-group
        .avatar-circle
          img.avatar-img(v-if="getLeaderIcon(panels.rung1?.class)" :src="getLeaderIcon(panels.rung1?.class)")
          span.avatar-initial(v-else) {{ panels.rung1?.leaderName?.charAt(0) || 'B' }}
        span.mic-icon 💬

      .leader-info
        template(v-if="panels.rung1?.leaderName")
          .leader-name-row
            span.leader-name {{ panels.rung1.leaderName }}
            span.mercenary-tag(v-if="panels.rung1?.isExternal || panels.rung1?.userId?.startsWith('ext_')") ĐÁNH THUÊ
          .leader-subtag {{ panels.rung1.subTag || 'Trưởng Rừng 1' }}
        template(v-else)
          .empty-leader-text + Kéo thành viên thả vào làm Trưởng Rừng 1

      .leader-actions(v-if="isEditMode && panels.rung1?.userId")
        button.action-btn(
          @click.stop="store.clearRung('rung1')"
          title="Xóa khỏi Trưởng Rừng 1"
        ) ✕

  //- Box 3: RỪNG 2 (PHẢI)
  .panel-box(
    :class="[themeStore.theme === 'light' ? 'panel-light' : 'panel-dark', { 'drag-over-ring': isEditMode && dragOverRung === 'rung2' }]"
    @dragover.prevent="dragOverRung = 'rung2'"
    @dragleave="dragOverRung = null"
    @drop="onDropToRung($event, 'rung2')"
  )
    .panel-header-title.title-red
      template(v-if="!isEditMode")
        span {{ panels.rung2?.title || 'RỪNG 2 (PHẢI)' }}
      template(v-else)
        input.title-input.input-blue(
          v-model="panels.rung2.title"
          placeholder="Tiêu đề Rừng 2..."
        )

    .leader-card(
      :draggable="isEditMode && !!panels.rung2?.userId"
      @dragstart="onDragLeaderStart($event, panels.rung2, 'rung2')"
      :class="{ 'draggable': isEditMode && !!panels.rung2?.userId, 'dashed': isEditMode && !panels.rung2?.userId }"
    )
      .leader-avatar-group
        .avatar-circle
          img.avatar-img(v-if="getLeaderIcon(panels.rung2?.class)" :src="getLeaderIcon(panels.rung2?.class)")
          span.avatar-initial(v-else) {{ panels.rung2?.leaderName?.charAt(0) || 'T' }}
        span.mic-icon 💬

      .leader-info
        template(v-if="panels.rung2?.leaderName")
          .leader-name-row
            span.leader-name {{ panels.rung2.leaderName }}
            span.mercenary-tag(v-if="panels.rung2?.isExternal || panels.rung2?.userId?.startsWith('ext_')") ĐÁNH THUÊ
          .leader-subtag {{ panels.rung2.subTag || 'Trưởng Rừng 2' }}
        template(v-else)
          .empty-leader-text + Kéo thành viên thả vào làm Trưởng Rừng 2

      .leader-actions(v-if="isEditMode && panels.rung2?.userId")
        button.action-btn(
          @click.stop="store.clearRung('rung2')"
          title="Xóa khỏi Trưởng Rừng 2"
        ) ✕

  //- Box 4: LƯU Ý & CHIẾN THUẬT
  .panel-box(
    :class="themeStore.theme === 'light' ? 'panel-light' : 'panel-dark'"
  )
    .panel-header-title.flex-row-between
      span {{ panels.tactics?.title || 'LƯU Ý & CHIẾN THUẬT' }}
      button.btn-add-note(v-if="isEditMode" @click="addNote") + Thêm

    ul.tactics-notes-list
      li.note-item(v-for="(note, idx) in panels.tactics?.notes" :key="idx")
        span.bullet-dash -
        template(v-if="!isEditMode")
          span.note-text {{ note }}
        template(v-else)
          input.note-input(v-model="panels.tactics.notes[idx]")
          button.btn-remove-note(@click="store.removeTacticNote(idx)" title="Xóa dòng này") ✕
</template>

<script setup>
import { ref, computed } from 'vue';
import { useLineupStore } from '../../stores/lineupStore';
import { useThemeStore } from '../../stores/themeStore';
import { CLASS_LIST, getClassIcon } from '../../theme/classColors';

const props = defineProps({
  panels: { type: Object, default: () => ({}) },
  isEditMode: { type: Boolean, default: false }
});

const store = useLineupStore();
const themeStore = useThemeStore();
const dragOverRung = ref(null);

const onDragLeaderStart = (evt, leaderObj, key) => {
  if (!leaderObj || !leaderObj.userId) return;
  const payload = {
    source: 'leader',
    leader: {
      userId: leaderObj.userId,
      displayName: leaderObj.leaderName,
      className: leaderObj.class || 'Huyết Hà',
      roleName: leaderObj.subTag || 'Leader',
      note: leaderObj.subTag || 'Leader',
    }
  };
  evt.dataTransfer.setData('application/json', JSON.stringify(payload));
};

const onDropToRung = (evt, rungKey) => {
  dragOverRung.value = null;
  try {
    const raw = evt.dataTransfer.getData('application/json');
    if (!raw) return;
    const data = JSON.parse(raw);

    if (data.source === 'pool') {
      store.assignToRungFromPool({ rungKey, member: data.member });
    } else if (data.source === 'slot') {
      store.assignToRungFromSlot({ rungKey, srcDIdx: data.dIdx, srcTIdx: data.tIdx, srcSIdx: data.sIdx });
    }
  } catch (e) {
    console.error('Lỗi khi thả vào Trưởng Rừng:', e);
  }
};

const getLeaderIcon = (cName) => getClassIcon(cName);

const addNote = () => {
  store.addTacticNote('Ghi chú chiến thuật mới...');
};

const classStatsList = computed(() => {
  const counts = store.classCounts;

  return CLASS_LIST.map((c) => ({
    name: c.name,
    hex: c.hex,
    icon: c.icon,
    count: counts[c.name] || 0,
  }));
});

const dashOffset = computed(() => {
  const total = store.totalAttendance || 62;
  const current = store.totalAssigned;
  const ratio = Math.min(current / total, 1);
  const circumference = 238.76;
  return circumference * (1 - ratio);
});
</script>

<style lang="stylus" scoped>
.panels-wrapper
  width 16rem
  flex-shrink 0
  display flex
  flex-direction column
  gap 0.65rem
  user-select none
  font-family 'Lora', serif

.panel-box
  border-radius 0.5rem
  padding 0.75rem
  box-shadow 0 4px 15px rgba(0, 0, 0, 0.05)
  backdrop-filter blur(12px)
  position relative
  transition all 0.2s ease

  &.panel-light
    background rgba(255, 255, 255, 0.95)
    border 1px solid #cbd5e1
    color #0f172a

  &.panel-dark
    background rgba(8, 13, 23, 0.9)
    border 1px solid #17263c
    color #e2e8f0

  &.drag-over-ring
    outline 2px solid #3b82f6
    background rgba(59, 130, 246, 0.1)

.panel-header-title
  font-size 0.7rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em
  margin-bottom 0.5rem
  padding-bottom 0.25rem
  border-bottom 1px solid

  .panel-light &
    border-color #e2e8f0
    color #1d4ed8

  .panel-dark &
    border-color #18263e
    color #93c5fd

  &.title-red
    .panel-light &
      color #dc2626
    .panel-dark &
      color #ef5757

  &.flex-row-between
    display flex
    align-items center
    justify-content space-between

.title-input
  font-size 0.7rem
  font-weight 700
  padding 0.1rem 0.35rem
  border-radius 0.25rem
  border 1px solid
  width 100%
  outline none

  &.input-red
    .panel-light &
      background #ffffff
      border-color #cbd5e1
      color #dc2626
    .panel-dark &
      background #060a12
      border-color #2a3f63
      color #ef5757

  &.input-blue
    .panel-light &
      background #ffffff
      border-color #cbd5e1
      color #2563eb
    .panel-dark &
      background #060a12
      border-color #2a3f63
      color #60a5fa

.chart-container
  display flex
  justify-content center
  margin 0.5rem 0
  position relative

.chart-svg
  width 6rem
  height 6rem
  transform rotate(-90deg)

.chart-bg
  stroke #17263c
  stroke-width 8
  fill transparent

  .panel-light &
    stroke #e2e8f0

.chart-progress
  stroke #3b82f6
  stroke-width 8
  fill transparent
  stroke-linecap round
  transition stroke-dashoffset 0.7s ease-out

.chart-overlay
  position absolute
  inset 0
  display flex
  flex-direction column
  align-items center
  justify-content center

.chart-number
  font-size 1.25rem
  font-weight 800
  font-family monospace
  letter-spacing -0.05em

  .panel-light &
    color #0f172a

  .panel-dark &
    color #ffffff

.chart-label
  font-size 0.55rem
  text-transform uppercase
  letter-spacing 0.05em
  font-weight 600

  .panel-light &
    color #64748b

  .panel-dark &
    color #64748b

.class-stats-list
  display flex
  flex-direction column
  gap 0.35rem
  margin 0.5rem 0

.class-stat-row
  display flex
  align-items center
  justify-content space-between
  font-size 0.75rem
  padding 0.15rem 0
  border-bottom 1px solid

  .panel-light &
    border-color #f1f5f9

  .panel-dark &
    border-color #111c2e

.stat-name-group
  display flex
  align-items center
  gap 0.35rem

.stat-icon
  width 1rem
  height 1rem
  object-fit contain
  flex-shrink 0

.stat-dot
  width 0.5rem
  height 0.5rem
  border-radius 9999px
  flex-shrink 0

.stat-name
  font-size 0.7rem
  font-weight 500

  .panel-light &
    color #0f172a

  .panel-dark &
    color #cbd5e1

.stat-count-badge
  font-family monospace
  font-size 0.7rem
  font-weight 700
  padding 0.05rem 0.35rem
  border-radius 0.25rem
  border 1px solid

  .panel-light &
    background #fef3c7
    color #b45309
    border-color #fde68a

  .panel-dark &
    background rgba(245, 197, 24, 0.1)
    color #f5c518
    border-color rgba(245, 197, 24, 0.2)

.rollcall-footer
  padding-top 0.5rem
  margin-top 0.25rem
  border-top 1px solid
  display flex
  flex-direction column
  gap 0.25rem
  font-size 0.75rem

  .panel-light &
    border-color #e2e8f0

  .panel-dark &
    border-color #18263e

.footer-stat-row
  display flex
  justify-content space-between
  align-items center

.footer-stat-label
  font-size 0.7rem

  .panel-light &
    color #64748b

  .panel-dark &
    color #94a3b8

.footer-stat-val
  font-family monospace
  font-weight 700

  &.val-gold
    .panel-light &
      color #b45309
    .panel-dark &
      color #f5c518

  &.val-red
    color #ef5757

.leader-card
  border-radius 0.375rem
  padding 0.5rem
  display flex
  align-items center
  gap 0.65rem
  position relative
  transition all 0.15s ease

  .panel-light &
    background #f8fafc
    border 1px solid #cbd5e1

  .panel-dark &
    background rgba(14, 22, 38, 0.8)
    border 1px solid #1e2e4a

  &.draggable
    cursor grab
    &:active
      cursor grabbing

  &.dashed
    border-style dashed

.leader-avatar-group
  position relative
  flex-shrink 0

.avatar-circle
  width 2rem
  height 2rem
  border-radius 9999px
  display flex
  align-items center
  justify-content center
  font-size 0.75rem
  font-weight 700

  .panel-light &
    background #ffffff
    border 1px solid #cbd5e1
    color #2563eb

  .panel-dark &
    background #182740
    border 1px solid rgba(59, 130, 246, 0.5)
    color #60a5fa

.avatar-img
  width 1.5rem
  height 1.5rem
  object-fit contain

.mic-icon
  position absolute
  right -0.125rem
  bottom -0.125rem
  width 0.75rem
  height 0.75rem
  border-radius 9999px
  background #5865F2
  color #ffffff
  display flex
  align-items center
  justify-content center
  font-size 0.5rem

.leader-info
  flex 1
  min-width 0

.leader-name-row
  display flex
  align-items center
  gap 0.25rem

.leader-name
  font-size 0.75rem
  font-weight 700
  color #ef5757
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

.mercenary-tag
  font-size 0.5rem
  padding 0.05rem 0.25rem
  border-radius 0.125rem
  font-weight 700
  text-transform uppercase
  flex-shrink 0

  .panel-light &
    background #fef3c7
    color #b45309
    border 1px solid #fde68a

  .panel-dark &
    background rgba(245, 197, 24, 0.2)
    color #f5c518
    border 1px solid rgba(245, 197, 24, 0.4)

.leader-subtag
  font-size 0.625rem
  margin-top 0.1rem
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

  .panel-light &
    color #64748b

  .panel-dark &
    color #64748b

.empty-leader-text
  font-size 0.7rem
  font-style italic

  .panel-light &
    color #64748b

  .panel-dark &
    color #475569

.leader-actions
  display flex
  align-items center
  gap 0.25rem
  opacity 0
  transition opacity 0.15s ease

  .leader-card:hover &
    opacity 1

.action-btn
  width 1rem
  height 1rem
  border-radius 0.25rem
  font-size 0.625rem
  display flex
  align-items center
  justify-content center
  cursor pointer
  border 1px solid

  .panel-light &
    background #ffffff
    border-color #cbd5e1
    color #475569
  .panel-dark &
    background rgba(51, 65, 85, 0.6)
    border-color #475569
    color #cbd5e1

  &:hover
    background #ef5757 !important
    color #ffffff !important
    border-color #ef5757 !important

.btn-add-note
  font-size 0.625rem
  padding 0.1rem 0.35rem
  border-radius 0.25rem
  border none
  cursor pointer
  transition all 0.15s ease

  .panel-light &
    background #e0f2fe
    color #0284c7
    &:hover
      background #0284c7
      color #ffffff

  .panel-dark &
    background rgba(59, 130, 246, 0.2)
    color #60a5fa
    &:hover
      background #3b82f6
      color #ffffff

.tactics-notes-list
  list-style none
  padding 0
  margin 0
  display flex
  flex-direction column
  gap 0.5rem
  font-size 0.7rem
  line-height 1.6

.note-item
  display flex
  align-items flex-start
  gap 0.375rem

.bullet-dash
  color #3b82f6
  font-weight 700
  flex-shrink 0
  margin-top 0.1rem

.note-text
  flex 1

  .panel-light &
    color #0f172a

  .panel-dark &
    color #cbd5e1

.note-input
  flex 1
  font-size 0.7rem
  padding 0.1rem 0.25rem
  border-radius 0.25rem
  border 1px solid
  outline none

  .panel-light &
    background #ffffff
    border-color #cbd5e1
    color #0f172a

  .panel-dark &
    background #060a12
    border-color #2a3f63
    color #cbd5e1

.btn-remove-note
  color #ef5757
  background none
  border none
  cursor pointer
  padding 0 0.25rem
  font-size 0.75rem
  &:hover
    color #dc2626
</style>
