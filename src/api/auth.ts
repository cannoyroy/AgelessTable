export type AuthUser = {
  id: string
  name: string
  email: string
}

type StoredUser = AuthUser & { password: string }

const LS_USERS = 'ageless.users.v1'

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(LS_USERS)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredUser[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(LS_USERS, JSON.stringify(users))
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function mockRegister(input: { email: string; password: string; name: string }) {
  await sleep(600)
  const email = normalizeEmail(input.email)
  const name = input.name.trim()
  const password = input.password

  if (!email.includes('@')) throw new Error('请输入有效邮箱。')
  if (password.length < 6) throw new Error('密码至少 6 位。')
  if (name.length < 2) throw new Error('昵称至少 2 个字符。')

  const users = loadUsers()
  if (users.some((u) => u.email === email)) throw new Error('该邮箱已注册，请直接登录。')

  const user: StoredUser = { id: crypto.randomUUID(), email, name, password }
  users.push(user)
  saveUsers(users)

  return { user: { id: user.id, email: user.email, name: user.name } satisfies AuthUser }
}

export async function mockLogin(input: { email: string; password: string }) {
  await sleep(600)
  const email = normalizeEmail(input.email)
  const password = input.password

  const users = loadUsers()
  const user = users.find((u) => u.email === email)
  if (!user || user.password !== password) throw new Error('邮箱或密码不正确。')

  return { user: { id: user.id, email: user.email, name: user.name } satisfies AuthUser }
}


