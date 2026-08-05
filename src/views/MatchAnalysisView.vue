<template>
  <div class="relative min-h-[calc(100vh-57px)] text-[#e2e8f0] p-4 sm:p-6 max-w-7xl mx-auto font-sans select-none space-y-6 pb-16">
    <!-- Ambient Background Glows -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#f5c518]/10 rounded-full blur-[130px]"></div>
      <div class="absolute bottom-1/3 left-1/4 w-[450px] h-[450px] bg-[#ef4444]/10 rounded-full blur-[110px]"></div>
    </div>

    <!-- Section Header Banner -->
    <div class="relative z-10 bg-[#080d19]/90 border border-[#1e304d] rounded-2xl p-5 md:p-6 shadow-2xl backdrop-blur-md font-serif flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <span class="text-3xl">📊</span>
          <div>
            <h1 class="text-2xl md:text-3xl font-extrabold uppercase bg-gradient-to-r from-[#fffbeb] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent tracking-wide">
              DỮ LIỆU TRẬN ĐẤU & RÚT KINH NGHIỆM
            </h1>
            <p class="text-xs text-[#94a3b8] mt-0.5">
              Lưu trữ hình ảnh trận chiến, đánh giá các điểm sai sót & phương án chiến thuật sửa đổi
            </p>
          </div>
        </div>
      </div>

      <!-- Create Match Log Button -->
      <div>
        <button
          @click="openCreateModal"
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl font-extrabold text-xs text-slate-950 bg-gradient-to-r from-[#d97706] via-[#f5c518] to-[#b45309] hover:brightness-125 transition-all shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:scale-105 font-serif flex items-center justify-center gap-2"
        >
          <span>➕</span>
          <span>THÊM DỮ LIỆU TRẬN ĐẤU</span>
        </button>
      </div>
    </div>

    <!-- Overview Statistics Bar -->
    <div class="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 font-serif">
      <div class="bg-[#080d19]/80 border border-[#1e293b] rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md">
        <span class="text-2xl">🗡️</span>
        <div>
          <span class="text-[10px] text-[#64748b] block font-bold uppercase">Tổng Trận Đánh Giá</span>
          <span class="text-lg font-bold text-white font-mono">{{ records.length }}</span>
        </div>
      </div>

      <div class="bg-[#080d19]/80 border border-[#166534]/40 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md">
        <span class="text-2xl">🏆</span>
        <div>
          <span class="text-[10px] text-[#4ade80] block font-bold uppercase">Trận Thắng</span>
          <span class="text-lg font-bold text-[#4ade80] font-mono">{{ winCount }}</span>
        </div>
      </div>

      <div class="bg-[#080d19]/80 border border-[#991b1b]/40 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md">
        <span class="text-2xl">💔</span>
        <div>
          <span class="text-[10px] text-[#f87171] block font-bold uppercase">Trận Thua / Rút Kinh Nghiệm</span>
          <span class="text-lg font-bold text-[#f87171] font-mono">{{ lossCount }}</span>
        </div>
      </div>

      <div class="bg-[#080d19]/80 border border-[#1e304d] rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md">
        <span class="text-2xl">🖼️</span>
        <div>
          <span class="text-[10px] text-[#38bdf8] block font-bold uppercase">Tổng Ảnh Lưu Trữ</span>
          <span class="text-lg font-bold text-[#38bdf8] font-mono">{{ totalImagesCount }}</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="py-16 text-center space-y-3 font-serif">
      <div class="w-10 h-10 border-4 border-[#f5c518] border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-xs text-[#94a3b8]">Đang tải dữ liệu trận đấu...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="records.length === 0"
      class="relative z-10 bg-[#080d19]/80 border border-[#1c2e4a] rounded-2xl p-12 text-center space-y-3 font-serif backdrop-blur-md"
    >
      <span class="text-5xl block">⚔️</span>
      <h3 class="text-base font-bold text-white uppercase tracking-wider">
        Chưa có dữ liệu trận đấu nào được lưu trữ
      </h3>
      <p class="text-xs text-[#94a3b8] max-w-md mx-auto">
        Hãy bắt đầu ghi chép dữ liệu trận đấu, hình ảnh và note lại các việc sai sót để môn phái cùng rút kinh nghiệm!
      </p>
      <button
        @click="openCreateModal"
        class="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] via-[#f5c518] to-[#b45309] text-slate-950 text-xs font-bold transition shadow font-serif"
      >
        ➕ Thêm Trận Đấu Đầu Tiên
      </button>
    </div>

    <!-- Match Records List -->
    <div v-else class="relative z-10 space-y-6">
      <div
        v-for="item in records"
        :key="item._id"
        class="bg-[#080d19]/90 border border-[#1e304d] hover:border-[#f5c518]/60 rounded-2xl p-5 md:p-6 shadow-2xl backdrop-blur-md space-y-4 font-serif transition duration-300"
      >
        <!-- Header Info -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#142033] pb-3">
          <div class="flex items-center gap-3">
            <!-- Outcome Badge -->
            <span
              class="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border shadow"
              :class="{
                'bg-[#166534]/30 text-[#4ade80] border-[#4ade80]/40': item.result === 'win',
                'bg-[#991b1b]/30 text-[#f87171] border-[#f87171]/40': item.result === 'loss',
                'bg-[#854d0e]/30 text-[#fef08a] border-[#fef08a]/40': item.result === 'draw'
              }"
            >
              {{ item.result === 'win' ? '🏆 THẮNG TRẬN' : (item.result === 'loss' ? '💔 THUA TRẬN' : '⚖️ HÒA TRẬN') }}
            </span>

            <h3 class="text-lg font-bold text-white uppercase tracking-tight">
              {{ item.matchTitle }}
            </h3>
          </div>

          <!-- Actions & Date -->
          <div class="flex items-center gap-3 text-xs text-[#64748b]">
            <span class="font-mono">
              📅 {{ formatDate(item.eventDate) }}
            </span>

            <template v-if="canManage(item)">
              <button
                @click="openEditModal(item)"
                class="px-2.5 py-1 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-[#f5c518] text-xs font-bold transition"
              >
                ✏️ Sửa
              </button>
              <button
                @click="deleteRecord(item._id)"
                class="px-2.5 py-1 rounded-lg bg-[#7f1d1d]/30 hover:bg-[#ef5757] text-[#ef5757] hover:text-white text-xs font-bold transition"
              >
                🗑️ Xóa
              </button>
            </template>
          </div>
        </div>

        <!-- Mistakes Box (Những việc sai & cần sửa đổi) -->
        <div class="bg-[#7f1d1d]/15 border border-[#ef5757]/40 rounded-xl p-4 space-y-1.5">
          <div class="flex items-center gap-2 text-xs font-bold text-[#fca5a5] uppercase tracking-wider">
            <span>⚠️</span>
            <span>NHỮNG VIỆC SAI & ĐIỂM YẾU CẦN SỬA ĐỔI:</span>
          </div>
          <p class="text-xs md:text-sm text-[#fee2e2] leading-relaxed whitespace-pre-wrap font-serif">
            {{ item.mistakes }}
          </p>
        </div>

        <!-- Improvements Box (Phương án khắc phục) -->
        <div v-if="item.improvements" class="bg-[#1e3a8a]/20 border border-[#3b82f6]/40 rounded-xl p-4 space-y-1.5">
          <div class="flex items-center gap-2 text-xs font-bold text-[#93c5fd] uppercase tracking-wider">
            <span>💡</span>
            <span>PHƯƠNG ÁN KHẮC PHỤC & CHIẾN THUẬT MỚI:</span>
          </div>
          <p class="text-xs md:text-sm text-[#dbeafe] leading-relaxed whitespace-pre-wrap font-serif">
            {{ item.improvements }}
          </p>
        </div>

        <!-- Screenshots / Image Gallery -->
        <div v-if="item.images && item.images.length > 0" class="space-y-2 pt-1">
          <span class="text-xs font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1.5">
            <span>🖼️</span>
            <span>Hình Ảnh Trận Chiến & Screenshots ({{ item.images.length }} ảnh):</span>
          </span>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="(img, imgIdx) in item.images"
              :key="imgIdx"
              class="relative aspect-video rounded-xl overflow-hidden bg-[#03060d] border border-[#1e304d] group cursor-pointer"
              @click="openImageLightbox(img.url)"
            >
              <img
                :src="img.url"
                :alt="img.caption || item.matchTitle"
                class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div v-if="img.caption" class="absolute bottom-0 inset-x-0 bg-black/80 text-[10px] text-white p-1 text-center truncate">
                {{ img.caption }}
              </div>
            </div>
          </div>
        </div>

        <!-- Author Footer -->
        <div class="pt-3 border-t border-[#142033] flex items-center justify-between text-xs text-[#64748b]">
          <div class="flex items-center gap-2">
            <img
              :src="item.author?.avatar || defaultAvatar"
              :alt="item.author?.name"
              class="w-6 h-6 rounded-lg object-cover border border-[#f5c518]/40"
            />
            <span class="font-bold text-[#e2e8f0]">{{ item.author?.name || 'Đệ tử' }}</span>
            <span class="text-[9px] px-1.5 py-0.2 rounded bg-[#38bdf8]/20 text-[#38bdf8] font-bold">
              {{ item.author?.className || 'Bang Chúng' }}
            </span>
          </div>

          <span class="text-[11px] font-mono">Ghi chép: {{ formatDate(item.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- Modal Form (Create / Edit Match Log) -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showModal"
          class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none font-sans overflow-y-auto"
          @click.self="showModal = false"
        >
          <div class="bg-[#080d19]/95 border border-[#1e304d] rounded-2xl w-full max-w-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-md my-8 font-serif">
            <!-- Header -->
            <div class="flex justify-between items-center pb-4 border-b border-[#1c2c47] mb-4">
              <div class="flex items-center gap-2.5">
                <span class="text-2xl">📊</span>
                <h3 class="font-extrabold text-base bg-gradient-to-r from-[#fffbeb] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent uppercase tracking-wider">
                  {{ isEditing ? 'CHỈNH SỬA DỮ LIỆU TRẬN ĐẤU' : 'THÊM DỮ LIỆU TRẬN ĐẤU & SAI SÓT' }}
                </h3>
              </div>
              <button
                @click="showModal = false"
                class="w-8 h-8 rounded-xl bg-[#0f172a] border border-[#1e293b] text-[#94a3b8] hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Title & Date -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-bold text-[#e2e8f0] uppercase mb-1">
                    Tên Trận Đấu / Event <span class="text-[#ef5757]">*</span>
                  </label>
                  <input
                    v-model="form.matchTitle"
                    type="text"
                    required
                    placeholder="VD: Công Thành Chiến - Trận Cổng Đông"
                    class="w-full bg-[#050912] border border-[#1e293b] text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#f5c518]"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-[#e2e8f0] uppercase mb-1">
                    Kết Quả
                  </label>
                  <select
                    v-model="form.result"
                    class="w-full bg-[#050912] border border-[#1e293b] text-xs text-[#f5c518] font-bold rounded-xl px-3 py-2.5 focus:outline-none"
                  >
                    <option value="loss">💔 Thua Trận</option>
                    <option value="win">🏆 Thắng Trận</option>
                    <option value="draw">⚖️ Hòa Trận</option>
                  </select>
                </div>
              </div>

              <!-- Date Picker -->
              <div>
                <label class="block text-xs font-bold text-[#e2e8f0] uppercase mb-1">
                  Ngày Diễn Ra Trận Đấu
                </label>
                <input
                  v-model="form.eventDate"
                  type="date"
                  class="w-full bg-[#050912] border border-[#1e293b] text-white text-xs rounded-xl px-3.5 py-2 focus:outline-none"
                />
              </div>

              <!-- Mistakes Textarea -->
              <div>
                <label class="block text-xs font-bold text-[#fca5a5] uppercase mb-1 flex items-center gap-1">
                  <span>⚠️</span>
                  <span>Những Việc Sai & Điểm Yếu Cần Sửa Đổi <span class="text-[#ef5757]">*</span></span>
                </label>
                <textarea
                  v-model="form.mistakes"
                  required
                  rows="4"
                  placeholder="Ghi rõ các sai sót trong trận: Sai vị trí di chuyển, dồn skill trễ, thiếu phối hợp Tố Vấn, dính khống chế..."
                  class="w-full bg-[#050912] border border-[#ef5757]/40 text-white text-xs leading-relaxed rounded-xl p-3.5 focus:outline-none focus:border-[#ef5757]"
                ></textarea>
              </div>

              <!-- Improvements Textarea -->
              <div>
                <label class="block text-xs font-bold text-[#93c5fd] uppercase mb-1 flex items-center gap-1">
                  <span>💡</span>
                  <span>Phương Án Khắc Phục & Chiến Thuật Mới</span>
                </label>
                <textarea
                  v-model="form.improvements"
                  rows="3"
                  placeholder="Ghi chú cách sửa đổi: Tăng cường Thiết Y mở combat, chia team đánh tập trung..."
                  class="w-full bg-[#050912] border border-[#3b82f6]/40 text-white text-xs leading-relaxed rounded-xl p-3.5 focus:outline-none focus:border-[#3b82f6]"
                ></textarea>
              </div>

              <!-- Image Links & File Upload Section -->
              <div class="bg-[#050912] border border-[#17253b] rounded-xl p-3.5 space-y-3">
                <div class="flex justify-between items-center">
                  <label class="text-xs font-bold text-[#38bdf8] uppercase flex items-center gap-1.5">
                    <span>🖼️</span>
                    <span>Đính Kèm Ảnh Screenshots Trận Đấu (Tải Từ Máy / Cloudinary)</span>
                  </label>
                  <button
                    type="button"
                    @click="addImageInput"
                    class="text-[10px] bg-[#3b82f6]/20 text-[#60a5fa] px-2.5 py-1 rounded-lg border border-[#3b82f6]/40 font-bold hover:bg-[#3b82f6] hover:text-white transition flex items-center gap-1"
                  >
                    <span>➕ Thêm Ô Ảnh</span>
                  </button>
                </div>

                <div v-if="form.images.length === 0" class="text-[11px] text-[#64748b] italic">
                  Chưa có ảnh nào. Nhấn "Thêm Ô Ảnh" để tải ảnh từ máy lên Cloudinary hoặc dán URL.
                </div>

                <div v-for="(img, idx) in form.images" :key="idx" class="bg-[#091120] border border-[#1c2e4a] p-2.5 rounded-xl space-y-2">
                  <div class="flex items-center gap-2">
                    <!-- Thumbnail preview if uploaded -->
                    <div v-if="img.url" class="w-10 h-10 rounded-lg overflow-hidden border border-[#38bdf8]/40 shrink-0 bg-black">
                      <img :src="img.url" class="w-full h-full object-cover" />
                    </div>

                    <input
                      v-model="img.url"
                      type="text"
                      placeholder="URL ảnh Cloudinary (https://...)"
                      class="flex-1 bg-[#050912] text-xs text-white px-3 py-1.5 rounded-lg border border-[#1e293b] focus:outline-none"
                    />

                    <!-- Native File Input -->
                    <label class="cursor-pointer bg-[#38bdf8]/15 hover:bg-[#38bdf8] text-[#38bdf8] hover:text-slate-950 px-2.5 py-1.5 rounded-lg border border-[#38bdf8]/40 text-xs font-bold transition shrink-0 flex items-center gap-1">
                      <span>📁 Tải Ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleFileChange($event, idx)"
                      />
                    </label>

                    <button
                      type="button"
                      @click="removeImageInput(idx)"
                      class="w-7 h-7 bg-[#ef5757]/20 text-[#ef5757] rounded-lg border border-[#ef5757]/40 flex items-center justify-center text-xs hover:bg-[#ef5757] hover:text-white transition shrink-0"
                      title="Xóa ô ảnh"
                    >
                      ✕
                    </button>
                  </div>

                  <div class="flex items-center gap-2">
                    <input
                      v-model="img.caption"
                      type="text"
                      placeholder="Chú thích bức ảnh (VD: Bảng damage sát thương, Vị trí dồn skill...)"
                      class="w-full bg-[#050912] text-xs text-[#cbd5e1] px-2.5 py-1 rounded-lg border border-[#1e293b] focus:outline-none"
                    />
                    <span v-if="img.uploading" class="text-[10px] text-[#f5c518] font-bold animate-pulse shrink-0">
                      ☁️ Đang đẩy lên Cloudinary...
                    </span>
                  </div>
                </div>
              </div>

              <!-- Footer Buttons -->
              <div class="pt-3 border-t border-[#18263e] flex justify-end gap-3">
                <button
                  type="button"
                  @click="showModal = false"
                  class="px-4 py-2 rounded-xl bg-[#0f172a] text-[#94a3b8] text-xs font-bold border border-[#1e293b]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="px-6 py-2 rounded-xl bg-gradient-to-r from-[#d97706] via-[#f5c518] to-[#b45309] text-slate-950 text-xs font-extrabold shadow-lg hover:brightness-125 transition disabled:opacity-50"
                >
                  {{ isSubmitting ? 'Đang Lưu...' : (isEditing ? '💾 Lưu Cập Nhật' : '🚀 Lưu Dữ Liệu Trận Đấu') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
const defaultAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png';

const records = ref([]);
const loading = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const isSubmitting = ref(false);

const form = reactive({
  matchTitle: '',
  eventDate: new Date().toISOString().substring(0, 10),
  result: 'loss',
  mistakes: '',
  improvements: '',
  images: []
});

const winCount = computed(() => records.value.filter((r) => r.result === 'win').length);
const lossCount = computed(() => records.value.filter((r) => r.result === 'loss').length);
const totalImagesCount = computed(() => {
  return records.value.reduce((sum, r) => sum + (r.images ? r.images.length : 0), 0);
});

const canManage = (record) => {
  if (!record || !authStore.isAuthenticated) return false;
  const currentUserId = authStore.user?.discordId || authStore.user?.id;
  const isAuthor = record.author?.discordId === currentUserId;
  const isLeader = !!authStore.canEdit;
  return isAuthor || isLeader;
};

const fetchRecords = async () => {
  loading.value = true;
  try {
    const res = await api.getMatchAnalysis();
    if (res.data && res.data.success) {
      records.value = res.data.data || [];
    }
  } catch (err) {
    console.error('Lỗi khi tải dữ liệu trận đấu:', err);
  } finally {
    loading.value = false;
  }
};

const openCreateModal = () => {
  if (!authStore.isAuthenticated) {
    authStore.openLoginPrompt();
    return;
  }
  isEditing.value = false;
  editingId.value = null;
  form.matchTitle = '';
  form.eventDate = new Date().toISOString().substring(0, 10);
  form.result = 'loss';
  form.mistakes = '';
  form.improvements = '';
  form.images = [];
  showModal.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  editingId.value = item._id;
  form.matchTitle = item.matchTitle || '';
  form.eventDate = item.eventDate ? new Date(item.eventDate).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10);
  form.result = item.result || 'loss';
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

const handleFileChange = async (event, idx) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const targetItem = form.images[idx];
  if (!targetItem) return;

  targetItem.uploading = true;
  try {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target.result;
        const res = await api.uploadMatchImage(base64);
        if (res.data && res.data.success && res.data.url) {
          targetItem.url = res.data.url;
          Swal.fire({
            icon: 'success',
            title: 'Đã đẩy ảnh lên Cloudinary!',
            timer: 1200,
            showConfirmButton: false,
            background: '#0d1526',
            color: '#f5c518'
          });
        }
      } catch (uploadErr) {
        console.error('Lỗi khi đẩy ảnh lên Cloudinary:', uploadErr);
        Swal.fire({
          icon: 'error',
          title: 'Lỗi Upload',
          text: 'Không thể upload ảnh lên Cloudinary.',
          background: '#0d1526',
          color: '#ffffff'
        });
      } finally {
        targetItem.uploading = false;
      }
    };
    reader.readAsDataURL(file);
  } catch (err) {
    console.error('Lỗi đọc file:', err);
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
      background: '#0d1526',
      color: '#f5c518'
    });

    showModal.value = false;
    await fetchRecords();
  } catch (err) {
    const msg = err.response?.data?.message || 'Có lỗi xảy ra.';
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: msg,
      background: '#0d1526',
      color: '#ffffff'
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
    background: '#0d1526',
    color: '#ffffff'
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

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
