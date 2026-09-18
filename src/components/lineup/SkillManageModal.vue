<template lang="pug">
.modal-overlay(v-if="visible" @click.self="$emit('close')")
  .modal-container(
    :class="themeStore.theme === 'light' ? 'modal-light' : 'modal-dark'"
  )
    //- Modal Header
    .modal-header
      .header-title-box
        span.header-icon ⚡
        h3.header-title QUẢN LÝ KỸ NĂNG & PHÂN CÔNG CHIẾN THUẬT
      button.btn-close(@click="$emit('close')") ✕

    //- Modal Body
    .modal-body
      //- Tab / Form thêm kỹ năng mới
      .add-skill-card
        h4.section-heading ➕ Thêm Kỹ Năng Mới Vào Database
        .form-grid
          .form-group
            label.form-label Tên Kỹ Năng / Phân Công *
            input.form-input(
              v-model="newSkillName"
              placeholder="VD: Thái Cực Đồ, Như Phong Tự Bế, Bất Tử..."
              @keyup.enter="handleCreateSkill"
            )

          .form-group
            label.form-label Phân Loại
            select.form-select(v-model="newSkillCategory")
              option(value="Tuyệt Kỹ / Phòng Thủ") Tuyệt Kỹ / Phòng Thủ
              option(value="Khống Chế") Khống Chế
              option(value="Sinh Tồn") Sinh Tồn
              option(value="Sát Thương") Sát Thương
              option(value="Hỗ Trợ / Buff") Hỗ Trợ / Buff
              option(value="Hồi Máu") Hồi Máu
              option(value="Chung") Khác

          .form-group.full-width
            label.form-label Icon / Ảnh Kỹ Năng *
            .icon-upload-row
              //- File upload
              label.btn-upload-file
                span 📁 Tải ảnh lên
                input(
                  type="file"
                  accept="image/*"
                  @change="handleFileUpload"
                  class="hidden-file-input"
                )

              //- Or URL input
              input.form-input.url-input(
                v-model="newSkillIconUrl"
                placeholder="Hoặc dán URL ảnh trực tiếp (https://...)"
              )

              //- Preview box
              .icon-preview-box(v-if="newSkillIconUrl")
                img.icon-preview-img(:src="newSkillIconUrl" alt="Preview")

        .form-actions
          button.btn-submit-skill(
            @click="handleCreateSkill"
            :disabled="isSubmitting"
          )
            span {{ isSubmitting ? 'Đang Lưu...' : '💾 Lưu Kỹ Năng Vào Database' }}

      //- Danh sách kỹ năng hiện có
      .skills-catalog-section
        .catalog-header
          h4.section-heading 📜 Danh Sách Kỹ Năng Trong Database ({{ skillStore.allSkills.length }})
          span.catalog-hint Click vào kỹ năng để gán nhanh hoặc bấm xoá

        .skills-grid
          .skill-card-item(
            v-for="skill in skillStore.allSkills"
            :key="skill._id || skill.id"
            :class="themeStore.theme === 'light' ? 'item-light' : 'item-dark'"
          )
            .skill-item-left
              img.skill-thumb(:src="skill.iconUrl" :alt="skill.name")
              .skill-meta
                span.skill-name {{ skill.name }}
                span.skill-category {{ skill.category || 'Chung' }}
            
            button.btn-delete-skill(
              @click="handleDeleteSkill(skill._id || skill.id, skill.name)"
              title="Xoá kỹ năng khỏi database"
            ) 🗑️

    //- Modal Footer
    .modal-footer
      button.btn-close-modal(@click="$emit('close')") Đóng
</template>

<script setup>
import { ref } from 'vue';
import { useSkillStore } from '../../stores/skillStore';
import { useThemeStore } from '../../stores/themeStore';
import Swal from 'sweetalert2';

defineProps({
  visible: { type: Boolean, default: false },
});

