<template lang="pug">
.monthly-absence
  //- Tổng quan theo từng tháng
  .card
    .card-head
      .head-title
        h3 📅 SỐ LƯỢT VOTE VẮNG THEO TỪNG THÁNG
        span.head-sub Bấm vào một tháng để xem chi tiết • Tính theo giờ Việt Nam
      select.select(v-model.number="overviewMonths" @change="fetchOverview")
        option(:value="3") 3 tháng
        option(:value="6") 6 tháng
        option(:value="12") 12 tháng

    .loading(v-if="loadingOverview")
      .spinner
      span Đang tải thống kê theo tháng...

    .month-bars(v-else-if="overview.length")
      button.month-bar(
        v-for="m in overview"
        :key="m.month"
        :class="{ active: m.month === selectedMonth }"
        @click="selectMonth(m.month)"
        :title="`${m.monthLabel}: ${m.totalAbsentVotes} lượt vắng / ${m.totalEvents} trận`"
      )
        span.bar-value {{ m.totalAbsentVotes }}
        .bar-track
          .bar-fill(:style="{ height: barHeight(m.totalAbsentVotes) + '%' }")
        span.bar-label {{ shortLabel(m.month) }}
        span.bar-flags
          span.flag-warn(v-if="m.warningCount") ⚠️{{ m.warningCount }}
          span.flag-danger(v-if="m.dangerCount") 🚨{{ m.dangerCount }}

  //- Chi tiết tháng đang chọn
  .card
    .card-head
      .head-title
        h3 🗓️ CHI TIẾT {{ detail ? detail.monthLabel.toUpperCase() : '' }}
        span.head-sub ⚠️ Nhắc nhở: vắng {{ WARN }} buổi • 🚨 Cảnh cáo: vắng từ {{ DANGER }} buổi
      .month-nav
        button.nav-btn(@click="selectMonth(shift(selectedMonth, -1))" title="Tháng trước") ◀
        input.select(type="month" v-model="monthInput" @change="onMonthInput")
        button.nav-btn(@click="selectMonth(shift(selectedMonth, 1))" :disabled="selectedMonth >= thisMonth" title="Tháng sau") ▶

    .loading(v-if="loadingDetail")
      .spinner
      span Đang tải chi tiết tháng...

    template(v-else-if="detail")
      .metrics
        .metric
          span.metric-label Số trận trong tháng
          span.metric-val {{ detail.totalEvents }}
        .metric
          span.metric-label Tổng lượt vote Vắng
          span.metric-val.c-amber {{ detail.totalAbsentVotes }}
          span.metric-sub {{ detail.membersWithAbsence }} đệ tử
        .metric
          span.metric-label ⚠️ Nhắc nhở ({{ WARN }} buổi)
          span.metric-val.c-amber {{ detail.warningCount }}
        .metric
          span.metric-label 🚨 Cảnh cáo (≥{{ DANGER }} buổi)
          span.metric-val.c-red {{ detail.dangerCount }}

      //- Đệ tử cần lưu ý
      h4.section-title(v-if="flagged.length") 📌 ĐỆ TỬ VẮNG TỪ {{ WARN }} BUỔI TRỞ LÊN ({{ flagged.length }})
      .flag-list(v-if="flagged.length")
        .flag-card(v-for="m in flagged" :key="m.userId" :class="`lvl-${m.level}`")
          .flag-top
            img.avatar(:src="avatarOf(m)" :alt="m.displayName")
            .who
              span.name {{ m.displayName }}
              span.sub {{ m.className }} • @{{ m.username || m.userId }}
            span.level-pill(:class="`pill-${m.level}`") {{ m.level === 'danger' ? '🚨 Cảnh cáo' : '⚠️ Nhắc nhở' }} • {{ m.absentCount }} buổi

          .absent-days
            span.day-chip(v-for="e in m.absentEvents" :key="e.eventId" :title="e.title + (e.reasons.length ? ' — ' + e.reasons.join(' / ') : '')")
              | {{ fmtDay(e.date) }}
              span(v-if="e.reasons.length") 💬
          .extra(v-if="m.unvotedCount || m.noShowCount")
            span(v-if="m.unvotedCount") ⏳ {{ m.unvotedCount }} buổi không vote
            span(v-if="m.noShowCount") 🚨 {{ m.noShowCount }} buổi vote mà không đánh

          .reasons(v-if="m.absentEvents.some((e) => e.reasons.length)")
            p.reason(v-for="e in m.absentEvents.filter((x) => x.reasons.length)" :key="'r' + e.eventId")
              b {{ fmtDay(e.date) }}:
              |  {{ e.reasons.join(' / ') }}

          .note-box
            p.auto-note {{ m.autoNote }}
            template(v-if="editingId === m.userId")
              textarea.note-input(v-model="noteDraft" maxlength="500" rows="2" placeholder="Ghi chú của Đương Gia / Đường Chủ (để trống để xoá)...")
              .note-actions
                button.btn-ghost(@click="editingId = null") Huỷ
                button.btn-primary(@click="saveNote(m)" :disabled="savingNote") {{ savingNote ? 'Đang lưu...' : 'Lưu ghi chú' }}
            template(v-else)
              p.leader-note(v-if="m.leaderNote")
                | 📝 {{ m.leaderNote.content }}
                span.note-meta  — {{ m.leaderNote.updatedBy || 'Quản trị' }}, {{ fmtDay(m.leaderNote.updatedAt) }}
              button.btn-ghost(v-if="authStore.canEdit" @click="startEdit(m)") {{ m.leaderNote ? '✏️ Sửa ghi chú' : '➕ Thêm ghi chú' }}

      .empty(v-else-if="detail.totalEvents")
        span 🎉 Không có đệ tử nào vắng từ {{ WARN }} buổi trở lên trong tháng này.

      //- Bảng toàn bộ
      h4.section-title(v-if="detail.members.length") 📋 TOÀN BỘ ĐỆ TỬ CÓ VẮNG / KHÔNG VOTE ({{ filteredMembers.length }})
      .table-tools(v-if="detail.members.length")
        input.select.search(v-model="search" placeholder="🔍 Tìm tên, võ phái...")
        label.check
          input(type="checkbox" v-model="onlyAbsent")
          |  Chỉ người có vote Vắng
      .table-wrap(v-if="filteredMembers.length")
        table.tbl
          thead
            tr
              th Đệ Tử
              th Võ Phái
              th.c Vote Vắng
              th.c Không Vote
              th Các buổi vắng
              th Ghi chú
          tbody
            tr(v-for="m in filteredMembers" :key="m.userId" :class="m.level ? `row-${m.level}` : ''")
              td
                .user-cell
                  img.avatar.sm(:src="avatarOf(m)" :alt="m.displayName")
                  span.name {{ m.displayName }}
              td
                span.class-txt(:style="{ color: getClassHex(m.className) }") {{ m.className }}
              td.c
                span.count(:class="m.level ? `pill-${m.level}` : (m.absentCount ? 'pill-low' : '')") {{ m.absentCount }}
              td.c {{ m.unvotedCount }}
              td.days {{ m.absentEvents.map((e) => fmtDay(e.date)).join(', ') || '—' }}
              td.note-cell {{ m.leaderNote?.content || m.autoNote || '—' }}

      .empty(v-if="!detail.totalEvents")
        span Tháng này chưa có trận bang chiến nào được ghi nhận.
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import api from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { getClassHex } from '../../theme/classColors';

