<template lang="pug">
Teleport(to="body")
  Transition(name="fade")
    .note-modal-overlay(
      v-if="visible"
      @click.self="$emit('close')"
    )
      .note-modal-card(
        :class="themeStore.theme === 'light' ? 'modal-light' : 'modal-dark'"
      )
        //- Modal Header
        .modal-header
          .header-left
            span.modal-icon 📝
            .title-group
              h3.modal-title GHI CHÚ CHIẾN THUẬT
              span.modal-subtitle {{ getContextSubtitle() }}
          button.close-btn(@click="$emit('close')") ✕

        //- Scope Navigation Tabs
        .scope-tabs-bar
          button.tab-btn(
            v-if="target && target.type === 'member'"
            type="button"
            :class="{ active: activeTab === 'member' }"
            @click="activeTab = 'member'"
          )
            span.tab-icon 👤
            span.tab-label Cá Nhân
            span.tab-badge(v-if="form.memberNote") ✦

          button.tab-btn(
            v-if="target && (target.type === 'member' || target.type === 'team')"
            type="button"
            :class="{ active: activeTab === 'team' }"
            @click="activeTab = 'team'"
          )
            span.tab-icon ⚔️
            span.tab-label Toàn Đội
            span.tab-badge(v-if="form.teamNote") ✦

          button.tab-btn(
            type="button"
            :class="{ active: activeTab === 'division' }"
            @click="activeTab = 'division'"
          )
            span.tab-icon 🚩
            span.tab-label Toàn Đoàn
            span.tab-badge(v-if="form.divisionNote") ✦

        //- Modal Body Content
        .modal-body
          //- 1. Tab Cá Nhân
          .tab-content(v-if="activeTab === 'member'")
            .target-info-card
              .info-header
                .member-avatar-chip(:style="memberClassStyle")
                  img.class-img(v-if="memberClassInfo.icon" :src="memberClassInfo.icon" :alt="memberClassInfo.name")
                  span.class-name {{ memberClassInfo.name }}
                .member-details
                  h4.member-name {{ target?.memberName || 'Thành viên' }}
                  span.member-sub {{ target?.divisionName }} • {{ target?.teamName }} • Vị trí {{ (target?.sIdx || 0) + 1 }}

              .form-group
                label.form-label
                  span 📝 Ghi Chú Riêng Cho Thành Viên
                  span.char-count {{ (form.memberNote || '').length }}/200
                textarea.form-textarea(
                  v-model="form.memberNote"
                  rows="4"
                  maxlength="200"
                  placeholder="Nhập nhiệm vụ riêng cho thành viên này (ví dụ: Cầm cờ 1, cắn buff thủ, gom địch, focus Healer đối phương...)"
                )
                span.form-hint * Ghi chú cá nhân sẽ được gửi trực tiếp qua DM Discord cho thành viên này khi xuất thông báo.

          //- 2. Tab Toàn Đội (Team)
          .tab-content(v-else-if="activeTab === 'team'")
            .target-info-card
              .team-info-banner
                span.banner-icon ⚔️
                .banner-text
                  h4.banner-title {{ target?.teamName || 'Team' }}
                  span.banner-sub Thuộc {{ target?.divisionName || 'Đoàn' }}

              .form-group
                label.form-label
                  span 🛡️ Chiến Thuật / Ghi Chú Toàn Đội
                  span.char-count {{ (form.teamNote || '').length }}/300
                textarea.form-textarea(
                  v-model="form.teamNote"
                  rows="4"
                  maxlength="300"
                  placeholder="Nhập chiến thuật cho toàn đội (ví dụ: Đánh trụ cánh trái, bọc lót cho Healer, di chuyển bám sát Team 2...)"
                )
                span.form-hint * Ghi chú này áp dụng cho toàn bộ 6 vị trí trong team và được đính kèm trong thông báo Discord.

          //- 3. Tab Toàn Đoàn (Division)
          .tab-content(v-else-if="activeTab === 'division'")
            .target-info-card
              .division-info-banner
                span.banner-icon 🚩
                .banner-text
                  h4.banner-title {{ target?.divisionName || 'Toàn Đoàn' }}
                  span.banner-sub Đại quân chỉ huy chiến dịch

              .form-group
                label.form-label
                  span 📢 Chỉ Thị / Ghi Chú Toàn Đoàn
                  span.char-count {{ (form.divisionNote || '').length }}/500
                textarea.form-textarea(
                  v-model="form.divisionNote"
                  rows="5"
                  maxlength="500"
                  placeholder="Nhập chỉ thị tổng thể cho toàn đoàn (ví dụ: Tập trung tại cổng Bắc lúc 20h00, phá trụ trung tâm khi có lệnh...)"
                )
                span.form-hint * Chỉ thị toàn đoàn sẽ hiển thị cho mọi thành viên thuộc đoàn này.

        //- Modal Footer Actions
        .modal-footer
          button.btn-cancel(type="button" @click="$emit('close')") Hủy Bỏ
          button.btn-submit(type="button" @click="handleSave")
            span 💾 Lưu Ghi Chú
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { useThemeStore } from '../../stores/themeStore';
import { getClassInfo } from '../../theme/classColors';

