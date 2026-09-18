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
      //- Nút Thêm Đoàn Mới
      button.btn-action.btn-add-division(
        v-if="store.viewMode === 'edit'"
        @click="store.addDivision()"
        title="Thêm một Đoàn mới (5 Team)"
      )
        span ➕
        span Thêm Đoàn

      //- Nút Quản Lý Kỹ Năng / Phân Công Database
      button.btn-action.btn-manage-skills(
        @click="showSkillManageModal = true"
        title="Thêm ảnh và tên skill vào database để phân công"
      )
        span ⚡
        span Quản Lý Kỹ Năng

      //- Mode Toggle Switch
      button.btn-action.btn-mode(
        @click="store.toggleViewMode()"
        :class="store.viewMode === 'edit' ? 'mode-edit' : 'mode-view'"
      )
        span {{ store.viewMode === 'edit' ? '✏️ Thiết Lập Trận' : '👁️ Thẩm Nguyện Trận' }}

      //- Nút Thêm Đệ Tử Ngoại Bang
      button.btn-action.btn-add-member(
        v-if="store.viewMode === 'edit'"
        @click="openAddMemberModal(null)"
        title="Thêm thành viên mới không trong danh sách vào trận đồ"
      )
        span 👤
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
      button.btn-action.btn-capture(
        @click="captureScreenshot"
        :disabled="isCapturing"
      )
        span 📷
        span {{ isCapturing ? 'Đang Xuất Họa Đồ...' : 'Xuất Họa Đồ' }}

      //- Nút Lưu Đội Hình
      button.btn-action.btn-save(
        @click="handleSave"
        :disabled="isSaving"
      ) {{ isSaving ? 'Đang Khắc Đồ...' : '💾 Lưu Trận Đồ' }}

  //- Thanh Legend Phái
  .sect-legend-bar
    span.legend-label Thất Đại Võ Phái
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
      //- Danh sách các Đoàn (Divisions)
      .divisions-list-container
        TacticalDivisionBox(
          v-for="(division, dIdx) in store.divisions"
          :key="division.id || dIdx"
          :divisionIndex="dIdx"
          :division="division"
          :isEditMode="store.viewMode === 'edit'"
          @toggleCollapse="store.toggleDivisionCollapse(dIdx)"
          @toggleCheck="({ tIdx, sIdx }) => store.toggleSlotCheck(dIdx, tIdx, sIdx)"
          @removeSlot="({ tIdx, sIdx }) => store.clearSlot(dIdx, tIdx, sIdx)"
          @clickSlot="({ tIdx, sIdx }) => handleSlotClick({ dIdx, tIdx, sIdx })"
          @openSkillAssign="({ tIdx, sIdx }) => handleOpenSkillAssign({ dIdx, tIdx, sIdx })"
          @addTeam="store.addTeamToDivision(dIdx)"
          @removeTeam="(tIdx) => store.removeTeam(dIdx, tIdx)"
          @deleteDivision="(idx) => store.removeDivision(idx)"
        )

  //- Modal Quản lý Kỹ Năng Database
  SkillManageModal(
    :visible="showSkillManageModal"
    @close="showSkillManageModal = false"
  )

  //- Modal Phân Công Kỹ Năng cho Slot
  SkillAssignModal(
    :visible="showSkillAssignModal"
    :targetInfo="targetSkillSlotInfo"
    @close="showSkillAssignModal = false"
    @toggleSkill="handleToggleSkill"
    @openSkillManager="handleOpenSkillManagerFromAssign"
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
import { ref, onMounted } from 'vue';
import { toPng } from 'html-to-image';
import { useLineupStore } from '../stores/lineupStore';
import { useSkillStore } from '../stores/skillStore';
import { useThemeStore } from '../stores/themeStore';
import AttendancePool from '../components/lineup/AttendancePool.vue';
import TacticalDivisionBox from '../components/lineup/TacticalDivisionBox.vue';
import SaveConfirmModal from '../components/lineup/SaveConfirmModal.vue';
import AddMemberModal from '../components/lineup/AddMemberModal.vue';
import SkillManageModal from '../components/lineup/SkillManageModal.vue';
import SkillAssignModal from '../components/lineup/SkillAssignModal.vue';
import { CLASS_LIST } from '../theme/classColors';

const store = useLineupStore();
const skillStore = useSkillStore();
const themeStore = useThemeStore();

const selectedMessageId = ref('');
const lineupCaptureRef = ref(null);

const isSaving = ref(false);
const isCapturing = ref(false);
const showScreenshotPrompt = ref(false);
const showAddMemberModal = ref(false);
const showSkillManageModal = ref(false);
const showSkillAssignModal = ref(false);
const targetSlotInfo = ref(null);
const targetSkillSlotInfo = ref(null);

onMounted(async () => {
  await store.fetchEventsList();
  await skillStore.fetchSkills();
  if (store.divisions.length === 0) {
    store.initDefaultLineup();
  }
});

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

const handleOpenSkillAssign = ({ dIdx, tIdx, sIdx }) => {
  const div = store.divisions[dIdx];
  const team = div?.teams[tIdx];
  const slot = team?.slots[sIdx];

  targetSkillSlotInfo.value = {
    dIdx,
    tIdx,
    sIdx,
    title: `${div?.divisionName || 'Đoàn'} — ${team?.teamName || 'Team'} (Slot ${sIdx + 1})`,
    memberName: slot?.displayName || slot?.username || '',
    skills: slot?.skills || [],
  };
  showSkillAssignModal.value = true;
};

const handleToggleSkill = (skill) => {
  if (!targetSkillSlotInfo.value) return;
  const { dIdx, tIdx, sIdx } = targetSkillSlotInfo.value;
  store.toggleSkillOnSlot({ dIdx, tIdx, sIdx, skill });

  // Update targetSkillSlotInfo skills
  const updatedSlot = store.divisions[dIdx]?.teams[tIdx]?.slots[sIdx];
  if (updatedSlot) {
    targetSkillSlotInfo.value.skills = updatedSlot.skills;
  }
};

const handleOpenSkillManagerFromAssign = () => {
  showSkillAssignModal.value = false;
  showSkillManageModal.value = true;
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
</script>

<style lang="stylus" scoped>
.lineup-wrapper
  width 100%
  min-height 100vh
  display flex
  flex-direction column
  background-attachment fixed
  font-family 'Be Vietnam Pro', sans-serif
  padding-bottom 3rem

  &.lineup-light
    background #f8fafc
    color #0f172a

  &.lineup-dark
    background #060a12
    color #f8fafc

.lineup-toolbar
  display flex
  flex-wrap wrap
  justify-content space-between
  align-items center
  padding 0.75rem 1.5rem
  border-bottom 1px solid
  gap 0.75rem
  position sticky
  top 0
  z-index 40
  backdrop-filter blur(12px)

  .lineup-light &
    background rgba(255, 255, 255, 0.85)
    border-color #e2e8f0
    box-shadow var(--shadow-sm)

  .lineup-dark &
    background rgba(11, 17, 32, 0.85)
    border-color #1e293b
    box-shadow var(--shadow-sm)

.toolbar-left
  display flex
  align-items center
  gap 0.75rem

.toolbar-icon
  font-size 1.5rem

.toolbar-title-group
  display flex
  flex-direction column

.toolbar-title
  font-family var(--font-heading)
  font-size 1.15rem
  font-weight 800
  letter-spacing 0.03em
  margin 0

  .lineup-light &
    color #0f172a

  .lineup-dark &
    color #f8fafc

.toolbar-subtitle
  font-size 0.75rem
  font-weight 600
  color #3b82f6

  .lineup-dark &
    color #60a5fa

.toolbar-actions
  display flex
  flex-wrap wrap
  align-items center
  gap 0.5rem

.btn-action
  padding 0.45rem 0.85rem
  border-radius var(--radius-md, 12px)
  font-family var(--font-body)
  font-size 0.8rem
  font-weight 600
  border 1px solid
  cursor pointer
  display flex
  align-items center
  gap 0.35rem
  box-shadow var(--shadow-sm)
  transition all 0.2s ease

  &:hover
    transform translateY(-1px)
    box-shadow var(--shadow-md)

  &.btn-add-division
    background #f0fdf4
    border-color #bbf7d0
    color #16a34a
    .lineup-dark &
      background rgba(34, 197, 94, 0.15)
      border-color rgba(34, 197, 94, 0.3)
      color #4ade80
    &:hover
      background #22c55e
      color #ffffff

  &.btn-manage-skills
    background #fefce8
    border-color #fef08a
    color #ca8a04
    .lineup-dark &
      background rgba(234, 179, 8, 0.15)
      border-color rgba(234, 179, 8, 0.3)
      color #fde047
    &:hover
      background #eab308
      color #ffffff

  &.btn-mode
    &.mode-edit
      background #eff6ff
      border-color #bfdbfe
      color #2563eb
      .lineup-dark &
        background rgba(37, 99, 235, 0.2)
        border-color rgba(59, 130, 246, 0.4)
        color #93c5fd
    &.mode-view
      background var(--color-bg-subtle)
      border-color var(--color-border)
      color var(--color-text)

  &.btn-add-member
    background #f0f9ff
    border-color #bae6fd
    color #0284c7
    .lineup-dark &
      background rgba(56, 189, 248, 0.15)
      border-color rgba(56, 189, 248, 0.3)
      color #38bdf8

  &.btn-capture
    background #faf5ff
    border-color #e9d5ff
    color #9333ea
    .lineup-dark &
      background rgba(168, 85, 247, 0.15)
      border-color rgba(168, 85, 247, 0.3)
      color #c084fc

  &.btn-save
    background #3b82f6
    border-color #2563eb
    color #ffffff
    box-shadow 0 2px 8px rgba(59, 130, 246, 0.3)
    &:hover
      background #2563eb

.select-event-box
  display flex
  align-items center

.event-select
  padding 0.45rem 0.75rem
  border-radius var(--radius-md, 12px)
  border 1px solid var(--color-border)
  font-size 0.8rem
  outline none
  background var(--color-surface)
  color inherit

.sect-legend-bar
  display flex
  flex-wrap wrap
  align-items center
  justify-content center
  gap 1rem
  padding 0.5rem 1rem
  border-bottom 1px solid
  font-size 0.75rem

  .lineup-light &
    background #ffffff
    border-color #e2e8f0

  .lineup-dark &
    background #0b1120
    border-color #1e293b

.legend-label
  font-weight 700
  text-transform uppercase
  color #64748b
  letter-spacing 0.05em

.legend-item
  display flex
  align-items center
  gap 0.35rem

.legend-icon
  width 18px
  height 18px
  border-radius 50%
  object-fit cover

.legend-dot
  width 10px
  height 10px
  border-radius 50%

.legend-name
  font-weight 600

.lineup-workspace
  display flex
  flex 1
  padding 1rem
  gap 1rem
  position relative
  max-width 100%
  overflow-x hidden

.attendance-pool-col
  width 270px
  flex-shrink 0

.lineup-matrix-box
  flex 1
  min-width 0
  border-radius var(--radius-lg, 16px)
  border 1px solid
  padding 1rem
  box-shadow var(--shadow-md)

  &.matrix-light
    background #ffffff
    border-color #e2e8f0

  &.matrix-dark
    background #0f172a
    border-color #1e293b

.divisions-list-container
  display flex
  flex-direction column
  gap 0.75rem
</style>
