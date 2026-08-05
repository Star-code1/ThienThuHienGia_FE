<template>
  <div class="relative min-h-[calc(100vh-57px)] flex items-center justify-center p-6 text-[#e2e8f0] select-none font-sans overflow-hidden">
    <!-- Xianxia Ambient Glow & Background -->
    <div class="fixed inset-0 pointer-events-none z-0 bg-[#060a12]">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#f5c518]/10 rounded-full blur-[130px]"></div>
    </div>

    <div class="relative z-10 w-full max-w-md bg-[#080d19]/90 border border-[#1e304d] rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-6 py-4 font-serif">
        <div class="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div class="absolute inset-0 rounded-full border-2 border-t-[#f5c518] border-r-transparent border-b-[#38bdf8] border-l-transparent animate-spin"></div>
          <span class="text-3xl">📜</span>
        </div>
        <div>
          <h2 class="text-xl font-bold font-serif bg-gradient-to-r from-[#fffbeb] via-[#f5c518] to-[#b45309] bg-clip-text text-transparent uppercase tracking-wider">
            ĐANG TRA ẤN ĐỊNH DANH TÍNH
          </h2>
          <p class="text-xs text-[#94a3b8] mt-2 font-serif">
            Đang tra cứu tiên sổ đệ tử trực thuộc Thiên Thư Môn...
          </p>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="space-y-6 py-4 font-serif">
        <div class="w-16 h-16 rounded-full bg-[#34d399]/20 border border-[#34d399]/50 flex items-center justify-center text-3xl mx-auto shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          ✨
        </div>
        <div>
          <h2 class="text-xl font-bold text-[#34d399] font-serif uppercase tracking-wide">
            QUY NHẬP THÀNH CÔNG!
          </h2>
          <p class="text-sm font-semibold text-white mt-3 font-serif">
            Chào mừng đệ tử <span class="text-[#f5c518]">{{ user?.nickname || user?.globalName || user?.username }}</span> an vị!
          </p>
          <p class="text-xs text-[#64748b] mt-1 font-serif">Đang chuyển về Trang Chủ...</p>
        </div>
      </div>

      <!-- Error / Rejected State (Not in Guild or Error) -->
      <div v-else class="space-y-6 py-4 font-serif">
        <div class="w-16 h-16 rounded-full bg-[#ef4444]/20 border border-[#ef4444]/50 flex items-center justify-center text-3xl mx-auto shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-bounce">
          🛑
        </div>
        <div>
          <h2 class="text-lg font-bold text-[#ef4444] font-serif uppercase tracking-wider">
            TỪ CHỐI QUY NẬP
          </h2>
          <div class="mt-3 p-3.5 bg-[#180d12] border border-[#7f1d1d]/60 rounded-xl text-xs text-[#fca5a5] leading-relaxed text-left font-serif">
            <span class="font-bold block text-[#f87171] mb-1">⚠️ Nguyên do:</span>
            {{ errorMessage || 'Tài khoản của bạn chưa có Role Bang Chúng trong Thiên Thư Môn.' }}
          </div>
        </div>

        <div class="flex flex-col gap-3 pt-2 font-serif">
          <button
            @click="authStore.loginWithDiscord()"
            class="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#d97706] to-[#f5c518] text-slate-950 hover:brightness-110 transition shadow-lg"
          >
            🔄 Thử Quy Nhập Lại
          </button>
          <RouterLink
            to="/"
            class="w-full py-2.5 rounded-xl font-semibold text-xs bg-[#111c2e] hover:bg-[#1b2b45] text-[#94a3b8] hover:text-white border border-[#1e304d] transition"
          >
            🏠 Trở Về Trang Chủ
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const success = ref(false);
const errorMessage = ref('');
const user = ref(null);

onMounted(async () => {
  const code = route.query.code;
  const error = route.query.error;

  if (error) {
    loading.value = false;
    errorMessage.value = 'Đệ tử chưa đồng ý ủy quyền từ Discord.';
    return;
  }

  if (!code) {
    loading.value = false;
    errorMessage.value = 'Thiếu chứng thư xác thực quy nhập.';
    return;
  }

  const result = await authStore.handleCallback(code);

  loading.value = false;
  if (result.success) {
    success.value = true;
    user.value = result.user;
    setTimeout(() => {
      router.push('/');
    }, 1500);
  } else {
    success.value = false;
    errorMessage.value = result.message;
  }
});
</script>