const props = defineProps({
  visible: { type: Boolean, default: false },
  target: { type: Object, default: null },
});

const emit = defineEmits(['close', 'save']);
const themeStore = useThemeStore();

const activeTab = ref('member');

const form = reactive({
  memberNote: '',
  teamNote: '',
  divisionNote: '',
});

watch(
  () => [props.visible, props.target],
  ([newVisible, newTarget]) => {
    if (newVisible && newTarget) {
      activeTab.value = newTarget.type || 'member';
      form.memberNote = newTarget.memberNote || '';
      form.teamNote = newTarget.teamNote || '';
      form.divisionNote = newTarget.divisionNote || '';
    }
  },
  { immediate: true }
);

const memberClassInfo = computed(() => {
  return getClassInfo(props.target?.memberClassName || '');
});

const memberClassStyle = computed(() => {
  const hex = memberClassInfo.value.hex || '#3b82f6';
  return {
    backgroundColor: hex,
    color: '#ffffff',
  };
});

const getContextSubtitle = () => {
  if (!props.target) return 'Ghi chú sơ đồ đội hình';
  if (props.target.type === 'member') {
    return `${props.target.divisionName} • ${props.target.teamName} • ${props.target.memberName}`;
  }
  if (props.target.type === 'team') {
    return `${props.target.divisionName} • ${props.target.teamName}`;
  }
  return `${props.target.divisionName}`;
};

const handleSave = () => {
  emit('save', {
    dIdx: props.target?.dIdx,
    tIdx: props.target?.tIdx,
    sIdx: props.target?.sIdx,
    memberNote: form.memberNote,
    teamNote: form.teamNote,
    divisionNote: form.divisionNote,
  });
};
</script>

<style lang="stylus" scoped>
.fade-enter-active, .fade-leave-active
  transition opacity 0.25s ease

.fade-enter-from, .fade-leave-to
  opacity 0

.note-modal-overlay
  position fixed
  inset 0
  background rgba(0, 0, 0, 0.75)
  backdrop-filter blur(6px)
  display flex
  align-items center
  justify-content center
  z-index 9999
  padding 1rem

.note-modal-card
  width 100%
  max-width 560px
  border-radius 16px
  display flex
  flex-direction column
  box-shadow 0 25px 50px -12px rgba(0, 0, 0, 0.6)
  overflow hidden
  transition all 0.3s ease
  animation modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1)

@keyframes modalPop
  from
    transform scale(0.95) translateY(10px)
    opacity 0
  to
    transform scale(1) translateY(0)
    opacity 1

.modal-dark
  background #0b1120
  border 1px solid rgba(224, 184, 84, 0.25)
  color #f1f5f9

.modal-light
  background #ffffff
  border 1px solid #e2e8f0
  color #0f172a

.modal-header
  display flex
  align-items center
  justify-content space-between
  padding 1.25rem 1.5rem
  border-bottom 1px solid rgba(148, 163, 184, 0.15)

  .header-left
    display flex
    align-items center
    gap 0.85rem

  .modal-icon
    font-size 1.75rem

  .modal-title
    margin 0
    font-size 1.15rem
    font-weight 800
    letter-spacing 0.5px
    background linear-gradient(135deg, #f59e0b 0%, #eab308 100%)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

  .modal-subtitle
    display block
    font-size 0.8rem
    color #94a3b8
    margin-top 0.15rem

  .close-btn
    background transparent
    border none
    color #94a3b8
    font-size 1.25rem
    cursor pointer
    padding 0.35rem 0.6rem
    border-radius 8px
    transition all 0.2s
    &:hover
      color #ef4444
      background rgba(239, 68, 68, 0.1)

// Tabs Bar
.scope-tabs-bar
  display flex
  gap 0.5rem
  padding 0.75rem 1.5rem
  background rgba(15, 23, 42, 0.4)
  border-bottom 1px solid rgba(148, 163, 184, 0.1)

.modal-light .scope-tabs-bar
  background #f8fafc

.tab-btn
  flex 1
  display flex
  align-items center
  justify-content center
  gap 0.4rem
  padding 0.6rem 0.8rem
  border-radius 10px
  border 1px solid transparent
  background transparent
  color #94a3b8
  font-weight 600
  font-size 0.88rem
  cursor pointer
  transition all 0.2s

  &:hover
    color #f1f5f9
    background rgba(255, 255, 255, 0.05)

  &.active
    background linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(234, 179, 8, 0.1))
    border-color rgba(245, 158, 11, 0.5)
    color #fbbf24
    box-shadow 0 4px 12px rgba(245, 158, 11, 0.15)

