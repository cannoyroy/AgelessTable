import { reactive } from 'vue'

export type HealthProfile = 'none' | 'diabetes' | 'inflammation' | 'weight-loss' | 'heart-health' | 'gut-health'

const STORAGE_KEY = 'ageless-table-health-preferences'

export const healthPreferences = reactive<{
  profile: HealthProfile
}>({
  profile: 'none',
})

function loadPreferences() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return
    const parsed = JSON.parse(stored) as { profile: HealthProfile }
    healthPreferences.profile = parsed.profile || 'none'
  } catch (e) {
    console.warn('Failed to load health preferences:', e)
  }
}

function savePreferences() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile: healthPreferences.profile }))
  } catch (e) {
    console.warn('Failed to save health preferences:', e)
  }
}

export function setHealthProfile(profile: HealthProfile) {
  healthPreferences.profile = profile
  savePreferences()
}

export const healthProfileLabels: Record<HealthProfile, string> = {
  none: '无特殊偏好',
  diabetes: '高血糖/糖尿病',
  inflammation: '慢性炎症',
  'weight-loss': '减脂/体重管理',
  'heart-health': '心血管健康',
  'gut-health': '肠道健康',
}

export const healthProfileDescriptions: Record<HealthProfile, string> = {
  none: '通用健康建议',
  diabetes: '重点关注血糖波动与胰岛素负荷',
  inflammation: '重点关注促炎/抗炎成分',
  'weight-loss': '重点关注饱腹感与代谢效率',
  'heart-health': '重点关注心血管风险因子',
  'gut-health': '重点关注肠道屏障与微生态',
}

// Initialize on module load
loadPreferences()

