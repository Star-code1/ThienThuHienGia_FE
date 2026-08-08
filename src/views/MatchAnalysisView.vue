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
      :class="item.result === 'thang' ? 'border-win' : 'border-loss'"
    )
      .card-top-header
        .header-title-flex
          span.result-badge(:class="item.result === 'thang' ? 'badge-win' : 'badge-loss'")
            | {{ item.result === 'thang' ? '🏆 CHIẾN THẮNG' : '💔 RÚT KINH NGHIỆM' }}
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
              label.form-label Điểm Hạn Chế & Lỗi Sai Cần Rút Kinh Nghiệm <span class="required-star">*</span>
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
                label.form-label 🖼️ Hình Ảnh Minh Họa / Thống Kê
                button.btn-add-img(type="button" @click="addImageInput") + Thêm Ảnh

              .images-list
                .image-input-item(v-for="(imgItem, idx) in form.images" :key="idx")
                  .img-input-row
                    input.form-input(
                      v-model="imgItem.url"
                      type="text"
                      placeholder="Dán Link ảnh hoặc bấm Đẩy ảnh bên phải ->"
                    )
                    label.btn-upload-file
                      span {{ imgItem.uploading ? '⏳ Đang tải...' : '📁 Đẩy ảnh' }}
                      input.hidden-file-input(
                        type="file"
                        accept="image/*"
                        @change="handleFileChange($event, idx)"
                        :disabled="imgItem.uploading"
                      )
                    button.btn-remove-img(type="button" @click="removeImageInput(idx)") ✕

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
import { ref, reactive, computed, onMounted } from 'vue';
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

const form = reactive({
  matchTitle: '',
  eventDate: new Date().toISOString().split('T')[0],
  result: 'thua',
  mistakes: '',
  improvements: '',
  images: []
});

const winCount = computed(() => records.value.filter((r) => r.result === 'thang').length);
const lossCount = computed(() => records.value.filter((r) => r.result === 'thua').length);
const totalImagesCount = computed(() => {
  return records.value.reduce((acc, curr) => acc + (curr.images ? curr.images.length : 0), 0);
});

