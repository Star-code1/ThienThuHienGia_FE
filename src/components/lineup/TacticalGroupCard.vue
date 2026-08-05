<template>
  <div
    class="bg-[#0b121e]/90 border border-[#1a2942] rounded-md p-2 flex flex-col justify-between shadow-lg shadow-black/40 hover:border-[#2a3f63] transition min-w-[155px] flex-1"
  >
    <!-- Header của Nhóm -->
    <div class="flex justify-between items-center pb-1.5 mb-1 border-b border-[#1c2c47] gap-1">
      <template v-if="!isEditMode">
        <span class="font-semibold text-xs text-[#cbd5e1] tracking-wide truncate">
          {{ team.teamName }}
        </span>
        <span
          v-if="team.teamTag"
          class="text-[9px] px-1.5 py-0.5 rounded bg-[#1e293b] text-[#f5c518] border border-[#f5c518]/30 shrink-0 font-mono font-bold"
        >
          {{ team.teamTag }}
        </span>
      </template>

      <!-- Cho phép nhập tay Tên nhóm & Tag nhóm -->
      <template v-else>
        <input
          v-model="team.teamName"
          placeholder="Tên nhóm..."
          class="w-20 bg-[#060a12] text-xs font-bold text-[#f5c518] px-1 py-0.5 rounded border border-[#2a3f63] focus:outline-none focus:border-[#3b82f6]"
        />
        <input
          v-model="team.teamTag"
          placeholder="+ Tag"
          class="w-12 bg-[#060a12] text-[10px] text-[#60a5fa] px-1 py-0.5 rounded border border-[#2a3f63] focus:outline-none focus:border-[#3b82f6]"
        />
      </template>
    </div>

    <!-- Danh sách 6 Slot thành viên trong Nhóm -->
    <div class="flex-1 space-y-1 min-h-[160px]">
      <div
        v-for="(slot, sIdx) in team.slots"
        :key="sIdx"
        class="relative transition-all rounded"
        :class="{
          'ring-2 ring-[#3b82f6] bg-[#3b82f6]/10': isEditMode && dragOverIndex === sIdx,
          'border-b border-amber-500/20': sIdx === 0
        }"
        @dragover.prevent="dragOverIndex = sIdx"
        @dragleave="dragOverIndex = null"
        @drop="onDrop($event, sIdx)"
      >
        <!-- Slot có người hoặc trống -->
        <div
          :draggable="isEditMode && !!slot.userId"
          @dragstart="onDragStart($event, slot, sIdx)"
          class="rounded"
          :class="{ 'cursor-grab active:cursor-grabbing': isEditMode && !!slot.userId }"
        >
          <TacticalSlotRow
            :slot="slot"
            :isEditMode="isEditMode"
            @toggleCheck="$emit('toggleCheck', sIdx)"
            @remove="$emit('removeSlot', sIdx)"
            @clickSlot="$emit('clickSlot', sIdx)"
            @deleteExternal="store.deleteExternalMember(slot.userId)"
          />
        </div>
      </div>
    </div>

    <!-- Footer Tag của Nhóm -->
    <div class="mt-2 pt-1">
      <template v-if="!isEditMode">
        <div
          class="text-[10px] uppercase tracking-wider text-center py-0.5 px-2 rounded border font-semibold truncate"
          :class="footerBadgeClass"
        >
          {{ team.footerTag || 'HEAL AOE' }}
        </div>
      </template>

      <!-- Input nhập tay banner/tag footer cho nhóm nhỏ -->
      <template v-else>
        <input
          v-model="team.footerTag"
          placeholder="Tag nhóm (VD: HEAL AOE)"
          class="w-full bg-[#060a12] text-[10px] text-center uppercase tracking-wider py-0.5 px-1 rounded border border-[#2a3f63] text-[#ef5757] focus:outline-none focus:border-[#ef5757]"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TacticalSlotRow from './TacticalSlotRow.vue';
import { useLineupStore } from '../../stores/lineupStore';

const props = defineProps({
  divisionIndex: { type: Number, required: true },
  teamIndex: { type: Number, required: true },
  team: { type: Object, required: true },
  isEditMode: { type: Boolean, default: false }
});

defineEmits(['toggleCheck', 'removeSlot', 'clickSlot']);

const store = useLineupStore();
const dragOverIndex = ref(null);

const onDragStart = (evt, slot, sIdx) => {
  if (!slot.userId) return;
  const payload = {
    source: 'slot',
    dIdx: props.divisionIndex,
    tIdx: props.teamIndex,
    sIdx: sIdx,
  };
  evt.dataTransfer.setData('application/json', JSON.stringify(payload));
};

const onDrop = (evt, targetSIdx) => {
  dragOverIndex.value = null;
  try {
    const raw = evt.dataTransfer.getData('application/json');
    if (!raw) return;
    const data = JSON.parse(raw);

    if (data.source === 'slot') {
      store.moveOrSwapSlot({
        srcDIdx: data.dIdx,
        srcTIdx: data.tIdx,
        srcSIdx: data.sIdx,
        targetDIdx: props.divisionIndex,
        targetTIdx: props.teamIndex,
        targetSIdx: targetSIdx,
      });
    } else if (data.source === 'leader') {
      store.assignLeaderToSlot({
        targetDIdx: props.divisionIndex,
        targetTIdx: props.teamIndex,
        targetSIdx: targetSIdx,
        leader: data.leader,
      });
    } else if (data.source === 'pool') {
      store.assignFromPool({
        targetDIdx: props.divisionIndex,
        targetTIdx: props.teamIndex,
        targetSIdx: targetSIdx,
        member: data.member,
      });
    }
  } catch (e) {
    console.error('Lỗi khi thả slot:', e);
  }
};

const footerBadgeClass = computed(() => {
  const tag = (props.team.footerTag || '').toLowerCase();
  if (tag.includes('heal')) {
    return 'border-[#ef5757]/40 text-[#ef5757] bg-[#ef5757]/10 shadow-[0_0_8px_rgba(239,87,87,0.15)]';
  } else if (tag.includes('call') || tag.includes('chủ')) {
    return 'border-[#eab308]/40 text-[#ef4444] bg-[#eab308]/10 shadow-[0_0_8px_rgba(234,179,8,0.15)]';
  }
  return 'border-[#3b82f6]/40 text-[#60a5fa] bg-[#3b82f6]/10';
});
</script>
