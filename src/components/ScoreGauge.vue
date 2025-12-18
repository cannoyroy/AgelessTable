<template>
  <div class="card p-4">
    <div class="flex items-end justify-between">
      <div class="space-y-1">
        <div class="text-xs text-ink/60">Longevity Score</div>
        <div class="text-3xl font-semibold tabular-nums">{{ score }}</div>
      </div>
      <div class="text-right">
        <div class="text-xs text-ink/60">时间影响因子</div>
        <div class="inline-flex items-center gap-2 text-lg font-semibold">
          <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: color }"></span>
          <span class="tabular-nums">{{ timeImpact }}</span>
        </div>
      </div>
    </div>

    <div class="mt-4">
      <svg viewBox="0 0 240 140" class="h-40 w-full">
        <!-- track -->
        <path
          d="M20,120 A100,100 0 0 1 220,120"
          fill="none"
          stroke="rgba(17,24,39,0.08)"
          stroke-width="16"
          stroke-linecap="round"
        />

        <!-- leaf ring -->
        <path
          ref="arc"
          d="M20,120 A100,100 0 0 1 220,120"
          fill="none"
          :stroke="color"
          stroke-width="16"
          stroke-linecap="round"
          :style="{ strokeDasharray: dashArray, strokeDashoffset: dashOffset }"
        />

        <!-- subtle botanical lines -->
        <path
          d="M64,120 C84,90 110,80 120,60 C130,80 156,90 176,120"
          fill="none"
          stroke="rgba(120,176,204,0.25)"
          stroke-width="2"
          stroke-linecap="round"
        />

        <text x="120" y="132" text-anchor="middle" class="fill-ink/60" style="font-size: 12px">
          0
        </text>
        <text x="220" y="132" text-anchor="end" class="fill-ink/60" style="font-size: 12px">
          100
        </text>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  score: number
  timeImpact: string
}>()

const clamped = computed(() => Math.max(0, Math.min(100, props.score)))

const color = computed(() => {
  // red -> leaf
  const t = clamped.value / 100
  const r = Math.round(220 - 90 * t)
  const g = Math.round(70 + 120 * t)
  const b = Math.round(70 - 20 * t)
  return `rgb(${r} ${g} ${b})`
})

// half circumference approximation for dash. For demo, just use a stable number.
const dashArray = 360
const dashOffset = computed(() => {
  const pct = clamped.value / 100
  return (1 - pct) * dashArray
})
</script>


