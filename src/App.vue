<template>
  <div
    class="min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-300 selection:bg-[#f5c518]/30 selection:text-[#f5c518]"
    :class="themeStore.theme === 'light' ? 'bg-[#f8fafc] text-[#0f172a] light-theme' : 'bg-[#050811] text-[#e2e8f0] dark-theme'"
  >
    <!-- Kiếm Hiệp Atmospheric Background Image -->
    <div
      class="fixed inset-0 z-0 bg-[url('@/assets/bg.png')] bg-cover bg-center bg-no-repeat bg-fixed pointer-events-none transform transition-opacity duration-500"
      :class="themeStore.theme === 'light' ? 'opacity-15 scale-100' : 'opacity-45 scale-105'"
    ></div>

    <!-- Gradient Overlay for Contrast -->
    <div
      class="fixed inset-0 z-0 pointer-events-none backdrop-blur-[1px] transition-colors duration-500"
      :class="themeStore.theme === 'light'
        ? 'bg-gradient-to-b from-[#f8fafc]/90 via-[#f1f5f9]/75 to-[#e2e8f0]/95'
        : 'bg-gradient-to-b from-[#050811]/90 via-[#050811]/75 to-[#050811]/95'"
    ></div>

    <!-- Kiếm Hiệp Ambient Glows -->
    <div
      class="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500"
      :class="themeStore.theme === 'light' ? 'opacity-25' : 'opacity-40'"
      :style="themeStore.theme === 'light'
        ? 'background: radial-gradient(60rem 30rem at 20% -10%, rgba(217,119,6,0.15), transparent), radial-gradient(50rem 30rem at 85% 30%, rgba(2,132,199,0.12), transparent);'
        : 'background: radial-gradient(60rem 30rem at 20% -10%, rgba(245,197,24,0.12), transparent), radial-gradient(50rem 30rem at 85% 30%, rgba(56,189,248,0.1), transparent);'"
    ></div>

    <!-- Main Navigation Bar -->
    <Navbar @toggleMenu="isMenuOpen = !isMenuOpen" />

    <!-- Collapsible Menu Drawer -->
    <SidebarDrawer :isOpen="isMenuOpen" @close="isMenuOpen = false" />

    <!-- Login Required Prompt Modal -->
    <LoginPromptModal />

    <!-- Main Content Area -->
    <main class="relative z-10 flex-1 flex flex-col">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from './components/common/Navbar.vue';
import SidebarDrawer from './components/common/SidebarDrawer.vue';
import LoginPromptModal from './components/common/LoginPromptModal.vue';
import { useThemeStore } from './stores/themeStore';

const isMenuOpen = ref(false);
const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initTheme();
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&family=Cinzel:wght@600;700;800;900&display=swap');

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>