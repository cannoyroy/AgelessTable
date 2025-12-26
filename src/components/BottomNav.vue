<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-surface/80 backdrop-blur-md"
    aria-label="Bottom navigation"
  >
    <div
      class="grid w-full grid-cols-5 gap-1 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] sm:px-6 lg:px-10"
    >
      <RouterLink v-for="item in items" :key="item.to" :to="item.to" class="tap hoverleaf">
        <div
          class="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs"
          :class="isActive(item.to) ? 'bg-paper/70 text-ink ring-1 ring-ink/10' : 'text-ink/70'"
        >
          <component :is="item.icon" class="h-5 w-5" />
          <span class="leading-none">{{ item.label }}</span>
        </div>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { FlaskConical, Lightbulb, ScanLine, User, Settings } from 'lucide-vue-next'

const route = useRoute()

const items = computed(() => [
  { label: '扫描', to: '/scan', icon: ScanLine },
  { label: '洞察', to: '/insight', icon: Lightbulb },
  { label: '对话', to: '/lab', icon: FlaskConical },
  { label: '我的', to: '/profile', icon: User },
  { label: '设置', to: '/settings', icon: Settings },
])

function isActive(to: string) {
  return route.path === to
}
</script>


