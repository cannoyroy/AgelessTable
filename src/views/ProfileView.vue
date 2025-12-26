<template>
  <div class="space-y-4">
    <header class="space-y-1">
      <div class="chip">我的 · Profile</div>
      <h1 class="text-2xl font-semibold tracking-tight">逆龄餐桌</h1>
      <p class="text-sm text-ink/70">演示版信息面板（后续接入账号与健康档案）。</p>
    </header>

    <!-- 个人资料头部 -->
    <ProfileHeader
      :is-authed="isAuthed"
      :user="auth.user"
      @login="goLogin"
      @scan="goScan"
      @logout="doLogout"
    />

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

    <!-- 扫描历史 -->
    <HistoryList
      :history-items="displayHistoryList"
      :is-authed="isAuthed"
      :empty-message="isAuthed ? '暂无历史记录' : '登录后保存扫描历史'"
      @view="viewHistoryItem"
      @remove="removeHistoryItem"
      @clear="clearHistory"
    />

    <!-- 健康偏好选择器 -->
    <HealthProfileSelector
      :current-profile="healthPreferences.profile"
      @change="updateHealthProfile"
    />

    <!-- 收藏列表 -->
    <FavoriteList
      :favorite-items="favoriteListWithNames"
      @view="viewFavorite"
      @toggle="toggleFavorite"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ProfileHeader from '../components/ProfileHeader.vue'
import HistoryList from '../components/HistoryList.vue'
import HealthProfileSelector from '../components/HealthProfileSelector.vue'
import FavoriteList from '../components/FavoriteList.vue'
import { session, setScoreOverride, selectProduct } from '../state/session'
import { auth, hydrateAuth, isAuthed, logout } from '../state/auth'
import { historyList, removeHistoryItem, clearHistory, getDemoHistoryItems, type ScanHistoryItem } from '../state/history'
import { favoriteList, toggleFavorite } from '../state/favorites'
import { healthPreferences, setHealthProfile, type HealthProfile } from '../state/healthPreferences'
import { getProductById } from '../data/mock'

const router = useRouter()

hydrateAuth()

/**
 * 显示的历史列表（已认证显示真实数据，游客显示演示数据）
 */
const displayHistoryList = computed(() => {
  if (isAuthed.value) {
    return historyList.value
  } else {
    return getDemoHistoryItems()
  }
})

/**
 * 带产品名称的收藏列表
 */
const favoriteListWithNames = computed(() => {
  return favoriteList.value.map((productId) => ({
    productId,
    productName: getProductById(productId).product,
  }))
})

/**
 * 重置分数覆盖
 */
function reset() {
  setScoreOverride(null)
}

/**
 * 跳转到登录页
 */
function goLogin() {
  void router.push({ path: '/auth', query: { redirect: '/profile' } })
}

/**
 * 跳转到扫描页
 */
function goScan() {
  void router.push('/scan')
}

/**
 * 退出登录
 */
function doLogout() {
  logout()
  void router.push('/scan')
}

/**
 * 查看历史记录项
 */
function viewHistoryItem(item: ScanHistoryItem) {
  selectProduct(item.productId)
  void router.push('/insight')
}

/**
 * 查看收藏
 */
function viewFavorite(productId: string) {
  selectProduct(productId)
  void router.push('/insight')
}

/**
 * 更新健康档案
 */
function updateHealthProfile(profile: HealthProfile) {
  setHealthProfile(profile)
}
</script>


