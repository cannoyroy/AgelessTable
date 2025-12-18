import { computed, reactive } from 'vue'
import type { AuthUser } from '../api/auth'
import { mockLogin, mockRegister } from '../api/auth'

type AuthState = {
  user: AuthUser | null
  token: string | null
  hydrated: boolean
}

const LS_AUTH = 'ageless.auth.v1'

function loadAuth(): Pick<AuthState, 'user' | 'token'> | null {
  try {
    const raw = localStorage.getItem(LS_AUTH)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { user?: AuthUser; token?: string }
    if (!parsed?.token || !parsed?.user) return null
    return { user: parsed.user, token: parsed.token }
  } catch {
    return null
  }
}

function saveAuth(user: AuthUser | null, token: string | null) {
  if (!user || !token) {
    localStorage.removeItem(LS_AUTH)
    return
  }
  localStorage.setItem(LS_AUTH, JSON.stringify({ user, token }))
}

export const auth = reactive<AuthState>({
  user: null,
  token: null,
  hydrated: false,
})

export const isAuthed = computed(() => Boolean(auth.token && auth.user))

export function hydrateAuth() {
  if (auth.hydrated) return
  const stored = loadAuth()
  auth.user = stored?.user ?? null
  auth.token = stored?.token ?? null
  auth.hydrated = true
}

export async function register(input: { email: string; password: string; name: string }) {
  const { user } = await mockRegister(input)
  const token = `demo_${crypto.randomUUID()}`
  auth.user = user
  auth.token = token
  saveAuth(user, token)
  return user
}

export async function login(input: { email: string; password: string }) {
  const { user } = await mockLogin(input)
  const token = `demo_${crypto.randomUUID()}`
  auth.user = user
  auth.token = token
  saveAuth(user, token)
  return user
}

export function logout() {
  auth.user = null
  auth.token = null
  saveAuth(null, null)
}


