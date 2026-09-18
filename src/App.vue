<template lang="pug">
.app-wrapper(
  :class="themeStore.theme === 'light' ? 'light-theme' : 'dark-theme'"
)
  //- CRT Scanline Overlay
  .crt-scanlines

  //- Atmospheric Background Image
  .bg-image(
    :class="themeStore.theme === 'light' ? 'opacity-15 scale-100' : 'opacity-45 scale-105'"
  )

  //- Gradient Overlay for Contrast
  .bg-overlay(
    :class="themeStore.theme === 'light' ? 'overlay-light' : 'overlay-dark'"
  )

  //- Kiếm Hiệp Retro Ambient Glows
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
/* Retro Font Utility Definitions */
.font-pixel
  font-family 'Chakra Petch', 'Silkscreen', sans-serif !important
  text-transform uppercase
  letter-spacing 0.04em

.font-arcade
  font-family 'VT323', monospace !important
  letter-spacing 0.05em

.font-retro-tech
  font-family 'Share Tech Mono', monospace !important

/* CRT Scanline Overlay */
.crt-scanlines
  position fixed
  inset 0
  z-index 999
  pointer-events none
  background linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.2) 50%
  ), linear-gradient(
    90deg,
    rgba(255, 0, 0, 0.02),
    rgba(0, 255, 0, 0.01),
    rgba(0, 0, 255, 0.02)
  )
  background-size 100% 3px, 6px 100%
  opacity 0.45
  contain strict
  transform translateZ(0)

/* Pixelated Custom Scrollbars */
::-webkit-scrollbar
  width 8px
  height 8px

::-webkit-scrollbar-track
  background #0b1120

::-webkit-scrollbar-thumb
  background #3b82f6
  border-radius 0px
  box-shadow inset -1px -1px 0px #1d4ed8, inset 1px 1px 0px #60a5fa

::-webkit-scrollbar-thumb:hover
  background #f5c518
  box-shadow inset -1px -1px 0px #b45309, inset 1px 1px 0px #fef08a

/* App Container */
.app-wrapper
  min-height 100vh
  display flex
  flex-direction column
  font-family 'Be Vietnam Pro', system-ui, -apple-system, sans-serif
  position relative
  overflow-x hidden
  transition background-color 0.2s ease, color 0.2s ease

  &.light-theme
    background-color #f5efe0
    color #1c1917

  &.dark-theme
    background-color #080c16
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
  contain strict
  transform translateZ(0)
  transition opacity 0.3s ease

.bg-overlay
  position fixed
  inset 0
  z-index 0
  pointer-events none
  backdrop-filter blur(1px)
  contain strict
  transform translateZ(0)
  transition background 0.3s ease

  &.overlay-light
    background linear-gradient(to bottom, rgba(245, 239, 224, 0.94), rgba(238, 228, 207, 0.88), rgba(230, 217, 192, 0.96))

  &.overlay-dark
    background linear-gradient(to bottom, rgba(8, 12, 22, 0.92), rgba(12, 17, 30, 0.8), rgba(5, 8, 16, 0.96))

.ambient-glows
  position fixed
  inset 0
  z-index 0
  pointer-events none
  contain strict
  transform translateZ(0)
  transition opacity 0.3s ease

  &.glows-light
    opacity 0.3
    background radial-gradient(60rem 30rem at 20% -10%, rgba(217, 119, 6, 0.2), transparent), radial-gradient(50rem 30rem at 85% 30%, rgba(2, 132, 199, 0.15), transparent)

  &.glows-dark
    opacity 0.5
    background radial-gradient(60rem 30rem at 20% -10%, rgba(245, 197, 24, 0.18), transparent), radial-gradient(50rem 30rem at 85% 30%, rgba(56, 189, 248, 0.15), transparent)

.main-content
  position relative
  z-index 10
  flex 1
  display flex
  flex-direction column

.page-fade-enter-active,
.page-fade-leave-active
  transition opacity 0.15s ease, transform 0.15s ease

.page-fade-enter-from
  opacity 0
  transform translateY(3px)

.page-fade-leave-to
  opacity 0
  transform translateY(-3px)
</style>