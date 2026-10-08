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
      p.header-subtitle Báo cáo tham chiến, phân bổ điểm công tội và bảng xếp hạng bang chúng

    .header-nav-actions
      .view-tabs
        button.tab-btn(
          :class="{ active: currentTab === 'event' }"
          @click="currentTab = 'event'"
        ) ⚔️ Trận Đang Chọn
        button.tab-btn(
          :class="{ active: currentTab === 'leaderboard' }"
          @click="currentTab = 'leaderboard'"
        ) 🏆 Bảng Xếp Hạng Tổng Điểm
      RouterLink.btn-lineup-link(to="/lineup") Thiên Thư Trận Phái ➔

  //- TAB 1: THỐNG KÊ THEO TRẬN ĐANG CHỌN
  template(v-if="currentTab === 'event'")
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
        span.metric-label Đệ Tử Cáo Bận Trận Này
        .metric-val.val-red {{ store.totalBusyCount }} đệ tử
        span.metric-sub.sub-red Danh sách đệ tử không thể xuất trận

      .metric-card
        span.metric-label Tỷ Lệ Lấp Đầy Trận Đồ
        .metric-val.val-blue {{ fillRatio }}%
        span.metric-sub.sub-blue Ma trận sẵn sàng nghênh chiến

    //- Absent Members Detail Section for Current Event
    .absent-section(v-if="store.absentUsers && store.absentUsers.length > 0")
      .absent-section-header
        h3.absent-title 🚫 ĐỆ TỬ BÁO VẮNG TRẬN NÀY ({{ store.absentUsers.length }} NGƯỜI)
        button.btn-view-all-absent(@click="currentTab = 'leaderboard'") Xem Bảng Xếp Hạng Tổng ➔
      .absent-grid
        .absent-card(v-for="user in store.absentUsers" :key="user.userId || user.id")
          .absent-avatar {{ (user.displayName || user.username || 'B').charAt(0) }}
          .absent-info
            span.absent-name {{ user.displayName || user.username }}
            span.absent-reason {{ user.reason || user.note || 'Cáo bận không thể tham chiến' }}

    //- No-Show Management Section (Đánh Dấu Vote Mà Không Đánh -3 Điểm)
    .noshow-section
      .noshow-header
        .noshow-title-group
          h3.noshow-title ⚖️ ĐIỂM DANH THỰC TẾ & XỬ PHẠT "VOTE MÀ KHÔNG ĐÁNH" (-3 ĐIỂM)
          p.noshow-desc(v-if="authStore.canEdit") Quản trị viên bấm nút xử phạt đối với thành viên vote đi nhưng thực tế không vào tham chiến.
          p.noshow-desc(v-else) Danh sách đệ tử đã đăng ký tham chiến trận này.

        .noshow-stat-badge
          span.badge-highlight {{ noShowAttendeesCount }}
          span / {{ activeAttendees.length }} người bị đánh dấu bỏ trận

      .attendees-table-wrap(v-if="activeAttendees.length > 0")
        table.attendees-table
          thead
            tr
              th Đệ Tử Tham Chiến
              th Võ Phái
              th.th-center Trạng Thái Vote
              th.th-center Trạng Thái Thực Tế
              th.th-right(v-if="authStore.canEdit") Thẩm Quyền Xử Phạt
          tbody
            tr(
              v-for="user in activeAttendees"
              :key="user.userId"
              :class="{ 'row-noshow': user.noShow }"
            )
              td
                .user-cell
                  img.user-avatar(:src="getMemberAvatarUrl(user)" :alt="user.displayName")
                  .user-info
                    span.user-name {{ user.displayName || user.username }}
                    span.user-sub @{{ user.username }}

              td
                span.class-pill(
                  :style="{ borderColor: getClassHex(user.className), color: getClassHex(user.className), backgroundColor: `${getClassHex(user.className)}15` }"
                )
                  img.pill-icon(v-if="getClassIcon(user.className)" :src="getClassIcon(user.className)")
                  span {{ user.className || 'Chưa rõ' }}

              td.td-center
                span.vote-pill(:class="`pill-${user.status}`") {{ getStatusLabel(user.status) }}

              td.td-center
                span.real-status-pill(v-if="user.noShow")
                  span.pill-danger-tag 🚨 BỎ TRẬN (-3đ)
                span.real-status-pill(v-else)
                  span.pill-success-tag ⚔️ Có Đánh (+1đ)

              td.td-right(v-if="authStore.canEdit")
                button.btn-toggle-noshow(
                  v-if="!user.noShow"
                  @click="handleToggleNoShow(user, true)"
                  title="Đánh dấu đệ tử này VOTE MÀ KHÔNG ĐÁNH (-3 điểm)"
                ) ⚠️ Phạt Không Đánh (-3đ)
                button.btn-cancel-noshow(
                  v-else
                  @click="handleToggleNoShow(user, false)"
                  title="Hủy đánh dấu bỏ trận"
                ) ✓ Đã Phạt (Bấm Hủy)

      .empty-attendees(v-else)
        p Chưa có dữ liệu điểm danh nào trong sự kiện này.

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

  //- TAB 2: BẢNG XẾP HẠNG TỔNG ĐIỂM (DUAL RANKING: CAO ➔ THẤP & THẤP ➔ CAO)
  template(v-else-if="currentTab === 'leaderboard'")
    //- Ranking Mode Switcher Bar (Cao -> Thấp vs Thấp -> Cao)
    .ranking-mode-card
      .mode-toggle-group
        button.mode-btn.btn-vinh-danh(
          :class="{ active: rankingMode === 'highToLow' }"
          @click="rankingMode = 'highToLow'"
        )
          span.mode-icon 🌟
          .mode-info
            span.mode-title BẢNG VINH DANH (ĐIỂM CAO ➔ THẤP)
            span.mode-sub Xếp hạng đệ tử tích cực & chuyên cần nhất

        button.mode-btn.btn-phong-than(
          :class="{ active: rankingMode === 'lowToHigh' }"
          @click="rankingMode = 'lowToHigh'"
        )
          span.mode-icon 🚨
          .mode-info
            span.mode-title BẢNG XỬ PHẠT (ĐIỂM THẤP ➔ CAO)
            span.mode-sub Xếp hạng đệ tử vắng nhiều & điểm âm cần cải thiện

    //- Rules of Points Box
    .rules-card
      .rules-header
        span.rules-icon ⚖️
        h3.rules-title CÔNG THỨC TÍNH ĐIỂM CÔNG TỘI BANG CHIẾN
      .rules-grid
        .rule-item.rule-add
          .rule-badge +1.0 đ
          .rule-text
            strong Vote Đánh / Dự Bị
            span Có mặt cống hiến (+1 điểm/trận)
        .rule-item.rule-sub-half
          .rule-badge -0.5 đ
          .rule-text
            strong Báo Vắng
            span Báo bận đúng quy định (-0.5 điểm/trận)
        .rule-item.rule-sub-two
          .rule-badge -2.0 đ
          .rule-text
            strong Không Vote
            span Không tham gia vote (-2 điểm/trận)
        .rule-item.rule-sub-three
          .rule-badge -3.0 đ
          .rule-text
            strong Vote Không Đánh
            span Đăng ký nhưng bỏ trận (-3 điểm/trận)

    //- Top Overview Cards
    .absent-overview-grid
      .overview-card(
        :class="rankingMode === 'highToLow' ? 'card-success' : 'card-danger'"
      )
        .overview-icon {{ rankingMode === 'highToLow' ? '👑' : '🚨' }}
        .overview-meta
          span.overview-label {{ rankingMode === 'highToLow' ? 'Đại Công Thần (Điểm Cao Nhất)' : 'Điểm Thấp Nhất (Cần Nhắc Nhở)' }}
          .overview-val {{ featuredMember ? featuredMember.displayName : 'Chưa có dữ liệu' }}
          span.overview-sub(v-if="featuredMember") Tổng điểm: {{ featuredMember.reputationScore > 0 ? '+' : '' }}{{ featuredMember.reputationScore }} đ (Tham chiến: {{ featuredMember.attendedCount }} • Vắng: {{ featuredMember.totalAbsentCount }} trận)
          span.overview-sub(v-else) Chưa ghi nhận lượt điểm danh nào

      .overview-card.card-warning
        .overview-icon 📊
        .overview-meta
          span.overview-label Tổng Sự Kiện Xét Duyệt
          .overview-val {{ totalEventsRecorded }} sự kiện
          span.overview-sub Tổng số lượt báo vắng + bỏ trận: {{ totalGuildAbsences }} lượt

      .overview-card.card-info
        .overview-icon 👥
        .overview-meta
          span.overview-label Tổng Số Đệ Tử Xếp Hạng
          .overview-val {{ absentRankings.length }} đệ tử
          span.overview-sub ({{ highScorersCount }} đệ tử điểm dương • {{ lowScorersCount }} đệ tử điểm âm)

    //- Podium Top 3 (Thích ứng theo chế độ Cao -> Thấp hoặc Thấp -> Cao)
    .podium-container(v-if="podiumMembers.length > 0")
      h3.section-heading {{ rankingMode === 'highToLow' ? '🌟 TOP 3 ĐẠI CÔNG THẦN BANG HỘI (ĐIỂM CAO NHẤT)' : '🚨 TOP 3 ĐỆ TỬ CẦN CẢI THIỆN CHUYÊN CẦN (ĐIỂM THẤP NHẤT)' }}
      .podium-grid
        //- Rank 2 (Silver - Left)
        .podium-card.podium-silver(v-if="podiumMembers[1]")
          .podium-crown 🥈
          .podium-avatar-wrapper
            img.podium-avatar(:src="getMemberAvatarUrl(podiumMembers[1])" :alt="podiumMembers[1].displayName")
            span.podium-rank-badge #2
          .podium-info
            span.podium-name {{ podiumMembers[1].displayName }}
            span.podium-class(:style="{ color: getClassHex(podiumMembers[1].className) }") {{ podiumMembers[1].className }}
            .score-pill(:class="podiumMembers[1].reputationScore >= 0 ? 'score-positive' : 'score-negative'")
              span.score-val {{ podiumMembers[1].reputationScore > 0 ? '+' : '' }}{{ podiumMembers[1].reputationScore }}
              span.score-unit điểm
            span.podium-rate-breakdown ⚔️ {{ podiumMembers[1].attendedCount }} đánh • 🚫 {{ podiumMembers[1].totalAbsentCount }} vắng
            span.podium-rate Tỷ lệ vắng: {{ podiumMembers[1].absenceRate }}%

        //- Rank 1 (Gold - Center)
        .podium-card.podium-gold(v-if="podiumMembers[0]")
          .podium-crown {{ rankingMode === 'highToLow' ? '👑' : '⚠️' }}
          .podium-avatar-wrapper
            img.podium-avatar(:src="getMemberAvatarUrl(podiumMembers[0])" :alt="podiumMembers[0].displayName")
            span.podium-rank-badge #1
          .podium-info
            span.podium-name {{ podiumMembers[0].displayName }}
            span.podium-class(:style="{ color: getClassHex(podiumMembers[0].className) }") {{ podiumMembers[0].className }}
            .score-pill.gold-score(:class="podiumMembers[0].reputationScore >= 0 ? 'score-positive' : 'score-negative'")
              span.score-val {{ podiumMembers[0].reputationScore > 0 ? '+' : '' }}{{ podiumMembers[0].reputationScore }}
              span.score-unit điểm
            span.podium-rate-breakdown ⚔️ {{ podiumMembers[0].attendedCount }} đánh • 🚫 {{ podiumMembers[0].totalAbsentCount }} vắng
            span.podium-rate Tỷ lệ vắng: {{ podiumMembers[0].absenceRate }}%

        //- Rank 3 (Bronze - Right)
        .podium-card.podium-bronze(v-if="podiumMembers[2]")
          .podium-crown 🥉
          .podium-avatar-wrapper
            img.podium-avatar(:src="getMemberAvatarUrl(podiumMembers[2])" :alt="podiumMembers[2].displayName")
            span.podium-rank-badge #3
          .podium-info
            span.podium-name {{ podiumMembers[2].displayName }}
            span.podium-class(:style="{ color: getClassHex(podiumMembers[2].className) }") {{ podiumMembers[2].className }}
            .score-pill(:class="podiumMembers[2].reputationScore >= 0 ? 'score-positive' : 'score-negative'")
              span.score-val {{ podiumMembers[2].reputationScore > 0 ? '+' : '' }}{{ podiumMembers[2].reputationScore }}
              span.score-unit điểm
            span.podium-rate-breakdown ⚔️ {{ podiumMembers[2].attendedCount }} đánh • 🚫 {{ podiumMembers[2].totalAbsentCount }} vắng
            span.podium-rate Tỷ lệ vắng: {{ podiumMembers[2].absenceRate }}%

    //- Controls & Filters Bar
    .leaderboard-controls
      .controls-left
        .search-box
          span.search-icon 🔍
          input.search-input(
            v-model="searchQuery"
            type="text"
            placeholder="Tìm tên đệ tử, võ phái..."
          )

        .filter-group
          label.filter-label Môn phái:
          select.filter-select(v-model="selectedClassFilter")
            option(value="all") Tất cả môn phái
            option(v-for="c in CLASS_LIST" :key="c.name" :value="c.name") {{ c.name }}

      .controls-right
        .filter-group
          label.filter-label Thời gian:
          select.filter-select(v-model="timeRangeFilter" @change="fetchAbsentRankings")
            option(value="all") Tất cả các mùa
            option(value="30") 30 ngày gần nhất
            option(value="60") 60 ngày gần nhất
            option(value="90") 90 ngày gần nhất

        .filter-group
          label.filter-label Xếp theo:
          select.filter-select(v-model="rankingMode")
            option(value="highToLow") 🌟 Điểm Cao ➔ Thấp (Vinh Danh)
            option(value="lowToHigh") 🚨 Điểm Thấp ➔ Cao (Xử Phạt)

    //- Leaderboard Table
    .leaderboard-table-card
      .table-card-header
        .table-title-group
          h3.table-heading 📜 {{ rankingMode === 'highToLow' ? 'BẢNG VINH DANH CÔNG THẦN (TỪ CAO TỚI THẤP)' : 'BẢNG PHONG THẦN XỬ PHẠT (TỪ THẤP TỚI CAO)' }} ({{ filteredRankings.length }} ĐỆ TỬ)
          span.table-subtitle (+1đ đánh/dự bị) • (-0.5đ báo vắng) • (-2đ không vote) • (-3đ vote bỏ trận)

        .badge-mode-indicator(:class="rankingMode === 'highToLow' ? 'ind-high' : 'ind-low'")
          span {{ rankingMode === 'highToLow' ? '📈 Đang xếp: Điểm Cao ➔ Thấp' : '📉 Đang xếp: Điểm Thấp ➔ Cao' }}

      .table-responsive(v-if="!loadingRankings && filteredRankings.length > 0")
        table.leaderboard-table
          thead
            tr
              th.th-center Thứ Hạng
              th Đệ Tử
              th Võ Phái
              th.th-center Tổng Điểm
              th.th-center Tham Chiến
              th.th-center Tổng Vắng
              th.th-center Chi Tiết Điểm Công Tội
              th Tỷ Lệ Vắng
              th.th-center Đánh Giá
          tbody
            tr(
              v-for="(member, index) in filteredRankings"
              :key="member.userId"
              :class="{ 'row-top-1': index === 0, 'row-top-2': index === 1, 'row-top-3': index === 2 }"
            )
              //- Rank Column
              td.td-center
                .rank-badge(
                  :class="{ 'rank-1': index === 0, 'rank-2': index === 1, 'rank-3': index === 2, 'rank-other': index > 2 }"
                )
                  span(v-if="index === 0") 🥇 1
                  span(v-else-if="index === 1") 🥈 2
                  span(v-else-if="index === 2") 🥉 3
                  span(v-else) # {{ index + 1 }}

              //- Member Column
              td
                .user-cell
                  img.user-avatar(:src="getMemberAvatarUrl(member)" :alt="member.displayName")
                  .user-info
                    span.user-name {{ member.displayName }}
                    span.user-sub @{{ member.username || member.userId }}

              //- Class Column
              td
                span.class-pill(
                  :style="{ borderColor: getClassHex(member.className), color: getClassHex(member.className), backgroundColor: `${getClassHex(member.className)}15` }"
                )
                  img.pill-icon(v-if="getClassIcon(member.className)" :src="getClassIcon(member.className)")
                  span {{ member.className }}

              //- Reputation Score Column
              td.td-center
                .table-score-pill(:class="member.reputationScore >= 0 ? 'score-pos' : 'score-neg'")
                  span.score-num {{ member.reputationScore > 0 ? '+' : '' }}{{ member.reputationScore }}
                  span.score-unit đ

              //- Attended Count Column
              td.td-center
                span.attendance-ratio {{ member.attendedCount || 0 }} / {{ member.totalEvents || totalEventsRecorded }} trận

              //- Total Absent Count Column
              td.td-center
                span.absent-count-badge
                  span.badge-num {{ member.totalAbsentCount }}
                  span.badge-txt trận

              //- Breakdown of Score
              td.td-center
                .breakdown-box
                  .breakdown-row
                    span.breakdown-item.item-green(title="Đã vote đánh/dự bị: +1 điểm/trận") ⚔️ {{ member.attendedCount }} đánh (+{{ member.attendedCount }}đ)
                    span.breakdown-item.item-half(title="Báo vắng: -0.5 điểm/trận") 🟡 {{ member.explicitAbsentCount }} vắng (-{{ member.explicitAbsentCount * 0.5 }}đ)
                  .breakdown-row
                    span.breakdown-item.item-amber(title="Không tham gia vote: -2 điểm/trận") ⏳ {{ member.unvotedCount }} không vote (-{{ member.unvotedCount * 2 }}đ)
                    span.breakdown-item.item-noshow(v-if="member.noShowCount > 0" title="Vote mà không đánh: -3 điểm/trận") 🚨 {{ member.noShowCount }} bỏ trận (-{{ member.noShowCount * 3 }}đ)

              //- Absence Rate Column
              td
                .rate-cell
                  .rate-bar-track
                    .rate-bar-fill(
                      :style="{ width: `${member.absenceRate}%`, backgroundColor: getRateColor(member.absenceRate) }"
                    )
                  span.rate-text(:style="{ color: getRateColor(member.absenceRate) }") {{ member.absenceRate }}%

              //- Status Evaluation Badge
              td.td-center
                span.eval-pill(:class="getEvalClass(member.reputationScore, member.totalAbsentCount)") {{ getEvalText(member.reputationScore, member.totalAbsentCount) }}

      //- Loading State
      .loading-state(v-else-if="loadingRankings")
        .spinner
        p.loading-text Đang tính toán điểm công tội và xếp hạng...

      //- Empty State
      .empty-state(v-else)
        span.empty-icon 🎉
        h4.empty-title Không có dữ liệu đệ tử trong bộ lọc
        p.empty-desc Hãy thử chọn mốc thời gian khác hoặc xóa từ khóa tìm kiếm.
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useLineupStore } from '../stores/lineupStore';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { CLASS_LIST, getClassHex, getClassIcon } from '../theme/classColors';
import api from '../services/api';
import Swal from 'sweetalert2';

