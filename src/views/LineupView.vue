<template lang="pug">
.lineup-wrapper(:class="themeStore.theme === 'light' ? 'lineup-light' : 'lineup-dark'")
  //- Sub-header Toolbar cho Lineup
  .lineup-toolbar
    .toolbar-left
      span.toolbar-icon 📜
      .toolbar-title-group
        h2.toolbar-title THIÊN THƯ TRẬN PHÁI — CÔNG THÀNH CHIẾN
        span.toolbar-subtitle {{ store.title || 'Thiên Thư Môn' }}

    .toolbar-actions
      //- Mode Toggle Switch
      button.btn-mode(
        @click="store.toggleViewMode()"
        :class="store.viewMode === 'edit' ? 'mode-edit' : 'mode-view'"
      )
        span {{ store.viewMode === 'edit' ? '✏️ Thiết Lập Trận' : '👁️ Thẩm Nguyện Trận' }}

      //- Nút Thêm Đệ Tử Ngoại Bang
      button.btn-add-member(
        v-if="store.viewMode === 'edit'"
        @click="openAddMemberModal(null)"
        title="Thêm thành viên mới không trong danh sách vào trận đồ"
      )
        span ➕
        span Thêm Đệ Tử

      //- Dropdown Chọn Event
      .select-event-box
        select.event-select(
          id="event-select"
          v-model="selectedMessageId"
          @change="handleEventChange"
        )
          option(value="" disabled) -- Chọn chiến kỳ --
          option(
            v-for="event in store.events"
            :key="event.messageId"
            :value="event.messageId"
          ) {{ event.name || event.title }}

      //- Nút Xuất Ảnh PNG
      button.btn-capture(
        @click="captureScreenshot"
        :disabled="isCapturing"
      )
        span 📷
        span {{ isCapturing ? 'Đang Xuất Họa Đồ...' : 'Xuất Họa Đồ' }}

      //- Nút Lưu Đội Hình
      button.btn-save(
        @click="handleSave"
        :disabled="isSaving"
      ) {{ isSaving ? 'Đang Khắc Đồ...' : '💾 Lưu Trận Đồ' }}

  //- Thanh Legend Phái
  .sect-legend-bar
    span.legend-label Bát Đại Võ Phái
    .legend-item(v-for="c in CLASS_LIST" :key="c.name")
      img.legend-icon(v-if="c.icon" :src="c.icon" :alt="c.name")
      span.legend-dot(v-else :style="{ backgroundColor: c.hex, boxShadow: `0 0 6px ${c.hex}` }")
      span.legend-name {{ c.name }}

  //- Workspace Khu vực Ma trận Đội hình chính
  .lineup-workspace
    //- Cột Trái Drawer Pool khi ở chế độ Edit
    .attendance-pool-col(v-if="store.viewMode === 'edit'")
      AttendancePool(:pool="store.attendancePool")

    //- Khối Ma Trận Tổng (Captured khi Xuất Ảnh PNG)
    .lineup-matrix-box(
      ref="lineupCaptureRef"
      :class="themeStore.theme === 'light' ? 'matrix-light' : 'matrix-dark'"
    )
      //- Cột Trái & Giữa: Các Division + Băng rôn chiến thuật
      .divisions-container
        //- Top Row Division
        TacticalDivisionBox(
          v-if="divMid"
          :divisionIndex="0"
          :division="divMid"
          :isEditMode="store.viewMode === 'edit'"
          @toggleCheck="({ tIdx, sIdx }) => store.toggleSlotCheck(0, tIdx, sIdx)"
          @removeSlot="({ tIdx, sIdx }) => store.clearSlot(0, tIdx, sIdx)"
          @clickSlot="({ tIdx, sIdx }) => handleSlotClick({ dIdx: 0, tIdx, sIdx })"
        )

        //- Bottom Row Divisions
        .bottom-divisions-row
          .bot-left-col
            TacticalDivisionBox(
              v-if="divBotLeft"
              :divisionIndex="1"
              :division="divBotLeft"
              :isEditMode="store.viewMode === 'edit'"
              @toggleCheck="({ tIdx, sIdx }) => store.toggleSlotCheck(1, tIdx, sIdx)"
              @removeSlot="({ tIdx, sIdx }) => store.clearSlot(1, tIdx, sIdx)"
              @clickSlot="({ tIdx, sIdx }) => handleSlotClick({ dIdx: 1, tIdx, sIdx })"
            )

          .bot-mid-col
            TacticalDivisionBox(
              v-if="divBotMid"
              :divisionIndex="2"
              :division="divBotMid"
              :isEditMode="store.viewMode === 'edit'"
              @toggleCheck="({ tIdx, sIdx }) => store.toggleSlotCheck(2, tIdx, sIdx)"
              @removeSlot="({ tIdx, sIdx }) => store.clearSlot(2, tIdx, sIdx)"
              @clickSlot="({ tIdx, sIdx }) => handleSlotClick({ dIdx: 2, tIdx, sIdx })"
            )

        //- Dual Strategy Banners
        TacticalBanners(
          :banners="store.bannerNotes"
          :isEditMode="store.viewMode === 'edit'"
        )

      //- Cột Phải: Panel Tiên Phong & Uy Danh
      RightTacticalPanels(
        :panels="store.rightPanels"
        :isEditMode="store.viewMode === 'edit'"
      )

  //- Modal thêm đệ tử mới / ngoại bang
  AddMemberModal(
    :visible="showAddMemberModal"
    :targetSlotInfo="targetSlotInfo"
    @close="showAddMemberModal = false"
    @add="handleAddMemberSubmit"
  )

  //- Modal confirm chụp ảnh
  SaveConfirmModal(
    :visible="showScreenshotPrompt"
    :capturing="isCapturing"
    @confirm="captureScreenshot"
    @cancel="showScreenshotPrompt = false"
  )
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { toPng } from 'html-to-image';
import { useLineupStore } from '../stores/lineupStore';
import { useThemeStore } from '../stores/themeStore';
import AttendancePool from '../components/lineup/AttendancePool.vue';
import TacticalDivisionBox from '../components/lineup/TacticalDivisionBox.vue';
import TacticalBanners from '../components/lineup/TacticalBanners.vue';
import RightTacticalPanels from '../components/lineup/RightTacticalPanels.vue';
import SaveConfirmModal from '../components/lineup/SaveConfirmModal.vue';
import AddMemberModal from '../components/lineup/AddMemberModal.vue';
import { CLASS_LIST } from '../theme/classColors';

