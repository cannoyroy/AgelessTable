<template>
  <div class="mx-auto w-full max-w-md space-y-4">
    <header class="space-y-1">
      <div class="chip">
        <span class="h-2 w-2 rounded-full bg-leaf/80"></span>
        账号 · 登录 / 注册
      </div>
      <h1 class="text-2xl font-semibold tracking-tight">欢迎回到逆龄餐桌</h1>
      <p class="text-sm text-ink/70">游客可浏览 Scan/Insight；登录后解锁 Lab 与 Profile。</p>
    </header>

    <section class="card p-4">
      <div class="flex gap-2 rounded-2xl bg-paper/60 p-1 ring-1 ring-ink/10">
        <button
          class="tap w-1/2 rounded-2xl px-3 py-2 text-sm font-semibold"
          :class="mode === 'login' ? 'bg-surface/80 shadow-soft' : 'text-ink/70'"
          @click="mode = 'login'"
          type="button"
        >
          登录
        </button>
        <button
          class="tap w-1/2 rounded-2xl px-3 py-2 text-sm font-semibold"
          :class="mode === 'register' ? 'bg-surface/80 shadow-soft' : 'text-ink/70'"
          @click="mode = 'register'"
          type="button"
        >
          注册
        </button>
      </div>

      <form class="mt-4 space-y-3" @submit.prevent="submit">
        <div v-if="mode === 'register'" class="space-y-1">
          <label class="text-xs text-ink/60">昵称</label>
          <input
            v-model="name"
            class="tap w-full rounded-2xl bg-paper/70 px-4 py-3 text-sm ring-1 ring-ink/10"
            placeholder="例如：小林"
            autocomplete="nickname"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs text-ink/60">邮箱</label>
          <input
            v-model="email"
            class="tap w-full rounded-2xl bg-paper/70 px-4 py-3 text-sm ring-1 ring-ink/10"
            placeholder="you@example.com"
            inputmode="email"
            autocomplete="email"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs text-ink/60">密码</label>
          <input
            v-model="password"
            class="tap w-full rounded-2xl bg-paper/70 px-4 py-3 text-sm ring-1 ring-ink/10"
            placeholder="至少 6 位"
            type="password"
            autocomplete="current-password"
          />
        </div>

        <div v-if="error" class="rounded-2xl bg-earth/10 px-3 py-2 text-sm text-ink ring-1 ring-ink/10">
          {{ error }}
        </div>

        <button
          class="tap hoverleaf w-full rounded-2xl bg-moss px-4 py-3 text-sm font-semibold text-paper shadow-soft disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
          type="submit"
        >
          {{ loading ? '请稍候…' : mode === 'login' ? '登录并继续' : '注册并继续' }}
        </button>

        <div class="flex items-center justify-between text-xs text-ink/60">
          <span>演示版本地账号（存储在浏览器）</span>
          <button class="tap hoverleaf underline" type="button" @click="goGuest">继续游客浏览</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { hydrateAuth, isAuthed, login, register } from '../state/auth'

const router = useRouter()
const route = useRoute()

type Mode = 'login' | 'register'
const mode = ref<Mode>('login')

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

const redirectTo = computed(() => {
  const q = route.query.redirect
  return typeof q === 'string' && q.startsWith('/') ? q : '/scan'
})

onMounted(() => {
  hydrateAuth()
  if (isAuthed.value) void router.replace(redirectTo.value)
})

async function submit() {
  error.value = null
  loading.value = true
  try {
    if (mode.value === 'login') {
      await login({ email: email.value, password: password.value })
    } else {
      await register({ email: email.value, password: password.value, name: name.value })
    }
    void router.replace(redirectTo.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '发生未知错误，请稍后重试。'
  } finally {
    loading.value = false
  }
}

function goGuest() {
  void router.replace('/scan')
}
</script>


