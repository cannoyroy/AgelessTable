import type { RouteRecordRaw } from 'vue-router'

import ScanView from '../views/ScanView.vue'
import InsightView from '../views/InsightView.vue'
import LabView from '../views/LabView.vue'
import ProfileView from '../views/ProfileView.vue'
import AuthView from '../views/AuthView.vue'
import SettingsView from '../views/SettingsView.vue'
import HelpView from '../views/HelpView.vue'
import LogsView from '../views/LogsView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/scan' },
  { path: '/scan', name: 'scan', component: ScanView },
  { path: '/insight', name: 'insight', component: InsightView },
  // Lab becomes "hybrid": guests can view but cannot send messages until login.
  { path: '/lab', name: 'lab', component: LabView },
  // Profile becomes "hybrid": guests can enter to see login CTA; authed users see full content.
  { path: '/profile', name: 'profile', component: ProfileView },
  { path: '/auth', name: 'auth', component: AuthView },
  { path: '/settings', name: 'settings', component: SettingsView },
  { path: '/help', name: 'help', component: HelpView },
  { path: '/logs', name: 'logs', component: LogsView },
]


