<template lang="pug">
.match-analysis-container(
  :class="themeStore.theme === 'light' ? 'analysis-light' : 'analysis-dark'"
)
  //- Header Banner
  .header-banner
    .banner-title-group
      span.banner-icon 📊
      .banner-titles
        h1.banner-main-title DỮ LIỆU TRẬN ĐẤU & RÚT KINH NGHIỆM
        p.banner-sub-desc Lưu trữ hình ảnh trận chiến, đánh giá các điểm sai sót & phương án chiến thuật sửa đổi

    .banner-actions
      button.btn-add-log(
        v-if="authStore.canEdit"
        @click="openCreateModal"
      )
        span ➕
        span THÊM DỮ LIỆU TRẬN ĐẤU

      span.permission-tag(v-else)
        span 🔒
        span Đương Gia & Đường Chủ có quyền đăng

  //- Overview Statistics Bar
  .overview-stats-grid
    .stat-card
      span.stat-icon 🗡️
      .stat-meta
        span.stat-label Tổng Trận Đánh Giá
        span.stat-value {{ records.length }}

    .stat-card.card-win
      span.stat-icon 🏆
      .stat-meta
        span.stat-label.label-win Trận Thắng
        span.stat-value.val-win {{ winCount }}

    .stat-card.card-loss
      span.stat-icon 💔
      .stat-meta
        span.stat-label.label-loss Trận Thua / Rút Kinh Nghiệm
        span.stat-value.val-loss {{ lossCount }}

    .stat-card.card-images
      span.stat-icon 🖼️
      .stat-meta
        span.stat-label.label-images Tổng Ảnh Lưu Trữ
        span.stat-value.val-images {{ totalImagesCount }}

  //- Loading State
  .loading-box(v-if="loading")
    .spinner
    p.loading-text Đang tải dữ liệu trận đấu...

  //- Empty State
  .empty-box(v-else-if="records.length === 0")
    span.empty-icon ⚔️
    h3.empty-title Chưa có dữ liệu trận đấu nào được lưu trữ
    p.empty-desc Chưa có ghi chép dữ liệu trận đấu nào từ Đương Gia / Đường Chủ.
    button.btn-add-log(v-if="authStore.canEdit" @click="openCreateModal")
      span ➕ THÊM DỮ LIỆU TRẬN ĐẤU

  //- Match Records List
  .records-list(v-else)
    .record-card(
      v-for="item in records"
      :key="item._id"
      :class="(item.result === 'thang' || item.result === 'win') ? 'border-win' : 'border-loss'"
    )
      .card-top-header
        .header-title-flex
          span.result-badge(:class="(item.result === 'thang' || item.result === 'win') ? 'badge-win' : 'badge-loss'")
            | {{ (item.result === 'thang' || item.result === 'win') ? '🏆 CHIẾN THẮNG' : '💔 RÚT KINH NGHIỆM' }}
          h3.record-match-title {{ item.matchTitle }}

        .header-actions-right
          span.event-date-text 📅 {{ formatDate(item.eventDate) }}
          .action-btn-group(v-if="authStore.canEdit")
            button.btn-icon-action(@click="openEditModal(item)" title="Sửa dữ liệu") ✏️
            button.btn-icon-action.btn-delete(@click="deleteRecord(item._id)" title="Xóa dữ liệu") 🗑️

      .record-body-grid
        .analysis-box.box-mistakes
          h4.box-sec-title
            span.sec-icon ⚠️
            span ĐIỂM HẠN CHẾ & LỖI SAI CẦN RÚT KINH NGHIỆM
          p.sec-content {{ item.mistakes }}

        .analysis-box.box-improvements
          h4.box-sec-title
            span.sec-icon 💡
            span HƯỚNG KHẮC PHỤC & CHIẾN THUẬT SỬA ĐỔI
          p.sec-content {{ item.improvements || 'Chưa ghi nhận phương án sửa đổi...' }}

      .gallery-section(v-if="item.images && item.images.length > 0")
        h4.gallery-title 🖼️ HÌNH ẢNH MINH HỌA VÀ BẢNG THỐNG KÊ ({{ item.images.length }})
        .gallery-grid
          .gallery-item(
            v-for="(img, idx) in item.images"
            :key="idx"
            @click="openImageLightbox(img.url)"
          )
            img.gallery-img(:src="img.url" :alt="img.caption || item.matchTitle")
            .image-overlay
              span.overlay-icon 🔍
              span.image-caption {{ img.caption || 'Nhấp để mở ảnh toàn màn hình' }}

      .record-footer
        span.author-text 👤 Đăng bởi: {{ item.authorName || 'Đương Gia' }}
        span.date-text 🕒 Cập nhật: {{ formatDate(item.updatedAt || item.createdAt) }}

  //- Create / Edit Modal
  Teleport(to="body")
    Transition(name="fade")
      .modal-overlay(v-if="showModal" @click.self="showModal = false")
        .modal-card(:class="themeStore.theme === 'light' ? 'modal-light' : 'modal-dark'")
          .modal-header
            h3.modal-title {{ isEditing ? '✏️ CHỈNH SỬA DỮ LIỆU TRẬN ĐẤU' : '➕ THÊM DỮ LIỆU TRẬN ĐẤU MỚI' }}
            button.close-btn(@click="showModal = false") ✕

          form.modal-form(@submit.prevent="handleSubmit")
            .form-group
              label.form-label Tiêu Đề Trận Đấu <span class="required-star">*</span>
              input.form-input(
                v-model="form.matchTitle"
                type="text"
                required
                placeholder="VD: Công Thành Chiến vs Bang Hải Tặc (Tuần 34)..."
              )

            .form-grid-2
              .form-group
                label.form-label Ngày Diễn Ra Trận Đấu <span class="required-star">*</span>
                input.form-input(v-model="form.eventDate" type="date" required)

              .form-group
                label.form-label Kết Quả Trận Đấu <span class="required-star">*</span>
                select.form-select(v-model="form.result")
                  option(value="thua") 💔 Thua / Rút Kinh Nghiệm
                  option(value="thang") 🏆 Thắng Lợi

            .form-group
              label.form-label Điểm Hạn Chế & Lỗi Sai CẦN Rút Kinh Nghiệm <span class="required-star">*</span>
              textarea.form-textarea(
                v-model="form.mistakes"
                rows="4"
                required
                placeholder="Mô tả các lỗi về xếp đội hình, voice call, di chuyển, dùng skill..."
              )

            .form-group
              label.form-label Hướng Khắc Phục & Chiến Thuật Sửa Đổi
              textarea.form-textarea(
                v-model="form.improvements"
                rows="3"
                placeholder="Mô tả phương án khắc phục cho các trận tiếp theo..."
              )

            .images-upload-group
              .images-group-header
                label.form-label 🖼️ Hình Ảnh Minh Họa / Thống Kê (3 Cách Thêm Ảnh)
                button.btn-add-img(type="button" @click="addImageInput") + Thêm Ô Link

              //- Multi-method Upload Dropzone Box (1. Select File, 2. Drag & Drop, 3. Paste Clipboard)
              .dropzone-container(
                :class="{ 'is-dragging': isDragging }"
                @dragenter.prevent="handleDragEnter"
                @dragover.prevent="handleDragOver"
                @dragleave.prevent="handleDragLeave"
                @drop.prevent="handleDrop"
                @click="triggerDropzoneFile"
              )
                input.hidden-dropzone-input(
                  ref="dropzoneFileInputRef"
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleDropzoneFileSelect"
                )
                .dropzone-content
                  .dropzone-badge-group
                    span.dz-badge 📁 1. Chọn File (Multiple)
                    span.dz-badge 🖱️ 2. Kéo & Thả Ảnh
                    span.dz-badge 📋 3. Dán Ctrl+V (Clipboard)
                  p.dropzone-main-text
                    span(v-if="isDragging") 📥 Thả ảnh vào đây ngay để tải lên...
                    span(v-else) 📂 Kéo thả ảnh vào đây, dán từ Clipboard (Ctrl+V) hoặc nhấp để chọn file
                  p.dropzone-sub-text Cho phép chọn / thả / dán nhiều hình ảnh cùng lúc (PNG, JPG, WebP, GIF)

              //- List of uploading / uploaded images with preview thumbnail
              .images-list(v-if="form.images && form.images.length > 0")
                .image-input-item(v-for="(imgItem, idx) in form.images" :key="idx")
                  .img-item-header
                    .img-preview-box(v-if="imgItem.url")
                      img.img-thumb(:src="imgItem.url" alt="Preview")
                    .img-preview-box.box-loading(v-else-if="imgItem.uploading")
                      span.spinner-mini
                    .img-preview-box.box-empty(v-else)
                      span 🖼️

                    .img-input-row
                      input.form-input(
                        v-model="imgItem.url"
                        type="text"
                        placeholder="Dán Link ảnh (https://...) hoặc chọn file bên phải ->"
                      )
                      label.btn-upload-file
                        span {{ imgItem.uploading ? '⏳ Đang tải...' : '📁 Chọn File' }}
                        input.hidden-file-input(
                          type="file"
                          accept="image/*"
                          @change="handleFileChange($event, idx)"
                          :disabled="imgItem.uploading"
                        )
                      button.btn-remove-img(type="button" @click="removeImageInput(idx)" title="Xóa ảnh") ✕

                  input.form-input.caption-input(
                    v-model="imgItem.caption"
                    type="text"
                    placeholder="Ghi chú ảnh (VD: Thống kê sát thương trận 1)..."
                  )

            .modal-actions
              button.btn-cancel(type="button" @click="showModal = false") Hủy
              button.btn-submit(type="submit" :disabled="isSubmitting")
                | {{ isSubmitting ? 'Đang Lưu...' : (isEditing ? 'Lưu Thay Đổi' : 'Tạo Ghi Chép') }}
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import Swal from 'sweetalert2';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import api from '../services/api';

