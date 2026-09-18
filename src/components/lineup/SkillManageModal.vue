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
              placeholder="VD: Thái Cực Đồ, Như Phong Tự Bế..."
              @keyup.enter="handleCreateSkill"
            )

          .form-group
            label.form-label Phân Loại
            select.form-select(v-model="newSkillCategory")
              option(value="Tuyệt Kỹ") Tuyệt Kỹ
              option(value="Bách Gia") Bách Gia
              option(value="Lưu Phái") Lưu Phái
              option(value="Đồng Hành") Đồng Hành
              option(value="Rèn") Rèn

          .form-group.full-width
            label.form-label Icon / Ảnh Kỹ Năng (Tải ảnh từ thiết bị) *
            .skill-dropzone(
              @click="$refs.fileInput.click()"
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="handleDrop"
              :class="{ 'is-dragging': isDragging, 'has-file': !!newSkillIconUrl }"
            )
              input.hidden-file-input(
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileUpload"
              )
              template(v-if="!newSkillIconUrl")
                .dropzone-placeholder
                  span.upload-icon 📁
                  .upload-text-group
                    span.upload-main-text Bấm để chọn file ảnh hoặc kéo thả ảnh vào đây
                    span.upload-sub-text Hỗ trợ PNG, JPG, WEBP (Tự động tải & lưu trữ an toàn trên Cloudinary)
              template(v-else)
                .dropzone-preview-card
                  img.skill-preview-thumb(:src="newSkillIconUrl" alt="Skill Preview")
                  .preview-meta
                    span.preview-filename {{ selectedFileName || 'Ảnh kỹ năng đã chọn' }}
                    span.preview-badge ☁️ Sẵn sàng lưu vào Cloudinary
                  button.btn-clear-image(
                    type="button"
                    @click.stop="clearSelectedImage"
                    title="Chọn lại ảnh khác"
                  ) ✕ Đổi ảnh

        .form-actions
          button.btn-submit-skill(
            @click="handleCreateSkill"
            :disabled="isSubmitting"
          )
            span {{ isSubmitting ? 'Đang Tải Lên Cloudinary...' : '💾 Lưu Kỹ Năng Vào Database' }}

      //- Danh sách kỹ năng hiện có
      .skills-catalog-section
        .catalog-header
          h4.section-heading 📜 Danh Sách Kỹ Năng Trong Database ({{ skillStore.allSkills.length }})
          span.catalog-hint Click vào kỹ năng để gán nhanh hoặc bấm xoá

        .skills-grid(v-if="skillStore.allSkills.length > 0")
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

        .empty-skills-box(v-else)
          span.empty-skills-icon 📜
          p.empty-skills-msg Chưa có kỹ năng nào trong Database.
          p.empty-skills-sub Vui lòng nhập tên và tải ảnh ở form phía trên để thêm kỹ năng mới.

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

const fileInput = ref(null);
const newSkillName = ref('');
const newSkillCategory = ref('Tuyệt Kỹ');
const newSkillIconUrl = ref('');
const selectedFileName = ref('');
const isDragging = ref(false);
const isSubmitting = ref(false);

const processFile = (file) => {
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    Swal.fire({ icon: 'warning', title: 'File quá lớn', text: 'Vui lòng chọn ảnh < 5MB' });
    return;
  }

  selectedFileName.value = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    newSkillIconUrl.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const handleFileUpload = (evt) => {
  const file = evt.target.files[0];
  processFile(file);
};

const handleDrop = (evt) => {
  isDragging.value = false;
  const file = evt.dataTransfer.files[0];
  processFile(file);
};

const clearSelectedImage = () => {
  newSkillIconUrl.value = '';
  selectedFileName.value = '';
  if (fileInput.value) fileInput.value.value = '';
};

