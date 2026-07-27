<template>
  <div class="bg-[#0d1017] border border-[#1e2430] rounded-xl p-3 text-white h-full flex flex-col">
    <h3 class="font-display text-sm mb-3 flex justify-between items-center text-[#e0b854] tracking-wide">
      <span>Chờ Xếp Đội Hình</span>
      <span class="bg-[#d4af37]/15 text-[#e0b854] border border-[#d4af37]/30 text-xs px-2 py-0.5 rounded-full font-body font-semibold">
        {{ pool.length }}
      </span>
    </h3>

    <!-- Danh sách Kéo - Thả -->
    <draggable
      :list="pool"
      group="attendance"
      item-key="userId"
      @add="onAddBackToPool"
      class="space-y-1.5 max-h-[calc(100vh-230px)] overflow-y-auto pr-1 min-h-[50px] flex-1"
    >
      <template #item="{ element }">
        <div class="cursor-grab active:cursor-grabbing hover:brightness-110 transition rounded-lg">
          <MemberCard
            :displayName="element.displayName || element.username"
            :className="element.className || element.roleOrClass"
          />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import draggable from 'vuedraggable';
import MemberCard from './MemberCard.vue';

const props = defineProps({
  pool: Array
});

// Xử lý khi có ai đó thả một Slot từ Team về lại Pool
const onAddBackToPool = (evt) => {
  const formattedPool = props.pool.map(item => {
    if (!item) return null;

    return {
      userId: item.userId,
      username: item.username || item.displayName || '',
      displayName: item.displayName || item.username || '',
      className: item.className || item.roleOrClass || 'N/A'
    };
  }).filter(item => item && item.userId);

  const uniquePool = formattedPool.filter((item, index, self) =>
    index === self.findIndex(t => t.userId === item.userId)
  );

  props.pool.splice(0, props.pool.length, ...uniquePool);
};
</script>