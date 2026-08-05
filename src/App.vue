<template>
  <div class="min-h-screen bg-[#050811] text-[#e2e8f0] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#f5c518]/30 selection:text-[#f5c518]">
    <!-- Kiếm Hiệp Atmospheric Background Image -->
    <div
      class="fixed inset-0 z-0 bg-[url('@/assets/bg.png')] bg-cover bg-center bg-no-repeat bg-fixed pointer-events-none opacity-45 scale-105 transform"
    ></div>

    <!-- Dark Gradient Overlay for Maximum Text Contrast -->
    <div
      class="fixed inset-0 z-0 bg-gradient-to-b from-[#050811]/90 via-[#050811]/75 to-[#050811]/95 pointer-events-none backdrop-blur-[1px]"
    ></div>

    <!-- Kiếm Hiệp Ambient Glows -->
    <div
      class="pointer-events-none fixed inset-0 opacity-40 z-0"
      style="background: radial-gradient(60rem 30rem at 20% -10%, rgba(245,197,24,0.12), transparent), radial-gradient(50rem 30rem at 85% 30%, rgba(56,189,248,0.1), transparent);"
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
import { ref } from 'vue';
import Navbar from './components/common/Navbar.vue';
import SidebarDrawer from './components/common/SidebarDrawer.vue';
import LoginPromptModal from './components/common/LoginPromptModal.vue';

const isMenuOpen = ref(false);
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&family=Cinzel:wght@600;700;800;900&display=swap');

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #050811; }
::-webkit-scrollbar-thumb { background: #172439; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #f5c518; }

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