const store = useLineupStore();
const authStore = useAuthStore();
const themeStore = useThemeStore();

// Tab state: 'event' hoặc 'leaderboard'
const currentTab = ref('event');
const selectedMessageId = ref('');

// Ranking Mode: 'highToLow' (Cao -> Thấp) hoặc 'lowToHigh' (Thấp -> Cao)
const rankingMode = ref('highToLow');

// Event attendees for No-Show management
const eventAttendees = ref([]);

// Leaderboard state
const absentRankings = ref([]);
const totalEventsRecorded = ref(0);
const loadingRankings = ref(false);
const searchQuery = ref('');
const selectedClassFilter = ref('all');
const timeRangeFilter = ref('all');

const currentEventTitle = computed(() => {
  if (!selectedMessageId.value || !store.events) return store.title || 'Công Thành Chiến';
  const found = store.events.find((e) => e.messageId === selectedMessageId.value);
  return found ? (found.name || found.title) : (store.title || 'Công Thành Chiến');
});

const activeAttendees = computed(() => {
  return eventAttendees.value.filter((a) => ['present', 'bench', 'late'].includes(a.status));
});

const noShowAttendeesCount = computed(() => {
  return activeAttendees.value.filter((a) => a.noShow).length;
});

const handleEventChange = async () => {
  if (selectedMessageId.value) {
    store.fetchEventData(selectedMessageId.value);
    await fetchEventAttendees(selectedMessageId.value);
  }
};

