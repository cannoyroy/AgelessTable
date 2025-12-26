/**
 * @file 确认对话框组件
 * @description 用于确认操作的对话框
 */
<template>
  <Modal
    :model-value="modelValue"
    :title="title"
    :closable="true"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p class="text-ink/80">{{ message }}</p>

    <template #footer>
      <button
        class="tap hoverleaf flex-1 rounded-2xl bg-earth/15 px-4 py-2 text-sm font-semibold text-ink ring-1 ring-ink/10"
        @click="handleCancel"
      >
        {{ cancelText }}
      </button>
      <button
        class="tap hoverleaf flex-1 rounded-2xl px-4 py-2 text-sm font-semibold text-paper shadow-soft"
        :class="dangerous ? 'bg-red-500' : 'bg-moss'"
        @click="handleConfirm"
      >
        {{ confirmText }}
      </button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'

/**
 * 组件 Props
 */
withDefaults(
  defineProps<{
    /** 是否显示对话框 */
    modelValue: boolean
    /** 标题 */
    title?: string
    /** 提示消息 */
    message: string
    /** 确认按钮文本 */
    confirmText?: string
    /** 取消按钮文本 */
    cancelText?: string
    /** 是否为危险操作（红色按钮） */
    dangerous?: boolean
  }>(),
  {
    title: '确认操作',
    confirmText: '确定',
    cancelText: '取消',
    dangerous: false,
  }
)

/**
 * 组件 Emits
 */
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

/**
 * 处理确认
 */
function handleConfirm() {
  emit('update:modelValue', false)
  emit('confirm')
}

/**
 * 处理取消
 */
function handleCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>
