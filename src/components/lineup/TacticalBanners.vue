<template lang="pug">
.banners-wrapper
  //- Banner 1: Chú ý Tố Vấn
  .banner-card.banner-purple(
    :class="themeStore.theme === 'light' ? 'banner-light' : 'banner-dark'"
  )
    template(v-if="!isEditMode")
      span.banner-text.text-purple {{ banner1Text }}
    template(v-else)
      input.banner-input.input-purple(
        v-model="banner1.text"
        placeholder="Nhập ghi chú chiến thuật banner 1..."
      )

  //- Banner 2: Trang bị Tank
  .banner-card.banner-yellow(
    :class="themeStore.theme === 'light' ? 'banner-light' : 'banner-dark'"
  )
    template(v-if="!isEditMode")
      span.banner-text.text-yellow {{ banner2Text }}
    template(v-else)
      input.banner-input.input-yellow(
        v-model="banner2.text"
        placeholder="Nhập ghi chú chiến thuật banner 2..."
      )
</template>

<script setup>
import { computed } from 'vue';
import { useThemeStore } from '../../stores/themeStore';

const props = defineProps({
  banners: { type: Array, default: () => [] },
  isEditMode: { type: Boolean, default: false }
});

const themeStore = useThemeStore();

const banner1 = computed(() => {
  if (!props.banners[0]) props.banners[0] = { id: 'b1', text: 'Các Tố Vấn mid build trâu nhiều chút nhé' };
  return props.banners[0];
});

const banner2 = computed(() => {
  if (!props.banners[1]) props.banners[1] = { id: 'b2', text: 'Tank cầm Thái Cực Đồ + Như Phong Tự Bế + Phong Tuyết Kinh Đào hoặc Chuông' };
  return props.banners[1];
});

const banner1Text = computed(() => banner1.value?.text || '');
const banner2Text = computed(() => banner2.value?.text || '');
</script>

<style lang="stylus" scoped>
.banners-wrapper
  display flex
  flex-direction column
  gap 0.375rem
  margin-top 0.5rem

.banner-card
  border-radius 0.375rem
  padding 0.4rem 1rem
  text-align center
  display flex
  align-items center
  justify-content center
  gap 0.5rem
  transition all 0.2s ease
  font-family 'Lora', serif

  &.banner-purple
    .banner-light &
      background #f3e8ff
      border 1px solid #e9d5ff
    .banner-dark &
      background rgba(11, 12, 22, 0.9)
      border 1px solid rgba(168, 85, 247, 0.4)
      box-shadow 0 0 12px rgba(168, 85, 247, 0.15)

  &.banner-yellow
    .banner-light &
      background #fef3c7
      border 1px solid #fde68a
    .banner-dark &
      background rgba(14, 12, 20, 0.9)
      border 1px solid rgba(234, 179, 8, 0.4)
      box-shadow 0 0 12px rgba(234, 179, 8, 0.15)

.banner-text
  font-size 0.75rem
  font-weight 600
  letter-spacing 0.025em

  &.text-purple
    .banner-light &
      color #7c3aed
    .banner-dark &
      color #c084fc

  &.text-yellow
    .banner-light &
      color #b45309
    .banner-dark &
      color #fde047

.banner-input
  width 100%
  font-size 0.75rem
  font-weight 600
  text-align center
  padding 0.15rem 0.5rem
  border-radius 0.25rem
  outline none

  &.input-purple
    .banner-light &
      background #ffffff
      border 1px solid #e9d5ff
      color #7c3aed
    .banner-dark &
      background #060a12
      border 1px solid rgba(168, 85, 247, 0.5)
      color #c084fc

  &.input-yellow
    .banner-light &
      background #ffffff
      border 1px solid #fde68a
      color #b45309
    .banner-dark &
      background #060a12
      border 1px solid rgba(234, 179, 8, 0.5)
      color #fde047
</style>
