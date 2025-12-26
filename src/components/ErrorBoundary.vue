/**
 * @file 错误边界组件
 * @description 捕获并处理子组件中的错误
 */
<template>
  <div>
    <slot v-if="!hasError"></slot>
    <div v-else class="flex min-h-[400px] items-center justify-center">
      <div class="card max-w-md rounded-organic p-6 text-center">
        <div class="mb-4 flex justify-center">
          <div class="rounded-full bg-red-50 p-3">
            <AlertCircle class="h-8 w-8 text-red-500" />
          </div>
        </div>
        <h3 class="mb-2 text-lg font-semibold text-ink">出错了</h3>
        <p class="mb-4 text-sm text-ink/70">
          {{ errorMessage || '页面加载失败，请刷新重试' }}
        </p>
        <div class="flex gap-2">
          <button
            class="tap hoverleaf flex-1 rounded-2xl bg-moss px-4 py-2 text-sm font-semibold text-paper shadow-soft"
            @click="handleReset"
          >
            重新加载
          </button>
          <button
            class="tap hoverleaf flex-1 rounded-2xl bg-earth/15 px-4 py-2 text-sm font-semibold text-ink ring-1 ring-ink/10"
            @click="handleGoHome"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import { AlertCircle } from 'lucide-vue-next'
import { handleError } from '../composables/useErrorHandler'

const router = useRouter()

const hasError = ref(false)
const errorMessage = ref('')

/**
 * 捕获子组件错误
 */
onErrorCaptured((error, instance, info) => {
  hasError.value = true
  errorMessage.value = error?.message || '未知错误'

  // 记录错误日志
  handleError(error, {
    context: {
      component: instance?.$options?.name || 'Unknown',
      info,
    },
    showToast: false, // 错误边界已显示 UI，不需要 Toast
  })

  // 阻止错误继续传播
  return false
})

/**
 * 重置错误状态
 */
function handleReset() {
  hasError.value = false
  errorMessage.value = ''
}

/**
 * 返回首页
 */
function handleGoHome() {
  handleReset()
  void router.push('/')
}
</script>