const fetchEventAttendees = async (eventId) => {
  if (!eventId) return;
  try {
    const res = await api.getAttendance(eventId);
    eventAttendees.value = res.data || [];
  } catch (err) {
    console.error('Lỗi khi tải danh sách điểm danh event:', err);
    eventAttendees.value = [];
  }
};

const handleToggleNoShow = async (user, noShow) => {
  if (!authStore.canEdit) {
    Swal.fire({
      icon: 'warning',
      title: 'Không có quyền',
      text: 'Chỉ có Đương Gia hoặc Đường Chủ mới có quyền xử phạt bỏ trận!',
      background: '#12161f',
      color: '#ffffff',
    });
    return;
  }

  const actionText = noShow ? 'xử phạt ĐÁNH DẤU BỎ TRẬN (-3 ĐIỂM)' : 'hủy xử phạt bỏ trận';
  const confirmRes = await Swal.fire({
    title: 'Xác nhận xử phạt',
    html: `Bạn có chắc muốn <b>${actionText}</b> đối với đệ tử <b>${user.displayName || user.username}</b>?`,
    icon: noShow ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonColor: noShow ? '#ef4444' : '#3b82f6',
    cancelButtonColor: '#475569',
    confirmButtonText: noShow ? 'Xác nhận phạt (-3đ)' : 'Hủy phạt',
    cancelButtonText: 'Đóng',
    background: '#12161f',
    color: '#ffffff',
  });

  if (!confirmRes.isConfirmed) return;

  try {
    const res = await api.toggleNoShow(selectedMessageId.value, {
      userId: user.userId,
      noShow: noShow,
      updatedBy: authStore.user?.nickname || authStore.user?.username || 'Quản Trị Viên',
    });

    if (res.data && res.data.success) {
      user.noShow = noShow;
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: res.data.message,
        timer: 1600,
        showConfirmButton: false,
        background: '#12161f',
        color: '#e0b854',
      });
      fetchAbsentRankings();
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: err.response?.data?.message || err.message,
      background: '#12161f',
      color: '#ffffff',
    });
  }
};