const handleCreateSkill = async () => {
  if (!newSkillName.value.trim()) {
    Swal.fire({ icon: 'warning', title: 'Thiếu tên kỹ năng', text: 'Vui lòng nhập tên kỹ năng!' });
    return;
  }
  if (!newSkillIconUrl.value.trim()) {
    Swal.fire({ icon: 'warning', title: 'Thiếu ảnh icon', text: 'Vui lòng tải ảnh icon từ thiết bị!' });
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
      clearSelectedImage();
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
  border-radius var(--radius-xl, 20px)
  border 1px solid
  display flex
  flex-direction column
  overflow hidden
  box-shadow var(--shadow-modal)

  &.modal-light
    background #ffffff
    border-color #e2e8f0
    color #0f172a

  &.modal-dark
    background #0f172a
    border-color #1e293b
    color #f8fafc

.modal-header
  display flex
  justify-content space-between
  align-items center
  padding 1rem 1.5rem
  border-bottom 1px solid
  background var(--color-bg-subtle)

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
  font-family var(--font-heading)
  font-size 1.1rem
  font-weight 800
  letter-spacing 0.03em
  margin 0

.btn-close
  background none
  border none
  font-size 1.2rem
  cursor pointer
  color inherit
  padding 0.25rem 0.5rem
  border-radius 50%
  transition all 0.2s ease

  &:hover
    background rgba(239, 68, 68, 0.15)
    color #ef4444

.modal-body
  padding 1.25rem 1.5rem
  overflow-y auto
  display flex
  flex-direction column
  gap 1.5rem

.add-skill-card
  padding 1.25rem
  border-radius var(--radius-md, 12px)
  border 1px solid
  display flex
  flex-direction column
  gap 0.85rem

  .modal-light &
    background #f8fafc
    border-color #e2e8f0

  .modal-dark &
    background #141f32
    border-color #1e293b

.section-heading
  font-family var(--font-body)
  font-size 0.9rem
  font-weight 700
  margin 0

.form-grid
  display grid
  grid-template-columns 1fr 1fr
  gap 0.75rem

.form-group
  display flex
  flex-direction column
  gap 0.35rem

.form-label
  font-size 0.75rem
  font-weight 700
  color var(--color-text-secondary)

.form-input, .form-select
  padding 0.45rem 0.75rem
  border-radius var(--radius-sm, 8px)
  border 1px solid var(--color-border)
  background var(--color-surface)
  color var(--color-text)
  font-size 0.8rem
  outline none
  transition border-color 0.2s ease

  &:focus
    border-color #3b82f6

.full-width
  grid-column 1 / -1

.hidden-file-input
  display none

.skill-dropzone
  position relative
  padding 1rem
  border 2px dashed var(--color-border)
  border-radius var(--radius-md, 12px)
  background var(--color-surface)
  cursor pointer
  transition all 0.2s ease
  display flex
  align-items center
  justify-content center

  &:hover
    border-color var(--color-brand)
    background var(--color-bg-subtle)

  &.is-dragging
    border-color var(--color-brand)
    background rgba(217, 119, 6, 0.08)

  &.has-file
    border-style solid
    border-color var(--color-border)
    background var(--color-bg-subtle)

.dropzone-placeholder
  display flex
  align-items center
  gap 0.75rem
  text-align left
  pointer-events none

.upload-icon
  font-size 1.75rem

.upload-text-group
  display flex
  flex-direction column
  gap 0.15rem

.upload-main-text
  font-size 0.8rem
  font-weight 700
  color var(--color-text)

.upload-sub-text
  font-size 0.7rem
  color var(--color-text-muted)

.dropzone-preview-card
  width 100%
  display flex
  align-items center
  justify-content space-between
  gap 0.75rem

.skill-preview-thumb
  width 48px
  height 48px
  border-radius var(--radius-sm, 8px)
  object-fit cover
  border 2px solid var(--color-border)
  box-shadow var(--shadow-sm)
  flex-shrink 0

.preview-meta
  flex 1
  min-width 0
  display flex
  flex-direction column
  gap 0.2rem

.preview-filename
  font-size 0.8rem
  font-weight 700
  color var(--color-text)
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

.preview-badge
  font-size 0.7rem
  color #10b981
  font-weight 600

.btn-clear-image
  padding 0.35rem 0.75rem
  border-radius var(--radius-sm, 8px)
  border 1px solid var(--color-border)
  background var(--color-surface)
  color var(--color-text-muted)
  font-size 0.75rem
  font-weight 600
  cursor pointer
  transition all 0.2s ease

  &:hover
    background #fee2e2
    color #dc2626
    border-color #fca5a5

.form-actions
  display flex
  justify-content flex-start

.btn-submit-skill
  padding 0.6rem 1.35rem
  border-radius var(--radius-md, 12px)
  background linear-gradient(135deg, #f59e0b, #d97706)
  color #ffffff
  border none
  font-weight 700
  font-size 0.8rem
  cursor pointer
  transition all 0.2s ease
  box-shadow var(--shadow-sm)

  &:hover
    transform translateY(-1px)
    box-shadow var(--shadow-md)
    filter brightness(1.05)

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
  color var(--color-muted)

.skills-grid
  display grid
  grid-template-columns repeat(auto-fill, minmax(200px, 1fr))
  gap 0.75rem

.skill-card-item
  display flex
  align-items center
  justify-content space-between
  padding 0.5rem 0.75rem
  border-radius var(--radius-md, 12px)
  border 1px solid
  box-shadow var(--shadow-sm)
  transition all 0.2s ease

  &.item-light
    background #ffffff
    border-color #e2e8f0

  &.item-dark
    background #141f32
    border-color #1e293b

.skill-item-left
  display flex
  align-items center
  gap 0.5rem
  overflow hidden

.skill-thumb
  width 30px
  height 30px
  border-radius var(--radius-xs, 4px)
  object-fit cover
  border 1px solid rgba(56, 189, 248, 0.4)
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
  color var(--color-muted)

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
  padding 0.75rem 1.5rem
  border-top 1px solid
  display flex
  justify-content flex-end

  .modal-light &
    border-color #e2e8f0

  .modal-dark &
    border-color #1e293b

.btn-close-modal
  padding 0.45rem 1.25rem
  border-radius var(--radius-md, 12px)
  border 1px solid var(--color-border)
  background var(--color-bg-subtle)
  color var(--color-text)
  font-size 0.8rem
  font-weight 600
  cursor pointer
  transition all 0.2s ease

  &:hover
    border-color var(--color-brand)

.empty-skills-box
  padding 2rem 1rem
  text-align center
  border 1px dashed var(--color-border)
  border-radius var(--radius-md, 12px)
  background var(--color-bg-subtle)
  display flex
  flex-direction column
  align-items center
  gap 0.35rem

.empty-skills-icon
  font-size 2rem

.empty-skills-msg
  font-size 0.85rem
  font-weight 700
  color var(--color-text)
  margin 0

.empty-skills-sub
  font-size 0.75rem
  color var(--color-text-muted)
  margin 0
</style>
