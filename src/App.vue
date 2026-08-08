<template lang="pug">
.app-wrapper(
  :class="themeStore.theme === 'light' ? 'light-theme' : 'dark-theme'"
)
  //- Atmospheric Background Image
  .bg-image(
    :class="themeStore.theme === 'light' ? 'opacity-15 scale-100' : 'opacity-45 scale-105'"
  )

  //- Gradient Overlay for Contrast
  .bg-overlay(
    :class="themeStore.theme === 'light' ? 'overlay-light' : 'overlay-dark'"
  )

  //- Kiếm Hiệp Ambient Glows
  .ambient-glows(
    :class="themeStore.theme === 'light' ? 'glows-light' : 'glows-dark'"
  )

  //- Main Navigation Bar
  Navbar(@toggleMenu="isMenuOpen = !isMenuOpen")

  //- Collapsible Menu Drawer
  SidebarDrawer(:isOpen="isMenuOpen" @close="isMenuOpen = false")

  //- Login Required Prompt Modal
  LoginPromptModal

  //- Main Content Area
  main.main-content
    router-view(v-slot="{ Component }")
      transition(name="page-fade" mode="out-in")
        component(:is="Component")
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

<style lang="stylus">
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,600&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Philosopher:ital,wght@0,400;0,700;1,400;1,700&display=swap')

.app-wrapper
  min-height 100vh
  display flex
  flex-direction column
  font-family 'Be Vietnam Pro', system-ui, -apple-system, sans-serif
  position relative
  overflow-x hidden
  transition background-color 0.3s ease, color 0.3s ease

  &.light-theme
    background-color #f8fafc
    color #0f172a

  &.dark-theme
    background-color #050811
    color #e2e8f0

.bg-image
  position fixed
  inset 0
  z-index 0
  background-image url('@/assets/bg.png')
  background-size cover
  background-position center
  background-repeat no-repeat
  background-attachment fixed
  pointer-events none
  transition opacity 0.5s ease, transform 0.5s ease

.bg-overlay
  position fixed
  inset 0
  z-index 0
  pointer-events none
  backdrop-filter blur(1px)
  transition background 0.5s ease

  &.overlay-light
    background linear-gradient(to bottom, rgba(248, 250, 252, 0.92), rgba(241, 245, 249, 0.85), rgba(226, 232, 240, 0.95))

  &.overlay-dark
    background linear-gradient(to bottom, rgba(5, 8, 17, 0.9), rgba(5, 8, 17, 0.75), rgba(5, 8, 17, 0.95))

.ambient-glows
  position fixed
  inset 0
  z-index 0
  pointer-events none
  transition opacity 0.5s ease

  &.glows-light
    opacity 0.35
    background radial-gradient(60rem 30rem at 20% -10%, rgba(217, 119, 6, 0.15), transparent), radial-gradient(50rem 30rem at 85% 30%, rgba(2, 132, 199, 0.12), transparent)

  &.glows-dark
    opacity 0.4
    background radial-gradient(60rem 30rem at 20% -10%, rgba(245, 197, 24, 0.12), transparent), radial-gradient(50rem 30rem at 85% 30%, rgba(56, 189, 248, 0.1), transparent)

.main-content
  position relative
  z-index 10
  flex 1
  display flex
  flex-direction column

.page-fade-enter-active,
.page-fade-leave-active
  transition opacity 0.18s ease, transform 0.18s ease

.page-fade-enter-from
  opacity 0
  transform translateY(4px)

.page-fade-leave-to
  opacity 0
  transform translateY(-4px)
</style>