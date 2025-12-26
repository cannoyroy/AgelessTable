/**
 * @file 设置中心页面
 * @description 应用设置和偏好配置
 */
<template>
  <div class="space-y-4">
    <header class="space-y-1">
      <div class="chip">设置 · Settings</div>
      <h1 class="text-2xl font-semibold tracking-tight">偏好设置</h1>
      <p class="text-sm text-ink/70">自定义您的使用体验</p>
    </header>

    <!-- 通用设置 -->
    <section class="card p-4">
      <h3 class="text-sm font-semibold">通用设置</h3>
      <div class="mt-3 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium">动画效果</div>
            <div class="text-xs text-ink/60">启用页面过渡和动画</div>
          </div>
          <button
            class="tap relative h-6 w-11 rounded-full transition-colors"
            :class="appSettings.enableAnimations ? 'bg-leaf' : 'bg-ink/20'"
            @click="toggleSetting('enableAnimations')"
          >
            <span
              class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
              :class="appSettings.enableAnimations ? 'left-5' : 'left-0.5'"
            ></span>
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium">震动反馈</div>
            <div class="text-xs text-ink/60">操作时提供触觉反馈</div>
          </div>
          <button
            class="tap relative h-6 w-11 rounded-full transition-colors"
            :class="appSettings.enableVibration ? 'bg-leaf' : 'bg-ink/20'"
            @click="toggleSetting('enableVibration')"
          >
            <span
              class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
              :class="appSettings.enableVibration ? 'left-5' : 'left-0.5'"
            ></span>
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium">自动保存历史</div>
            <div class="text-xs text-ink/60">自动保存扫描历史记录</div>
          </div>
          <button
            class="tap relative h-6 w-11 rounded-full transition-colors"
            :class="appSettings.autoSaveHistory ? 'bg-leaf' : 'bg-ink/20'"
            @click="toggleSetting('autoSaveHistory')"
          >
            <span
              class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
              :class="appSettings.autoSaveHistory ? 'left-5' : 'left-0.5'"
            ></span>
          </button>
        </div>
      </div>
    </section>

    <!-- 隐私设置 -->
    <section class="card p-4">
      <h3 class="text-sm font-semibold">隐私与安全</h3>
      <div class="mt-3 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium">数据分析</div>
            <div class="text-xs text-ink/60">帮助我们改进产品体验</div>
          </div>
          <button
            class="tap relative h-6 w-11 rounded-full transition-colors"
            :class="appSettings.enableAnalytics ? 'bg-leaf' : 'bg-ink/20'"
            @click="toggleSetting('enableAnalytics')"
          >
            <span
              class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
              :class="appSettings.enableAnalytics ? 'left-5' : 'left-0.5'"
            ></span>
          </button>
        </div>
      </div>
    </section>

    <!-- 显示设置 -->
    <section class="card p-4">
      <h3 class="text-sm font-semibold">显示</h3>
      <div class="mt-3 space-y-3">
        <div>
          <div class="mb-2 text-sm font-medium">字体大小</div>
          <div class="flex gap-2">
            <button
              v-for="size in fontSizes"
              :key="size.value"
              class="tap hoverleaf flex-1 rounded-xl px-3 py-2 text-sm ring-1 ring-ink/10"
              :class="appSettings.fontSize === size.value ? 'bg-leaf/10 ring-2 ring-leaf/50' : 'bg-paper/50'"
              @click="setFontSize(size.value)"
            >
              {{ size.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据管理 -->
    <section class="card p-4">
      <h3 class="text-sm font-semibold">数据管理</h3>
      <div class="mt-3 space-y-2">
        <button
          class="tap hoverleaf w-full rounded-2xl bg-earth/15 px-4 py-3 text-left text-sm font-semibold text-ink ring-1 ring-ink/10"
          @click="exportData"
        >
          导出我的数据
        </button>
        <button
          class="tap hoverleaf w-full rounded-2xl bg-earth/15 px-4 py-3 text-left text-sm font-semibold text-ink ring-1 ring-ink/10"
          @click="clearCache"
        >
          清除缓存数据
        </button>
        <button
          class="tap hoverleaf w-full rounded-2xl bg-red-500/10 px-4 py-3 text-left text-sm font-semibold text-red-600 ring-1 ring-red-500/20"
          @click="showDeleteConfirm = true"
        >
          清空所有数据
        </button>
      </div>
    </section>

    <!-- 关于 -->
    <section class="card p-4">
      <h3 class="text-sm font-semibold">关于</h3>
      <div class="mt-3 space-y-2 text-sm text-ink/70">
        <div class="flex justify-between">
          <span>应用名称</span>
          <span class="font-semibold">逆龄餐桌</span>
        </div>
        <div class="flex justify-between">
          <span>版本号</span>
          <span class="font-mono">v1.0</span>
        </div>
      </div>
    </section>

    <!-- 确认对话框 -->
    <ConfirmDialog
      v-model="showDeleteConfirm"
      title="清空所有数据"
      message="此操作将清空所有本地数据，包括历史记录、收藏和设置。此操作无法撤销，确定继续吗？"
      confirm-text="清空"
      :dangerous="true"
      @confirm="clearAllData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { useToast } from '../composables/useToast'
import { STORAGE_KEYS } from '../config/constants'
import { logOperation } from '../state/operationLogs'
import { appSettings, updateSetting, type FontSize } from '../state/appSettings'

const toast = useToast()

/**
 * 字体大小选项
 */
const fontSizes = [
  { label: '小', value: 'small' },
  { label: '中', value: 'medium' },
  { label: '大', value: 'large' },
]

const showDeleteConfirm = ref(false)

/**
 * 切换布尔设置
 */
function toggleSetting(key: 'enableAnimations' | 'enableVibration' | 'autoSaveHistory' | 'enableAnalytics') {
  updateSetting(key, !appSettings[key])
  toast.success('设置已更新')
  logOperation('update_preferences', `切换设置：${key}`)
}

/**
 * 设置字体大小
 */
function setFontSize(size: string) {
  updateSetting('fontSize', size as FontSize)
  toast.success('字体大小已更新')
  logOperation('update_preferences', `设置字体大小：${size}`)
}

/**
 * 导出数据
 */
function exportData() {
  try {
    const data = {
      settings: appSettings,
      history: localStorage.getItem(STORAGE_KEYS.HISTORY),
      favorites: localStorage.getItem(STORAGE_KEYS.FAVORITES),
      healthPreferences: localStorage.getItem(STORAGE_KEYS.HEALTH_PREFERENCES),
      exportTime: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ageless-table-data-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('数据导出成功')
    logOperation('other', '导出数据')
  } catch (e) {
    toast.error('导出失败')
  }
}

/**
 * 清除缓存（除了认证和设置）
 */
function clearCache() {
  try {
    // 保存需要保留的数据
    const authData = localStorage.getItem(STORAGE_KEYS.AUTH)
    const usersData = localStorage.getItem(STORAGE_KEYS.USERS)
    const settingsData = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS)

    // 清除所有 localStorage
    localStorage.clear()

    // 恢复保留的数据
    if (authData) localStorage.setItem(STORAGE_KEYS.AUTH, authData)
    if (usersData) localStorage.setItem(STORAGE_KEYS.USERS, usersData)
    if (settingsData) localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, settingsData)

    toast.success('缓存已清除（已保留登录信息和设置）')
    logOperation('other', '清除缓存')
  } catch (e) {
    toast.error('清除缓存失败')
  }
}

/**
 * 清空所有数据
 */
function clearAllData() {
  try {
    localStorage.clear()
    toast.success('所有数据已清空')
    logOperation('other', '清空所有数据')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch (e) {
    toast.error('清空失败')
  }
}
</script>
