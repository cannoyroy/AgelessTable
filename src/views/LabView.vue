<template>
  <div class="space-y-4">
    <header class="space-y-1">
      <div class="chip">实验室 · AI 营养科学家</div>
      <h1 class="text-2xl font-semibold tracking-tight">在树荫下，问一个更聪明的问题</h1>
      <p class="text-sm text-ink/70">
        演示版：输入包含 <span class="font-mono">[SCORE: 85]</span> 的内容，会自动更新洞察页分数。
      </p>
    </header>

    <ScoreGauge :score="displayedScore" :time-impact="insight.time_impact" />

    <section class="card p-4">
      <div v-if="!isAuthed" class="mb-4 rounded-2xl bg-paper/70 p-3 text-sm text-ink/70 ring-1 ring-ink/10">
        <div class="font-semibold text-ink/80">游客可查看 Lab，但功能已锁定</div>
        <div class="mt-1">登录/注册后即可体验完整对话能力与个性化建议。</div>
        <div class="mt-3 flex gap-2">
          <button
            class="tap hoverleaf rounded-2xl bg-moss px-4 py-2 text-sm font-semibold text-paper shadow-soft"
            type="button"
            @click="goLogin"
          >
            登录 / 注册
          </button>
          <button
            class="tap hoverleaf rounded-2xl bg-earth/15 px-4 py-2 text-sm font-semibold text-ink ring-1 ring-ink/10"
            type="button"
            @click="goScan"
          >
            先去扫描
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <div v-for="m in messages" :key="m.id" class="flex" :class="m.role === 'user' ? 'justify-end' : 'justify-start'">
          <div
            class="max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-soft ring-1 ring-ink/10"
            :class="m.role === 'user' ? 'bg-moss/15 text-ink' : 'bg-paper/80 text-ink'"
          >
            <div class="whitespace-pre-wrap leading-relaxed">{{ m.text }}</div>
          </div>
        </div>

        <div v-if="thinking" class="flex justify-start">
          <div class="max-w-[85%] rounded-2xl bg-paper/70 px-3 py-2 text-sm text-ink/70 ring-1 ring-ink/10">
            AI 正在思考...
          </div>
        </div>
      </div>

      <form class="mt-4 flex gap-2" @submit.prevent="send">
        <input
          v-model="input"
          class="tap w-full rounded-2xl bg-paper/70 px-4 py-3 text-sm ring-1 ring-ink/10 placeholder:text-ink/40 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!isAuthed"
          :placeholder="isAuthed ? '问：这份食物对 mTOR / AMPK / 炎症的影响？' : '登录后即可在 Lab 提问…'"
        />
        <button
          class="tap hoverleaf rounded-2xl bg-leaf px-4 py-3 text-sm font-semibold text-paper shadow-soft disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          :disabled="!isAuthed"
        >
          发送
        </button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ScoreGauge from '../components/ScoreGauge.vue'
import { getDisplayedScore, session, setScoreOverride } from '../state/session'
import { hydrateAuth, isAuthed } from '../state/auth'

type ChatRole = 'user' | 'ai'
type ChatMessage = { id: string; role: ChatRole; text: string }

const insight = computed(() => session.insight)
const displayedScore = computed(() => getDisplayedScore())

const router = useRouter()

const input = ref('')
const thinking = ref(false)
const messages = ref<ChatMessage[]>([
  {
    id: 'seed',
    role: 'ai',
    text:
      '我是“逆龄餐桌”AI 营养科学家。\n你可以问我：这份食物如何影响 mTOR、AMPK、Sirtuin 与慢性炎症？\n\n（演示技巧：在回复里加入 [SCORE: 85] 来联动更新上方分数。）',
  },
])

function parseScoreTag(text: string) {
  const m = text.match(/\[SCORE:\s*(\d{1,3})\]/i)
  if (!m) return null
  const n = Number(m[1])
  if (!Number.isFinite(n)) return null
  return Math.max(0, Math.min(100, n))
}

async function fakeDifyReply(userText: string) {
  // very light “scientist persona” with honest fallback
  if (userText.includes('未知') || userText.toLowerCase().includes('unknown')) {
    return '关于此成分的生化通路，目前森林中尚无成熟研究记录。\n你可以提供配料表或剂量范围，我会给出更结构化的风险/收益框架。'
  }

  return [
    '我们先用“稳态”视角拆解：',
    '- 能量信号：看血糖与胰岛素波动（影响 AMPK / mTOR 轴）',
    '- 炎症信号：看加工度与肠道屏障支持',
    '- 修复信号：看蛋白质量与微量营养密度',
    '',
    '如果你希望我把结论映射到演示仪表盘：试试在文本里加入 [SCORE: 85]。',
  ].join('\n')
}

async function send() {
  hydrateAuth()
  if (!isAuthed.value) {
    void router.push({ path: '/auth', query: { redirect: '/lab' } })
    return
  }
  const text = input.value.trim()
  if (!text || thinking.value) return
  input.value = ''

  messages.value.push({ id: crypto.randomUUID(), role: 'user', text })
  thinking.value = true

  await new Promise((r) => setTimeout(r, 650))
  const aiText = await fakeDifyReply(text)
  messages.value.push({ id: crypto.randomUUID(), role: 'ai', text: aiText })
  thinking.value = false

  const score = parseScoreTag(aiText)
  if (score !== null) setScoreOverride(score)
}

function goLogin() {
  void router.push({ path: '/auth', query: { redirect: '/lab' } })
}

function goScan() {
  void router.push('/scan')
}
</script>