const fetchAbsentRankings = async () => {
  loadingRankings.value = true;
  try {
    const params = {};
    if (timeRangeFilter.value !== 'all') {
      params.days = timeRangeFilter.value;
    }
    const response = await api.getAbsentRankings(params);
    absentRankings.value = response.data?.data || [];
    totalEventsRecorded.value = response.data?.totalEvents || 0;
  } catch (error) {
    console.error('Lỗi khi tải bảng xếp hạng vắng mặt:', error);
    absentRankings.value = [];
  } finally {
    loadingRankings.value = false;
  }
};

onMounted(async () => {
  await store.fetchEventsList();

  if (store.events && store.events.length > 0) {
    selectedMessageId.value = store.events[0].messageId;
    store.fetchEventData(selectedMessageId.value);
    await fetchEventAttendees(selectedMessageId.value);
  }

  await fetchAbsentRankings();
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

// ── LEADERBOARD COMPUTED PROPERTIES ──────────────────────────────────────────

const totalGuildAbsences = computed(() => {
  return absentRankings.value.reduce((sum, m) => sum + (m.totalAbsentCount || 0), 0);
});

const highScorersCount = computed(() => {
  return absentRankings.value.filter((m) => (m.reputationScore || 0) > 0).length;
});

const lowScorersCount = computed(() => {
  return absentRankings.value.filter((m) => (m.reputationScore || 0) < 0).length;
});

const filteredRankings = computed(() => {
  let list = [...absentRankings.value];

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    list = list.filter(
      (m) =>
        (m.displayName && m.displayName.toLowerCase().includes(q)) ||
        (m.username && m.username.toLowerCase().includes(q)) ||
        (m.className && m.className.toLowerCase().includes(q))
    );
  }

  // Class filter
  if (selectedClassFilter.value !== 'all') {
    list = list.filter((m) => m.className === selectedClassFilter.value);
  }

  // Sort by Ranking Mode
  if (rankingMode.value === 'highToLow') {
    // Cao tới Thấp (Vinh Danh)
    list.sort((a, b) => {
      return (
        (b.reputationScore || 0) - (a.reputationScore || 0) ||
        (b.attendedCount || 0) - (a.attendedCount || 0) ||
        (a.totalAbsentCount || 0) - (b.totalAbsentCount || 0)
      );
    });
  } else {
    // Thấp tới Cao (Xử Phạt)
    list.sort((a, b) => {
      return (
        (a.reputationScore || 0) - (b.reputationScore || 0) ||
        (b.totalAbsentCount || 0) - (a.totalAbsentCount || 0) ||
        (b.noShowCount || 0) - (a.noShowCount || 0)
      );
    });
  }

  return list;
});

const featuredMember = computed(() => {
  if (!filteredRankings.value || filteredRankings.value.length === 0) return null;
  return filteredRankings.value[0] || null;
});

const podiumMembers = computed(() => {
  return filteredRankings.value.slice(0, 3);
});

// Helper functions
const getMemberAvatarUrl = (member) => {
  if (member.avatar) return member.avatar;
  if (member.userId) {
    return `https://cdn.discordapp.com/embed/avatars/${(BigInt(member.userId) >> 22n) % 6n}.png`;
  }
  return 'https://cdn.discordapp.com/embed/avatars/0.png';
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'present': return '⚔️ Có Mặt';
    case 'bench': return '🪑 Dự Bị';
    case 'late': return '⏰ Đi Muộn';
    case 'absent': return '🚫 Báo Vắng';
    case 'tentative': return '⚖️ Chưa Chắc';
    default: return status || 'Chưa rõ';
  }
};

const getRateColor = (rate) => {
  if (rate >= 60) return '#ef4444'; // Red
  if (rate >= 30) return '#f59e0b'; // Amber
  return '#10b981'; // Green
};

const getEvalClass = (score, totalAbsent) => {
  if (score >= 10 && totalAbsent === 0) return 'eval-gold';
  if (score >= 5 && totalAbsent <= 1) return 'eval-success';
  if (score >= 1) return 'eval-good';
  if (score <= -6 || totalAbsent >= 6) return 'eval-danger';
  if (score < 0 || totalAbsent >= 3) return 'eval-warning';
  return 'eval-caution';
};

const getEvalText = (score, totalAbsent) => {
  if (score >= 10 && totalAbsent === 0) return '👑 Đại Công Thần';
  if (score >= 5 && totalAbsent <= 1) return '🌟 Rất Chuyên Cần';
  if (score >= 1) return '✨ Chuyên Cần Khá';
  if (score <= -6 || totalAbsent >= 6) return '🚨 Phạt Nặng / Báo Động';
  if (score < 0) return '⚠️ Điểm Âm (Cần Cải Thiện)';
  return '⏳ Trung Bình';
};
</script>

<style lang="stylus" scoped>
.stats-container
  position relative
  min-height calc(100vh - 57px)
  padding 1.5rem
  max-width 80rem
  margin 1rem auto
  font-family var(--font-body, system-ui, sans-serif)
  user-select none
  display flex
  flex-direction column
  gap 1.5rem

// Header & Tabs
.stats-header
  padding 1.25rem 1.5rem
  border-radius var(--radius-lg, 16px)
  border 1px solid var(--color-border)
  background var(--color-surface)
  box-shadow var(--shadow-sm)
  display flex
  flex-direction column
  gap 1rem

@media (min-width: 768px)
  .stats-header
    flex-direction row
    align-items center
    justify-content space-between

.title-row
  display flex
  align-items center
  gap 0.75rem

.header-icon
  font-size 1.5rem

.header-title
  font-size 1.15rem
  font-weight 800
  letter-spacing 0.03em
  text-transform uppercase
  font-family var(--font-heading)
  margin 0
  color var(--color-text)