const authStore = useAuthStore();
const themeStore = useThemeStore();

const records = ref([]);
const loading = ref(true);
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const isSubmitting = ref(false);

// Dropzone & Drag/Paste state
const dropzoneFileInputRef = ref(null);
const isDragging = ref(false);
let dragCounter = 0;

const form = reactive({
  matchTitle: '',
  eventDate: new Date().toISOString().split('T')[0],
  result: 'thua',
  mistakes: '',
  improvements: '',
  images: []
});

const winCount = computed(() => records.value.filter((r) => r.result === 'thang' || r.result === 'win').length);
const lossCount = computed(() => records.value.filter((r) => r.result === 'thua' || r.result === 'loss').length);
const totalImagesCount = computed(() => {
  return records.value.reduce((acc, curr) => acc + (curr.images ? curr.images.length : 0), 0);
});

const fetchRecords = async () => {
  loading.value = true;
  try {
    const res = await api.getMatchAnalysis();
    records.value = res.data?.data || res.data || [];
  } catch (err) {
    console.error('Lỗi khi tải dữ liệu trận đấu:', err);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  form.matchTitle = '';
  form.eventDate = new Date().toISOString().split('T')[0];
  form.result = 'thua';
  form.mistakes = '';
  form.improvements = '';
  form.images = [];
  showModal.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  editingId.value = item._id;
  form.matchTitle = item.matchTitle || '';
  form.eventDate = item.eventDate ? item.eventDate.split('T')[0] : new Date().toISOString().split('T')[0];
  form.result = item.result || 'thua';
  form.mistakes = item.mistakes || '';
  form.improvements = item.improvements || '';
  form.images = item.images ? JSON.parse(JSON.stringify(item.images)) : [];
  showModal.value = true;
};

const addImageInput = () => {
  form.images.push({ url: '', caption: '', uploading: false });
};

const removeImageInput = (idx) => {
  form.images.splice(idx, 1);
};

const triggerDropzoneFile = () => {
  if (dropzoneFileInputRef.value) {
    dropzoneFileInputRef.value.click();
  }
};

const handleDragEnter = (e) => {
  dragCounter++;
  if (e.dataTransfer?.types && Array.from(e.dataTransfer.types).includes('Files')) {
    isDragging.value = true;
  }
};

const handleDragOver = (e) => {
  isDragging.value = true;
};

const handleDragLeave = (e) => {
  dragCounter--;
  if (dragCounter <= 0) {
    dragCounter = 0;
    isDragging.value = false;
  }
};

const handleDrop = async (e) => {
  dragCounter = 0;
  isDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    await processFiles(files);
  }
};