const authStore = useAuthStore();

const pad2 = (n) => String(n).padStart(2, '0');
const toKey = (d) => {
  const vn = new Date(d.getTime() + 7 * 3600 * 1000);
  return `${vn.getUTCFullYear()}-${pad2(vn.getUTCMonth() + 1)}`;
};
const shift = (key, delta) => {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}`;
};
const thisMonth = toKey(new Date());

const overview = ref([]);
const overviewMonths = ref(6);
const loadingOverview = ref(false);

const selectedMonth = ref(thisMonth);
const monthInput = ref(thisMonth);
const detail = ref(null);
const loadingDetail = ref(false);

const search = ref('');
const onlyAbsent = ref(true);

const editingId = ref(null);
const noteDraft = ref('');
const savingNote = ref(false);

const WARN = computed(() => detail.value?.thresholds?.warning ?? 3);
const DANGER = computed(() => detail.value?.thresholds?.danger ?? 4);

const flagged = computed(() => (detail.value?.members || []).filter((m) => m.level));

const filteredMembers = computed(() => {
  let list = detail.value?.members || [];
  if (onlyAbsent.value) list = list.filter((m) => m.absentCount > 0);
  const q = search.value.trim().toLowerCase();
  if (q) {
    list = list.filter((m) =>
      [m.displayName, m.username, m.className].some((v) => v && v.toLowerCase().includes(q))
    );
  }
  return list;
});

const maxAbsent = computed(() => Math.max(1, ...overview.value.map((m) => m.totalAbsentVotes)));
const barHeight = (v) => Math.max(3, Math.round((v / maxAbsent.value) * 100));
const shortLabel = (key) => {
  const [y, m] = key.split('-');
  return `T${+m}/${y.slice(2)}`;
};

const fmtDay = (d) =>
  d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }) : '—';

const avatarOf = (m) => {
  if (m.avatar) return m.avatar;
  try {
    return `https://cdn.discordapp.com/embed/avatars/${(BigInt(m.userId) >> 22n) % 6n}.png`;
  } catch {
    return 'https://cdn.discordapp.com/embed/avatars/0.png';
  }
};

