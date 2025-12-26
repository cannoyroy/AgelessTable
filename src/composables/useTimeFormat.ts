/**
 * @file 时间格式化工具 Composable
 * @description 提供各种时间格式化函数，用于统一显示时间格式
 */

/**
 * 将时间戳格式化为相对时间描述（如"3分钟前"）
 * @param timestamp - Unix 时间戳（毫秒）
 * @returns 格式化后的相对时间字符串
 */
export function formatRelativeTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

/**
 * 将时间戳格式化为完整日期时间
 * @param timestamp - Unix 时间戳（毫秒）
 * @param options - Intl.DateTimeFormat 选项
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(
  timestamp: number,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(timestamp)
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }
  return date.toLocaleString('zh-CN', defaultOptions)
}

/**
 * 将时间戳格式化为日期
 * @param timestamp - Unix 时间戳（毫秒）
 * @returns 格式化后的日期字符串（YYYY-MM-DD）
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 将时间戳格式化为时间
 * @param timestamp - Unix 时间戳（毫秒）
 * @returns 格式化后的时间字符串（HH:MM:SS）
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

/**
 * 计算两个时间戳之间的时长（友好格式）
 * @param startTimestamp - 开始时间戳
 * @param endTimestamp - 结束时间戳
 * @returns 格式化后的时长字符串
 */
export function formatDuration(startTimestamp: number, endTimestamp: number): string {
  const diff = endTimestamp - startTimestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天${hours % 24}小时`
  if (hours > 0) return `${hours}小时${minutes % 60}分钟`
  if (minutes > 0) return `${minutes}分钟${seconds % 60}秒`
  return `${seconds}秒`
}
