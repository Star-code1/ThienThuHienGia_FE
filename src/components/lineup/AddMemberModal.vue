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
            span.modal-icon 📜
            .title-group
              h3.modal-title THÊM THÀNH VIÊN MỚI
              span.modal-subtitle THÊM ĐỆ TỬ VÀO MA TRẬN ĐỘI HÌNH
          button.close-btn(@click="$emit('close')") ✕

        form.modal-form(@submit.prevent="handleSubmit")
          .form-group
            label.form-label
              | Tên Đệ Tử / Biệt Danh 
              span.required-star *
            input.form-input(
              v-model="form.displayName"
              type="text"
              required
              placeholder="Nhập tên đệ tử..."
            )

          .form-group
            label.form-label
              | Chọn Võ Phái 
              span.required-star *
            .class-grid
              button.class-item(
                v-for="c in CLASS_LIST"
                :key="c.name"
                type="button"
                @click="form.className = c.name"
                :class="{ 'selected': form.className === c.name }"
              )
                img.class-icon(v-if="c.icon" :src="c.icon" :alt="c.name")
                span.class-dot(v-else :style="{ backgroundColor: c.hex }")
                span.class-name {{ c.name }}

          .form-group
            label.form-label Ghi Chú / Vai Trò (Tùy chọn)
            input.form-input(
              v-model="form.note"
              type="text"
              placeholder="VD: Tanker, Heal AOE, Tiên Phong..."
            )

          .target-location-box(v-if="targetSlotInfo")
            span.target-label Vị Trí Đích:
            span.target-value {{ targetSlotInfo.label }}

          .modal-actions
            button.btn-cancel(type="button" @click="$emit('close')") Hủy
            button.btn-submit(type="submit") ➕ Thêm Thành Viên
</template>

<script setup>
import { reactive, watch } from 'vue';
import { CLASS_LIST } from '../../theme/classColors';
import { useThemeStore } from '../../stores/themeStore';

const props = defineProps({
  visible: { type: Boolean, default: false },
  targetSlotInfo: { type: Object, default: null }
});

const emit = defineEmits(['close', 'add']);
const themeStore = useThemeStore();

const form = reactive({
  displayName: '',
  className: 'Long Ngâm',
  note: ''
});

watch(() => props.visible, (newVal) => {
  if (newVal) {
    form.displayName = '';
    form.className = 'Long Ngâm';
    form.note = '';
  }
});

const handleSubmit = () => {
  if (!form.displayName.trim()) return;

  emit('add', {
    displayName: form.displayName.trim(),
    className: form.className,
    note: form.note.trim()
  });

  emit('close');
};
</script>

<style lang="stylus" scoped>
.modal-overlay
  position fixed
  inset 0
  z-index 50
  background rgba(0, 0, 0, 0.8)
  backdrop-filter blur(4px)
  display flex
  align-items center
  justify-content center
  padding 1rem
  user-select none
  font-family 'Lora', serif

.modal-card
  position relative
  width 100%
  max-width 28rem
  border-radius 1rem
  padding 1.25rem
  overflow hidden
  backdrop-filter blur(12px)

  &.modal-light
    background var(--color-surface)
    border 1px solid var(--color-border)
    box-shadow var(--shadow-modal)
    color var(--color-text)

  &.modal-dark
    background #2a191c
    border 1px solid #3b2327
    box-shadow var(--shadow-modal)
    color #f8fafc

.modal-header
  display flex
  align-items center
  justify-content space-between
  padding-bottom 0.75rem
  border-bottom 1px solid
  margin-bottom 1rem

  .modal-light &
    border-color var(--color-border)

  .modal-dark &
    border-color #3b2327

.header-left
  display flex
  align-items center
  gap 0.5rem

.modal-icon
  font-size 1.25rem

.modal-title
  font-size 0.95rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.03em
  margin 0

  .modal-light &
    color var(--color-text)

  .modal-dark &
    color #f8fafc

.modal-subtitle
  font-size 0.65rem
  font-family var(--font-body)
  display block
  color var(--color-muted)

.close-btn
  width 1.75rem
  height 1.75rem
  border-radius 50%
  font-size 0.75rem
  display flex
  align-items center
  justify-content center
  cursor pointer
  border 1px solid
  transition all 0.2s ease

  .modal-light &
    background var(--color-bg-subtle)
    border-color var(--color-border)
    color var(--color-muted)
    &:hover
      color #ef4444
      border-color #fecaca

  .modal-dark &
    background #321e21
    border-color #3b2327
    color var(--color-text-secondary)
    &:hover
      color #ffffff
      border-color #ef4444

