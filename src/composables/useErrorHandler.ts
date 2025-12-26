/**
 * @file 错误处理工具 Composable
 * @description 统一的错误处理、日志记录和用户提示
 */

import { useToast } from './useToast'

/**
 * 错误类型
 */
export type ErrorType = 'network' | 'validation' | 'auth' | 'business' | 'unknown'

/**
 * 错误日志记录
 */
export interface ErrorLog {
  /** 错误 ID */
  id: string
  /** 错误类型 */
  type: ErrorType
  /** 错误消息 */
  message: string
  /** 原始错误对象 */
  error: Error | unknown
  /** 上下文信息 */
  context?: Record<string, any>
  /** 发生时间 */
  timestamp: number
  /** 堆栈信息 */
  stack?: string
}

const errorLogs: ErrorLog[] = []
const MAX_ERROR_LOGS = 100
let errorIdCounter = 0

/**
 * 生成错误 ID
 * @returns 错误 ID
 */
function generateErrorId(): string {
  return `error_${Date.now()}_${++errorIdCounter}`
}

/**
 * 根据错误对象推断错误类型
 * @param error - 错误对象
 * @returns 错误类型
 */
function inferErrorType(error: any): ErrorType {
  if (error?.name === 'TypeError' || error?.message?.includes('网络')) {
    return 'network'
  }
  if (error?.message?.includes('验证') || error?.message?.includes('格式')) {
    return 'validation'
  }
  if (error?.message?.includes('登录') || error?.message?.includes('权限')) {
    return 'auth'
  }
  if (error?.type) {
    return error.type as ErrorType
  }
  return 'unknown'
}

/**
 * 获取用户友好的错误提示
 * @param error - 错误对象
 * @param type - 错误类型
 * @returns 用户友好的错误消息
 */
function getUserFriendlyMessage(error: any, type: ErrorType): string {
  // 如果错误对象已经包含用户友好的消息
  if (error?.message && typeof error.message === 'string') {
    return error.message
  }

  // 根据错误类型返回默认消息
  const defaultMessages: Record<ErrorType, string> = {
    network: '网络连接失败，请检查网络后重试',
    validation: '输入内容格式不正确，请检查后重试',
    auth: '身份验证失败，请重新登录',
    business: '操作失败，请稍后重试',
    unknown: '发生了未知错误，请稍后重试',
  }

  return defaultMessages[type]
}

/**
 * 记录错误日志
 * @param error - 错误对象
 * @param type - 错误类型
 * @param context - 上下文信息
 * @returns 错误日志对象
 */
function logError(
  error: Error | unknown,
  type?: ErrorType,
  context?: Record<string, any>
): ErrorLog {
  const errorType = type || inferErrorType(error)
  const message = getUserFriendlyMessage(error, errorType)

  const errorLog: ErrorLog = {
    id: generateErrorId(),
    type: errorType,
    message,
    error,
    context,
    timestamp: Date.now(),
    stack: error instanceof Error ? error.stack : undefined,
  }

  errorLogs.unshift(errorLog)

  // 限制日志数量
  if (errorLogs.length > MAX_ERROR_LOGS) {
    errorLogs.splice(MAX_ERROR_LOGS)
  }

  // 在开发环境下打印到控制台
  if (import.meta.env.DEV) {
    console.error('[ErrorHandler]', {
      type: errorType,
      message,
      error,
      context,
    })
  }

  return errorLog
}

/**
 * 处理错误（记录日志并显示 Toast）
 * @param error - 错误对象
 * @param options - 处理选项
 * @returns 错误日志对象
 */
export function handleError(
  error: Error | unknown,
  options: {
    /** 错误类型 */
    type?: ErrorType
    /** 自定义用户提示消息 */
    message?: string
    /** 上下文信息 */
    context?: Record<string, any>
    /** 是否显示 Toast（默认 true） */
    showToast?: boolean
    /** Toast 显示时长 */
    toastDuration?: number
  } = {}
): ErrorLog {
  const { type, message, context, showToast = true, toastDuration = 4000 } = options

  const errorLog = logError(error, type, context)

  // 显示 Toast 提示
  if (showToast) {
    const toast = useToast()
    toast.error(message || errorLog.message, toastDuration)
  }

  return errorLog
}

/**
 * 获取所有错误日志
 * @returns 错误日志数组
 */
export function getErrorLogs(): ErrorLog[] {
  return [...errorLogs]
}

/**
 * 清空错误日志
 */
export function clearErrorLogs() {
  errorLogs.splice(0)
}

/**
 * 包装异步函数，自动处理错误
 * @param fn - 异步函数
 * @param errorMessage - 自定义错误消息
 * @returns 包装后的函数
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error, { message: errorMessage })
      throw error
    }
  }) as T
}

/**
 * 错误处理 Composable
 * @returns 错误处理相关的方法
 */
export function useErrorHandler() {
  return {
    handleError,
    logError,
    getErrorLogs,
    clearErrorLogs,
    withErrorHandling,
  }
}
