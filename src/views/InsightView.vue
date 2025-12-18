<template>
  <div class="space-y-4">
    <header class="space-y-1">
      <div class="chip">洞察 · The Dashboard</div>
      <h1 class="text-2xl font-semibold tracking-tight">{{ insight.product }}</h1>
      <p class="text-sm text-ink/70">长寿分数与通路看板（演示版稳定 mock 数据）。</p>
    </header>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
      <div class="md:col-span-2">
        <ScoreGauge :score="displayedScore" :time-impact="insight.time_impact" />
      </div>

      <section class="grid grid-cols-1 gap-3 md:col-span-2 md:grid-cols-2">
        <div class="card p-4">
          <div class="text-sm font-semibold">积极影响</div>
          <ul class="mt-2 space-y-1 text-sm text-ink/75">
            <li v-for="(x, i) in insight.positives" :key="i" class="flex gap-2">
              <span class="mt-2 h-1.5 w-1.5 rounded-full bg-leaf/80"></span>
              <span>{{ x }}</span>
            </li>
          </ul>
        </div>
        <div class="card p-4">
          <div class="text-sm font-semibold">潜在风险</div>
          <ul class="mt-2 space-y-1 text-sm text-ink/75">
            <li v-for="(x, i) in insight.risks" :key="i" class="flex gap-2">
              <span class="mt-2 h-1.5 w-1.5 rounded-full bg-earth/70"></span>
              <span>{{ x }}</span>
            </li>
          </ul>
        </div>
      </section>

      <section class="space-y-2 md:col-span-2">
        <div class="flex items-end justify-between">
          <div>
            <div class="text-sm font-semibold">生化通路看板</div>
            <div class="text-xs text-ink/60">10 个核心通路 · 点击展开“模型推理依据”</div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <PathwayCard v-for="p in insight.pathways" :key="p.name" :pathway="p" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ScoreGauge from '../components/ScoreGauge.vue'
import PathwayCard from '../components/PathwayCard.vue'
import { getDisplayedScore, session } from '../state/session'

const insight = computed(() => session.insight)
const displayedScore = computed(() => getDisplayedScore())
</script>


