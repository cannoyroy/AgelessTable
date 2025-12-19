import { reactive, computed } from 'vue'
import type { ProductInsight } from '../data/mock'

export type ScanHistoryItem = {
  id: string
  productId: string
  productName: string
  score: number
  timeImpact: string
  timestamp: number
  imageUrl?: string // base64 or blob URL for uploaded images
}

const STORAGE_KEY = 'ageless-table-history'
const MAX_HISTORY = 50

const history = reactive<ScanHistoryItem[]>([])

function loadHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return
    const parsed = JSON.parse(stored) as ScanHistoryItem[]
    history.push(...parsed.slice(0, MAX_HISTORY))
  } catch (e) {
    console.warn('Failed to load history:', e)
  }
}

function saveHistory() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
  } catch (e) {
    console.warn('Failed to save history:', e)
  }
}

export function addHistoryItem(productId: string, insight: ProductInsight, imageUrl?: string) {
  const item: ScanHistoryItem = {
    id: crypto.randomUUID(),
    productId,
    productName: insight.product,
    score: insight.longevity_score,
    timeImpact: insight.time_impact,
    timestamp: Date.now(),
    imageUrl,
  }
  history.unshift(item)
  if (history.length > MAX_HISTORY) {
    history.splice(MAX_HISTORY)
  }
  saveHistory()
}

export function removeHistoryItem(id: string) {
  const idx = history.findIndex((h) => h.id === id)
  if (idx >= 0) {
    history.splice(idx, 1)
    saveHistory()
  }
}

export function clearHistory() {
  history.splice(0)
  saveHistory()
}

export function getHistoryItem(id: string): ScanHistoryItem | undefined {
  return history.find((h) => h.id === id)
}

export const historyList = computed(() => [...history])

export function getDemoHistoryItems(): ScanHistoryItem[] {
  return [
    {
      id: 'demo-1',
      productId: 'yogurt',
      productName: '希腊酸奶 (Greek Yogurt)',
      score: 88,
      timeImpact: '+18 min',
      timestamp: Date.now() - 2 * 3600000, // 2 hours ago
    },
    {
      id: 'demo-2',
      productId: 'bread',
      productName: '全麦面包 (Whole Wheat Bread)',
      score: 71,
      timeImpact: '+7 min',
      timestamp: Date.now() - 5 * 3600000, // 5 hours ago
    },
    {
      id: 'demo-3',
      productId: 'cola',
      productName: '可口可乐 (Coca‑Cola)',
      score: 22,
      timeImpact: '-15 min',
      timestamp: Date.now() - 24 * 3600000, // 1 day ago
    },
  ]
}

// Initialize on module load
loadHistory()

