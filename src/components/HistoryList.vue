/**
 * @file 扫描历史列表组件
 * @description 显示用户的扫描历史记录
 */
<template>
  <section class="card p-4">
    <div class="flex items-center justify-between">
      <div class="text-sm font-semibold">扫描历史</div>
      <button
        v-if="historyItems.length > 0 && isAuthed"
        class="tap text-xs text-ink/60 hover:text-ink"
        @click="$emit('clear')"
      >
        清空
      </button>
    </div>

    <div v-if="historyItems.length === 0" class="mt-4 text-center text-sm text-ink/50">
      {{ emptyMessage }}
    </div>

    <div v-else class="mt-3 space-y-2">
      <div
        v-for="item in historyItems"
        :key="item.id"
        class="tap hoverleaf flex items-center gap-3 rounded-xl bg-paper/50 p-3 ring-1 ring-ink/10"
        :class="item.id.startsWith('demo-') && 'ring-2 ring-leaf/30'"
        @click="$emit('view', item)"
      >
        <!-- 图片预览 -->
        <div v-if="item.imageUrl" class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg">
          <img :src="item.imageUrl" :alt="item.productName" class="h-full w-full object-cover" />
        </div>
        <div v-else class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-moss/20">
          <span class="text-lg">{{ item.productName[0] }}</span>
        </div>

        <!-- 产品信息 -->
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

        <!-- 删除按钮 -->
        <button
          v-if="isAuthed && !item.id.startsWith('demo-')"
          class="tap flex-shrink-0 text-ink/40 hover:text-ink"
          @click.stop="$emit('remove', item.id)"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import type { ScanHistoryItem } from '../state/history'
import { formatRelativeTime } from '../composables/useTimeFormat'

/**
 * 组件 Props
 */
const props = defineProps<{
  /** 历史记录列表 */
  historyItems: ScanHistoryItem[]
  /** 是否已认证 */
  isAuthed: boolean
  /** 空列表提示消息 */
  emptyMessage?: string
}>()

/**
 * 组件 Emits
 */
defineEmits<{
  /** 查看历史记录 */
  view: [item: ScanHistoryItem]
  /** 移除历史记录 */
  remove: [id: string]
  /** 清空历史记录 */
  clear: []
}>()

/**
 * 格式化时间
 */
function formatTime(timestamp: number): string {
  return formatRelativeTime(timestamp)
}
</script>
