<template lang="pug">
nav.bottom-nav(aria-label="Điều hướng nhanh")
  RouterLink.tab(v-for="t in tabs" :key="t.path" :to="t.path" :class="{ active: isActive(t.path) }")
    span.tab-icon {{ t.icon }}
    span.tab-label {{ t.label }}
  button.tab(type="button" @click="$emit('more')")
    span.tab-icon ☰
    span.tab-label Thêm
</template>

<script setup>
import { useRoute } from 'vue-router';

defineEmits(['more']);
const route = useRoute();

const tabs = [
  { path: '/', icon: '🏠', label: 'Trang chủ' },
  { path: '/lineup', icon: '📜', label: 'Đội hình' },
  { path: '/schedule', icon: '⚔️', label: 'Chiến kỳ' },
  { path: '/stats', icon: '📊', label: 'Thống kê' },
];

const isActive = (path) => (path === '/' ? route.path === '/' : route.path.startsWith(path));
</script>

<style lang="stylus" scoped>
/* Chỉ hiện trên điện thoại / tablet nhỏ */
.bottom-nav
  display none

@media (max-width: 767px)
  .bottom-nav
    position fixed
    left 0
    right 0
    bottom 0
    z-index 40
    display grid
    grid-template-columns repeat(5, 1fr)
    padding-bottom env(safe-area-inset-bottom)
    background var(--color-surface)
    border-top 1px solid var(--color-border)
    box-shadow 0 -6px 18px rgba(0, 0, 0, 0.18)

  .tab
    display flex
    flex-direction column
    align-items center
    justify-content center
    gap 2px
    min-height 56px
    background none
    border 0
    cursor pointer
    text-decoration none
    color var(--color-text-secondary)
    font-family var(--font-body)
    -webkit-tap-highlight-color transparent

    &.active
      color var(--color-brand)

      .tab-icon
        transform translateY(-1px) scale(1.12)

  .tab-icon
    font-size 1.25rem
    line-height 1
    transition transform 0.15s ease

  .tab-label
    font-size 0.65rem
    font-weight 600
</style>
