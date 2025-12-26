/**
 * @file 操作日志页面
 * @description 查看和管理用户操作日志
 */
<template>
  <div class="space-y-4">
    <header class="space-y-1">
      <div class="chip">日志 · Logs</div>
      <h1 class="text-2xl font-semibold tracking-tight">操作日志</h1>
      <p class="text-sm text-ink/70">查看您的操作记录</p>
    </header>

    <!-- 操作栏 -->
    <div class="card p-3">
      <div class="flex items-center gap-2">
        <select
          v-model="filterType"
          class="tap flex-1 rounded-xl bg-paper/70 px-3 py-2 text-sm ring-1 ring-ink/10"
        >
          <option value="all">全部类型</option>
          <option value="scan">扫描</option>
          <option value="view_insight">查看洞察</option>
          <option value="favorite">收藏</option>
          <option value="chat">聊天</option>
          <option value="login">登录</option>
          <option value="logout">退出</option>
          <option value="other">其他</option>
        </select>
        <button
          class="tap hoverleaf rounded-xl bg-earth/15 px-4 py-2 text-sm font-semibold ring-1 ring-ink/10"
          @click="showClearConfirm = true"
        >
          清空
        </button>
        <button
          class="tap hoverleaf rounded-xl bg-moss px-4 py-2 text-sm font-semibold text-paper shadow-soft"
          @click="handleExport"
        >
          导出
        </button>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="grid grid-cols-3 gap-3">
      <div class="card p-3 text-center">
        <div class="text-2xl font-semibold tabular-nums">{{ totalLogs }}</div>
        <div class="mt-1 text-xs text-ink/60">总记录数</div>
      </div>
      <div class="card p-3 text-center">
        <div class="text-2xl font-semibold tabular-nums">{{ todayLogs }}</div>
        <div class="mt-1 text-xs text-ink/60">今日操作</div>
      </div>
      <div class="card p-3 text-center">
        <div class="text-2xl font-semibold tabular-nums">{{ thisWeekLogs }}</div>
        <div class="mt-1 text-xs text-ink/60">本周操作</div>
      </div>
    </div>

    <!-- 日志列表 -->
    <section class="space-y-2">
      <div v-if="filteredLogs.length === 0" class="card p-8 text-center text-sm text-ink/50">
        暂无日志记录
      </div>
      <div
        v-for="log in filteredLogs"
        :key="log.id"
        class="card p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span
                class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                :class="getTypeColor(log.type)"
              >
                {{ getTypeLabel(log.type) }}
              </span>
              <span class="text-sm font-medium">{{ log.description }}</span>
            </div>
            <div class="mt-1 text-xs text-ink/60">
              {{ formatLogTime(log.timestamp) }}
            </div>
            <div v-if="log.metadata" class="mt-2">
              <details class="text-xs">
                <summary class="cursor-pointer text-ink/60 hover:text-ink">
                  查看详情
                </summary>
                <pre class="mt-2 overflow-auto rounded-lg bg-paper/70 p-2 text-xs">{{ JSON.stringify(log.metadata, null, 2) }}</pre>
              </details>
            </div>
          </div>
          <button
            class="tap flex-shrink-0 text-ink/40 hover:text-ink"
            @click="handleDeleteLog(log.id)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>

    <!-- 确认对话框 -->
    <ConfirmDialog
      v-model="showClearConfirm"
      title="清空日志"
      message="确定要清空所有操作日志吗？此操作无法撤销。"
      confirm-text="清空"
      :dangerous="true"
      @confirm="handleClearLogs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { useToast } from '../composables/useToast'
import { formatDateTime, formatRelativeTime } from '../composables/useTimeFormat'
import {
  getOperationLogs,
  clearLogs,
  deleteLog,
  exportLogsAsJSON,
  type OperationType,
} from '../state/operationLogs'

const toast = useToast()
const filterType = ref<OperationType | 'all'>('all')
const showClearConfirm = ref(false)

/**
 * 所有日志
 */
const allLogs = computed(() => getOperationLogs())

/**
 * 过滤后的日志
 */
const filteredLogs = computed(() => {
  if (filterType.value === 'all') return allLogs.value
  return allLogs.value.filter((log) => log.type === filterType.value)
})

/**
 * 总日志数
 */
const totalLogs = computed(() => allLogs.value.length)

/**
 * 今日日志数
 */
const todayLogs = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return allLogs.value.filter((log) => log.timestamp >= today.getTime()).length
})

/**
 * 本周日志数
 */
const thisWeekLogs = computed(() => {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return allLogs.value.filter((log) => log.timestamp >= weekAgo).length
})

/**
 * 获取操作类型标签
 */
function getTypeLabel(type: OperationType): string {
  const labels: Record<OperationType, string> = {
    scan: '扫描',
    view_insight: '洞察',
    favorite: '收藏',
    unfavorite: '取消收藏',
    chat: '聊天',
    login: '登录',
    logout: '退出',
    register: '注册',
    update_profile: '更新资料',
    update_preferences: '更新偏好',
    clear_history: '清除历史',
    delete_history: '删除历史',
    other: '其他',
  }
  return labels[type] || type
}

/**
 * 获取操作类型颜色
 */
function getTypeColor(type: OperationType): string {
  const colors: Record<string, string> = {
    scan: 'bg-leaf/10 text-leaf',
    view_insight: 'bg-skylight/10 text-skylight',
    favorite: 'bg-moss/10 text-moss',
    unfavorite: 'bg-earth/10 text-earth',
    chat: 'bg-skylight/10 text-skylight',
    login: 'bg-leaf/10 text-leaf',
    logout: 'bg-ink/10 text-ink',
    register: 'bg-moss/10 text-moss',
    update_profile: 'bg-earth/10 text-earth',
    update_preferences: 'bg-earth/10 text-earth',
    clear_history: 'bg-red-500/10 text-red-600',
    delete_history: 'bg-red-500/10 text-red-600',
  }
  return colors[type] || 'bg-ink/10 text-ink'
}

/**
 * 格式化日志时间
 */
function formatLogTime(timestamp: number): string {
  const relative = formatRelativeTime(timestamp)
  const absolute = formatDateTime(timestamp, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${relative}（${absolute}）`
}

/**
 * 删除单条日志
 */
function handleDeleteLog(logId: string) {
  deleteLog(logId)
  toast.success('日志已删除')
}

/**
 * 清空所有日志
 */
function handleClearLogs() {
  clearLogs()
  toast.success('日志已清空')
}

/**
 * 导出日志
 */
function handleExport() {
  try {
    const json = exportLogsAsJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `operation-logs-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('日志已导出')
  } catch (e) {
    toast.error('导出失败')
  }
}
</script>
