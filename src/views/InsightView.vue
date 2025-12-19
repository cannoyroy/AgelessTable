<template>
  <div class="space-y-4">
    <header class="space-y-1">
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 space-y-1">
          <div class="chip">洞察 · The Dashboard</div>
          <h1 class="text-2xl font-semibold tracking-tight">{{ insight.product }}</h1>
          <p class="text-sm text-ink/70">长寿分数与通路看板（演示版稳定 mock 数据）。</p>
        </div>
        <div class="flex gap-2">
          <button
            class="tap hoverleaf flex h-9 w-9 items-center justify-center rounded-xl bg-paper/70 ring-1 ring-ink/10"
            :class="isFav ? 'text-leaf' : 'text-ink/60'"
            @click="toggleFav"
            :title="isFav ? '取消收藏' : '收藏'"
          >
            <Star :class="['h-5 w-5', isFav && 'fill-current']" />
          </button>
          <button
            class="tap hoverleaf flex h-9 w-9 items-center justify-center rounded-xl bg-paper/70 ring-1 ring-ink/10 text-ink/60"
            @click="handleShare"
            title="分享"
          >
            <Share2 class="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
      <div class="md:col-span-2">
        <ScoreGauge :score="displayedScore" :time-impact="insight.time_impact" />
      </div>

      <section v-if="healthAdaptation" class="card p-4 ring-2 ring-leaf/30">
        <div class="flex items-start gap-2">
          <AlertCircle class="h-5 w-5 flex-shrink-0 text-leaf" />
          <div class="flex-1">
            <div class="text-sm font-semibold">针对你的健康偏好</div>
            <div class="mt-1 text-sm text-ink/75">{{ healthAdaptation }}</div>
          </div>
        </div>
      </section>

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
        <div class="card p-4" :class="highlightRisks && 'ring-2 ring-earth/40'">
          <div class="flex items-center gap-2">
            <div class="text-sm font-semibold">潜在风险</div>
            <AlertTriangle v-if="highlightRisks" class="h-4 w-4 text-earth" />
          </div>
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
import { Star, Share2, AlertCircle, AlertTriangle } from 'lucide-vue-next'
import ScoreGauge from '../components/ScoreGauge.vue'
import PathwayCard from '../components/PathwayCard.vue'
import { getDisplayedScore, session } from '../state/session'
import { toggleFavorite, isFavorite } from '../state/favorites'
import { healthPreferences } from '../state/healthPreferences'

const insight = computed(() => session.insight)
const displayedScore = computed(() => getDisplayedScore())
const isFav = computed(() => isFavorite(session.selectedProductId))

// Health preference adaptations
const healthAdaptation = computed(() => {
  const profile = healthPreferences.profile
  if (profile === 'none') return null

  const productId = session.selectedProductId
  const adaptations: Record<string, Record<string, string>> = {
    diabetes: {
      yogurt: '✅ 低糖版本对血糖友好，但需注意选择无添加糖产品。蛋白质有助于平缓血糖曲线。',
      bread: '⚠️ 全麦面包仍含碳水，建议控制单次摄入量（1-2片），搭配蛋白质或脂肪可进一步平缓血糖。',
      cola: '❌ 高糖负荷会快速推高血糖，高血糖人群应避免。',
    },
    inflammation: {
      yogurt: '✅ 益生菌与发酵产物可能支持抗炎通路，但需选择无添加糖版本。',
      bread: '✅ 全麦纤维支持肠道健康，可能降低炎症标志物。',
      cola: '❌ 高糖与加工成分可能促进炎症反应，慢性炎症人群应避免。',
    },
    'weight-loss': {
      yogurt: '✅ 高蛋白提供饱腹感，低糖版本热量可控，适合减脂期。',
      bread: '⚠️ 注意控制摄入量，避免高热量涂抹酱。全麦纤维有助于饱腹。',
      cola: '❌ 液体热量不易产生饱腹感，易导致热量超标。',
    },
    'heart-health': {
      yogurt: '✅ 低饱和脂肪，益生菌可能支持心血管健康。',
      bread: '✅ 全麦纤维有助于降低胆固醇，但需注意钠含量。',
      cola: '❌ 高糖与可能的咖啡因可能影响血压与心血管健康。',
    },
    'gut-health': {
      yogurt: '✅ 益生菌与发酵产物直接支持肠道微生态与屏障功能。',
      bread: '✅ 全麦纤维是益生元，支持有益菌群生长。',
      cola: '❌ 高糖可能破坏肠道菌群平衡，缺乏有益成分。',
    },
  }

  return adaptations[profile]?.[productId] || null
})

const highlightRisks = computed(() => {
  const profile = healthPreferences.profile
  if (profile === 'none') return false
  // Highlight risks for diabetes, inflammation, heart-health
  return ['diabetes', 'inflammation', 'heart-health'].includes(profile) && session.selectedProductId === 'cola'
})

function toggleFav() {
  toggleFavorite(session.selectedProductId)
}

async function handleShare() {
  const shareText = `我在「逆龄餐桌」分析了 ${insight.value.product}，长寿分数：${displayedScore.value}，${insight.value.time_impact}。\n\n查看详细分析：${window.location.href}`

  if (navigator.share) {
    try {
      await navigator.share({
        title: `${insight.value.product} - 长寿分数分析`,
        text: shareText,
        url: window.location.href,
      })
      return
    } catch (e) {
      // User cancelled or share failed
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(shareText)
    alert('分享内容已复制到剪贴板')
  } catch (e) {
    // Fallback: show text
    prompt('复制以下内容分享：', shareText)
  }
}
</script>


