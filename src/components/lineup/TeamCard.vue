<template>
  <div class="bg-[#0b0e14] border border-[#1e2430] rounded-lg p-2.5 flex flex-col h-full shadow-md shadow-black/20 hover:border-[#2a3140] transition">
    <!-- Header của Team -->
    <div class="flex justify-between items-center mb-2 pb-1.5 border-b border-[#1e2430]">
      <span class="font-display text-sm text-[#7ea6ec] tracking-wide">{{ team.teamName }}</span>
      <input
        v-model="team.teamTag"
        placeholder="+ Tag"
        class="text-[11px] bg-[#12161f] text-[#e0b854] font-medium px-2 py-0.5 rounded border border-[#d4af37]/25 w-24 text-right focus:outline-none focus:border-[#d4af37]/60 placeholder-[#5b6472]"
      />
    </div>

    <!-- Danh sách Slot -->
    <div class="flex-1">
      <div v-for="(slot, sIdx) in team.slots" :key="sIdx">
        <draggable
          :list="getSlotAsArray(slot)"
          group="attendance"
          item-key="userId"
          @add="onDropIntoSlot($event, sIdx)"
          @remove="onRemoveFromSlot(sIdx)"
          class="min-h-[36px]"
        >
          <template #item="{ element }">
            <SlotRow :slot="element" @remove="$emit('removeSlot', sIdx)" />
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import draggable from 'vuedraggable';
import SlotRow from './SlotRow.vue';

const props = defineProps({
  team: Object
});

defineEmits(['removeSlot']);

const getSlotAsArray = (slot) => {
  return slot && slot.userId ? [slot] : [];
};

const onDropIntoSlot = (evt, slotIndex) => {
  const droppedItem = evt.item._underlying_vm_;
  if (droppedItem) {
    const targetSlot = props.team.slots[slotIndex];

    targetSlot.userId = droppedItem.userId;
    targetSlot.displayName = droppedItem.displayName || droppedItem.username || '';
    targetSlot.className = droppedItem.className || '';
    targetSlot.roleName = droppedItem.roleName || '';
  }
};

const onRemoveFromSlot = (slotIndex) => {
  const targetSlot = props.team.slots[slotIndex];

  targetSlot.userId = null;
  targetSlot.displayName = '';
  targetSlot.className = '';
  targetSlot.roleName = '';
};
</script>
