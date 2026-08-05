<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="authStore.showLoginPromptModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans"
        @click.self="authStore.closeLoginPrompt()"
      >
        <div class="relative w-full max-w-md bg-[#080d19] border border-[#f5c518]/40 rounded-2xl p-6 shadow-[0_0_40px_rgba(245,197,24,0.2)] text-center space-y-6">
          <div class="w-16 h-16 rounded-full bg-[#f5c518]/10 border border-[#f5c518]/40 flex items-center justify-center text-3xl mx-auto shadow-[0_0_20px_rgba(245,197,24,0.3)] animate-pulse">
            📜
          </div>

          <div>
            <span class="text-[10px] uppercase font-bold tracking-widest text-[#d97706] font-serif block">
              天 書 門 — TIÊN MÔN THẮP PHIẾU
            </span>
            <h3 class="text-xl font-bold text-white font-serif uppercase tracking-wider mt-1">
              YÊU CẦU QUY NẬP XÁC THỰC
            </h3>
            <p class="text-xs text-[#94a3b8] leading-relaxed mt-3 px-2 font-serif">
              Để bảo hộ bí mật chiến trận và ma trận nội bộ Bang hội, các tiên phong khu vực yêu cầu đệ tử quy nhập xác thực tài khoản Discord mang chức vị <span class="text-[#f5c518] font-semibold">Bang Chúng</span> trong Thiên Thư Môn.
            </p>
          </div>

          <div class="flex flex-col gap-3 font-serif">
            <button
              @click="handleLogin"
              class="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#5865F2] to-[#404EED] text-white hover:brightness-110 transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>👾</span>
              <span>Quy Nhập Xác Thực Discord</span>
            </button>

            <button
              @click="authStore.closeLoginPrompt()"
              class="w-full py-2.5 rounded-xl font-semibold text-xs bg-[#111c2e] hover:bg-[#1b2b45] text-[#94a3b8] hover:text-white border border-[#1e304d] transition"
            >
              Quán Chiêm Trang Chủ
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();

const handleLogin = () => {
  authStore.closeLoginPrompt();
  authStore.loginWithDiscord();
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
