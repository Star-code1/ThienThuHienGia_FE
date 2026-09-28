<template lang="pug">
Teleport(to="body")
  Transition(name="fade")
    .modal-overlay(
      v-if="visible"
      @click.self="$emit('close')"
    )
      .modal-card(
        :class="themeStore.theme === 'light' ? 'modal-light' : 'modal-dark'"
      )
        .modal-header
          .header-left
            span.modal-icon 🔄
            .title-group
              h3.modal-title KẾ THỪA TRẬN ĐỒ
              span.modal-subtitle SAO CHÉP ĐỘI HÌNH TỪ CHIẾN KỲ TRƯỚC SANG HIỆN TẠI
          button.close-btn(@click="$emit('close')") ✕

        .modal-body
          //- Thông tin trận hiện tại (Đích)
          .battle-info-banner
            .banner-item
              span.banner-label 🎯 Chiến kỳ hiện tại (Trận B):
              span.banner-value {{ currentEventName }}

          //- Chọn trận nguồn (Trận A)
          .form-group
            label.form-label
              | Chọn Chiến Kỳ Nguồn (Trận A đã xếp)
              span.required-star *
            select.form-select(
              v-model="selectedSourceId"
              @change="handleSourceChange"
              :disabled="loadingPreview"
            )
              option(value="" disabled) -- Chọn chiến kỳ mẫu đã xếp trước đó --
              option(
                v-for="ev in availableSourceEvents"
                :key="ev.messageId"
                :value="ev.messageId"
              ) {{ ev.name || ev.title }} {{ formatEventDate(ev.date) }}

          //- Loading state
          .loading-box(v-if="loadingPreview")
            .spinner
            span Đang phân tích và đối soát dữ liệu 2 chiến kỳ...

          //- Preview kết quả đối soát
          .preview-container(v-else-if="previewData")
            //- Thống kê tổng quan
            .stats-grid
              .stat-card.stat-matched
                .stat-num {{ previewData.matchedCount }}
                .stat-desc
                  span.stat-title ✅ Kế thừa vị trí
                  span.stat-sub Có ở A & đã vote tham gia B

              .stat-card.stat-skipped
                .stat-num {{ previewData.skippedCount }}
                .stat-desc
                  span.stat-title ⚠️ Bỏ qua (Trống slot)
                  span.stat-sub Có ở A nhưng bận/chưa vote B

              .stat-card.stat-pool
                .stat-num {{ previewData.poolCount }}
                .stat-desc
                  span.stat-title 🆕 Chờ phân bổ (Pool)
                  span.stat-sub Vote tham gia B nhưng chưa có ở A

            //- Tùy chọn kế thừa
            .options-row
              label.checkbox-label
                input(type="checkbox" v-model="includeSkills")
                span Kế thừa kỹ năng đã phân công từ trận trước
              label.checkbox-label
                input(type="checkbox" v-model="includeExternal")
                span Kế thừa đệ tử ngoại bang / khách mời

            //- Danh sách chi tiết tab/accordion
            .preview-details
              .detail-section(v-if="previewData.matchedList.length > 0")
                .section-header(@click="showMatchedList = !showMatchedList")
                  span.section-title 📋 Thành viên được giữ nguyên vị trí ({{ previewData.matchedList.length }})
                  span.section-toggle {{ showMatchedList ? '▲ Thu gọn' : '▼ Chi tiết' }}
                .member-chip-list(v-if="showMatchedList")
                  .member-chip.chip-matched(v-for="(m, idx) in previewData.matchedList" :key="idx")
                    span.member-loc {{ m.location }}
                    span.member-name {{ m.displayName }}
                    span.member-class {{ m.className }}

              .detail-section(v-if="previewData.skippedList.length > 0")
                .section-header(@click="showSkippedList = !showSkippedList")
                  span.section-title ⏳ Thành viên vắng/chưa vote sẽ bỏ qua ({{ previewData.skippedList.length }})
                  span.section-toggle {{ showSkippedList ? '▲ Thu gọn' : '▼ Chi tiết' }}
                .member-chip-list(v-if="showSkippedList")
                  .member-chip.chip-skipped(v-for="(m, idx) in previewData.skippedList" :key="idx")
                    span.member-loc {{ m.location }}
                    span.member-name {{ m.displayName }}
                    span.member-status {{ m.statusText }}

              .detail-section(v-if="previewData.poolList.length > 0")
                .section-header(@click="showPoolList = !showPoolList")
                  span.section-title 📥 Đệ tử mới tham gia B sẽ vào Hàng Chờ ({{ previewData.poolList.length }})
                  span.section-toggle {{ showPoolList ? '▲ Thu gọn' : '▼ Chi tiết' }}
                .member-chip-list(v-if="showPoolList")
                  .member-chip.chip-pool(v-for="(m, idx) in previewData.poolList" :key="idx")
                    span.member-name {{ m.displayName }}
                    span.member-class {{ m.className }}

          //- Trạng thái chưa chọn
          .empty-hint(v-else-if="!selectedSourceId")
            span 💡 Chọn một chiến kỳ mẫu ở trên để hệ thống tự động đối chiếu danh sách điểm danh và phân tích đội hình.

          //- Trạng thái chiến kỳ nguồn không có dữ liệu
          .empty-hint.empty-warning(v-else-if="!loadingPreview && !previewData")
            span ⚠️ Chiến kỳ mẫu đã chọn chưa có sơ đồ đội hình được lưu!

        .modal-actions
          button.btn-cancel(type="button" @click="$emit('close')") Hủy
          button.btn-apply(
            type="button"
            :disabled="!previewData || isApplying"
            @click="handleApply"
          )
            span.spinner(v-if="isApplying")
            span {{ isApplying ? 'Đang Áp Dụng...' : '⚡ Áp Dụng Kế Thừa' }}
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useThemeStore } from '../../stores/themeStore';
import { useLineupStore } from '../../stores/lineupStore';
import Swal from 'sweetalert2';

