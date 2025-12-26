/**
 * @file 健康档案选择器组件
 * @description 让用户选择健康偏好档案
 */
<template>
  <section class="card p-4">
    <div class="text-sm font-semibold">健康偏好</div>
    <p class="mt-1 text-xs text-ink/60">设置后，洞察分析将针对你的健康需求进行调整</p>

    <div class="mt-3 space-y-2">
      <button
        v-for="profile in availableProfiles"
        :key="profile.value"
        class="tap hoverleaf w-full rounded-xl bg-paper/50 px-4 py-3 text-left ring-1 ring-ink/10"
        :class="currentProfile === profile.value && 'ring-2 ring-leaf/50 bg-leaf/10'"
        @click="$emit('change', profile.value)"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-semibold">{{ profile.label }}</div>
            <div class="mt-0.5 text-xs text-ink/60">{{ profile.description }}</div>
          </div>
          <div v-if="currentProfile === profile.value" class="flex-shrink-0 text-leaf">
            <Check class="h-5 w-5" />
          </div>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import type { HealthProfile } from '../state/healthPreferences'
import { healthProfileLabels, healthProfileDescriptions } from '../state/healthPreferences'

/**
 * 健康档案选项
 */
interface ProfileOption {
  value: HealthProfile
  label: string
  description: string
}

/**
 * 组件 Props
 */
const props = defineProps<{
  /** 当前选中的档案 */
  currentProfile: HealthProfile
  /** 可用的档案列表 */
  profiles?: HealthProfile[]
}>()

/**
 * 组件 Emits
 */
defineEmits<{
  /** 档案变更 */
  change: [profile: HealthProfile]
}>()

/**
 * 可用的档案选项列表
 */
const availableProfiles = computed<ProfileOption[]>(() => {
  const profiles: HealthProfile[] = props.profiles || [
    'none',
    'diabetes',
    'inflammation',
    'weight-loss',
    'heart-health',
    'gut-health',
  ]

  return profiles.map((profile) => ({
    value: profile,
    label: healthProfileLabels[profile],
    description: healthProfileDescriptions[profile],
  }))
})
</script>
