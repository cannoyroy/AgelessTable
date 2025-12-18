import { reactive } from 'vue'
import type { ProductInsight } from '../data/mock'
import { getProductById } from '../data/mock'

type SessionState = {
  selectedProductId: string
  insight: ProductInsight
  scoreOverride: number | null
}

export const session = reactive<SessionState>({
  selectedProductId: 'yogurt',
  insight: getProductById('yogurt'),
  scoreOverride: null,
})

export function selectProduct(id: string) {
  session.selectedProductId = id
  session.insight = getProductById(id)
  session.scoreOverride = null
}

export function setScoreOverride(score: number | null) {
  session.scoreOverride = score
}

export function getDisplayedScore() {
  return session.scoreOverride ?? session.insight.longevity_score
}