const store = useLineupStore();
const themeStore = useThemeStore();

const selectedMessageId = ref('');
const lineupCaptureRef = ref(null);

const isSaving = ref(false);
const isCapturing = ref(false);
const showScreenshotPrompt = ref(false);
const showAddMemberModal = ref(false);
const targetSlotInfo = ref(null);

const divMid = computed(() => store.divisions[0]);
const divBotLeft = computed(() => store.divisions[1]);
const divBotMid = computed(() => store.divisions[2]);

const openAddMemberModal = (slotInfo = null) => {
  targetSlotInfo.value = slotInfo;
  showAddMemberModal.value = true;
};

const handleSlotClick = ({ dIdx, tIdx, sIdx }) => {
  if (store.viewMode !== 'edit') return;

  const div = store.divisions[dIdx];
  const team = div?.teams[tIdx];
  const slot = team?.slots[sIdx];

  const label = `${div?.divisionName || 'Đoàn'} — ${team?.teamName || 'Nhóm'} (Vị trí ${sIdx + 1})`;

  openAddMemberModal({
    dIdx,
    tIdx,
    sIdx,
    label
  });
};

const handleAddMemberSubmit = (memberData) => {
  if (targetSlotInfo.value) {
    store.assignExternalMemberToSlot({
      targetDIdx: targetSlotInfo.value.dIdx,
      targetTIdx: targetSlotInfo.value.tIdx,
      targetSIdx: targetSlotInfo.value.sIdx,
      displayName: memberData.displayName,
      className: memberData.className,
      note: memberData.note
    });
  } else {
    store.addExternalMember(memberData);
  }
};

const handleEventChange = () => {
  if (selectedMessageId.value) {
    store.fetchEventData(selectedMessageId.value);
  }
};

const handleSave = async () => {
  isSaving.value = true;
  try {
    await store.saveCurrentLineup();
    showScreenshotPrompt.value = true;
  } finally {
    isSaving.value = false;
  }
};

