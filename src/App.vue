<template>
  <div class="min-h-screen bg-[#060a12] text-[#e2e8f0] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#3b82f6]/30">
    <!-- Gaming Ambient Glow Background -->
    <div
      class="pointer-events-none fixed inset-0 opacity-40 z-0"
      style="background: radial-gradient(60rem 30rem at 15% -10%, rgba(59,130,246,0.14), transparent), radial-gradient(50rem 30rem at 90% 20%, rgba(234,179,8,0.1), transparent);"
    ></div>

    <!-- Main Navigation Bar -->
    <Navbar @toggleMenu="isMenuOpen = !isMenuOpen" />

    <!-- Collapsible Menu Drawer (Góc Trái / Góc Phải) -->
    <SidebarDrawer :isOpen="isMenuOpen" @close="isMenuOpen = false" />

    <!-- Router View (HomeView, LineupView, ScheduleView, RosterView, StatsView) -->
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

const isMenuOpen = ref(false);
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap');

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #060a12; }
::-webkit-scrollbar-thumb { background: #172439; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #253856; }

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