.modal-light .tab-btn
  color #64748b
  &:hover
    color #0f172a
    background #e2e8f0
  &.active
    background #fef3c7
    border-color #f59e0b
    color #b45309

.tab-badge
  font-size 0.65rem
  color #eab308

.modal-body
  padding 1.5rem
  display flex
  flex-direction column
  gap 1.25rem

.target-info-card
  display flex
  flex-direction column
  gap 1rem

.info-header
  display flex
  align-items center
  gap 0.85rem
  padding 0.75rem 1rem
  background rgba(30, 41, 59, 0.5)
  border-radius 12px
  border 1px solid rgba(148, 163, 184, 0.1)

.modal-light .info-header
  background #f1f5f9
  border-color #e2e8f0

.member-avatar-chip
  display inline-flex
  align-items center
  gap 0.35rem
  padding 0.3rem 0.65rem
  border-radius 20px
  font-size 0.78rem
  font-weight 700

  .class-img
    width 16px
    height 16px
    object-fit contain

.member-details
  .member-name
    margin 0
    font-size 1rem
    font-weight 700
    color #f8fafc

  .member-sub
    font-size 0.78rem
    color #94a3b8

.modal-light .member-details
  .member-name
    color #0f172a
  .member-sub
    color #64748b

.team-info-banner, .division-info-banner
  display flex
  align-items center
  gap 0.85rem
  padding 0.85rem 1.1rem
  border-radius 12px
  background rgba(30, 41, 59, 0.5)
  border 1px solid rgba(148, 163, 184, 0.1)

  .banner-icon
    font-size 1.6rem

  .banner-title
    margin 0
    font-size 1.05rem
    font-weight 800
    color #f8fafc

  .banner-sub
    font-size 0.8rem
    color #94a3b8

.modal-light .team-info-banner, .modal-light .division-info-banner
  background #f1f5f9
  border-color #e2e8f0
  .banner-title
    color #0f172a
  .banner-sub
    color #64748b

.form-group
  display flex
  flex-direction column
  gap 0.45rem

.form-label
  display flex
  justify-content space-between
  align-items center
  font-size 0.85rem
  font-weight 700
  color #cbd5e1

.modal-light .form-label
  color #334155

.char-count
  font-size 0.75rem
  color #64748b
  font-weight normal

.form-textarea
  width 100%
  padding 0.85rem 1rem
  border-radius 12px
  font-size 0.9rem
  line-height 1.5
  resize vertical
  font-family inherit
  outline none
  transition all 0.2s

  background #0f172a
  border 1px solid #334155
  color #f8fafc

  &:focus
    border-color #f59e0b
    box-shadow 0 0 0 3px rgba(245, 158, 11, 0.15)

.modal-light .form-textarea
  background #ffffff
  border-color #cbd5e1
  color #0f172a

  &:focus
    border-color #f59e0b
    box-shadow 0 0 0 3px rgba(245, 158, 11, 0.2)

.form-hint
  font-size 0.75rem
  color #64748b
  font-style italic

.modal-footer
  display flex
  align-items center
  justify-content flex-end
  gap 0.75rem
  padding 1rem 1.5rem
  border-top 1px solid rgba(148, 163, 184, 0.15)

.btn-cancel
  padding 0.65rem 1.25rem
  border-radius 10px
  font-size 0.88rem
  font-weight 600
  border 1px solid #475569
  background transparent
  color #94a3b8
  cursor pointer
  transition all 0.2s
  &:hover
    background rgba(148, 163, 184, 0.1)
    color #f1f5f9

.modal-light .btn-cancel
  border-color #cbd5e1
  color #64748b
  &:hover
    background #f1f5f9
    color #0f172a

.btn-submit
  display flex
  align-items center
  gap 0.4rem
  padding 0.65rem 1.4rem
  border-radius 10px
  font-size 0.88rem
  font-weight 700
  border none
  cursor pointer
  background linear-gradient(135deg, #f59e0b 0%, #d97706 100%)
  color #0f172a
  box-shadow 0 4px 14px rgba(245, 158, 11, 0.3)
  transition all 0.2s
  &:hover
    transform translateY(-1px)
    box-shadow 0 6px 18px rgba(245, 158, 11, 0.45)
    background linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)
  &:active
    transform translateY(0)
</style>
