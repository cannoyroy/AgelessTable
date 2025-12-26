/**
 * @file Toast 通知全局组件
 * @description 显示全局 Toast 通知消息
 */
<template>
  <Teleport to="body">
    <div class="fixed right-4 top-4 z-50 flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in messages"
          :key="toast.id"
          class="min-w-[280px] max-w-sm rounded-2xl px-4 py-3 shadow-lift backdrop-blur-sm"
          :class="toastClasses[toast.type]"
        >
          <div class="flex items-center gap-3">
            <component :is="toastIcons[toast.type]" class="h-5 w-5 flex-shrink-0" />
            <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
            <button
              class="tap flex-shrink-0 opacity-70 hover:opacity-100"
              @click="hideToast(toast.id)"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useToast } from '../composables/useToast'

const { messages, hide: hideToast } = useToast()

/**
 * Toast 类型对应的图标
 */
const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

/**
 * Toast 类型对应的样式
 */
const toastClasses = {
  success: 'bg-leaf/95 text-paper ring-1 ring-leaf',
  error: 'bg-red-500/95 text-white ring-1 ring-red-600',
  warning: 'bg-amber-500/95 text-white ring-1 ring-amber-600',
  info: 'bg-skylight/95 text-white ring-1 ring-skylight',
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