.modal-form
  display flex
  flex-direction column
  gap 1rem

.form-group
  display flex
  flex-direction column

.form-label
  font-size 0.75rem
  font-weight 700
  text-transform uppercase
  letter-spacing 0.03em
  margin-bottom 0.35rem

  .modal-light &
    color var(--color-text)

  .modal-dark &
    color #e2e8f0

.required-star
  color #ef4444

.form-input
  width 100%
  font-size 0.8rem
  font-weight 500
  padding 0.55rem 0.85rem
  border-radius var(--radius-md, 12px)
  border 1px solid
  outline none
  box-sizing border-box
  font-family var(--font-body)
  transition all 0.2s ease

  .modal-light &
    background var(--color-bg-subtle)
    border-color var(--color-border)
    color var(--color-text)
    &::placeholder
      color var(--color-text-secondary)
    &:focus
      border-color var(--color-brand)
      box-shadow 0 0 0 3px rgba(59, 130, 246, 0.15)

  .modal-dark &
    background #321e21
    border-color #3b2327
    color #ffffff
    &::placeholder
      color var(--color-muted)
    &:focus
      border-color var(--color-brand)
      box-shadow 0 0 0 3px rgba(96, 165, 250, 0.15)

.class-grid
  display grid
  grid-template-columns repeat(4, minmax(0, 1fr))
  gap 0.5rem

.class-item
  display flex
  flex-direction column
  align-items center
  justify-content center
  padding 0.5rem
  border-radius var(--radius-md, 12px)
  border 1px solid
  cursor pointer
  transition all 0.2s ease
  background none

  .modal-light &
    background var(--color-bg-subtle)
    border-color var(--color-border)
    color var(--color-text-secondary)
    &:hover
      border-color var(--color-brand)
      color var(--color-text)

  .modal-dark &
    background #321e21
    border-color #3b2327
    color var(--color-text-secondary)
    &:hover
      border-color var(--color-brand)
      color #ffffff

  &.selected
    .modal-light &
      background var(--color-brand-subtle)
      border-color var(--color-brand)
      color var(--color-brand)
      box-shadow var(--shadow-sm)

    .modal-dark &
      background rgba(37, 99, 235, 0.2)
      border-color var(--color-brand)
      color var(--color-brand)
      box-shadow var(--shadow-sm)

.class-icon
  width 1.5rem
  height 1.5rem
  object-fit contain
  margin-bottom 0.25rem

.class-dot
  width 0.75rem
  height 0.75rem
  border-radius 9999px
  margin-bottom 0.25rem

.class-name
  font-size 0.65rem
  font-weight 700
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

.target-location-box
  padding 0.65rem
  border-radius var(--radius-md, 12px)
  border 1px solid
  font-size 0.75rem

  .modal-light &
    background var(--color-bg-subtle)
    border-color var(--color-border)
    color var(--color-text-secondary)

  .modal-dark &
    background #321e21
    border-color #3b2327
    color var(--color-text-secondary)

.target-label
  font-size 0.6rem
  font-weight 700
  text-transform uppercase
  display block
  color var(--color-muted)

.target-value
  font-weight 700
  display block
  margin-top 0.1rem
  color var(--color-brand)

.modal-actions
  padding-top 0.75rem
  border-top 1px solid
  display flex
  align-items center
  justify-content flex-end
  gap 0.65rem

  .modal-light &
    border-color var(--color-border)

  .modal-dark &
    border-color #3b2327

.btn-cancel
  padding 0.5rem 1rem
  border-radius var(--radius-md, 12px)
  font-size 0.75rem
  font-weight 600
  cursor pointer
  transition all 0.2s ease
  background var(--color-bg-subtle)
  border 1px solid var(--color-border)
  color var(--color-text)
  &:hover
    border-color var(--color-brand)

.btn-submit
  padding 0.5rem 1.25rem
  border-radius var(--radius-md, 12px)
  font-size 0.75rem
  font-weight 700
  cursor pointer
  transition all 0.2s ease
  border none
  background var(--color-brand)
  color #ffffff
  box-shadow 0 2px 8px rgba(59, 130, 246, 0.3)
  &:hover
    background var(--color-brand)
    transform translateY(-1px)

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s ease

.fade-enter-from, .fade-leave-to
  opacity 0
</style>