const fetchRecords = async () => {
  loading.value = true;
  try {
    const res = await api.getMatchAnalysisList();
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
      Swal.fire({
        icon: 'success',
        title: 'Đã đẩy ảnh lên Cloudinary!',
        timer: 1200,
        showConfirmButton: false,
        background: themeStore.theme === 'light' ? '#ffffff' : '#0d1526',
        color: themeStore.theme === 'light' ? '#b45309' : '#f5c518'
      });
    }
  } catch (uploadErr) {
    console.error('Lỗi khi đẩy ảnh lên Cloudinary:', uploadErr);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi Upload',
      text: uploadErr.response?.data?.message || 'Không thể upload ảnh lên Cloudinary.',
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
  font-family 'Lora', serif
  user-select none
  display flex
  flex-direction column
  gap 1.5rem
  padding-bottom 4rem

.header-banner
  position relative
  z-index 10
  padding 1.25rem 1.5rem
  border-radius 1rem
  border 1px solid
  backdrop-filter blur(12px)
  display flex
  flex-direction column
  gap 1rem

  .analysis-light &
    background rgba(255, 255, 255, 0.95)
    border-color #cbd5e1
    box-shadow 0 4px 15px rgba(0, 0, 0, 0.04)

  .analysis-dark &
    background rgba(8, 13, 25, 0.9)
    border-color #1e304d
    box-shadow 0 10px 30px rgba(0, 0, 0, 0.4)

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
  font-size 1.25rem
  font-weight 900
  text-transform uppercase
  letter-spacing 0.05em
  margin 0

  .analysis-light &
    background linear-gradient(to right, #78350f, #b45309, #d97706)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

  .analysis-dark &
    background linear-gradient(to right, #fffbeb, #f5c518, #b45309)
    -webkit-background-clip text
    -webkit-text-fill-color transparent

.banner-sub-desc
  font-size 0.75rem
  margin-top 0.15rem

  .analysis-light &
    color #475569

  .analysis-dark &
    color #94a3b8

.btn-add-log
  padding 0.65rem 1.25rem
  border-radius 0.75rem
  font-size 0.75rem
  font-weight 800
  cursor pointer
  display inline-flex
  align-items center
  gap 0.5rem
  transition all 0.2s ease
  border none

  .analysis-light &
    background linear-gradient(to right, #b45309, #d97706)
    color #ffffff
    box-shadow 0 4px 15px rgba(180, 83, 9, 0.2)
    &:hover
      filter brightness(1.1)

  .analysis-dark &
    background linear-gradient(to right, #d97706, #f5c518, #b45309)
    color #020617
    box-shadow 0 0 20px rgba(245, 197, 24, 0.3)
    &:hover
      filter brightness(1.25)
      transform scale(1.03)

.permission-tag
  padding 0.4rem 0.75rem
  border-radius 0.75rem
  font-size 0.75rem
  display flex
  align-items center
  gap 0.375rem
  border 1px solid

  .analysis-light &
    background #f1f5f9
    border-color #cbd5e1
    color #64748b

  .analysis-dark &
    background #0f172a
    border-color #1e293b
    color #94a3b8

.overview-stats-grid
  display grid
  grid-template-columns repeat(2, minmax(0, 1fr))
  gap 0.75rem

@media (min-width: 640px)
  .overview-stats-grid
    grid-template-columns repeat(4, minmax(0, 1fr))

.stat-card
  padding 1rem
  border-radius 1rem
  border 1px solid
  display flex
  align-items center
  gap 0.75rem
  backdrop-filter blur(12px)

  .analysis-light &
    background #ffffff
    border-color #cbd5e1
    box-shadow 0 2px 10px rgba(0, 0, 0, 0.03)

  .analysis-dark &
    background rgba(8, 13, 25, 0.8)
    border-color #1e293b

  &.card-win
    .analysis-dark &
      border-color rgba(22, 101, 52, 0.4)

  &.card-loss
    .analysis-dark &
      border-color rgba(153, 27, 27, 0.4)

  &.card-images
    .analysis-dark &
      border-color #1e304d

.stat-icon
  font-size 1.5rem

.stat-meta
  display flex
  flex-direction column

.stat-label
  font-size 0.6rem
  font-weight 700
  text-transform uppercase

  .analysis-light &
    color #64748b

  .analysis-dark &
    color #64748b

  &.label-win
    color #059669
    .analysis-dark &
      color #4ade80

  &.label-loss
    color #dc2626
    .analysis-dark &
      color #f87171

  &.label-images
    color #0284c7
    .analysis-dark &
      color #38bdf8

.stat-value
  font-size 1.125rem
  font-weight 700
  font-family monospace

  .analysis-light &
    color #0f172a

  .analysis-dark &
    color #ffffff

  &.val-win
    color #059669
    .analysis-dark &
      color #4ade80

  &.val-loss
    color #dc2626
    .analysis-dark &
      color #f87171

  &.val-images
    color #0284c7
    .analysis-dark &
      color #38bdf8

.loading-box, .empty-box
  padding 4rem 1.5rem
  text-align center
  border-radius 1rem
  border 1px solid
  backdrop-filter blur(12px)
  display flex
  flex-direction column
  align-items center
  gap 0.75rem

  .analysis-light &
    background #ffffff
    border-color #cbd5e1

  .analysis-dark &
    background rgba(8, 13, 25, 0.8)
    border-color #1c2e4a

.spinner
  width 2.5rem
  height 2.5rem
  border 4px solid #f5c518
  border-top-color transparent
  border-radius 9999px
  animation spin 1s linear infinite

.empty-icon
  font-size 3rem

.empty-title
  font-size 1rem
  font-weight 700
  text-transform uppercase
  margin 0

  .analysis-light &
    color #0f172a

  .analysis-dark &
    color #ffffff

.empty-desc
  font-size 0.75rem

  .analysis-light &
    color #475569

  .analysis-dark &
    color #94a3b8

.records-list
  display flex
  flex-direction column
  gap 1.5rem

.record-card
  padding 1.25rem
  border-radius 1rem
  border 1px solid
  backdrop-filter blur(12px)
  display flex
  flex-direction column
  gap 1rem
  transition all 0.2s ease

  .analysis-light &
    background #ffffff
    box-shadow 0 4px 15px rgba(0, 0, 0, 0.04)

  .analysis-dark &
    background rgba(8, 13, 25, 0.9)
    box-shadow 0 10px 30px rgba(0, 0, 0, 0.4)

  &.border-win
    .analysis-light &
      border-color #a7f3d0
    .analysis-dark &
      border-color rgba(52, 211, 153, 0.4)

  &.border-loss
    .analysis-light &
      border-color #fca5a5
    .analysis-dark &
      border-color rgba(239, 68, 68, 0.4)

.card-top-header
  display flex
  align-items center
  justify-content space-between
  flex-wrap wrap
  gap 0.5rem
  padding-bottom 0.75rem
  border-bottom 1px solid

  .analysis-light &
    border-color #e2e8f0

  .analysis-dark &
    border-color #18263e

.header-title-flex
  display flex
  align-items center
  gap 0.65rem

.result-badge
  padding 0.25rem 0.65rem
  border-radius 0.25rem
  font-size 0.65rem
  font-weight 800
  text-transform uppercase

  &.badge-win
    .analysis-light &
      background #d1fae5
      color #059669
      border 1px solid #a7f3d0
    .analysis-dark &
      background rgba(52, 211, 153, 0.2)
      color #34d399
      border 1px solid rgba(52, 211, 153, 0.4)

  &.badge-loss
    .analysis-light &
      background #fee2e2
      color #dc2626
      border 1px solid #fca5a5
    .analysis-dark &
      background rgba(239, 68, 68, 0.2)
      color #ef4444
      border 1px solid rgba(239, 68, 68, 0.4)

.record-match-title
  font-size 1rem
  font-weight 800
  margin 0

  .analysis-light &
    color #0f172a

  .analysis-dark &
    color #ffffff

.header-actions-right
  display flex
  align-items center
  gap 0.75rem

.event-date-text
  font-size 0.75rem
  font-family monospace

  .analysis-light &
    color #64748b

  .analysis-dark &
    color #94a3b8

.action-btn-group
  display flex
  align-items center
  gap 0.35rem

.btn-icon-action
  padding 0.25rem 0.5rem
  border-radius 0.375rem
  font-size 0.75rem
  border 1px solid
  cursor pointer
  transition all 0.15s ease

  .analysis-light &
    background #f1f5f9
    border-color #cbd5e1
    &:hover
      background #e2e8f0

  .analysis-dark &
    background #0f172a
    border-color #1e293b
    &:hover
      background #1e293b

  &.btn-delete
    &:hover
      background #ef5757 !important
      color #ffffff !important

.record-body-grid
  display grid
  grid-template-columns 1fr
  gap 1rem

@media (min-width: 768px)
  .record-body-grid
    grid-template-columns repeat(2, minmax(0, 1fr))

.analysis-box
  padding 1rem
  border-radius 0.75rem
  border 1px solid
  display flex
  flex-direction column
  gap 0.5rem

  &.box-mistakes
    .analysis-light &
      background #fef2f2
      border-color #fca5a5
    .analysis-dark &
      background rgba(239, 68, 68, 0.05)
      border-color rgba(239, 68, 68, 0.2)

  &.box-improvements
    .analysis-light &
      background #f0fdf4
      border-color #a7f3d0
    .analysis-dark &
      background rgba(52, 211, 153, 0.05)
      border-color rgba(52, 211, 153, 0.2)

.box-sec-title
  font-size 0.75rem
  font-weight 800
  text-transform uppercase
  letter-spacing 0.05em
  margin 0
  display flex
  align-items center
  gap 0.35rem

  .box-mistakes &
    .analysis-light &
      color #dc2626
    .analysis-dark &
      color #ef4444

  .box-improvements &
    .analysis-light &
      color #059669
    .analysis-dark &
      color #34d399

.sec-content
  font-size 0.75rem
  line-height 1.6
  margin 0
  white-space pre-line

  .analysis-light &
    color #0f172a

  .analysis-dark &
    color #cbd5e1

.gallery-section
  display flex
  flex-direction column
  gap 0.5rem

.gallery-title
  font-size 0.75rem
  font-weight 800
  text-transform uppercase
  margin 0

  .analysis-light &
    color #b45309

  .analysis-dark &
    color #f5c518

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
  border-radius 0.5rem
  overflow hidden
  border 1px solid
  cursor pointer

  .analysis-light &
    border-color #cbd5e1

  .analysis-dark &
    border-color #1e293b

.gallery-img
  width 100%
  height 100%
  object-fit cover

.image-overlay
  position absolute
  inset 0
  background rgba(0, 0, 0, 0.7)
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
  font-size 0.625rem
  color #ffffff
  margin-top 0.25rem

.record-footer
  padding-top 0.75rem
  border-top 1px solid
  display flex
  align-items center
  justify-content space-between
  font-size 0.65rem

  .analysis-light &
    border-color #e2e8f0
    color #64748b

  .analysis-dark &
    border-color #18263e
    color #64748b

.modal-overlay
  position fixed
  inset 0
  z-index 50
  background rgba(0, 0, 0, 0.75)
  backdrop-filter blur(6px)
  display flex
  align-items center
  justify-content center
  padding 1rem
  user-select none
  font-family 'Lora', serif

.modal-card
  width 100%
  max-width 42rem
  max-height 90vh
  border-radius 1rem
  padding 1.5rem
  overflow-y auto

  &.modal-light
    background #ffffff
    border 1px solid #cbd5e1
    color #0f172a
    box-shadow 0 20px 40px rgba(0, 0, 0, 0.15)

  &.modal-dark
    background #080d19
    border 1px solid #1e304d
    color #e2e8f0
    box-shadow 0 0 40px rgba(0, 0, 0, 0.5)

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

.modal-title
  font-size 1rem
  font-weight 800
  text-transform uppercase
  margin 0

  .modal-light &
    color #b45309

  .modal-dark &
    color #f5c518

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

  .modal-light &
    background #f1f5f9
    border-color #cbd5e1
    color #64748b

  .modal-dark &
    background #0f172a
    border-color #1e293b
    color #94a3b8

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
  margin-bottom 0.35rem

  .modal-light &
    color #0f172a

  .modal-dark &
    color #e2e8f0

.required-star
  color #ef5757

.form-input, .form-select, .form-textarea
  width 100%
  font-size 0.75rem
  padding 0.65rem
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

  .modal-dark &
    background #050912
    border-color #1e293b
    color #ffffff
    &::placeholder
      color #475569

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
  font-size 0.65rem
  font-weight 700
  padding 0.25rem 0.5rem
  border-radius 0.375rem
  border 1px solid
  cursor pointer

  .modal-light &
    background #e0f2fe
    border-color #bae6fd
    color #0284c7

  .modal-dark &
    background rgba(56, 189, 248, 0.15)
    border-color rgba(56, 189, 248, 0.4)
    color #38bdf8

.images-list
  display flex
  flex-direction column
  gap 0.75rem

.image-input-item
  padding 0.75rem
  border-radius 0.75rem
  border 1px solid
  display flex
  flex-direction column
  gap 0.5rem

  .modal-light &
    background #f8fafc
    border-color #cbd5e1

  .modal-dark &
    background #050912
    border-color #1c2e4a

.img-input-row
  display flex
  align-items center
  gap 0.5rem

.btn-upload-file
  padding 0.5rem 0.75rem
  border-radius 0.5rem
  font-size 0.7rem
  font-weight 700
  cursor pointer
  flex-shrink 0
  border 1px solid

  .modal-light &
    background #ffffff
    border-color #cbd5e1
    color #b45309

  .modal-dark &
    background #18263e
    border-color #2b4266
    color #f5c518

.hidden-file-input
  display none

.btn-remove-img
  color #ef5757
  background none
  border none
  cursor pointer
  padding 0 0.25rem

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
  cursor pointer

  .modal-light &
    background #f1f5f9
    border 1px solid #cbd5e1
    color #475569

  .modal-dark &
    background #0f172a
    border 1px solid #1e293b
    color #94a3b8

.btn-submit
  padding 0.5rem 1.25rem
  border-radius 0.75rem
  font-size 0.75rem
  font-weight 800
  cursor pointer
  border none

  .modal-light &
    background linear-gradient(to right, #b45309, #d97706)
    color #ffffff

  .modal-dark &
    background linear-gradient(to right, #d97706, #f5c518, #b45309)
    color #020617

@keyframes spin
  to
    transform rotate(360deg)

.fade-enter-active, .fade-leave-active
  transition opacity 0.2s ease

.fade-enter-from, .fade-leave-to
  opacity 0
</style>
