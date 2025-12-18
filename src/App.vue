<template>
  <div class="min-h-dvh bg-surface text-ink">
    <div class="w-full px-4 pb-24 pt-4 sm:px-6 lg:px-10">
      <RouterView />
    </div>
    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
</script>


