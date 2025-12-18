<template>
  <div class="space-y-4">
    <header class="space-y-1">
      <div class="chip">我的 · Profile</div>
      <h1 class="text-2xl font-semibold tracking-tight">逆龄餐桌</h1>
      <p class="text-sm text-ink/70">演示版信息面板（后续接入账号与健康档案）。</p>
    </header>

    <section v-if="!isAuthed" class="card p-4">
      <div class="text-sm font-semibold">游客模式</div>
      <p class="mt-2 text-sm text-ink/70">
        你正在以游客身份浏览。登录后可使用 <span class="font-semibold">Lab</span> 并保存个人偏好。
      </p>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <button
          class="tap hoverleaf w-full rounded-2xl bg-moss px-4 py-3 text-sm font-semibold text-paper shadow-soft"
          @click="goLogin"
        >
          登录 / 注册
        </button>
        <button
          class="tap hoverleaf w-full rounded-2xl bg-earth/15 px-4 py-3 text-sm font-semibold text-ink ring-1 ring-ink/10"
          @click="goScan"
        >
          继续浏览
        </button>
      </div>
    </section>

    <section class="card p-4">
      <div class="text-sm font-semibold">当前演示设置</div>
      <div class="mt-2 text-sm text-ink/70">
        <div class="flex items-center justify-between gap-3">
          <span>选中食品</span>
          <span class="font-semibold">{{ session.insight.product }}</span>
        </div>
        <div class="mt-2 flex items-center justify-between gap-3">
          <span>分数覆盖</span>
          <span class="font-mono">{{ session.scoreOverride ?? '—' }}</span>
        </div>
      </div>
      <button class="tap hoverleaf mt-4 w-full rounded-2xl bg-earth/15 px-4 py-3 text-sm font-semibold text-ink ring-1 ring-ink/10" @click="reset">
        清除分数覆盖（回到食品原始分数）
      </button>
    </section>

    <section v-if="isAuthed" class="card p-4">
      <div class="text-sm font-semibold">账号</div>
      <div class="mt-2 text-sm text-ink/70">
        <div class="flex items-center justify-between gap-3">
          <span>昵称</span>
          <span class="font-semibold">{{ auth.user?.name }}</span>
        </div>
        <div class="mt-2 flex items-center justify-between gap-3">
          <span>邮箱</span>
          <span class="font-mono text-xs">{{ auth.user?.email }}</span>
        </div>
      </div>
      <button
        class="tap hoverleaf mt-4 w-full rounded-2xl bg-earth/15 px-4 py-3 text-sm font-semibold text-ink ring-1 ring-ink/10"
        @click="doLogout"
      >
        退出登录
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { session, setScoreOverride } from '../state/session'
import { auth, hydrateAuth, isAuthed, logout } from '../state/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

onMounted(() => {
  hydrateAuth()
})

function reset() {
  setScoreOverride(null)
}

function goLogin() {
  void router.push({ path: '/auth', query: { redirect: '/profile' } })
}

function goScan() {
  void router.push('/scan')
}

function doLogout() {
  logout()
  void router.push('/scan')
}
</script>


