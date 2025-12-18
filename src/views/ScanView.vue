<template>
  <div class="space-y-4">
    <header class="space-y-1">
      <div class="chip">
        <span class="h-2 w-2 rounded-full bg-leaf/80"></span>
        多模态感知 · The Scanner
      </div>
      <h1 class="text-2xl font-semibold tracking-tight">把食物放到“森林光线”里</h1>
      <p class="text-sm text-ink/70">演示版：选择一个食品，模拟检索“长寿知识图谱 (LKG)”。</p>
    </header>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-stretch">
      <section class="card p-4 md:h-full">
        <div
          class="relative h-full w-full overflow-hidden rounded-organic bg-paper/60 ring-1 ring-ink/10"
          style="min-height: 340px"
        >
          <!-- organic scan frame -->
          <div class="absolute inset-5 rounded-[2rem] ring-2 ring-leaf/40"></div>
          <div class="absolute inset-7 rounded-[2rem] ring-1 ring-moss/25"></div>

          <!-- scan line -->
          <div ref="scanLine" class="absolute left-6 right-6 top-8 h-0.5 rounded-full bg-leaf/60 blur-[0.5px]"></div>
          <div ref="scanGlow" class="absolute left-6 right-6 top-8 h-10 bg-leaf/10 blur-xl"></div>

          <!-- status -->
          <div class="absolute inset-x-0 bottom-4 flex justify-center">
            <div class="chip">
              <span v-if="phase === 'idle'">等待识别</span>
              <span v-else-if="phase === 'loading'">正在检索长寿知识图谱 (LKG)...</span>
              <span v-else>识别完成，正在生成洞察…</span>
            </div>
          </div>
        </div>
      </section>

      <section class="card p-4 md:flex md:h-full md:flex-col">
        <div class="flex items-center justify-between gap-3">
          <div class="text-sm text-ink/70">模拟食品</div>
          <select v-model="selected" class="tap rounded-xl bg-paper/70 px-3 py-2 text-sm ring-1 ring-ink/10">
            <option value="cola">可口可乐</option>
            <option value="bread">全麦面包</option>
            <option value="yogurt">希腊酸奶</option>
          </select>
        </div>

        <button
          class="tap hoverleaf mt-3 w-full rounded-2xl bg-moss px-4 py-3 text-sm font-semibold text-paper shadow-soft disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="phase !== 'idle'"
          @click="startScan"
        >
          模拟识别
        </button>

        <p class="mt-2 text-xs text-ink/60">提示：会轻微震动（如设备支持），并播放 2 秒检索流程。</p>
        <div class="hidden md:block md:flex-1"></div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

import { selectProduct } from '../state/session'

type Phase = 'idle' | 'loading' | 'done'

const router = useRouter()

const selected = ref<'cola' | 'bread' | 'yogurt'>('yogurt')
const phase = ref<Phase>('idle')

const scanLine = ref<HTMLDivElement | null>(null)
const scanGlow = ref<HTMLDivElement | null>(null)

let tl: gsap.core.Timeline | null = null

onMounted(() => {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return
  tl = gsap.timeline({ repeat: -1, yoyo: true })
  tl.to([scanLine.value, scanGlow.value], {
    y: 260,
    duration: 1.4,
    ease: 'sine.inOut',
  })
})

onUnmounted(() => {
  tl?.kill()
  tl = null
})

async function startScan() {
  phase.value = 'loading'
  if (navigator.vibrate) navigator.vibrate(30)

  selectProduct(selected.value)

  await new Promise((r) => setTimeout(r, 2000))
  phase.value = 'done'
  await new Promise((r) => setTimeout(r, 250))
  void router.push('/insight')
  phase.value = 'idle'
}
</script>