.header-subtitle
  font-size 0.7rem
  font-weight 600
  letter-spacing 0.05em
  text-transform uppercase
  margin-top 0.25rem
  color var(--color-brand)

.header-nav-actions
  display flex
  align-items center
  gap 1rem
  flex-wrap wrap

.view-tabs
  display flex
  background rgba(0, 0, 0, 0.2)
  padding 0.25rem
  border-radius var(--radius-md, 12px)
  border 1px solid var(--color-border)
  gap 0.25rem

.tab-btn
  padding 0.5rem 1rem
  border-radius 0.5rem
  border none
  background transparent
  color var(--color-muted)
  font-size 0.75rem
  font-weight 700
  cursor pointer
  transition all 0.2s ease
  &:hover
    color var(--color-text)
  &.active
    background var(--color-brand)
    color #000000
    box-shadow var(--shadow-sm)

.btn-lineup-link
  padding 0.5rem 1.25rem
  border-radius var(--radius-md, 12px)
  background #3b82f6
  color #ffffff
  font-size 0.75rem
  font-weight 700
  border 1px solid transparent
  box-shadow var(--shadow-sm)
  text-decoration none
  transition all 0.2s ease
  &:hover
    background #2563eb
    transform translateY(-1px)
    box-shadow var(--shadow-md)

// Ranking Mode Card Switcher (Cao -> Thap vs Thap -> Cao)
.ranking-mode-card
  padding 0.5rem
  border-radius 1rem
  border 1px solid var(--color-border)
  background var(--color-surface)
  box-shadow var(--shadow-sm)

.mode-toggle-group
  display grid
  grid-template-columns 1fr
  gap 0.5rem

@media (min-width: 640px)
  .mode-toggle-group
    grid-template-columns 1fr 1fr

.mode-btn
  padding 1rem 1.25rem
  border-radius 0.75rem
  border 1px solid transparent
  background rgba(0, 0, 0, 0.15)
  display flex
  align-items center
  gap 1rem
  cursor pointer
  transition all 0.2s ease
  text-align left

  &:hover
    background rgba(0, 0, 0, 0.3)
    transform translateY(-1px)

  &.btn-vinh-danh.active
    border-color #10b981
    background radial-gradient(circle at left, rgba(16, 185, 129, 0.2), transparent 80%), rgba(16, 185, 129, 0.08)
    box-shadow 0 4px 15px rgba(16, 185, 129, 0.15)
    .mode-title
      color #34d399

  &.btn-phong-than.active
    border-color #ef4444
    background radial-gradient(circle at left, rgba(239, 68, 68, 0.2), transparent 80%), rgba(239, 68, 68, 0.08)
    box-shadow 0 4px 15px rgba(239, 68, 68, 0.15)
    .mode-title
      color #f87171

.mode-icon
  font-size 2rem
  flex-shrink 0

.mode-info
  display flex
  flex-direction column

.mode-title
  font-size 0.85rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.05em
  color var(--color-text)

.mode-sub
  font-size 0.65rem
  color var(--color-muted)
  margin-top 0.2rem

// Event Selector
.event-selector-bar
  padding 1.25rem
  border-radius var(--radius-lg, 16px)
  border 1px solid var(--color-border)
  background var(--color-surface)
  display flex
  flex-direction column
  gap 1rem
  box-shadow var(--shadow-sm)

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
  width 2.5rem
  height 2.5rem
  border-radius var(--radius-md, 12px)
  display flex
  align-items center
  justify-content center
  font-size 1.25rem
  background var(--color-brand-subtle)
  border 1px solid var(--color-border)
  color var(--color-brand)

.event-meta
  display flex
  flex-direction column

.event-label
  font-size 0.65rem
  font-weight 700
  text-transform uppercase
  color var(--color-muted)

.event-current-title
  font-size 0.85rem
  font-weight 700
  color var(--color-brand)

.event-select-right
  display flex
  align-items center
  gap 0.5rem
  width 100%

@media (min-width: 640px)
  .event-select-right
    width auto

.select-label
  font-size 0.7rem
  font-weight 600
  color var(--color-text-secondary)
  flex-shrink 0

.event-select
  width 100%
  padding 0.5rem 0.85rem
  border-radius var(--radius-md, 12px)
  border 1px solid var(--color-border)
  font-size 0.8rem
  font-weight 600
  outline none
  cursor pointer
  background var(--color-surface)
  color var(--color-text)

@media (min-width: 640px)
  .event-select
    width 16rem

// Metrics Grid
.metrics-grid
  display grid
  grid-template-columns 1fr
  gap 1.25rem

@media (min-width: 640px)
  .metrics-grid
    grid-template-columns repeat(3, minmax(0, 1fr))

.metric-card
  padding 1.25rem
  border-radius var(--radius-lg, 16px)
  border 1px solid var(--color-border)
  background var(--color-surface)
  box-shadow var(--shadow-sm)

.metric-label
  font-size 0.7rem
  font-weight 700
  text-transform uppercase
  color var(--color-text-secondary)

.metric-val
  font-size 1.85rem
  font-weight 800
  font-family var(--font-heading)
  margin-top 0.5rem

  &.val-gold
    color #f5c518
  &.val-red
    color #ef5757
  &.val-blue
    color #60a5fa

.metric-sub
  font-size 0.7rem
  margin-top 0.25rem
  display block

  &.sub-emerald
    color #34d399
  &.sub-red
    color #ef5757
  &.sub-blue
    color #60a5fa

// No-Show Section
.noshow-section
  padding 1.5rem
  border-radius 1rem
  border 1px solid rgba(239, 68, 68, 0.4)
  background rgba(239, 68, 68, 0.04)
  display flex
  flex-direction column
  gap 1.25rem

.noshow-header
  display flex
  flex-direction column
  gap 0.5rem

@media (min-width: 768px)
  .noshow-header
    flex-direction row
    align-items center
    justify-content space-between

.noshow-title
  font-size 0.85rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.05em
  color #ef4444
  margin 0

.noshow-desc
  font-size 0.7rem
  color var(--color-muted)
  margin 0.2rem 0 0 0

.noshow-stat-badge
  padding 0.35rem 0.85rem
  border-radius 9999px
  background rgba(239, 68, 68, 0.15)
  border 1px solid rgba(239, 68, 68, 0.4)
  font-size 0.75rem
  font-weight 700
  color #ef4444
  align-self flex-start
  .badge-highlight
    font-size 1rem
    font-weight 900
    font-family monospace
    margin-right 0.25rem

.attendees-table-wrap
  width 100%
  overflow-x auto
  border-radius 0.75rem
  border 1px solid var(--color-border)
  background rgba(0, 0, 0, 0.2)

.attendees-table
  width 100%
  border-collapse collapse
  text-align left

  th
    padding 0.75rem 1rem
    font-size 0.65rem
    font-weight 800
    text-transform uppercase
    color var(--color-muted)
    border-bottom 1px solid var(--color-border)
    background rgba(0, 0, 0, 0.2)

  td
    padding 0.75rem 1rem
    font-size 0.8rem
    border-bottom 1px solid var(--color-border)
    vertical-align middle

  tr:last-child td
    border-bottom none

  .row-noshow
    background rgba(239, 68, 68, 0.12)

.th-right, .td-right
  text-align right

