/**
 * @file 模态对话框组件
 * @description 通用的模态对话框
 */
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-ink/40 backdrop-blur-sm"></div>

        <!-- 对话框内容 -->
        <div
          ref="modalRef"
          class="card relative z-10 w-full max-w-md rounded-organic p-6 shadow-lift"
          @click.stop
        >
          <!-- 关闭按钮 -->
          <button
            v-if="closable"
            class="tap absolute right-4 top-4 text-ink/60 hover:text-ink"
            @click="handleClose"
          >
            <X class="h-5 w-5" />
          </button>

          <!-- 标题 -->
          <h3 v-if="title" class="mb-4 pr-8 text-lg font-semibold text-ink">
            {{ title }}
          </h3>

          <!-- 内容插槽 -->
          <div class="text-sm text-ink/80">
            <slot></slot>
          </div>

          <!-- 底部操作按钮 -->
          <div v-if="$slots.footer" class="mt-6 flex gap-2">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { X } from 'lucide-vue-next'

/**
 * 组件 Props
 */
const props = defineProps<{
  /** 是否显示对话框 */
  modelValue: boolean
  /** 对话框标题 */
  title?: string
  /** 是否可关闭 */
  closable?: boolean
  /** 点击背景是否关闭 */
  closeOnBackdrop?: boolean
}>()

/**
 * 组件 Emits
 */
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

/**
 * 处理关闭
 */
function handleClose() {
  emit('update:modelValue', false)
  emit('close')
}

/**
 * 处理背景点击
 */
function handleBackdropClick() {
  if (props.closeOnBackdrop !== false) {
    handleClose()
  }
}

/**
 * 监听显示状态，控制 body 滚动
 */
watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .card,
.modal-leave-active .card {
  transition: transform 0.3s ease;
}

.modal-enter-from .card,
.modal-leave-to .card {
  transform: scale(0.95);
}
</style>
