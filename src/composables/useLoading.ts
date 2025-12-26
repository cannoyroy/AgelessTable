/**
 * @file 全局 Loading 状态管理 Composable
 * @description 管理全局加载状态，支持多层级 Loading
 */

import { ref, computed } from 'vue'

/**
 * Loading 任务信息
 */
interface LoadingTask {
  /** 任务 ID */
  id: string
  /** 任务描述 */
  message?: string
  /** 创建时间 */
  timestamp: number
}

const loadingTasks = ref<LoadingTask[]>([])
let taskIdCounter = 0

/**
 * 生成唯一的任务 ID
 * @returns 任务 ID
 */
function generateTaskId(): string {
  return `loading_${Date.now()}_${++taskIdCounter}`
}

/**
 * 是否正在加载（只要有一个任务就返回 true）
 */
const isLoading = computed(() => loadingTasks.value.length > 0)

/**
 * 当前加载消息（显示最新的任务消息）
 */
const loadingMessage = computed(() => {
  const latestTask = loadingTasks.value[loadingTasks.value.length - 1]
  return latestTask?.message || '加载中...'
})

/**
 * 当前活动任务数量
 */
const activeTasksCount = computed(() => loadingTasks.value.length)

/**
 * 开始一个 Loading 任务
 * @param message - 加载提示消息
 * @returns 任务 ID，用于后续停止该任务
 */
function startLoading(message?: string): string {
  const task: LoadingTask = {
    id: generateTaskId(),
    message,
    timestamp: Date.now(),
  }
  loadingTasks.value.push(task)
  return task.id
}

/**
 * 停止指定的 Loading 任务
 * @param taskId - 任务 ID
 */
function stopLoading(taskId: string) {
  const index = loadingTasks.value.findIndex((t) => t.id === taskId)
  if (index !== -1) {
    loadingTasks.value.splice(index, 1)
  }
}

/**
 * 停止所有 Loading 任务
 */
function stopAllLoading() {
  loadingTasks.value = []
}

/**
 * 包装异步函数，自动管理 Loading 状态
 * @param fn - 异步函数
 * @param message - 加载提示消息
 * @returns 包装后的异步函数
 */
function withLoading<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  message?: string
): T {
  return (async (...args: Parameters<T>) => {
    const taskId = startLoading(message)
    try {
      return await fn(...args)
    } finally {
      stopLoading(taskId)
    }
  }) as T
}

/**
 * 全局 Loading Composable
 * @returns Loading 相关的状态和方法
 */
export function useLoading() {
  return {
    isLoading,
    loadingMessage,
    activeTasksCount,
    startLoading,
    stopLoading,
    stopAllLoading,
    withLoading,
  }
}
