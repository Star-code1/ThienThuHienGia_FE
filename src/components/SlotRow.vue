<template>
  <div class="flex items-stretch gap-1.5 my-1">
    <template v-if="slot.userId">
      <!-- Thẻ thành viên: giống hệt giao diện ở hàng chờ -->
      <MemberCard
        :displayName="slot.displayName"
        :className="slot.className"
        :roleName="slot.roleName"
        removable
        @remove="$emit('remove')"
        class="flex-1 min-w-0"
      />

      <!-- Ô Note riêng bên cạnh -->
      <input
        v-model="slot.note"
        placeholder="Note..."
        title="Ghi chú"
        class="w-16 shrink-0 bg-[#0b0e14] text-[#c7cbd4] placeholder-[#4b5364] text-[10px] px-1.5 rounded border border-[#232a38] focus:outline-none focus:border-[#4d8fea]"
      />
    </template>

    <!-- Slot trống -->
    <div
      v-else
      class="flex-1 pl-3 pr-2 py-2 rounded-lg border border-dashed border-[#2a3140] bg-[#0d1017] text-[#4b5364] italic text-xs"
    >
      -- Cần xếp --
    </div>
  </div>
</template>

<script setup>
import MemberCard from './MemberCard.vue';

defineProps({
  slot: Object
});
defineEmits(['remove']);
</script>