const swalTheme = { background: '#12161f', color: '#ffffff' };

async function fetchOverview() {
  loadingOverview.value = true;
  try {
    const res = await api.getAbsenceOverview({ months: overviewMonths.value });
    overview.value = res.data?.data || [];
  } catch (err) {
    console.error('Lỗi tải thống kê vắng theo tháng:', err);
    overview.value = [];
  } finally {
    loadingOverview.value = false;
  }
}

async function fetchDetail() {
  loadingDetail.value = true;
  editingId.value = null;
  try {
    const res = await api.getAbsenceMonth(selectedMonth.value);
    detail.value = res.data?.data || null;
  } catch (err) {
    console.error('Lỗi tải chi tiết vắng tháng:', err);
    detail.value = null;
  } finally {
    loadingDetail.value = false;
  }
}

function selectMonth(key) {
  if (!key || key > thisMonth) return;
  selectedMonth.value = key;
  monthInput.value = key;
  fetchDetail();
}

function onMonthInput() {
  if (monthInput.value) selectMonth(monthInput.value);
}

function startEdit(m) {
  editingId.value = m.userId;
  noteDraft.value = m.leaderNote?.content || '';
}

async function saveNote(m) {
  savingNote.value = true;
  try {
    const res = await api.saveAbsenceNote(selectedMonth.value, m.userId, noteDraft.value);
    m.leaderNote = res.data?.note || null;
    editingId.value = null;
    Swal.fire({ icon: 'success', title: res.data?.message || 'Đã lưu', timer: 1400, showConfirmButton: false, ...swalTheme });
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Lỗi', text: err.response?.data?.message || err.message, ...swalTheme });
  } finally {
    savingNote.value = false;
  }
}

onMounted(() => {
  fetchOverview();
  fetchDetail();
});
</script>

<style lang="stylus" scoped>
.monthly-absence
  display flex
  flex-direction column
  gap 1.5rem

.card
  padding 1.25rem
  border-radius var(--radius-lg, 16px)
  border 1px solid var(--color-border)
  background var(--color-surface)
  box-shadow var(--shadow-sm)
  display flex
  flex-direction column
  gap 1rem

.card-head
  display flex
  flex-wrap wrap
  align-items center
  justify-content space-between
  gap 0.75rem

.head-title
  display flex
  flex-direction column
  gap 0.2rem
  h3
    margin 0
    font-size 0.95rem
    font-weight 800
    letter-spacing 0.03em
    color var(--color-text)
    font-family var(--font-heading)