const handleDropzoneFileSelect = async (e) => {
  const files = e.target.files;
  if (files && files.length > 0) {
    await processFiles(files);
    e.target.value = '';
  }
};

const compressImage = (file, maxWidth = 1920, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const processFiles = async (files) => {
  const fileArray = Array.from(files).filter((f) => f.type && f.type.startsWith('image/'));
  if (fileArray.length === 0) return;

  for (const file of fileArray) {
    const newItem = reactive({ url: '', caption: '', uploading: true });
    form.images.push(newItem);

    try {
      const compressedBase64 = await compressImage(file);
      const res = await api.uploadMatchImage(compressedBase64);
      if (res.data && res.data.success && res.data.url) {
        newItem.url = res.data.url;
      } else if (res.data && res.data.url) {
        newItem.url = res.data.url;
      } else {
        newItem.url = compressedBase64;
      }
    } catch (uploadErr) {
      console.error('Lỗi khi đẩy ảnh:', uploadErr);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi Upload Ảnh',
        text: uploadErr.response?.data?.message || 'Không thể upload ảnh.',
        background: themeStore.theme === 'light' ? '#ffffff' : '#0d1526',
        color: themeStore.theme === 'light' ? '#0f172a' : '#ffffff'
      });
      const idx = form.images.indexOf(newItem);
      if (idx !== -1) form.images.splice(idx, 1);
    } finally {
      newItem.uploading = false;
    }
  }

  Swal.fire({
    icon: 'success',
    title: `Đã dán / tải lên ${fileArray.length} ảnh!`,
    timer: 1500,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
    background: themeStore.theme === 'light' ? '#ffffff' : '#0d1526',
    color: themeStore.theme === 'light' ? '#b45309' : '#f5c518'
  });
};

const isImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase();
  return (
    (clean.startsWith('http://') || clean.startsWith('https://')) &&
    (clean.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) !== null ||
      clean.includes('cloudinary.com') ||
      clean.includes('imgur.com') ||
      clean.includes('discordapp.net') ||
      clean.includes('discordapp.com'))
  );
};

const handlePaste = async (event) => {
  if (!showModal.value) return;

  const items = event.clipboardData?.items;
  if (!items) return;

  const imageFiles = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type && item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) imageFiles.push(file);
    }
  }

  if (imageFiles.length > 0) {
    event.preventDefault();
    await processFiles(imageFiles);
    return;
  }

  const pastedText = event.clipboardData.getData('text');
  if (pastedText && isImageUrl(pastedText)) {
    const activeEl = document.activeElement;
    if (!activeEl || (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA')) {
      event.preventDefault();
      form.images.push({ url: pastedText.trim(), caption: '', uploading: false });
      Swal.fire({
        icon: 'success',
        title: 'Đã dán Link ảnh!',
        timer: 1200,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        background: themeStore.theme === 'light' ? '#ffffff' : '#0d1526',
        color: themeStore.theme === 'light' ? '#b45309' : '#f5c518'
      });
    }
  }
};

watch(showModal, (newVal) => {
  if (newVal) {
    window.addEventListener('paste', handlePaste);
  } else {
    window.removeEventListener('paste', handlePaste);
  }
});

onUnmounted(() => {
  window.removeEventListener('paste', handlePaste);
});

const handleFileChange = async (event, idx) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const targetItem = form.images[idx];
  if (!targetItem) return;

  targetItem.uploading = true;
  try {
    const compressedBase64 = await compressImage(file);
    const res = await api.uploadMatchImage(compressedBase64);
    if (res.data && res.data.success && res.data.url) {
      targetItem.url = res.data.url;
    } else if (res.data && res.data.url) {
      targetItem.url = res.data.url;
    }
    Swal.fire({
      icon: 'success',
      title: 'Đã tải ảnh lên!',
      timer: 1200,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      background: themeStore.theme === 'light' ? '#ffffff' : '#0d1526',
      color: themeStore.theme === 'light' ? '#b45309' : '#f5c518'
    });
  } catch (uploadErr) {
    console.error('Lỗi khi đẩy ảnh lên Cloudinary:', uploadErr);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi Upload',
      text: uploadErr.response?.data?.message || 'Không thể upload ảnh.',
      background: themeStore.theme === 'light' ? '#ffffff' : '#0d1526',
      color: themeStore.theme === 'light' ? '#0f172a' : '#ffffff'
    });
  } finally {
    targetItem.uploading = false;
  }
};

const handleSubmit = async () => {
  if (!form.matchTitle.trim() || !form.mistakes.trim()) return;

  isSubmitting.value = true;
  try {
    const payload = {
      matchTitle: form.matchTitle.trim(),
      eventDate: form.eventDate,
      result: form.result,
      mistakes: form.mistakes,
      improvements: form.improvements,
      images: form.images.filter((img) => img.url && img.url.trim())
    };

    if (isEditing.value && editingId.value) {
      await api.updateMatchAnalysis(editingId.value, payload);
    } else {
      await api.createMatchAnalysis(payload);
    }

    Swal.fire({
      icon: 'success',
      title: 'Thành công!',
      text: 'Đã lưu dữ liệu trận đấu.',
      timer: 1500,
      showConfirmButton: false,
      background: themeStore.theme === 'light' ? '#ffffff' : '#0d1526',
      color: themeStore.theme === 'light' ? '#b45309' : '#f5c518'
    });

    showModal.value = false;
    await fetchRecords();
  } catch (err) {
    const msg = err.response?.data?.message || 'Có lỗi xảy ra.';
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: msg,
      background: themeStore.theme === 'light' ? '#ffffff' : '#0d1526',
      color: themeStore.theme === 'light' ? '#0f172a' : '#ffffff'
    });
  } finally {
    isSubmitting.value = false;
  }
};

