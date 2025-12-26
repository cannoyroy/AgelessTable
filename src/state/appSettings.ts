/**
 * @file 应用设置状态管理
 * @description 管理应用全局设置
 */

import { reactive, watch } from 'vue'
import { STORAGE_KEYS } from '../config/constants'

/**
 * 字体大小类型
 */
export type FontSize = 'small' | 'medium' | 'large'

/**
 * 应用设置接口
 */
export interface AppSettings {
  /** 启用动画效果 */
  enableAnimations: boolean
  /** 启用震动反馈 */
  enableVibration: boolean
  /** 自动保存历史记录 */
  autoSaveHistory: boolean
  /** 启用数据分析 */
  enableAnalytics: boolean
  /** 字体大小 */
  fontSize: FontSize
}

/**
 * 默认设置
 */
const defaultSettings: AppSettings = {
  enableAnimations: true,
  enableVibration: true,
  autoSaveHistory: true,
  enableAnalytics: false,
  fontSize: 'medium',
}

/**
 * 应用设置状态
 */
export const appSettings = reactive<AppSettings>({ ...defaultSettings })

/**
 * 从 localStorage 加载设置
 */
export function loadAppSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AppSettings>
      Object.assign(appSettings, { ...defaultSettings, ...parsed })
    }
  } catch (e) {
    console.warn('Failed to load app settings:', e)
  }
}

/**
 * 保存设置到 localStorage
 */
export function saveAppSettings() {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(appSettings))
  } catch (e) {
    console.warn('Failed to save app settings:', e)
  }
}

/**
 * 更新设置
 * @param key - 设置键
 * @param value - 设置值
 */
export function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
  appSettings[key] = value
  saveAppSettings()
}

/**
 * 重置所有设置为默认值
 */
export function resetAppSettings() {
  Object.assign(appSettings, defaultSettings)
  saveAppSettings()
}

/**
 * 应用字体大小到 DOM
 */
function applyFontSize() {
  const fontSizeMap: Record<FontSize, string> = {
    small: '14px',
    medium: '16px',
    large: '18px',
  }
  document.documentElement.style.fontSize = fontSizeMap[appSettings.fontSize]
}

/**
 * 应用动画设置到 DOM
 */
function applyAnimationSettings() {
  if (appSettings.enableAnimations) {
    document.documentElement.style.removeProperty('--transition-duration')
    document.documentElement.classList.remove('reduce-motion')
  } else {
    document.documentElement.style.setProperty('--transition-duration', '0ms')
    document.documentElement.classList.add('reduce-motion')
  }
}

/**
 * 触发震动反馈
 * @param duration - 震动时长（毫秒）
 */
export function vibrate(duration: number = 30) {
  if (appSettings.enableVibration && navigator.vibrate) {
    navigator.vibrate(duration)
  }
}

/**
 * 检查是否应该保存历史记录
 * @returns 是否保存历史
 */
export function shouldSaveHistory(): boolean {
  return appSettings.autoSaveHistory
}

// 监听设置变化，自动应用到 DOM
watch(() => appSettings.fontSize, applyFontSize, { immediate: true })
watch(() => appSettings.enableAnimations, applyAnimationSettings, { immediate: true })

// 初始化时加载设置
loadAppSettings()
