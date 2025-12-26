/**
 * @file Toast 通知工具 Composable
 * @description 提供全局 Toast 通知功能
 */

import { reactive, readonly } from 'vue'

/**
 * Toast 类型
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

/**
 * Toast 消息对象
 */
export interface ToastMessage {
  /** 唯一标识符 */
  id: string
  /** 消息内容 */
  message: string
  /** Toast 类型 */
  type: ToastType
  /** 显示时长（毫秒），0 表示不自动关闭 */
  duration: number
  /** 创建时间戳 */
  timestamp: number
}

/**
 * Toast 配置选项
 */
export interface ToastOptions {
  /** 消息类型 */
  type?: ToastType
  /** 显示时长（毫秒），默认 3000ms */
  duration?: number
}

/**
 * Toast 状态
 */
interface ToastState {
  /** 当前显示的 Toast 列表 */
  messages: ToastMessage[]
}

const state = reactive<ToastState>({
  messages: [],
})

let toastIdCounter = 0

/**
 * 生成唯一的 Toast ID
 * @returns Toast ID
 */
function generateToastId(): string {
  return `toast_${Date.now()}_${++toastIdCounter}`
}

/**
 * 显示 Toast 通知
 * @param message - 消息内容
 * @param options - Toast 选项
 * @returns Toast ID
 */
function showToast(message: string, options: ToastOptions = {}): string {
  const { type = 'info', duration = 3000 } = options

  const toast: ToastMessage = {
    id: generateToastId(),
    message,
    type,
    duration,
    timestamp: Date.now(),
  }

  state.messages.push(toast)

  // 自动关闭
  if (duration > 0) {
    setTimeout(() => {
      hideToast(toast.id)
    }, duration)
  }

  return toast.id
}

/**
 * 隐藏指定的 Toast
 * @param id - Toast ID
 */
function hideToast(id: string) {
  const index = state.messages.findIndex((t) => t.id === id)
  if (index !== -1) {
    state.messages.splice(index, 1)
  }
}

/**
 * 清空所有 Toast
 */
function clearToasts() {
  state.messages = []
}

/**
 * 显示成功 Toast
 * @param message - 消息内容
 * @param duration - 显示时长
 * @returns Toast ID
 */
function success(message: string, duration = 3000): string {
  return showToast(message, { type: 'success', duration })
}

/**
 * 显示错误 Toast
 * @param message - 消息内容
 * @param duration - 显示时长
 * @returns Toast ID
 */
function error(message: string, duration = 4000): string {
  return showToast(message, { type: 'error', duration })
}

/**
 * 显示警告 Toast
 * @param message - 消息内容
 * @param duration - 显示时长
 * @returns Toast ID
 */
function warning(message: string, duration = 3500): string {
  return showToast(message, { type: 'warning', duration })
}

/**
 * 显示信息 Toast
 * @param message - 消息内容
 * @param duration - 显示时长
 * @returns Toast ID
 */
function info(message: string, duration = 3000): string {
  return showToast(message, { type: 'info', duration })
}

/**
 * Toast Composable
 * @returns Toast 相关的状态和方法
 */
export function useToast() {
  return {
    messages: readonly(state.messages),
    show: showToast,
    hide: hideToast,
    clear: clearToasts,
    success,
    error,
    warning,
    info,
  }
}
