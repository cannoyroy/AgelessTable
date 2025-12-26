/**
 * @file 收藏列表组件
 * @description 显示用户收藏的产品列表
 */
<template>
  <section v-if="favoriteItems.length > 0" class="card p-4">
    <div class="text-sm font-semibold">收藏</div>

    <div class="mt-3 space-y-2">
      <div
        v-for="item in favoriteItems"
        :key="item.productId"
        class="tap hoverleaf flex items-center justify-between rounded-xl bg-paper/50 p-3 ring-1 ring-ink/10"
        @click="$emit('view', item.productId)"
      >
        <span class="text-sm font-semibold">{{ item.productName }}</span>
        <button
          class="tap text-leaf hover:text-moss"
          @click.stop="$emit('toggle', item.productId)"
        >
          <Star class="h-4 w-4 fill-current" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Star } from 'lucide-vue-next'

/**
 * 收藏项接口
 */
export interface FavoriteItem {
  /** 产品 ID */
  productId: string
  /** 产品名称 */
  productName: string
}

/**
 * 组件 Props
 */
defineProps<{
  /** 收藏列表 */
  favoriteItems: FavoriteItem[]
}>()

/**
 * 组件 Emits
 */
defineEmits<{
  /** 查看收藏 */
  view: [productId: string]
  /** 切换收藏状态 */
  toggle: [productId: string]
}>()
</script>