.vote-pill
  display inline-block
  padding 0.2rem 0.55rem
  border-radius 0.35rem
  font-size 0.7rem
  font-weight 700

  &.pill-present
    background rgba(16, 185, 129, 0.15)
    color #34d399
    border 1px solid rgba(16, 185, 129, 0.3)
  &.pill-bench
    background rgba(245, 158, 11, 0.15)
    color #fbbf24
    border 1px solid rgba(245, 158, 11, 0.3)
  &.pill-late
    background rgba(59, 130, 246, 0.15)
    color #93c5fd
    border 1px solid rgba(59, 130, 246, 0.3)

.pill-danger-tag
  padding 0.25rem 0.65rem
  border-radius 9999px
  background rgba(239, 68, 68, 0.25)
  border 1px solid #ef4444
  color #f87171
  font-size 0.7rem
  font-weight 800
  animation pulse 2s infinite

.pill-success-tag
  padding 0.25rem 0.65rem
  border-radius 9999px
  background rgba(16, 185, 129, 0.15)
  border 1px solid rgba(16, 185, 129, 0.3)
  color #34d399
  font-size 0.7rem
  font-weight 700

.btn-toggle-noshow
  padding 0.35rem 0.75rem
  border-radius 0.5rem
  background rgba(239, 68, 68, 0.15)
  border 1px solid rgba(239, 68, 68, 0.5)
  color #ef4444
  font-size 0.7rem
  font-weight 700
  cursor pointer
  transition all 0.2s ease
  &:hover
    background #ef4444
    color #ffffff
    transform translateY(-1px)

.btn-cancel-noshow
  padding 0.35rem 0.75rem
  border-radius 0.5rem
  background rgba(16, 185, 129, 0.2)
  border 1px solid rgba(16, 185, 129, 0.5)
  color #34d399
  font-size 0.7rem
  font-weight 700
  cursor pointer
  transition all 0.2s ease
  &:hover
    background rgba(239, 68, 68, 0.2)
    border-color #ef4444
    color #ef4444

// Rules Box
.rules-card
  padding 1.25rem 1.5rem
  border-radius 1rem
  border 1px solid var(--color-border)
  background var(--color-surface)
  display flex
  flex-direction column
  gap 1rem
  box-shadow var(--shadow-sm)

.rules-header
  display flex
  align-items center
  gap 0.65rem

.rules-icon
  font-size 1.25rem

.rules-title
  font-size 0.85rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.05em
  margin 0
  color var(--color-brand)

.rules-grid
  display grid
  grid-template-columns 1fr
  gap 0.75rem

@media (min-width: 640px)
  .rules-grid
    grid-template-columns repeat(2, minmax(0, 1fr))

@media (min-width: 1024px)
  .rules-grid
    grid-template-columns repeat(4, minmax(0, 1fr))

.rule-item
  padding 0.75rem
  border-radius 0.75rem
  border 1px solid var(--color-border)
  background rgba(0, 0, 0, 0.2)
  display flex
  align-items center
  gap 0.75rem

.rule-badge
  padding 0.25rem 0.6rem
  border-radius 0.4rem
  font-size 0.85rem
  font-weight 900
  font-family monospace
  flex-shrink 0

.rule-add
  border-color rgba(16, 185, 129, 0.3)
  .rule-badge
    background rgba(16, 185, 129, 0.2)
    color #34d399
    border 1px solid #10b981

.rule-sub-half
  border-color rgba(245, 158, 11, 0.3)
  .rule-badge
    background rgba(245, 158, 11, 0.2)
    color #fbbf24
    border 1px solid #f59e0b

.rule-sub-two
  border-color rgba(239, 68, 68, 0.4)
  .rule-badge
    background rgba(239, 68, 68, 0.2)
    color #f87171
    border 1px solid #ef4444

.rule-sub-three
  border-color rgba(220, 38, 38, 0.6)
  background rgba(220, 38, 38, 0.08)
  .rule-badge
    background rgba(220, 38, 38, 0.3)
    color #fca5a5
    border 1px solid #dc2626

.rule-text
  display flex
  flex-direction column
  strong
    font-size 0.75rem
    color var(--color-text)
  span
    font-size 0.65rem
    color var(--color-muted)

// Absent Section (Event)
.absent-section
  padding 1.5rem
  border-radius 1rem
  border 1px solid rgba(239, 68, 68, 0.4)
  background rgba(239, 68, 68, 0.05)
  display flex
  flex-direction column
  gap 1rem

.absent-section-header
  display flex
  align-items center
  justify-content space-between

.absent-title
  font-size 0.75rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.05em
  color #ef5757
  margin 0

.btn-view-all-absent
  background transparent
  border none
  color #ef5757
  font-size 0.75rem
  font-weight 700
  cursor pointer
  text-decoration underline
  &:hover
    color #f87171

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
  border 1px solid rgba(239, 68, 68, 0.3)
  background rgba(0, 0, 0, 0.3)
  display flex
  align-items center
  gap 0.75rem

.absent-avatar
  width 2rem
  height 2rem
  border-radius 9999px
  background rgba(239, 68, 68, 0.2)
  border 1px solid #ef5757
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
  color var(--color-text)

.absent-reason
  font-size 0.625rem
  color #fca5a5

// Class stats
.class-stats-card
  padding 1.5rem
  border-radius 1rem
  border 1px solid var(--color-border)
  background var(--color-surface)
  display flex
  flex-direction column
  gap 1.25rem

.class-stats-header
  display flex
  align-items center
  justify-content space-between
  padding-bottom 0.75rem
  border-bottom 1px solid var(--color-border)

.class-stats-title
  font-size 0.875rem
  font-weight 800
  text-transform uppercase
  margin 0
  color var(--color-brand)

.total-assigned-badge
  font-family monospace
  font-size 0.75rem
  font-weight 700
  padding 0.25rem 0.65rem
  border-radius 0.5rem
  background rgba(245, 197, 24, 0.1)
  color #f5c518
  border 1px solid rgba(245, 197, 24, 0.3)

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
  border 1px solid var(--color-border)
  background rgba(0, 0, 0, 0.2)
  display flex
  flex-direction column
  align-items center
  justify-content center

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
  stroke rgba(255, 255, 255, 0.1)
  stroke-width 8
  fill transparent

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
  color var(--color-text)

.chart-text
  font-size 0.6rem
  font-weight 700
  text-transform uppercase
  color var(--color-muted)

.chart-ratio-text
  font-size 0.75rem
  margin-top 0.75rem
  font-weight 600
  color var(--color-text-secondary)

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
  border 1px solid var(--color-border)
  background rgba(0, 0, 0, 0.15)
  display flex
  align-items center
  justify-content space-between

.class-name-left
  display flex
  align-items center
  gap 0.65rem

.class-icon
  width 1.25rem
  height 1.25rem
  object-fit contain

.class-dot
  width 0.625rem
  height 0.625rem
  border-radius 9999px

.class-title
  font-size 0.75rem
  font-weight 700
  color var(--color-text)

.class-bar-right
  display flex
  align-items center
  gap 0.75rem

