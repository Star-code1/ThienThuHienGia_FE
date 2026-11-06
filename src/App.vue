<template lang="pug">
.app-wrapper(
  :class="themeStore.theme === 'light' ? 'light-theme' : 'dark-theme'"
)
  //- Atmospheric Background Image
  .bg-image(
    :class="themeStore.theme === 'light' ? 'opacity-20 scale-100' : 'opacity-40 scale-105'"
  )

  //- Gradient Overlay for Contrast
  .bg-overlay(
    :class="themeStore.theme === 'light' ? 'overlay-light' : 'overlay-dark'"
  )

  //- Modern Pastel Ambient Glows
  .ambient-glows(
    :class="themeStore.theme === 'light' ? 'glows-light' : 'glows-dark'"
  )

  //- Main Navigation Bar
  Navbar(@toggleMenu="isMenuOpen = !isMenuOpen")

  //- Collapsible Menu Drawer
  SidebarDrawer(:isOpen="isMenuOpen" @close="isMenuOpen = false")

  //- Thanh điều hướng dưới cùng (chỉ mobile)
  BottomNav(@more="isMenuOpen = true")

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
import BottomNav from './components/common/BottomNav.vue';
import LoginPromptModal from './components/common/LoginPromptModal.vue';
import { useThemeStore } from './stores/themeStore';

const isMenuOpen = ref(false);
const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initTheme();
});
</script>

<style lang="stylus">
/* App Container */
.app-wrapper
  min-height 100vh
  display flex
  flex-direction column
  font-family 'Be Vietnam Pro', system-ui, -apple-system, sans-serif
  position relative
  overflow-x hidden
  transition background-color 0.25s ease, color 0.25s ease

  &.light-theme
    background-color #f6efe1
    color #2a1a14

  &.dark-theme
    background-color #120a0d
    color #f6ecdc

.bg-image
  position fixed
  inset 0
  z-index 0
  pointer-events none
  contain strict
  transform translateZ(0)
  transition opacity 0.3s ease

.bg-overlay
  position fixed
  inset 0
  z-index 0
  pointer-events none
  contain strict
  transform translateZ(0)
  transition background 0.3s ease

  &.overlay-light
    background radial-gradient(at 100% 0%, rgba(226, 184, 87, 0.22) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(155, 28, 49, 0.10) 0px, transparent 50%), #f6efe1

  &.overlay-dark
    background radial-gradient(at 100% 0%, rgba(226, 184, 87, 0.09) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(155, 28, 49, 0.22) 0px, transparent 50%), #120a0d

.ambient-glows
  position fixed
  inset 0
  z-index 0
  pointer-events none
  contain strict
  transform translateZ(0)
  transition opacity 0.3s ease

  &.glows-light
    opacity 0.6
    background radial-gradient(55rem 25rem at 20% -5%, rgba(226, 184, 87, 0.28), transparent), radial-gradient(45rem 25rem at 85% 25%, rgba(155, 28, 49, 0.10), transparent)

  &.glows-dark
    opacity 0.45
    background radial-gradient(55rem 25rem at 20% -5%, rgba(155, 28, 49, 0.28), transparent), radial-gradient(45rem 25rem at 85% 25%, rgba(226, 184, 87, 0.12), transparent)

.main-content
  position relative
  z-index 10
  flex 1
  display flex
  flex-direction column

@media (max-width: 767px)
  .main-content
    padding-bottom calc(60px + env(safe-area-inset-bottom))

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