const props = defineProps({
  visible: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'applied']);

const themeStore = useThemeStore();
const lineupStore = useLineupStore();

const selectedSourceId = ref('');
const loadingPreview = ref(false);
const isApplying = ref(false);
const previewData = ref(null);
const includeSkills = ref(true);
const includeExternal = ref(false);

const showMatchedList = ref(false);
const showSkippedList = ref(false);
const showPoolList = ref(false);

const availableSourceEvents = computed(() => {
  return lineupStore.events.filter((e) => e.messageId !== lineupStore.eventId);
});

const currentEventName = computed(() => {
  const current = lineupStore.events.find((e) => e.messageId === lineupStore.eventId);
  return current ? (current.name || current.title) : 'Chưa chọn chiến kỳ';
});

const formatEventDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return `(${d.toLocaleDateString('vi-VN')})`;
  } catch {
    return '';
  }
};

watch(() => props.visible, (newVal) => {
  if (newVal) {
    selectedSourceId.value = '';
    previewData.value = null;
    showMatchedList.value = false;
    showSkippedList.value = false;
    showPoolList.value = false;
  }
});

const handleSourceChange = async () => {
  if (!selectedSourceId.value) {
    previewData.value = null;
    return;
  }

  loadingPreview.value = true;
  try {
    const preview = await lineupStore.previewInheritLineup({
      sourceEventId: selectedSourceId.value,
      includeExternal: includeExternal.value,
    });
    previewData.value = preview;
  } catch (error) {
    console.error('Lỗi khi phân tích kế thừa:', error);
    previewData.value = null;
  } finally {
    loadingPreview.value = false;
  }
};

watch(includeExternal, async () => {
  if (selectedSourceId.value) {
    await handleSourceChange();
  }
});