.progress-track
  width 8rem
  height 0.5rem
  border-radius 9999px
  overflow hidden
  background rgba(255, 255, 255, 0.1)
  display none

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
  background rgba(245, 197, 24, 0.1)
  color #f5c518
  border 1px solid rgba(245, 197, 24, 0.2)
  min-width 70px
  text-align right

// ── LEADERBOARD TAB STYLES ───────────────────────────────────────────────────

.absent-overview-grid
  display grid
  grid-template-columns 1fr
  gap 1.25rem

@media (min-width: 640px)
  .absent-overview-grid
    grid-template-columns repeat(3, minmax(0, 1fr))

.overview-card
  padding 1.25rem
  border-radius var(--radius-lg, 16px)
  border 1px solid var(--color-border)
  background var(--color-surface)
  display flex
  align-items center
  gap 1rem
  box-shadow var(--shadow-sm)

  &.card-success
    border-color rgba(16, 185, 129, 0.4)
    background radial-gradient(circle at top left, rgba(16, 185, 129, 0.12), transparent 70%), var(--color-surface)
  &.card-danger
    border-color rgba(239, 68, 68, 0.4)
    background radial-gradient(circle at top left, rgba(239, 68, 68, 0.12), transparent 70%), var(--color-surface)
  &.card-warning
    border-color rgba(245, 158, 11, 0.4)
    background radial-gradient(circle at top left, rgba(245, 158, 11, 0.12), transparent 70%), var(--color-surface)
  &.card-info
    border-color rgba(59, 130, 246, 0.4)
    background radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 70%), var(--color-surface)

.overview-icon
  font-size 2.25rem
  flex-shrink 0

.overview-meta
  display flex
  flex-direction column

.overview-label
  font-size 0.7rem
  font-weight 700
  text-transform uppercase
  color var(--color-muted)

.overview-val
  font-size 1.35rem
  font-weight 800
  font-family var(--font-heading)
  margin-top 0.25rem
  color var(--color-text)

.overview-sub
  font-size 0.7rem
  color var(--color-text-secondary)
  margin-top 0.2rem

// Podium
.podium-container
  padding 1.5rem
  border-radius 1rem
  border 1px solid var(--color-border)
  background var(--color-surface)
  display flex
  flex-direction column
  gap 1.25rem

.section-heading
  font-size 0.85rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.05em
  margin 0
  color var(--color-brand)
  text-align center

.podium-grid
  display grid
  grid-template-columns 1fr
  gap 1rem
  align-items flex-end
  max-width 50rem
  margin 0 auto
  width 100%

@media (min-width: 640px)
  .podium-grid
    grid-template-columns 1fr 1.15fr 1fr

.podium-card
  padding 1.5rem 1rem
  border-radius 1rem
  border 1px solid var(--color-border)
  background rgba(0, 0, 0, 0.3)
  display flex
  flex-direction column
  align-items center
  text-align center
  position relative
  transition transform 0.2s ease

  &:hover
    transform translateY(-3px)

  &.podium-gold
    border-color #f5c518
    background radial-gradient(circle at top, rgba(245, 197, 24, 0.2), transparent 70%), rgba(20, 24, 36, 0.9)
    box-shadow 0 8px 25px rgba(245, 197, 24, 0.2)
    order 1
    @media (min-width: 640px)
      order 2
      padding-top 2rem

  &.podium-silver
    border-color #94a3b8
    background radial-gradient(circle at top, rgba(148, 163, 184, 0.2), transparent 70%), rgba(20, 24, 36, 0.8)
    order 2
    @media (min-width: 640px)
      order 1

  &.podium-bronze
    border-color #d97706
    background radial-gradient(circle at top, rgba(217, 119, 6, 0.2), transparent 70%), rgba(20, 24, 36, 0.8)
    order 3

.podium-crown
  font-size 1.75rem
  margin-bottom 0.5rem

.podium-avatar-wrapper
  position relative
  width 4rem
  height 4rem
  margin-bottom 0.75rem

.podium-avatar
  width 100%
  height 100%
  border-radius 9999px
  object-fit cover
  border 2px solid var(--color-border)

.podium-rank-badge
  position absolute
  bottom -0.25rem
  right -0.25rem
  width 1.5rem
  height 1.5rem
  border-radius 9999px
  display flex
  align-items center
  justify-content center
  font-size 0.7rem
  font-weight 800
  background #0f172a
  border 1px solid var(--color-border)
  color #ffffff

.podium-name
  font-size 0.95rem
  font-weight 800
  color var(--color-text)

.podium-class
  font-size 0.7rem
  font-weight 700
  margin-top 0.15rem

.score-pill
  margin-top 0.75rem
  padding 0.35rem 0.85rem
  border-radius 9999px
  display flex
  align-items center
  gap 0.25rem

  &.score-positive
    background rgba(16, 185, 129, 0.2)
    border 1px solid #10b981
    color #34d399

  &.score-negative
    background rgba(239, 68, 68, 0.2)
    border 1px solid #ef4444
    color #f87171

.score-val
  font-size 1.15rem
  font-weight 900
  font-family monospace

.score-unit
  font-size 0.65rem
  font-weight 700

.podium-rate-breakdown
  font-size 0.65rem
  color var(--color-text-secondary)
  margin-top 0.4rem

.podium-rate
  font-size 0.65rem
  color var(--color-muted)
  margin-top 0.2rem

// Controls
.leaderboard-controls
  display flex
  flex-direction column
  gap 1rem
  padding 1rem 1.25rem
  border-radius 1rem
  border 1px solid var(--color-border)
  background var(--color-surface)

@media (min-width: 768px)
  .leaderboard-controls
    flex-direction row
    align-items center
    justify-content space-between

.controls-left, .controls-right
  display flex
  align-items center
  gap 0.75rem
  flex-wrap wrap

.search-box
  display flex
  align-items center
  gap 0.5rem
  padding 0.4rem 0.75rem
  border-radius 0.5rem
  border 1px solid var(--color-border)
  background rgba(0, 0, 0, 0.2)

.search-icon
  font-size 0.85rem

.search-input
  border none
  outline none
  background transparent
  color var(--color-text)
  font-size 0.75rem
  font-weight 600
  width 10rem
  &::placeholder
    color var(--color-muted)

.filter-group
  display flex
  align-items center
  gap 0.4rem

.filter-label
  font-size 0.65rem
  font-weight 700
  text-transform uppercase
  color var(--color-muted)

.filter-select
  padding 0.4rem 0.6rem
  border-radius 0.5rem
  border 1px solid var(--color-border)
  background var(--color-surface)
  color var(--color-text)
  font-size 0.75rem
  font-weight 600
  outline none
  cursor pointer

// Leaderboard Table Card
.leaderboard-table-card
  border-radius 1rem
  border 1px solid var(--color-border)
  background var(--color-surface)
  overflow hidden
  box-shadow var(--shadow-sm)

.table-card-header
  padding 1.25rem 1.5rem
  border-bottom 1px solid var(--color-border)
  display flex
  flex-direction column
  gap 0.5rem

@media (min-width: 768px)
  .table-card-header
    flex-direction row
    align-items center
    justify-content space-between

.table-title-group
  display flex
  flex-direction column
  gap 0.25rem

.table-heading
  font-size 0.85rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.05em
  margin 0
  color var(--color-text)

.table-subtitle
  font-size 0.65rem
  color var(--color-muted)