const captureScreenshot = async () => {
  if (!lineupCaptureRef.value) {
    showScreenshotPrompt.value = false;
    return;
  }

  isCapturing.value = true;
  try {
    const bgColor = themeStore.theme === 'light' ? '#f8fafc' : '#060a12';
    const dataUrl = await toPng(lineupCaptureRef.value, {
      backgroundColor: bgColor,
      pixelRatio: 2,
      cacheBust: true,
    });

    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    link.download = `tran-do-thien-thu-${timestamp}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Lỗi khi xuất ảnh họa đồ:', err);
  } finally {
    isCapturing.value = false;
    showScreenshotPrompt.value = false;
  }
};

onMounted(async () => {
  await store.fetchEventsList();

  if (store.events && store.events.length > 0) {
    selectedMessageId.value = store.events[0].messageId;
    store.fetchEventData(selectedMessageId.value);
  }
});
</script>

<style lang="stylus" scoped>
.lineup-wrapper
  flex 1
  display flex
  flex-direction column
  min-height calc(100vh - 57px)
  font-family 'Lora', serif
  position relative
  overflow-x auto

.lineup-toolbar
  position relative
  z-index 20
  border-bottom 1px solid
  backdrop-filter blur(8px)
  padding 0.5rem 1rem
  display flex
  flex-wrap wrap
  align-items center
  justify-content space-between
  gap 0.75rem

  .lineup-light &
    background rgba(255, 255, 255, 0.95)
    border-color #cbd5e1

  .lineup-dark &
    background rgba(7, 12, 24, 0.9)
    border-color #172439

.toolbar-left
  display flex
  align-items center
  gap 0.75rem

.toolbar-icon
  font-size 1.25rem

.toolbar-title
  font-size 0.85rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.05em
  margin 0

  .lineup-light &
    color #b45309

  .lineup-dark &
    color #f5c518

.toolbar-subtitle
  font-size 0.65rem
  font-family monospace

  .lineup-light &
    color #64748b

  .lineup-dark &
    color #64748b

.toolbar-actions
  display flex
  align-items center
  gap 0.65rem

.btn-mode
  padding 0.4rem 0.75rem
  border-radius 0.375rem
  font-size 0.75rem
  font-weight 600
  border 1px solid
  cursor pointer
  transition all 0.15s ease
  display flex
  align-items center
  gap 0.4rem

  &.mode-edit
    .lineup-light &
      background #fef3c7
      border-color #b45309
      color #b45309

    .lineup-dark &
      background rgba(245, 197, 24, 0.15)
      border-color #f5c518
      color #f5c518

  &.mode-view
    .lineup-light &
      background #ffffff
      border-color #cbd5e1
      color #475569
      &:hover
        color #0f172a

    .lineup-dark &
      background #1e293b
      border-color #334155
      color #94a3b8
      &:hover
        color #ffffff

.btn-add-member
  background #059669
  border 1px solid rgba(52, 211, 153, 0.6)
  color #ffffff
  padding 0.4rem 0.75rem
  border-radius 0.375rem
  font-size 0.75rem
  font-weight 700
  cursor pointer
  display flex
  align-items center
  gap 0.4rem
  transition all 0.2s ease

  &:hover
    background #10b981
    transform scale(1.03)

.event-select
  padding 0.4rem 0.65rem
  border-radius 0.375rem
  font-size 0.75rem
  font-weight 700
  border 1px solid
  outline none
  cursor pointer

  .lineup-light &
    background #ffffff
    border-color #cbd5e1
    color #b45309

  .lineup-dark &
    background #0f172a
    border-color #1e293b
    color #f5c518

.btn-capture
  padding 0.4rem 0.75rem
  border-radius 0.375rem
  font-size 0.75rem
  font-weight 600
  border 1px solid
  cursor pointer
  display flex
  align-items center
  gap 0.4rem
  transition all 0.15s ease

  .lineup-light &
    background #ffffff
    border-color #cbd5e1
    color #0f172a
    &:hover
      background #f1f5f9

  .lineup-dark &
    background #1e293b
    border-color #475569
    color #ffffff
    &:hover
      background #334155

  &:disabled
    opacity 0.5

.btn-save
  background linear-gradient(to right, #2563eb, #1d4ed8)
  color #ffffff
  padding 0.4rem 1rem
  border-radius 0.375rem
  font-size 0.75rem
  font-weight 700
  border none
  cursor pointer
  transition all 0.15s ease

  &:hover
    filter brightness(1.1)

  &:disabled
    opacity 0.6

.sect-legend-bar
  position relative
  z-index 10
  padding 0.4rem 1rem
  border-bottom 1px solid
  display flex
  align-items center
  gap 1rem
  overflow-x auto

  .lineup-light &
    background #ffffff
    border-color #e2e8f0

  .lineup-dark &
    background #050810
    border-color #111c2e

.legend-label
  font-size 0.6rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.15em
  flex-shrink 0

  .lineup-light &
    color #64748b

  .lineup-dark &
    color #475569

.legend-item
  display flex
  align-items center
  gap 0.35rem
  flex-shrink 0

.legend-icon
  width 1rem
  height 1rem
  object-fit contain

.legend-dot
  width 0.5rem
  height 0.5rem
  border-radius 9999px

.legend-name
  font-size 0.75rem
  font-weight 500

  .lineup-light &
    color #0f172a

  .lineup-dark &
    color #cbd5e1

.lineup-workspace
  position relative
  z-index 10
  flex 1
  padding 0.75rem
  display flex
  gap 0.75rem
  overflow-x auto

.attendance-pool-col
  width 15rem
  flex-shrink 0

.lineup-matrix-box
  flex 1
  padding 0.75rem
  border-radius 0.5rem
  border 1px solid
  display flex
  flex-direction column
  gap 0.75rem
  align-items flex-start
  min-width 1050px

  &.matrix-light
    background #ffffff
    border-color #cbd5e1
    box-shadow 0 4px 20px rgba(0, 0, 0, 0.04)

  &.matrix-dark
    background #060a12
    border-color #131f33
    box-shadow 0 10px 30px rgba(0, 0, 0, 0.4)

@media (min-width: 768px)
  .lineup-matrix-box
    flex-direction row

.divisions-container
  flex 1
  display flex
  flex-direction column
  justify-content flex-start
  gap 0.65rem
  width 100%

.bottom-divisions-row
  display flex
  flex-direction column
  gap 0.65rem
  align-items stretch

@media (min-width: 1280px)
  .bottom-divisions-row
    flex-direction row

.bot-left-col
  flex 1

.bot-mid-col
  flex 1.4
</style>