const handleApply = async () => {
  if (!selectedSourceId.value || !previewData.value) return;

  const confirmRes = await Swal.fire({
    title: 'Xác nhận kế thừa?',
    text: `Hệ thống sẽ xếp ${previewData.value.matchedCount} thành viên vào đúng vị trí từ trận trước và đưa ${previewData.value.poolCount} thành viên còn lại vào Hàng Chờ.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Đồng ý kế thừa',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#64748b',
    background: '#12161f',
    color: '#ffffff',
  });

  if (!confirmRes.isConfirmed) return;

  isApplying.value = true;
  try {
    await lineupStore.applyInheritLineup({
      sourceEventId: selectedSourceId.value,
      includeSkills: includeSkills.value,
      includeExternal: includeExternal.value,
    });

    emit('applied');
    emit('close');
  } catch (error) {
    console.error('Lỗi khi áp dụng kế thừa:', error);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: error.message || 'Không thể áp dụng kế thừa đội hình.',
      background: '#12161f',
      color: '#ffffff',
    });
  } finally {
    isApplying.value = false;
  }
};
</script>

<style lang="stylus" scoped>
.modal-overlay
  position fixed
  inset 0
  z-index 100
  display flex
  align-items center
  justify-content center
  background rgba(0, 0, 0, 0.7)
  backdrop-filter blur(6px)
  padding 1rem
  font-family 'Be Vietnam Pro', sans-serif

.modal-card
  width 100%
  max-width 42rem
  max-height 90vh
  display flex
  flex-direction column
  border-radius var(--radius-xl, 20px)
  box-shadow 0 25px 50px -12px rgba(0, 0, 0, 0.5)
  overflow hidden
  animation modalPop 0.25s ease-out

  &.modal-light
    background #ffffff
    border 1px solid #e2e8f0
    color #0f172a

  &.modal-dark
    background #0b1120
    border 1px solid #1e293b
    color #f8fafc

@keyframes modalPop
  from
    opacity 0
    transform scale(0.95) translateY(10px)
  to
    opacity 1
    transform scale(1) translateY(0)

.modal-header
  display flex
  justify-content space-between
  align-items center
  padding 1.25rem 1.5rem
  border-bottom 1px solid
  flex-shrink 0

  .modal-light &
    background #f8fafc
    border-color #e2e8f0

  .modal-dark &
    background #0f172a
    border-color #1e293b

.header-left
  display flex
  align-items center
  gap 0.75rem

.modal-icon
  font-size 1.5rem

.title-group
  display flex
  flex-direction column

.modal-title
  font-family var(--font-heading)
  font-size 1.15rem
  font-weight 800
  margin 0

  .modal-light &
    color #0f172a

  .modal-dark &
    color #f8fafc

.modal-subtitle
  font-size 0.72rem
  font-weight 600
  color #64748b
  letter-spacing 0.04em
  margin-top 0.15rem

.close-btn
  background transparent
  border none
  font-size 1.25rem
  cursor pointer
  color #94a3b8
  transition color 0.15s

  &:hover
    color #ef4444

.modal-body
  padding 1.25rem 1.5rem
  overflow-y auto
  flex 1
  display flex
  flex-direction column
  gap 1.1rem

.battle-info-banner
  padding 0.75rem 1rem
  border-radius var(--radius-md, 12px)
  display flex
  align-items center
  gap 0.5rem
  font-size 0.85rem

  .modal-light &
    background #eff6ff
    border 1px solid #bfdbfe
    color #1e40af

  .modal-dark &
    background rgba(30, 58, 138, 0.25)
    border 1px solid rgba(59, 130, 246, 0.3)
    color #93c5fd

.banner-label
  font-weight 600

.banner-value
  font-weight 800
  color #3b82f6
  .modal-dark &
    color #60a5fa

.form-group
  display flex
  flex-direction column
  gap 0.4rem

.form-label
  font-size 0.82rem
  font-weight 700
  display flex
  align-items center
  gap 0.25rem

  .modal-light &
    color #334155
  .modal-dark &
    color #cbd5e1

.required-star
  color #ef4444

.form-select
  width 100%
  padding 0.65rem 0.85rem
  border-radius var(--radius-md, 12px)
  font-size 0.85rem
  font-family inherit
  border 1px solid
  outline none
  cursor pointer
  transition border-color 0.2s

  .modal-light &
    background #ffffff
    border-color #cbd5e1
    color #0f172a
    &:focus
      border-color #3b82f6

  .modal-dark &
    background #1e293b
    border-color #334155
    color #f8fafc
    &:focus
      border-color #60a5fa

.loading-box
  display flex
  align-items center
  justify-content center
  gap 0.75rem
  padding 2rem
  font-size 0.85rem
  color #94a3b8

.stats-grid
  display grid
  grid-template-columns repeat(3, 1fr)
  gap 0.75rem

.stat-card
  padding 0.85rem
  border-radius var(--radius-md, 12px)
  display flex
  align-items center
  gap 0.75rem
  border 1px solid

  .stat-num
    font-size 1.5rem
    font-weight 900
    line-height 1

  .stat-desc
    display flex
    flex-direction column

  .stat-title
    font-size 0.78rem
    font-weight 800

  .stat-sub
    font-size 0.68rem
    opacity 0.8
    margin-top 0.15rem

  &.stat-matched
    .modal-light &
      background #f0fdf4
      border-color #bbf7d0
      color #15803d
    .modal-dark &
      background rgba(34, 197, 94, 0.15)
      border-color rgba(34, 197, 94, 0.3)
      color #4ade80

  &.stat-skipped
    .modal-light &
      background #fffbeb
      border-color #fde68a
      color #b45309
    .modal-dark &
      background rgba(245, 158, 11, 0.15)
      border-color rgba(245, 158, 11, 0.3)
      color #fbbf24

  &.stat-pool
    .modal-light &
      background #eff6ff
      border-color #bfdbfe
      color #1d4ed8
    .modal-dark &
      background rgba(59, 130, 246, 0.15)
      border-color rgba(59, 130, 246, 0.3)
      color #60a5fa

.options-row
  display flex
  flex-wrap wrap
  gap 1rem
  padding 0.6rem 0.85rem
  border-radius var(--radius-md, 12px)

  .modal-light &
    background #f8fafc
    border 1px solid #e2e8f0
  .modal-dark &
    background rgba(15, 23, 42, 0.6)
    border 1px solid #1e293b

.checkbox-label
  display flex
  align-items center
  gap 0.45rem
  font-size 0.78rem
  font-weight 600
  cursor pointer

.preview-details
  display flex
  flex-direction column
  gap 0.5rem

.detail-section
  border-radius var(--radius-md, 12px)
  overflow hidden
  border 1px solid

  .modal-light &
    border-color #e2e8f0
    background #ffffff
  .modal-dark &
    border-color #1e293b
    background rgba(15, 23, 42, 0.4)

.section-header
  display flex
  justify-content space-between
  align-items center
  padding 0.6rem 0.85rem
  cursor pointer
  user-select none
  font-size 0.78rem
  font-weight 700

  &:hover
    background rgba(255, 255, 255, 0.05)

.section-toggle
  font-size 0.72rem
  color #3b82f6

.member-chip-list
  display flex
  flex-wrap wrap
  gap 0.4rem
  padding 0.6rem 0.85rem
  max-height 130px
  overflow-y auto
  border-top 1px solid

  .modal-light &
    border-color #f1f5f9
    background #f8fafc
  .modal-dark &
    border-color #1e293b
    background rgba(2, 6, 23, 0.4)

.member-chip
  display flex
  align-items center
  gap 0.35rem
  padding 0.25rem 0.55rem
  border-radius 9999px
  font-size 0.72rem
  font-weight 600

  .member-loc
    font-size 0.65rem
    opacity 0.75
    font-family monospace

  .member-name
    font-weight 700

  .member-class
    font-size 0.65rem
    padding 0.1rem 0.35rem
    border-radius 4px
    background rgba(0, 0, 0, 0.15)

  &.chip-matched
    background rgba(34, 197, 94, 0.18)
    color #22c55e
    border 1px solid rgba(34, 197, 94, 0.3)

  &.chip-skipped
    background rgba(245, 158, 11, 0.18)
    color #f59e0b
    border 1px solid rgba(245, 158, 11, 0.3)

  &.chip-pool
    background rgba(59, 130, 246, 0.18)
    color #3b82f6
    border 1px solid rgba(59, 130, 246, 0.3)

.empty-hint
  padding 1.5rem
  text-align center
  font-size 0.82rem
  color #64748b
  border-radius var(--radius-md, 12px)
  border 1px dashed

  .modal-light &
    border-color #cbd5e1
    background #f8fafc
  .modal-dark &
    border-color #334155
    background rgba(15, 23, 42, 0.3)

  &.empty-warning
    color #f59e0b
    border-color rgba(245, 158, 11, 0.4)

.modal-actions
  display flex
  justify-content flex-end
  gap 0.75rem
  padding 1rem 1.5rem
  border-top 1px solid
  flex-shrink 0

  .modal-light &
    background #f8fafc
    border-color #e2e8f0
  .modal-dark &
    background #0f172a
    border-color #1e293b

.btn-cancel
  padding 0.55rem 1.25rem
  border-radius var(--radius-md, 12px)
  font-size 0.82rem
  font-weight 600
  cursor pointer
  border 1px solid
  transition all 0.15s

  .modal-light &
    background #ffffff
    border-color #cbd5e1
    color #475569
    &:hover
      background #f1f5f9
  .modal-dark &
    background #1e293b
    border-color #334155
    color #cbd5e1
    &:hover
      background #334155

.btn-apply
  padding 0.55rem 1.4rem
  border-radius var(--radius-md, 12px)
  font-size 0.82rem
  font-weight 700
  cursor pointer
  border none
  background linear-gradient(135deg, #3b82f6, #2563eb)
  color #ffffff
  display flex
  align-items center
  gap 0.4rem
  box-shadow 0 4px 12px rgba(37, 99, 235, 0.35)
  transition all 0.2s

  &:hover:not(:disabled)
    transform translateY(-1px)
    box-shadow 0 6px 16px rgba(37, 99, 235, 0.45)

  &:disabled
    opacity 0.5
    cursor not-allowed

.spinner
  width 0.9rem
  height 0.9rem
  border 2px solid rgba(255, 255, 255, 0.3)
  border-top-color #ffffff
  border-radius 50%
  animation spin 0.8s linear infinite

@keyframes spin
  to
    transform rotate(360deg)
</style>
