/**
 * @file 个人资料头部卡片组件
 * @description 显示用户账号信息和登录/退出操作
 */
<template>
  <div>
    <!-- 游客模式 -->
    <section v-if="!isAuthed" class="card p-4">
      <div class="text-sm font-semibold">游客模式</div>
      <p class="mt-2 text-sm text-ink/70">
        你正在以游客身份浏览。登录后可使用 <span class="font-semibold">Lab</span> 并保存个人偏好。
      </p>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <button
          class="tap hoverleaf w-full rounded-2xl bg-moss px-4 py-3 text-sm font-semibold text-paper shadow-soft"
          @click="$emit('login')"
        >
          登录 / 注册
        </button>
        <button
          class="tap hoverleaf w-full rounded-2xl bg-earth/15 px-4 py-3 text-sm font-semibold text-ink ring-1 ring-ink/10"
          @click="$emit('scan')"
        >
          继续浏览
        </button>
      </div>
    </section>

    <!-- 已登录用户信息 -->
    <section v-else class="card p-4">
      <div class="text-sm font-semibold">账号</div>
      <div class="mt-2 text-sm text-ink/70">
        <div class="flex items-center justify-between gap-3">
          <span>昵称</span>
          <span class="font-semibold">{{ user?.name }}</span>
        </div>
        <div class="mt-2 flex items-center justify-between gap-3">
          <span>邮箱</span>
          <span class="font-mono text-xs">{{ user?.email }}</span>
        </div>
      </div>
      <button
        class="tap hoverleaf mt-4 w-full rounded-2xl bg-earth/15 px-4 py-3 text-sm font-semibold text-ink ring-1 ring-ink/10"
        @click="$emit('logout')"
      >
        退出登录
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { AuthUser } from '../api/auth'

/**
 * 组件 Props
 */
defineProps<{
  /** 是否已认证 */
  isAuthed: boolean
  /** 用户信息 */
  user: AuthUser | null
}>()

/**
 * 组件 Emits
 */
defineEmits<{
  /** 点击登录按钮 */
  login: []
  /** 点击扫描按钮 */
  scan: []
  /** 点击退出登录按钮 */
  logout: []
}>()
</script>