const deleteRecord = async (id) => {
  const confirm = await Swal.fire({
    title: 'Xác nhận xóa dữ liệu trận đấu?',
    text: 'Hành động này không thể hoàn tác.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Đồng ý xóa',
    cancelButtonText: 'Hủy',
    confirmButtonColor: '#ef5757',
    background: themeStore.theme === 'light' ? '#ffffff' : '#0d1526',
    color: themeStore.theme === 'light' ? '#0f172a' : '#ffffff'
  });

  if (!confirm.isConfirmed) return;

  try {
    await api.deleteMatchAnalysis(id);
    await fetchRecords();
  } catch (err) {
    console.error('Lỗi khi xóa:', err);
  }
};

const openImageLightbox = (url) => {
  window.open(url, '_blank');
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

onMounted(() => {
  fetchRecords();
});
</script>

<style lang="stylus" scoped>
.match-analysis-container
  position relative
  min-height calc(100vh - 57px)
  padding 1.5rem
  max-width 80rem
  margin 0 auto
  font-family var(--font-sans)
  user-select none
  display flex
  flex-direction column
  gap 1.5rem
  padding-bottom 4rem

.header-banner
  position relative
  z-index 10
  padding 1.25rem 1.5rem
  border-radius var(--radius-lg, 16px)
  border 1px solid var(--color-border)
  background var(--color-surface)
  box-shadow var(--shadow-sm)
  display flex
  flex-direction column
  gap 1rem

@media (min-width: 768px)
  .header-banner
    flex-direction row
    align-items center
    justify-content space-between

.banner-title-group
  display flex
  align-items center
  gap 0.75rem

.banner-icon
  font-size 1.75rem

.banner-main-title
  font-size 1.1rem
  font-weight 800
  text-transform uppercase
  letter-spacing -0.01em
  font-family var(--font-heading)
  color var(--color-text)
  margin 0

.banner-sub-desc
  font-size 0.75rem
  color var(--color-text-muted)
  margin-top 0.15rem

.btn-add-log
  padding 0.65rem 1.25rem
  border-radius var(--radius-md, 12px)
  font-size 0.8rem
  font-weight 700
  font-family var(--font-heading)
  cursor pointer
  display inline-flex
  align-items center
  gap 0.5rem
  transition all 0.2s ease
  border 1px solid transparent
  background linear-gradient(135deg, #f59e0b, #d97706)
  color #ffffff
  box-shadow var(--shadow-sm)

  &:hover
    transform translateY(-1px)
    box-shadow var(--shadow-md)
    filter brightness(1.05)

  .analysis-dark &
    background linear-gradient(135deg, #fbbf24, #d97706)
    color #0f172a

.permission-tag
  padding 0.4rem 0.85rem
  border-radius var(--radius-full, 9999px)
  font-size 0.75rem
  font-family var(--font-heading)
  display flex
  align-items center
  gap 0.375rem
  border 1px solid var(--color-border)
  background var(--color-bg-subtle)
  color var(--color-text-muted)

.overview-stats-grid
  display grid
  grid-template-columns repeat(2, minmax(0, 1fr))
  gap 0.75rem

@media (min-width: 640px)
  .overview-stats-grid
    grid-template-columns repeat(4, minmax(0, 1fr))

.stat-card
  padding 1.15rem
  border-radius var(--radius-lg, 16px)
  border 1px solid var(--color-border)
  background var(--color-surface)
  box-shadow var(--shadow-sm)
  display flex
  align-items center
  gap 0.85rem
  transition all 0.2s ease

  &:hover
    transform translateY(-1px)
    box-shadow var(--shadow-md)

.stat-icon
  font-size 1.6rem

.stat-meta
  display flex
  flex-direction column

.stat-label
  font-size 0.7rem
  font-weight 700
  text-transform uppercase
  font-family var(--font-heading)
  color var(--color-text-muted)

  &.label-win
    color #10b981

  &.label-loss
    color #ef4444

  &.label-images
    color #0284c7
    .analysis-dark &
      color #38bdf8

.stat-value
  font-size 1.5rem
  font-weight 800
  font-family var(--font-heading)
  color var(--color-text)

  &.val-win
    color #10b981

  &.val-loss
    color #ef4444

  &.val-images
    color #0284c7
    .analysis-dark &
      color #38bdf8

.loading-box, .empty-box
  padding 4rem 1.5rem
  text-align center
  border-radius var(--radius-xl, 20px)
  border 1px solid var(--color-border)
  background var(--color-surface)
  box-shadow var(--shadow-sm)
  display flex
  flex-direction column
  align-items center
  gap 0.75rem

.spinner
  width 2.5rem
  height 2.5rem
  border 3px solid var(--color-border)
  border-top-color var(--color-brand)
  border-radius 9999px
  animation spin 1s linear infinite

.empty-icon
  font-size 3rem

.empty-title
  font-size 1.1rem
  font-weight 800
  font-family var(--font-heading)
  color var(--color-text)
  margin 0

.empty-desc
  font-size 0.8rem
  color var(--color-text-muted)

.records-list
  display flex
  flex-direction column
  gap 1.25rem

.record-card
  padding 1.5rem
  border-radius var(--radius-xl, 20px)
  border 1px solid var(--color-border)
  background var(--color-surface)
  box-shadow var(--shadow-sm)
  display flex
  flex-direction column
  gap 1rem
  transition all 0.2s ease

  &:hover
    box-shadow var(--shadow-md)

  &.border-win
    border-color rgba(16, 185, 129, 0.3)

  &.border-loss
    border-color rgba(239, 68, 68, 0.3)

.card-top-header
  display flex
  align-items center
  justify-content space-between
  flex-wrap wrap
  gap 0.5rem
  padding-bottom 0.75rem
  border-bottom 1px solid var(--color-border)

.header-title-flex
  display flex
  align-items center
  gap 0.65rem

.result-badge
  padding 0.3rem 0.75rem
  border-radius var(--radius-full, 9999px)
  font-size 0.7rem
  font-weight 800
  font-family var(--font-heading)
  text-transform uppercase
  border 1px solid

  &.badge-win
    background #d1fae5
    color #059669
    border-color #a7f3d0
    .analysis-dark &
      background rgba(16, 185, 129, 0.15)
      color #34d399
      border-color rgba(16, 185, 129, 0.3)

  &.badge-loss
    background #fee2e2
    color #dc2626
    border-color #fca5a5
    .analysis-dark &
      background rgba(239, 68, 68, 0.15)
      color #f87171
      border-color rgba(239, 68, 68, 0.3)

.record-match-title
  font-size 1.05rem
  font-weight 800
  font-family var(--font-heading)
  color var(--color-text)
  margin 0

.header-actions-right
  display flex
  align-items center
  gap 0.75rem

.event-date-text
  font-size 0.8rem
  color var(--color-text-muted)

.action-btn-group
  display flex
  align-items center
  gap 0.35rem

.btn-icon-action
  padding 0.35rem 0.6rem
  border-radius var(--radius-sm, 8px)
  font-size 0.75rem
  border 1px solid var(--color-border)
  background var(--color-bg-subtle)
  color var(--color-text)
  cursor pointer
  transition all 0.2s ease

  &:hover
    background var(--color-surface-hover)
    border-color var(--color-border-strong)

  &.btn-delete
    &:hover
      background #fee2e2 !important
      color #dc2626 !important
      border-color #fca5a5 !important
      .analysis-dark &
        background rgba(239, 68, 68, 0.2) !important
        color #f87171 !important
        border-color rgba(239, 68, 68, 0.4) !important

.record-body-grid
  display grid
  grid-template-columns 1fr
  gap 1rem

@media (min-width: 768px)
  .record-body-grid
    grid-template-columns repeat(2, minmax(0, 1fr))

.analysis-box
  padding 1rem
  border-radius var(--radius-md, 12px)
  border 1px solid var(--color-border)
  display flex
  flex-direction column
  gap 0.5rem

  &.box-mistakes
    background #fef2f2
    border-color #fecaca
    .analysis-dark &
      background rgba(239, 68, 68, 0.08)
      border-color rgba(239, 68, 68, 0.25)

  &.box-improvements
    background #f0fdf4
    border-color #bbf7d0
    .analysis-dark &
      background rgba(16, 185, 129, 0.08)
      border-color rgba(16, 185, 129, 0.25)

.box-sec-title
  font-size 0.75rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.02em
  font-family var(--font-heading)
  margin 0
  display flex
  align-items center
  gap 0.35rem

  .box-mistakes &
    color #dc2626
    .analysis-dark &
      color #f87171

  .box-improvements &
    color #059669
    .analysis-dark &
      color #34d399

.sec-content
  font-size 0.8rem
  line-height 1.6
  margin 0
  white-space pre-line
  color var(--color-text)

.gallery-section
  display flex
  flex-direction column
  gap 0.5rem

.gallery-title
  font-size 0.8rem
  font-weight 800
  text-transform uppercase
  font-family var(--font-heading)
  color var(--color-brand)
  margin 0

.gallery-grid
  display grid
  grid-template-columns repeat(2, minmax(0, 1fr))
  gap 0.75rem

@media (min-width: 640px)
  .gallery-grid
    grid-template-columns repeat(3, minmax(0, 1fr))

@media (min-width: 1024px)
  .gallery-grid
    grid-template-columns repeat(4, minmax(0, 1fr))

.gallery-item
  position relative
  aspect-ratio 16/9
  border-radius var(--radius-md, 12px)
  overflow hidden
  border 1px solid var(--color-border)
  cursor pointer
  transition transform 0.2s ease

  &:hover
    transform translateY(-1px)
    box-shadow var(--shadow-sm)

.gallery-img
  width 100%
  height 100%
  object-fit cover

.image-overlay
  position absolute
  inset 0
  background rgba(0, 0, 0, 0.6)
  display flex
  flex-direction column
  align-items center
  justify-content center
  padding 0.5rem
  text-align center
  opacity 0
  transition opacity 0.2s ease

  .gallery-item:hover &
    opacity 1

.overlay-icon
  font-size 1.25rem

.image-caption
  font-size 0.65rem
  color #ffffff
  margin-top 0.25rem

.record-footer
  padding-top 0.75rem
  border-top 1px solid var(--color-border)
  display flex
  align-items center
  justify-content space-between
  font-size 0.75rem
  color var(--color-text-muted)

.modal-overlay
  position fixed
  inset 0
  z-index 50
  background rgba(0, 0, 0, 0.6)
  backdrop-filter blur(8px)
  display flex
  align-items center
  justify-content center
  padding 1rem
  user-select none
  font-family var(--font-sans)

.modal-card
  width 100%
  max-width 42rem
  max-height 90vh
  border-radius var(--radius-xl, 20px)
  padding 1.75rem
  overflow-y auto
  background var(--color-surface)
  border 1px solid var(--color-border)
  color var(--color-text)
  box-shadow var(--shadow-modal)

.modal-header
  display flex
  align-items center
  justify-content space-between
  padding-bottom 0.75rem
  border-bottom 1px solid var(--color-border)
  margin-bottom 1rem

.modal-title
  font-size 1.1rem
  font-weight 800
  font-family var(--font-heading)
  text-transform uppercase
  color var(--color-brand)
  margin 0

.close-btn
  width 2rem
  height 2rem
  border-radius var(--radius-sm, 8px)
  font-size 0.85rem
  display flex
  align-items center
  justify-content center
  cursor pointer
  border 1px solid var(--color-border)
  background var(--color-bg-subtle)
  color var(--color-text-muted)
  transition all 0.2s ease

  &:hover
    background var(--color-surface-hover)
    color var(--color-text)

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
  font-family var(--font-heading)
  text-transform uppercase
  color var(--color-text)
  margin-bottom 0.35rem

.required-star
  color #ef4444

.form-input, .form-select, .form-textarea
  width 100%
  font-size 0.8rem
  padding 0.7rem 0.85rem
  border-radius var(--radius-md, 12px)
  border 1px solid var(--color-border)
  background var(--color-bg-subtle)
  color var(--color-text)
  outline none
  box-sizing border-box
  font-family var(--font-sans)
  transition all 0.2s ease

  &:focus
    border-color var(--color-brand)
    box-shadow 0 0 0 3px rgba(217, 119, 6, 0.15)

.form-grid-2
  display grid
  grid-template-columns 1fr
  gap 0.75rem

@media (min-width: 640px)
  .form-grid-2
    grid-template-columns repeat(2, minmax(0, 1fr))

.images-upload-group
  display flex
  flex-direction column
  gap 0.5rem

.images-group-header
  display flex
  align-items center
  justify-content space-between

.btn-add-img
  font-size 0.75rem
  font-weight 700
  padding 0.35rem 0.75rem
  border-radius var(--radius-md, 8px)
  border 1px solid rgba(2, 132, 199, 0.3)
  background rgba(2, 132, 199, 0.1)
  color #0284c7
  cursor pointer
  transition all 0.2s ease

  &:hover
    background rgba(2, 132, 199, 0.18)

  .analysis-dark &
    background rgba(56, 189, 248, 0.15)
    border-color rgba(56, 189, 248, 0.3)
    color #38bdf8

.images-list
  display flex
  flex-direction column
  gap 0.75rem

.image-input-item
  padding 0.75rem
  border-radius var(--radius-md, 12px)
  border 1px solid var(--color-border)
  background var(--color-bg-subtle)
  display flex
  flex-direction column
  gap 0.5rem

.img-input-row
  display flex
  align-items center
  gap 0.5rem

.btn-upload-file
  padding 0.5rem 0.85rem
  border-radius var(--radius-md, 8px)
  font-size 0.75rem
  font-weight 700
  cursor pointer
  flex-shrink 0
  border 1px solid var(--color-border)
  background var(--color-surface)
  color var(--color-brand)
  transition all 0.2s ease

  &:hover
    background var(--color-surface-hover)

.hidden-file-input
  display none

.btn-remove-img
  color #ef4444
  background none
  border none
  cursor pointer
  padding 0 0.25rem

.dropzone-container
  position relative
  padding 1.5rem 1rem
  border 2px dashed var(--color-border)
  border-radius var(--radius-lg, 16px)
  text-align center
  cursor pointer
  transition all 0.2s ease
  display flex
  flex-direction column
  align-items center
  justify-content center
  background var(--color-bg-subtle)
  margin-bottom 0.5rem

  &:hover
    border-color var(--color-brand)
    background var(--color-surface-hover)

  &.is-dragging
    border-color var(--color-brand)
    background rgba(217, 119, 6, 0.08)

.hidden-dropzone-input
  display none

.dropzone-content
  display flex
  flex-direction column
  align-items center
  gap 0.5rem
  pointer-events none

.dropzone-badge-group
  display flex
  align-items center
  justify-content center
  gap 0.5rem
  flex-wrap wrap

.dz-badge
  font-size 0.7rem
  font-weight 700
  padding 0.25rem 0.6rem
  border-radius var(--radius-sm, 6px)
  border 1px solid var(--color-border)
  background var(--color-surface)
  color var(--color-brand)

.dropzone-main-text
  font-size 0.85rem
  font-weight 700
  color var(--color-text)
  margin 0

.dropzone-sub-text
  font-size 0.75rem
  color var(--color-text-muted)
  margin 0

.img-item-header
  display flex
  align-items center
  gap 0.75rem

.img-preview-box
  width 3rem
  height 3rem
  border-radius var(--radius-md, 8px)
  overflow hidden
  border 1px solid var(--color-border)
  flex-shrink 0
  display flex
  align-items center
  justify-content center
  font-size 1.25rem
  background var(--color-bg-subtle)

  &.box-loading
    background rgba(217, 119, 6, 0.1)

.img-thumb
  width 100%
  height 100%
  object-fit cover

.spinner-mini
  width 1.25rem
  height 1.25rem
  border 2px solid var(--color-brand)
  border-top-color transparent
  border-radius 9999px
  animation spin 0.8s linear infinite

.modal-actions
  padding-top 0.75rem
  border-top 1px solid var(--color-border)
  display flex
  align-items center
  justify-content flex-end
  gap 0.65rem

.btn-cancel
  padding 0.55rem 1.15rem
  border-radius var(--radius-md, 10px)
  font-size 0.8rem
  font-weight 600
  cursor pointer
  border 1px solid var(--color-border)
  background var(--color-bg-subtle)
  color var(--color-text-muted)
  transition all 0.2s ease

  &:hover
    background var(--color-surface-hover)
    color var(--color-text)

.btn-submit
  padding 0.55rem 1.35rem
  border-radius var(--radius-md, 10px)
  font-size 0.8rem
  font-weight 800
  font-family var(--font-heading)
  cursor pointer
  border none
  background linear-gradient(135deg, #f59e0b, #d97706)
  color #ffffff
  box-shadow var(--shadow-sm)
  transition all 0.2s ease

  &:hover
    transform translateY(-1px)
    box-shadow var(--shadow-md)
    filter brightness(1.05)

@keyframes spin
  to
    transform rotate(360deg)

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s ease

.fade-enter-from, .fade-leave-to
  opacity 0
</style>