.head-sub
  font-size 0.72rem
  color var(--color-muted)

.select
  padding 0.45rem 0.7rem
  border-radius var(--radius-sm, 8px)
  border 1px solid var(--color-border)
  background var(--color-bg-subtle)
  color var(--color-text)
  font-size 0.8rem
  font-weight 600

.month-nav
  display flex
  align-items center
  gap 0.4rem

.nav-btn
  padding 0.45rem 0.7rem
  border-radius var(--radius-sm, 8px)
  border 1px solid var(--color-border)
  background var(--shade-1)
  color var(--color-text)
  cursor pointer
  &:disabled
    opacity 0.35
    cursor not-allowed

// Biểu đồ cột theo tháng
.month-bars
  display flex
  gap 0.5rem
  overflow-x auto
  padding-bottom 0.25rem

.month-bar
  flex 1 0 3.5rem
  display flex
  flex-direction column
  align-items center
  gap 0.3rem
  padding 0.5rem 0.25rem
  border-radius var(--radius-md, 12px)
  border 1px solid transparent
  background transparent
  cursor pointer
  color var(--color-text)
  transition all 0.2s ease
  &:hover
    background var(--shade-1)
  &.active
    border-color var(--color-brand)
    background var(--color-brand-subtle)

.bar-value
  font-weight 800
  font-size 0.85rem

.bar-track
  width 1.6rem
  height 7rem
  border-radius 0.5rem
  background var(--color-bg-subtle)
  display flex
  align-items flex-end
  overflow hidden

