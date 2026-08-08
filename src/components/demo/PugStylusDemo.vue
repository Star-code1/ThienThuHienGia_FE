<template lang="pug">
.demo-container
  .demo-card
    header.demo-header
      .badge Vue 3 + Pug + Stylus
      h1.title {{ title }}
      p.subtitle {{ subtitle }}

    section.counter-section
      p.count-display Số lượt click: 
        span.highlight {{ count }}
      .button-group
        button.btn.btn-primary(@click="increment")
          i.icon ➕
          span Tăng số
        button.btn.btn-secondary(@click="decrement")
          i.icon ➖
          span Giảm số
        button.btn.btn-danger(@click="reset")
          i.icon 🔄
          span Đặt lại

    section.feature-section
      h2.section-title Danh sách tính năng nổi bật
      ul.feature-list
        li.feature-item(v-for="(item, index) in features" :key="index")
          span.check-icon ✓
          .feature-info
            h3.item-title {{ item.name }}
            p.item-desc {{ item.description }}

    footer.demo-footer
      p.status Status: 
        span.status-online ● Hoạt động bình thường
</template>

<script setup>
import { ref } from 'vue';

const title = ref('Cấu hình Vue.js với Pug & Stylus');
const subtitle = ref('Viết template ngắn gọn, sạch sẽ với Pug và styling siêu tốc với Stylus trong Vue 3');
const count = ref(0);

const features = ref([
  {
    name: 'Pug Template Engine',
    description: 'Cú pháp thụt lề sạch đẹp, không cần đóng thẻ HTML, viết template nhanh hơn 50%.'
  },
  {
    name: 'Stylus CSS Preprocessor',
    description: 'Hỗ trợ nesting, variables, mixins, functions mà không cần dấu ngoặc nhọn `{}` hay chấm phẩy `;`.'
  },
  {
    name: 'Vue 3 SFC Composition API',
    description: 'Tích hợp hoàn hảo trong thẻ `<script setup>` của Single File Component.'
  }
]);

const increment = () => {
  count.value++;
};

const decrement = () => {
  if (count.value > 0) count.value--;
};

const reset = () => {
  count.value = 0;
};
</script>

<style lang="stylus" scoped>
// Stylus Variables
primary-color = #6366f1
primary-hover = #4f46e5
secondary-bg = rgba(255, 255, 255, 0.05)
text-main = #f8fafc
text-sub = #94a3b8
border-color = rgba(255, 255, 255, 0.1)
radius-lg = 16px
radius-md = 8px

// Stylus Mixin
glass-card()
  background: rgba(15, 23, 42, 0.75)
  backdrop-filter: blur(12px)
  border: 1px solid border-color
  border-radius: radius-lg
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)

flex-center()
  display: flex
  align-items: center
  justify-content: center

.demo-container
  flex-center()
  min-height: 100vh
  padding: 2rem
  background: radial-gradient(circle at top right, #1e1b4b, #0f172a, #020617)
  font-family: 'Inter', system-ui, -apple-system, sans-serif
  color: text-main

.demo-card
  glass-card()
  width: 100%
  max-width: 640px
  padding: 2.5rem
  display: flex
  flex-direction: column
  gap: 2rem

.demo-header
  text-align: center

  .badge
    display: inline-block
    padding: 0.35rem 0.85rem
    font-size: 0.8rem
    font-weight: 600
    color: #a5b4fc
    background: rgba(99, 102, 241, 0.15)
    border: 1px solid rgba(99, 102, 241, 0.3)
    border-radius: 9999px
    margin-bottom: 1rem

  .title
    font-size: 1.75rem
    font-weight: 700
    background: linear-gradient(135deg, #ffffff, #a5b4fc)
    -webkit-background-clip: text
    -webkit-text-fill-color: transparent
    margin-bottom: 0.5rem

  .subtitle
    font-size: 0.95rem
    color: text-sub
    line-height: 1.5

.counter-section
  background: secondary-bg
  padding: 1.5rem
  border-radius: radius-md
  border: 1px solid rgba(255, 255, 255, 0.05)
  text-align: center

  .count-display
    font-size: 1.1rem
    margin-bottom: 1.25rem
    color: text-sub

    .highlight
      font-size: 1.8rem
      font-weight: 800
      color: #38bdf8
      margin-left: 0.5rem

  .button-group
    display: flex
    gap: 0.75rem
    justify-content: center
    flex-wrap: wrap

.btn
  flex-center()
  gap: 0.5rem
  padding: 0.65rem 1.25rem
  border-radius: radius-md
  font-weight: 600
  font-size: 0.9rem
  cursor: pointer
  transition: all 0.2s ease
  border: none
  outline: none

  &:hover
    transform: translateY(-2px)
  
  &:active
    transform: translateY(0)

  &.btn-primary
    background: primary-color
    color: #ffffff

    &:hover
      background: primary-hover
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4)

  &.btn-secondary
    background: rgba(255, 255, 255, 0.1)
    color: text-main

    &:hover
      background: rgba(255, 255, 255, 0.18)

  &.btn-danger
    background: rgba(239, 68, 68, 0.15)
    color: #fca5a5
    border: 1px solid rgba(239, 68, 68, 0.3)

    &:hover
      background: rgba(239, 68, 68, 0.25)

.feature-section
  .section-title
    font-size: 1.1rem
    font-weight: 600
    margin-bottom: 1rem
    color: #cbd5e1

  .feature-list
    list-style: none
    padding: 0
    margin: 0
    display: flex
    flex-direction: column
    gap: 0.85rem

  .feature-item
    display: flex
    align-items: flex-start
    gap: 1rem
    padding: 1rem
    background: rgba(255, 255, 255, 0.03)
    border: 1px solid rgba(255, 255, 255, 0.05)
    border-radius: radius-md
    transition: background 0.2s ease

    &:hover
      background: rgba(255, 255, 255, 0.06)

    .check-icon
      flex-center()
      width: 24px
      height: 24px
      border-radius: 50%
      background: rgba(34, 197, 94, 0.15)
      color: #4ade80
      font-size: 0.85rem
      font-weight: bold
      flex-shrink: 0
      margin-top: 2px

    .item-title
      font-size: 0.95rem
      font-weight: 600
      color: #f1f5f9
      margin-bottom: 0.25rem

    .item-desc
      font-size: 0.85rem
      color: text-sub
      line-height: 1.4

.demo-footer
  text-align: center
  padding-top: 1rem
  border-top: 1px solid rgba(255, 255, 255, 0.08)
  font-size: 0.85rem
  color: text-sub

  .status-online
    color: #4ade80
    font-weight: 600
    margin-left: 0.25rem
</style>
