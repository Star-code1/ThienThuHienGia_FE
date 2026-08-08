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
    background #ffffff
    border 1px solid #cbd5e1
    box-shadow 0 20px 40px rgba(0, 0, 0, 0.15)
    color #0f172a

  &.modal-dark
    background rgba(8, 13, 25, 0.95)
    border 1px solid rgba(245, 197, 24, 0.4)
    box-shadow 0 0 40px rgba(245, 197, 24, 0.15)
    color #e2e8f0

.modal-header
  display flex
  align-items center
  justify-content space-between
  padding-bottom 0.75rem
  border-bottom 1px solid
  margin-bottom 1rem

  .modal-light &
    border-color #e2e8f0

  .modal-dark &
    border-color #1c2c47

.header-left
  display flex
  align-items center
  gap 0.5rem

.modal-icon
  font-size 1.25rem

.modal-title
  font-size 0.9rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.05em
  margin 0

  .modal-light &
    background linear-gradient(to right, #b45309, #d97706)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

  .modal-dark &
    background linear-gradient(to right, #fef08a, #f5c518, #b45309)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

.modal-subtitle
  font-size 0.6rem
  font-family monospace
  display block

  .modal-light &
    color #64748b

  .modal-dark &
    color #64748b

.close-btn
  width 1.75rem
  height 1.75rem
  border-radius 0.5rem
  font-size 0.75rem
  display flex
  align-items center
  justify-content center
  cursor pointer
  border 1px solid
  transition all 0.15s ease

  .modal-light &
    background #f1f5f9
    border-color #cbd5e1
    color #64748b
    &:hover
      color #dc2626
      border-color #dc2626

  .modal-dark &
    background #0f172a
    border-color #1e293b
    color #94a3b8
    &:hover
      color #ffffff
      border-color #ef5757

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
  letter-spacing 0.05em
  margin-bottom 0.35rem

  .modal-light &
    color #0f172a

  .modal-dark &
    color #e2e8f0

.required-star
  color #ef5757

.form-input
  width 100%
  font-size 0.75rem
  font-weight 600
  padding 0.65rem 0.85rem
  border-radius 0.75rem
  border 1px solid
  outline none
  box-sizing border-box
  font-family 'Lora', serif

  .modal-light &
    background #ffffff
    border-color #cbd5e1
    color #0f172a
    &::placeholder
      color #94a3b8
    &:focus
      border-color #b45309

  .modal-dark &
    background #050912
    border-color #1e293b
    color #ffffff
    &::placeholder
      color #475569
    &:focus
      border-color #f5c518

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
  border-radius 0.75rem
  border 1px solid
  cursor pointer
  transition all 0.15s ease
  background none

  .modal-light &
    background #f8fafc
    border-color #e2e8f0
    color #475569
    &:hover
      border-color #b45309
      color #0f172a

  .modal-dark &
    background rgba(6, 10, 18, 0.8)
    border-color #142033
    color #94a3b8
    &:hover
      border-color #2b4266
      color #ffffff

  &.selected
    .modal-light &
      background #fef3c7
      border-color #b45309
      color #b45309
      box-shadow 0 0 10px rgba(180, 83, 9, 0.2)

    .modal-dark &
      background #18263e
      border-color #f5c518
      color #f5c518
      box-shadow 0 0 12px rgba(245, 197, 24, 0.25)
      transform scale(1.03)

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
  font-size 0.625rem
  font-weight 700
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

.target-location-box
  padding 0.65rem
  border-radius 0.75rem
  border 1px solid
  font-size 0.75rem

  .modal-light &
    background #f1f5f9
    border-color #cbd5e1
    color #475569

  .modal-dark &
    background #0f172a
    border-color #1e2a3e
    color #94a3b8

.target-label
  font-size 0.6rem
  font-weight 700
  text-transform uppercase
  display block

  .modal-light &
    color #64748b

  .modal-dark &
    color #64748b

.target-value
  font-weight 700
  display block
  margin-top 0.1rem

  .modal-light &
    color #b45309

  .modal-dark &
    color #f5c518

.modal-actions
  padding-top 0.75rem
  border-top 1px solid
  display flex
  align-items center
  justify-content flex-end
  gap 0.65rem

  .modal-light &
    border-color #e2e8f0

  .modal-dark &
    border-color #18263e

.btn-cancel
  padding 0.5rem 1rem
  border-radius 0.75rem
  font-size 0.75rem
  font-weight 600
  cursor pointer
  transition all 0.15s ease

  .modal-light &
    background #f1f5f9
    border 1px solid #cbd5e1
    color #475569
    &:hover
      background #e2e8f0
      color #0f172a

  .modal-dark &
    background #0f172a
    border 1px solid #1e293b
    color #94a3b8
    &:hover
      background #1e293b
      color #ffffff

.btn-submit
  padding 0.5rem 1.25rem
  border-radius 0.75rem
  font-size 0.75rem
  font-weight 800
  cursor pointer
  transition all 0.2s ease
  border none

  .modal-light &
    background linear-gradient(to right, #b45309, #d97706)
    color #ffffff
    box-shadow 0 4px 15px rgba(180, 83, 9, 0.3)
    &:hover
      filter brightness(1.1)

  .modal-dark &
    background linear-gradient(to right, #d97706, #f5c518, #b45309)
    color #020617
    box-shadow 0 0 15px rgba(245, 197, 24, 0.3)
    &:hover
      filter brightness(1.25)
      transform scale(1.03)

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s ease

.fade-enter-from, .fade-leave-to
  opacity 0
</style>