.bar-fill
  width 100%
  border-radius 0.5rem
  background linear-gradient(180deg, #f59e0b, #ef4444)
  transition height 0.4s ease

.bar-label
  font-size 0.72rem
  font-weight 700
  color var(--color-muted)

.bar-flags
  display flex
  gap 0.2rem
  font-size 0.65rem
  min-height 1rem

// Chỉ số tháng
.metrics
  display grid
  grid-template-columns repeat(2, 1fr)
  gap 0.75rem

@media (min-width: 768px)
  .metrics
    grid-template-columns repeat(4, 1fr)

.metric
  padding 0.85rem 1rem
  border-radius var(--radius-md, 12px)
  background var(--shade-1)
  border 1px solid var(--color-border-subtle)
  display flex
  flex-direction column
  gap 0.2rem

.metric-label
  font-size 0.7rem
  font-weight 700
  color var(--color-muted)
  text-transform uppercase

.metric-val
  font-size 1.5rem
  font-weight 800
  color var(--color-text)

.metric-sub
  font-size 0.7rem
  color var(--color-muted)

.c-amber
  color #f59e0b
.c-red
  color #ef4444

.section-title
  margin 0.5rem 0 0
  font-size 0.82rem
  font-weight 800
  letter-spacing 0.03em
  color var(--color-brand)

// Thẻ đệ tử cần lưu ý
.flag-list
  display grid
  grid-template-columns 1fr
  gap 0.75rem

@media (min-width: 900px)
  .flag-list
    grid-template-columns 1fr 1fr

.flag-card
  padding 0.9rem 1rem
  border-radius var(--radius-md, 12px)
  border 1px solid var(--color-border)
  border-left-width 4px
  background var(--shade-1)
  display flex
  flex-direction column
  gap 0.6rem
  &.lvl-warning
    border-left-color #f59e0b
  &.lvl-danger
    border-left-color #ef4444
    background rgba(239, 68, 68, 0.06)

.flag-top
  display flex
  align-items center
  gap 0.65rem

.avatar
  width 2.4rem
  height 2.4rem
  border-radius 50%
  object-fit cover
  flex-shrink 0
  &.sm
    width 1.8rem
    height 1.8rem

.who
  display flex
  flex-direction column
  min-width 0
  flex 1

.name
  font-weight 700
  font-size 0.88rem
  color var(--color-text)

.sub
  font-size 0.7rem
  color var(--color-muted)
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

.level-pill, .count
  padding 0.2rem 0.6rem
  border-radius 999px
  font-size 0.72rem
  font-weight 800
  white-space nowrap

.pill-warning
  background rgba(245, 158, 11, 0.15)
  color #f59e0b
.pill-danger
  background rgba(239, 68, 68, 0.15)
  color #ef4444
.pill-low
  background var(--shade-2)
  color var(--color-text)

.absent-days
  display flex
  flex-wrap wrap
  gap 0.35rem

.day-chip
  padding 0.15rem 0.5rem
  border-radius 999px
  border 1px solid var(--color-border)
  font-size 0.7rem
  font-weight 600
  color var(--color-text-secondary)

.extra
  display flex
  flex-wrap wrap
  gap 0.75rem
  font-size 0.72rem
  color var(--color-muted)

.reasons
  display flex
  flex-direction column
  gap 0.2rem
  .reason
    margin 0
    font-size 0.75rem
    color var(--color-text-secondary)

.note-box
  display flex
  flex-direction column
  gap 0.4rem
  padding-top 0.5rem
  border-top 1px dashed var(--color-border)

.auto-note
  margin 0
  font-size 0.75rem
  color var(--color-muted)

.leader-note
  margin 0
  font-size 0.8rem
  font-weight 600
  color var(--color-text)

.note-meta
  font-weight 400
  font-size 0.7rem
  color var(--color-muted)

.note-input
  width 100%
  box-sizing border-box
  padding 0.5rem 0.65rem
  border-radius var(--radius-sm, 8px)
  border 1px solid var(--color-border)
  background var(--color-bg-subtle)
  color var(--color-text)
  font-size 0.8rem
  font-family inherit
  resize vertical

.note-actions
  display flex
  justify-content flex-end
  gap 0.5rem

.btn-ghost, .btn-primary
  align-self flex-start
  padding 0.35rem 0.8rem
  border-radius var(--radius-sm, 8px)
  font-size 0.72rem
  font-weight 700
  cursor pointer

.btn-ghost
  border 1px solid var(--color-border)
  background transparent
  color var(--color-text)
  &:hover
    background var(--shade-2)

.btn-primary
  border 1px solid transparent
  background var(--color-brand)
  color var(--color-on-brand, #000)
  &:disabled
    opacity 0.6

// Bảng toàn bộ
.table-tools
  display flex
  flex-wrap wrap
  align-items center
  gap 0.75rem
  .search
    flex 1 1 14rem

.check
  font-size 0.78rem
  color var(--color-text-secondary)
  display flex
  align-items center
  gap 0.3rem
  cursor pointer

.table-wrap
  overflow-x auto

.tbl
  width 100%
  border-collapse collapse
  font-size 0.8rem
  th
    text-align left
    padding 0.6rem 0.5rem
    font-size 0.68rem
    text-transform uppercase
    letter-spacing 0.04em
    color var(--color-muted)
    border-bottom 1px solid var(--color-border)
    white-space nowrap
  td
    padding 0.55rem 0.5rem
    border-bottom 1px solid var(--color-border-subtle)
    color var(--color-text)
    vertical-align middle
  .c
    text-align center
  tr.row-warning td
    background rgba(245, 158, 11, 0.05)
  tr.row-danger td
    background rgba(239, 68, 68, 0.07)

.user-cell
  display flex
  align-items center
  gap 0.5rem
  white-space nowrap

.class-txt
  font-weight 700
  white-space nowrap

.days
  font-size 0.72rem
  color var(--color-text-secondary)

.note-cell
  font-size 0.72rem
  color var(--color-text-secondary)
  min-width 12rem

.loading, .empty
  display flex
  align-items center
  justify-content center
  gap 0.6rem
  padding 1.5rem
  font-size 0.82rem
  color var(--color-muted)

.spinner
  width 1.2rem
  height 1.2rem
  border 2px solid var(--color-border)
  border-top-color var(--color-brand)
  border-radius 50%
  animation spin 0.8s linear infinite

@keyframes spin
  to
    transform rotate(360deg)
</style>