.badge-mode-indicator
  padding 0.35rem 0.75rem
  border-radius 9999px
  font-size 0.7rem
  font-weight 800
  font-family monospace
  align-self flex-start

  &.ind-high
    background rgba(16, 185, 129, 0.15)
    border 1px solid rgba(16, 185, 129, 0.4)
    color #34d399

  &.ind-low
    background rgba(239, 68, 68, 0.15)
    border 1px solid rgba(239, 68, 68, 0.4)
    color #f87171

.table-responsive
  width 100%
  overflow-x auto

.leaderboard-table
  width 100%
  border-collapse collapse
  text-align left

  th
    padding 0.75rem 1rem
    font-size 0.65rem
    font-weight 800
    text-transform uppercase
    letter-spacing 0.05em
    color var(--color-muted)
    border-bottom 1px solid var(--color-border)
    background rgba(0, 0, 0, 0.15)

  td
    padding 0.85rem 1rem
    font-size 0.8rem
    border-bottom 1px solid var(--color-border)
    vertical-align middle

  tr:last-child td
    border-bottom none

  tbody tr
    transition background 0.15s ease
    &:hover
      background rgba(255, 255, 255, 0.03)

  .row-top-1
    background rgba(245, 197, 24, 0.05)
  .row-top-2
    background rgba(148, 163, 184, 0.04)
  .row-top-3
    background rgba(217, 119, 6, 0.04)

.th-center, .td-center
  text-align center

.rank-badge
  display inline-flex
  align-items center
  justify-content center
  padding 0.25rem 0.6rem
  border-radius 9999px
  font-size 0.75rem
  font-weight 800
  font-family monospace

  &.rank-1
    background rgba(245, 197, 24, 0.2)
    color #f5c518
    border 1px solid #f5c518
  &.rank-2
    background rgba(148, 163, 184, 0.2)
    color #cbd5e1
    border 1px solid #94a3b8
  &.rank-3
    background rgba(217, 119, 6, 0.2)
    color #f59e0b
    border 1px solid #d97706
  &.rank-other
    color var(--color-muted)

.user-cell
  display flex
  align-items center
  gap 0.75rem

.user-avatar
  width 2.25rem
  height 2.25rem
  border-radius 9999px
  object-fit cover
  border 1px solid var(--color-border)

.user-info
  display flex
  flex-direction column

.user-name
  font-size 0.8rem
  font-weight 700
  color var(--color-text)

.user-sub
  font-size 0.65rem
  color var(--color-muted)

.class-pill
  display inline-flex
  align-items center
  gap 0.35rem
  padding 0.2rem 0.6rem
  border-radius 9999px
  border 1px solid
  font-size 0.7rem
  font-weight 700

.pill-icon
  width 0.9rem
  height 0.9rem
  object-fit contain

.table-score-pill
  display inline-flex
  align-items baseline
  gap 0.2rem
  padding 0.25rem 0.65rem
  border-radius 0.5rem
  font-weight 900
  font-family monospace

  &.score-pos
    background rgba(16, 185, 129, 0.15)
    border 1px solid rgba(16, 185, 129, 0.4)
    color #34d399

  &.score-neg
    background rgba(239, 68, 68, 0.15)
    border 1px solid rgba(239, 68, 68, 0.4)
    color #f87171

.score-num
  font-size 1.05rem

.score-unit
  font-size 0.65rem
  font-weight 700

.absent-count-badge
  display inline-flex
  align-items baseline
  gap 0.2rem
  padding 0.25rem 0.65rem
  border-radius 0.5rem
  background rgba(239, 68, 68, 0.15)
  border 1px solid rgba(239, 68, 68, 0.4)
  color #ef4444

.badge-num
  font-size 1.05rem
  font-weight 900
  font-family monospace

.badge-txt
  font-size 0.65rem
  font-weight 700

.breakdown-box
  display flex
  flex-direction column
  gap 0.25rem
  align-items center

.breakdown-row
  display flex
  gap 0.35rem
  align-items center

.breakdown-item
  font-size 0.65rem
  font-weight 700
  padding 0.12rem 0.45rem
  border-radius 0.3rem
  display inline-block

  &.item-green
    background rgba(16, 185, 129, 0.15)
    color #34d399
    border 1px solid rgba(16, 185, 129, 0.3)
  &.item-half
    background rgba(245, 158, 11, 0.15)
    color #fbbf24
    border 1px solid rgba(245, 158, 11, 0.3)
  &.item-amber
    background rgba(239, 68, 68, 0.15)
    color #f87171
    border 1px solid rgba(239, 68, 68, 0.3)
  &.item-noshow
    background rgba(220, 38, 38, 0.3)
    color #fca5a5
    border 1px solid #dc2626
    animation pulse 2s infinite

.attendance-ratio
  font-family monospace
  font-size 0.8rem
  font-weight 700
  color var(--color-text-secondary)

.rate-cell
  display flex
  align-items center
  gap 0.75rem
  min-width 120px

.rate-bar-track
  flex 1
  height 0.45rem
  border-radius 9999px
  background rgba(255, 255, 255, 0.1)
  overflow hidden

.rate-bar-fill
  height 100%
  border-radius 9999px
  transition width 0.4s ease

.rate-text
  font-family monospace
  font-size 0.75rem
  font-weight 800
  min-width 45px
  text-align right

.eval-pill
  display inline-block
  padding 0.2rem 0.5rem
  border-radius 0.35rem
  font-size 0.65rem
  font-weight 700

  &.eval-gold
    background rgba(245, 197, 24, 0.25)
    color #f5c518
    border 1px solid #f5c518
  &.eval-success
    background rgba(16, 185, 129, 0.15)
    color #34d399
    border 1px solid rgba(16, 185, 129, 0.3)
  &.eval-good
    background rgba(59, 130, 246, 0.15)
    color #93c5fd
    border 1px solid rgba(59, 130, 246, 0.3)
  &.eval-danger
    background rgba(239, 68, 68, 0.2)
    color #f87171
    border 1px solid rgba(239, 68, 68, 0.4)
  &.eval-warning
    background rgba(245, 158, 11, 0.2)
    color #fbbf24
    border 1px solid rgba(245, 158, 11, 0.4)
  &.eval-caution
    background rgba(148, 163, 184, 0.15)
    color #cbd5e1
    border 1px solid rgba(148, 163, 184, 0.3)

// Loading & Empty States
.loading-state, .empty-state, .empty-attendees
  padding 3rem 1.5rem
  display flex
  flex-direction column
  align-items center
  justify-content center
  text-align center

.spinner
  width 2rem
  height 2rem
  border 3px solid rgba(255, 255, 255, 0.1)
  border-top-color var(--color-brand)
  border-radius 9999px
  animation spin 0.8s linear infinite

@keyframes spin
  to
    transform rotate(360deg)

.loading-text
  font-size 0.8rem
  color var(--color-muted)
  margin-top 1rem

.empty-icon
  font-size 2.5rem

.empty-title
  font-size 0.95rem
  font-weight 800
  margin 0.5rem 0 0.25rem 0
  color var(--color-text)

.empty-desc
  font-size 0.75rem
  color var(--color-muted)
  max-width 24rem
</style>
