<template>
  <button class="tap hoverleaf w-full text-left" @click="open = !open">
    <div class="card p-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-sm font-semibold">{{ pathway.name }}</div>
          <div class="mt-1 text-xs text-ink/70">{{ pathway.desc }}</div>
        </div>
        <div class="shrink-0">
          <span class="rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-ink/10" :class="badgeClass">
            {{ pathway.level }}
          </span>
        </div>
      </div>

      <div v-if="open" class="mt-3 rounded-2xl bg-paper/60 p-3 text-xs text-ink/70 ring-1 ring-ink/10">
        <div class="font-semibold text-ink/80">模型推理依据</div>
        <div class="mt-1 leading-relaxed">{{ pathway.rationale ?? '演示版：该通路的推理依据将在接入 LKG 后补全。' }}</div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Pathway } from '../data/mock'

const props = defineProps<{ pathway: Pathway }>()
const open = ref(false)

const badgeClass = computed(() => {
  switch (props.pathway.level) {
    case 'Optimal':
      return 'bg-leaf/25 text-ink'
    case 'High':
      return 'bg-moss/25 text-ink'
    case 'Medium':
      return 'bg-skylight/20 text-ink'
    case 'Low':
      return 'bg-earth/15 text-ink'
    case 'Risk':
      return 'bg-red-500/15 text-red-700'
    default:
      return 'bg-paper/60 text-ink'
  }
})
</script>


