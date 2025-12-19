<template>
  <div class="space-y-4">
    <header class="space-y-1">
      <div class="chip">我的 · Profile</div>
      <h1 class="text-2xl font-semibold tracking-tight">逆龄餐桌</h1>
      <p class="text-sm text-ink/70">演示版信息面板（后续接入账号与健康档案）。</p>
    </header>

    <section v-if="!isAuthed" class="card p-4">
      <div class="text-sm font-semibold">游客模式</div>
      <p class="mt-2 text-sm text-ink/70">
        你正在以游客身份浏览。登录后可使用 <span class="font-semibold">Lab</span> 并保存个人偏好。
      </p>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <button
          class="tap hoverleaf w-full rounded-2xl bg-moss px-4 py-3 text-sm font-semibold text-paper shadow-soft"
          @click="goLogin"
        >
          登录 / 注册
        </button>
        <button
          class="tap hoverleaf w-full rounded-2xl bg-earth/15 px-4 py-3 text-sm font-semibold text-ink ring-1 ring-ink/10"
          @click="goScan"
        >
          继续浏览
        </button>
      </div>
    </section>

    <section class="card p-4">
      <div class="text-sm font-semibold">当前演示设置</div>
      <div class="mt-2 text-sm text-ink/70">
        <div class="flex items-center justify-between gap-3">
          <span>选中食品</span>
          <span class="font-semibold">{{ session.insight.product }}</span>
        </div>
        <div class="mt-2 flex items-center justify-between gap-3">
          <span>分数覆盖</span>
          <span class="font-mono">{{ session.scoreOverride ?? '—' }}</span>
        </div>
      </div>
      <button class="tap hoverleaf mt-4 w-full rounded-2xl bg-earth/15 px-4 py-3 text-sm font-semibold text-ink ring-1 ring-ink/10" @click="reset">
        清除分数覆盖（回到食品原始分数）
      </button>
    </section>

    <section v-if="isAuthed" class="card p-4">
      <div class="text-sm font-semibold">账号</div>
      <div class="mt-2 text-sm text-ink/70">
        <div class="flex items-center justify-between gap-3">
          <span>昵称</span>
          <span class="font-semibold">{{ auth.user?.name }}</span>
        </div>
        <div class="mt-2 flex items-center justify-between gap-3">
          <span>邮箱</span>
          <span class="font-mono text-xs">{{ auth.user?.email }}</span>
        </div>
      </div>
      <button
        class="tap hoverleaf mt-4 w-full rounded-2xl bg-earth/15 px-4 py-3 text-sm font-semibold text-ink ring-1 ring-ink/10"
        @click="doLogout"
      >
        退出登录
      </button>
    </section>

    <section class="card p-4">
      <div class="flex items-center justify-between">
        <div class="text-sm font-semibold">扫描历史</div>
        <button
          v-if="displayHistoryList.length > 0 && isAuthed"
          class="tap text-xs text-ink/60 hover:text-ink"
          @click="clearHistory"
        >
          清空
        </button>
      </div>
      <div v-if="displayHistoryList.length === 0" class="mt-4 text-center text-sm text-ink/50">
        {{ isAuthed ? '暂无历史记录' : '登录后保存扫描历史' }}
      </div>
      <div v-else class="mt-3 space-y-2">
        <div
          v-for="item in displayHistoryList"
          :key="item.id"
          class="tap hoverleaf flex items-center gap-3 rounded-xl bg-paper/50 p-3 ring-1 ring-ink/10"
          :class="item.id.startsWith('demo-') && 'ring-2 ring-leaf/30'"
          @click="viewHistoryItem(item)"
        >
          <div v-if="item.imageUrl" class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
            <img :src="item.imageUrl" :alt="item.productName" class="h-full w-full object-cover" />
          </div>
          <div v-else class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-moss/20">
            <span class="text-lg">{{ item.productName[0] }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="truncate text-sm font-semibold">{{ item.productName }}</span>
              <span v-if="item.id.startsWith('demo-')" class="chip text-xs">演示</span>
            </div>
            <div class="mt-0.5 flex items-center gap-2 text-xs text-ink/60">
              <span>分数: {{ item.score }}</span>
              <span>·</span>
              <span>{{ item.timeImpact }}</span>
              <span>·</span>
              <span>{{ formatTime(item.timestamp) }}</span>
            </div>
          </div>
          <button
            v-if="isAuthed && !item.id.startsWith('demo-')"
            class="tap flex-shrink-0 text-ink/40 hover:text-ink"
            @click.stop="removeHistoryItem(item.id)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>

    <section class="card p-4">
      <div class="text-sm font-semibold">健康偏好</div>
      <p class="mt-1 text-xs text-ink/60">设置后，洞察分析将针对你的健康需求进行调整</p>
      <div class="mt-3 space-y-2">
        <button
          v-for="profile in healthProfiles"
          :key="profile"
          class="tap hoverleaf w-full rounded-xl bg-paper/50 px-4 py-3 text-left ring-1 ring-ink/10"
          :class="healthPreferences.profile === profile && 'ring-2 ring-leaf/50 bg-leaf/10'"
          @click="updateHealthProfile(profile)"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-semibold">{{ healthProfileLabels[profile] }}</div>
              <div class="mt-0.5 text-xs text-ink/60">{{ healthProfileDescriptions[profile] }}</div>
            </div>
            <div v-if="healthPreferences.profile === profile" class="flex-shrink-0 text-leaf">
              <Check class="h-5 w-5" />
            </div>
          </div>
        </button>
      </div>
    </section>

    <section v-if="favoriteList.length > 0" class="card p-4">
      <div class="text-sm font-semibold">收藏</div>
      <div class="mt-3 space-y-2">
        <div
          v-for="productId in favoriteList"
          :key="productId"
          class="tap hoverleaf flex items-center justify-between rounded-xl bg-paper/50 p-3 ring-1 ring-ink/10"
          @click="viewFavorite(productId)"
        >
          <span class="text-sm font-semibold">{{ getProductName(productId) }}</span>
          <button
            class="tap text-leaf hover:text-moss"
            @click.stop="toggleFavorite(productId)"
          >
            <Star class="h-4 w-4 fill-current" />
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { X, Star, Check } from 'lucide-vue-next'
import { session, setScoreOverride, selectProduct } from '../state/session'
import { auth, hydrateAuth, isAuthed, logout } from '../state/auth'
import { historyList, removeHistoryItem, clearHistory, getDemoHistoryItems } from '../state/history'
import { favoriteList, toggleFavorite } from '../state/favorites'
import { healthPreferences, setHealthProfile, healthProfileLabels, healthProfileDescriptions, type HealthProfile } from '../state/healthPreferences'
import { getProductById } from '../data/mock'

const router = useRouter()

hydrateAuth()

const healthProfiles: HealthProfile[] = ['none', 'diabetes', 'inflammation', 'weight-loss', 'heart-health', 'gut-health']

const displayHistoryList = computed(() => {
  if (isAuthed.value) {
    return historyList.value
  } else {
    return getDemoHistoryItems()
  }
})

function reset() {
  setScoreOverride(null)
}

function goLogin() {
  void router.push({ path: '/auth', query: { redirect: '/profile' } })
}

function goScan() {
  void router.push('/scan')
}

function doLogout() {
  logout()
  void router.push('/scan')
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

function viewHistoryItem(item: { productId: string }) {
  selectProduct(item.productId)
  void router.push('/insight')
}

function getProductName(productId: string) {
  return getProductById(productId).product
}

function viewFavorite(productId: string) {
  selectProduct(productId)
  void router.push('/insight')
}

function updateHealthProfile(profile: HealthProfile) {
  setHealthProfile(profile)
}
</script>


