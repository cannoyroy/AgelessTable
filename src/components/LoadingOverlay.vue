/**
 * @file 全局 Loading 遮罩组件
 * @description 显示全局加载状态遮罩层
 */
<template>
  <Teleport to="body">
    <Transition name="loading">
      <div
        v-if="isLoading"
        class="fixed inset-0 z-40 flex items-center justify-center bg-ink/20 backdrop-blur-sm"
      >
        <div class="card rounded-organic p-6 shadow-lift">
          <div class="flex flex-col items-center gap-4">
            <!-- Loading 动画 -->
            <div class="relative h-12 w-12">
              <div class="absolute inset-0 animate-spin rounded-full border-4 border-moss/30 border-t-moss"></div>
            </div>

            <!-- Loading 消息 -->
            <p class="text-sm font-medium text-ink">{{ loadingMessage }}</p>

            <!-- 任务计数（可选） -->
            <p v-if="activeTasksCount > 1" class="text-xs text-ink/60">
              正在处理 {{ activeTasksCount }} 个任务
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useLoading } from '../composables/useLoading'

const { isLoading, loadingMessage, activeTasksCount } = useLoading()
</script>

<style scoped>
.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.2s ease;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
