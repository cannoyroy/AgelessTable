/**
 * @file 操作日志状态管理
 * @description 记录用户操作日志
 */

import { reactive } from 'vue'
import { STORAGE_KEYS, LIMITS } from '../config/constants'

/**
 * 操作类型
 */
export type OperationType =
  | 'scan'
  | 'view_insight'
  | 'favorite'
  | 'unfavorite'
  | 'chat'
  | 'login'
  | 'logout'
  | 'register'
  | 'update_profile'
  | 'update_preferences'
  | 'clear_history'
  | 'delete_history'
  | 'other'

/**
 * 操作日志记录
 */
export interface OperationLog {
  /** 日志 ID */
  id: string
  /** 操作类型 */
  type: OperationType
  /** 操作描述 */
  description: string
  /** 操作时间戳 */
  timestamp: number
  /** 额外数据 */
  metadata?: Record<string, any>
}

const operationLogs = reactive<OperationLog[]>([])
let logIdCounter = 0

/**
 * 从 localStorage 加载日志
 */
function loadLogs() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.OPERATION_LOGS)
    if (!stored) return
    const parsed = JSON.parse(stored) as OperationLog[]
    operationLogs.push(...parsed.slice(0, LIMITS.MAX_OPERATION_LOGS))
  } catch (e) {
    console.warn('Failed to load operation logs:', e)
  }
}

/**
 * 保存日志到 localStorage
 */
function saveLogs() {
  try {
    const logsToSave = operationLogs.slice(0, LIMITS.MAX_OPERATION_LOGS)
    localStorage.setItem(STORAGE_KEYS.OPERATION_LOGS, JSON.stringify(logsToSave))
  } catch (e) {
    console.warn('Failed to save operation logs:', e)
  }
}

/**
 * 生成日志 ID
 */
function generateLogId(): string {
  return `log_${Date.now()}_${++logIdCounter}`
}

/**
 * 记录操作日志
 * @param type - 操作类型
 * @param description - 操作描述
 * @param metadata - 额外数据
 * @returns 日志对象
 */
export function logOperation(
  type: OperationType,
  description: string,
  metadata?: Record<string, any>
): OperationLog {
  const log: OperationLog = {
    id: generateLogId(),
    type,
    description,
    timestamp: Date.now(),
    metadata,
  }

  operationLogs.unshift(log)

  // 限制日志数量
  if (operationLogs.length > LIMITS.MAX_OPERATION_LOGS) {
    operationLogs.splice(LIMITS.MAX_OPERATION_LOGS)
  }

  saveLogs()
  return log
}

/**
 * 获取所有操作日志
 * @returns 日志数组
 */
export function getOperationLogs(): OperationLog[] {
  return [...operationLogs]
}

/**
 * 获取指定类型的日志
 * @param type - 操作类型
 * @returns 日志数组
 */
export function getLogsByType(type: OperationType): OperationLog[] {
  return operationLogs.filter((log) => log.type === type)
}

/**
 * 获取指定时间范围内的日志
 * @param startTime - 开始时间戳
 * @param endTime - 结束时间戳
 * @returns 日志数组
 */
export function getLogsByTimeRange(startTime: number, endTime: number): OperationLog[] {
  return operationLogs.filter((log) => log.timestamp >= startTime && log.timestamp <= endTime)
}

/**
 * 清空所有日志
 */
export function clearLogs() {
  operationLogs.splice(0)
  saveLogs()
}

/**
 * 删除指定日志
 * @param logId - 日志 ID
 */
export function deleteLog(logId: string) {
  const index = operationLogs.findIndex((log) => log.id === logId)
  if (index !== -1) {
    operationLogs.splice(index, 1)
    saveLogs()
  }
}

/**
 * 导出日志为 JSON
 * @returns JSON 字符串
 */
export function exportLogsAsJSON(): string {
  return JSON.stringify(operationLogs, null, 2)
}

// 初始化时加载日志
loadLogs()