const emit = defineEmits(['close']);

const skillStore = useSkillStore();
const themeStore = useThemeStore();

const newSkillName = ref('');
const newSkillCategory = ref('Tuyệt Kỹ / Phòng Thủ');
const newSkillIconUrl = ref('');
const isSubmitting = ref(false);

const handleFileUpload = (evt) => {
  const file = evt.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    Swal.fire({ icon: 'warning', title: 'File quá lớn', text: 'Vui lòng chọn ảnh < 2MB' });
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    newSkillIconUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const handleCreateSkill = async () => {
  if (!newSkillName.value.trim()) {
    Swal.fire({ icon: 'warning', title: 'Thiếu tên kỹ năng', text: 'Vui lòng nhập tên kỹ năng!' });
    return;
  }
  if (!newSkillIconUrl.value.trim()) {
    Swal.fire({ icon: 'warning', title: 'Thiếu ảnh icon', text: 'Vui lòng tải ảnh hoặc dán URL icon!' });
    return;
  }

  isSubmitting.value = true;
  try {
    const res = await skillStore.addSkill({
      name: newSkillName.value.trim(),
      iconUrl: newSkillIconUrl.value.trim(),
      category: newSkillCategory.value,
    });
    if (res) {
      newSkillName.value = '';
      newSkillIconUrl.value = '';
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleDeleteSkill = async (id, name) => {
  const result = await Swal.fire({
    title: 'Xác nhận xoá?',
    text: `Bạn có chắc muốn xoá kỹ năng "${name}" khỏi database?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xoá vĩnh viễn',
    cancelButtonText: 'Huỷ',
    confirmButtonColor: '#ef4444',
  });

  if (result.isConfirmed) {
    await skillStore.deleteSkill(id);
  }
};
</script>

<style lang="stylus" scoped>
.modal-overlay
  position fixed
  inset 0
  background rgba(0, 0, 0, 0.75)
  backdrop-filter blur(6px)
  z-index 9999
  display flex
  align-items center
  justify-content center
  padding 1rem

.modal-container
  width 100%
  max-width 750px
  max-height 90vh
  border-radius 0.5rem
  border 2px solid
  display flex
  flex-direction column
  overflow hidden
  box-shadow 0 20px 40px rgba(0, 0, 0, 0.5)

  &.modal-light
    background #ffffff
    border-color #0284c7
    color #0f172a

  &.modal-dark
    background #0f172a
    border-color #38bdf8
    color #f8fafc

.modal-header
  display flex
  justify-content space-between
  align-items center
  padding 1rem 1.25rem
  border-bottom 2px solid
  background rgba(56, 189, 248, 0.1)

  .modal-light &
    border-color #e2e8f0

  .modal-dark &
    border-color #1e293b

.header-title-box
  display flex
  align-items center
  gap 0.5rem

.header-icon
  font-size 1.25rem

.header-title
  font-family 'Chakra Petch', sans-serif
  font-size 1.1rem
  font-weight 700
  letter-spacing 0.05em
  margin 0

.btn-close
  background none
  border none
  font-size 1.2rem
  cursor pointer
  color inherit
  padding 0.25rem 0.5rem
  border-radius 0.25rem

  &:hover
    background rgba(239, 68, 68, 0.2)
    color #ef4444

.modal-body
  padding 1.25rem
  overflow-y auto
  display flex
  flex-direction column
  gap 1.5rem

.add-skill-card
  padding 1rem
  border-radius 0.375rem
  border 1px dashed
  display flex
  flex-direction column
  gap 0.85rem

  .modal-light &
    background #f8fafc
    border-color #cbd5e1

  .modal-dark &
    background #1e293b
    border-color #334155

.section-heading
  font-family 'Chakra Petch', sans-serif
  font-size 0.95rem
  font-weight 700
  margin 0

.form-grid
  display grid
  grid-template-columns 1fr 1fr
  gap 0.75rem

  @media (max-width: 640px)
    grid-template-columns 1fr

.form-group
  display flex
  flex-direction column
  gap 0.35rem

  &.full-width
    grid-column span 2
    @media (max-width: 640px)
      grid-column span 1

.form-label
  font-size 0.8rem
  font-weight 600

.form-input, .form-select
  padding 0.45rem 0.75rem
  border-radius 0.25rem
  border 1px solid
  font-size 0.85rem
  outline none

  .modal-light &
    background #ffffff
    border-color #cbd5e1
    color #0f172a

  .modal-dark &
    background #0b1120
    border-color #475569
    color #f8fafc

.icon-upload-row
  display flex
  align-items center
  gap 0.75rem

.hidden-file-input
  display none

.btn-upload-file
  padding 0.45rem 0.85rem
  border-radius 0.25rem
  background #0284c7
  color #ffffff
  font-size 0.8rem
  font-weight 600
  cursor pointer
  white-space nowrap
  transition background 0.2s

  &:hover
    background #0369a1

.url-input
  flex 1

.icon-preview-box
  width 36px
  height 36px
  border-radius 0.25rem
  border 2px solid #38bdf8
  overflow hidden
  flex-shrink 0
  display flex
  align-items center
  justify-content center
  background #000

.icon-preview-img
  width 100%
  height 100%
  object-fit cover

.form-actions
  display flex
  justify-content flex-end

.btn-submit-skill
  padding 0.5rem 1.25rem
  border-radius 0.25rem
  background linear-gradient(135deg, #0284c7, #2563eb)
  color #ffffff
  border none
  font-family 'Chakra Petch', sans-serif
  font-size 0.85rem
  font-weight 700
  cursor pointer
  transition all 0.2s

  &:hover
    box-shadow 0 0 12px rgba(56, 189, 248, 0.4)
    transform translateY(-1px)

  &:disabled
    opacity 0.6
    cursor not-allowed

.skills-catalog-section
  display flex
  flex-direction column
  gap 0.75rem

.catalog-header
  display flex
  justify-content space-between
  align-items baseline

.catalog-hint
  font-size 0.75rem
  color #94a3b8

.skills-grid
  display grid
  grid-template-columns repeat(auto-fill, minmax(200px, 1fr))
  gap 0.65rem

.skill-card-item
  display flex
  align-items center
  justify-content space-between
  padding 0.45rem 0.65rem
  border-radius 0.375rem
  border 1px solid
  transition all 0.15s ease

  &.item-light
    background #ffffff
    border-color #e2e8f0
    box-shadow 0 1px 3px rgba(0, 0, 0, 0.05)

  &.item-dark
    background #1e293b
    border-color #334155

.skill-item-left
  display flex
  align-items center
  gap 0.5rem
  overflow hidden

.skill-thumb
  width 28px
  height 28px
  border-radius 0.25rem
  object-fit cover
  border 1px solid #38bdf8
  flex-shrink 0

.skill-meta
  display flex
  flex-direction column
  overflow hidden

.skill-name
  font-size 0.8rem
  font-weight 700
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

.skill-category
  font-size 0.65rem
  color #94a3b8

.btn-delete-skill
  background none
  border none
  cursor pointer
  font-size 0.85rem
  opacity 0.6
  transition opacity 0.15s

  &:hover
    opacity 1
    transform scale(1.1)

.modal-footer
  padding 0.75rem 1.25rem
  border-top 1px solid
  display flex
  justify-content flex-end

  .modal-light &
    border-color #e2e8f0

  .modal-dark &
    border-color #1e293b

.btn-close-modal
  padding 0.4rem 1rem
  border-radius 0.25rem
  border 1px solid #64748b
  background transparent
  color inherit
  font-size 0.85rem
  cursor pointer
  transition background 0.2s

  &:hover
    background rgba(100, 116, 139, 0.2)
</style>
