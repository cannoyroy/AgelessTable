import { reactive, computed } from 'vue'

const STORAGE_KEY = 'ageless-table-favorites'

const favorites = reactive<Set<string>>(new Set())

function loadFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return
    const parsed = JSON.parse(stored) as string[]
    favorites.clear()
    parsed.forEach((id) => favorites.add(id))
  } catch (e) {
    console.warn('Failed to load favorites:', e)
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favorites)))
  } catch (e) {
    console.warn('Failed to save favorites:', e)
  }
}

export function toggleFavorite(productId: string) {
  if (favorites.has(productId)) {
    favorites.delete(productId)
  } else {
    favorites.add(productId)
  }
  saveFavorites()
}

export function isFavorite(productId: string): boolean {
  return favorites.has(productId)
}

export const favoriteList = computed(() => Array.from(favorites))

// Initialize on module load
loadFavorites()

