/**
 * @file 文件上传工具 Composable
 * @description 处理文件上传、预览、验证等逻辑
 */

import { ref, type Ref } from 'vue'

/**
 * 文件上传配置选项
 */
export interface FileUploadOptions {
  /** 允许的文件类型（MIME types） */
  accept?: string[]
  /** 最大文件大小（字节） */
  maxSize?: number
  /** 最大文件数量 */
  maxFiles?: number
  /** 是否自动创建预览 URL */
  autoPreview?: boolean
}

/**
 * 上传的文件信息
 */
export interface UploadedFile {
  /** 原始 File 对象 */
  file: File
  /** 预览 URL（如果启用） */
  previewUrl?: string
  /** 上传进度（0-100） */
  progress?: number
  /** 上传状态 */
  status: 'pending' | 'uploading' | 'success' | 'error'
  /** 错误信息 */
  error?: string
}

/**
 * 文件上传 Composable
 * @param options - 上传配置选项
 * @returns 文件上传相关的状态和方法
 */
export function useFileUpload(options: FileUploadOptions = {}) {
  const {
    accept = ['image/*'],
    maxSize = 10 * 1024 * 1024, // 默认 10MB
    maxFiles = 1,
    autoPreview = true,
  } = options

  const files: Ref<UploadedFile[]> = ref([])
  const isUploading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 验证文件是否符合要求
   * @param file - 待验证的文件
   * @returns 验证结果和错误信息
   */
  function validateFile(file: File): { valid: boolean; error?: string } {
    // 检查文件类型
    const fileType = file.type
    const isValidType = accept.some((type) => {
      if (type.endsWith('/*')) {
        const prefix = type.replace('/*', '')
        return fileType.startsWith(prefix)
      }
      return fileType === type
    })

    if (!isValidType) {
      return { valid: false, error: `不支持的文件类型：${fileType}` }
    }

    // 检查文件大小
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
      return { valid: false, error: `文件大小超过限制（最大 ${maxSizeMB}MB）` }
    }

    // 检查文件数量
    if (files.value.length >= maxFiles) {
      return { valid: false, error: `最多只能上传 ${maxFiles} 个文件` }
    }

    return { valid: true }
  }

  /**
   * 添加文件到上传列表
   * @param fileList - 文件列表或单个文件
   * @returns 是否添加成功
   */
  function addFiles(fileList: FileList | File[]): boolean {
    error.value = null
    const fileArray = Array.from(fileList)

    for (const file of fileArray) {
      const validation = validateFile(file)
      if (!validation.valid) {
        error.value = validation.error!
        return false
      }

      const uploadedFile: UploadedFile = {
        file,
        status: 'pending',
        progress: 0,
      }

      // 创建预览 URL
      if (autoPreview && file.type.startsWith('image/')) {
        uploadedFile.previewUrl = URL.createObjectURL(file)
      }

      files.value.push(uploadedFile)
    }

    return true
  }

  /**
   * 移除指定索引的文件
   * @param index - 文件索引
   */
  function removeFile(index: number) {
    const file = files.value[index]
    if (file?.previewUrl) {
      URL.revokeObjectURL(file.previewUrl)
    }
    files.value.splice(index, 1)
  }

  /**
   * 清空所有文件
   */
  function clearFiles() {
    files.value.forEach((file) => {
      if (file.previewUrl) {
        URL.revokeObjectURL(file.previewUrl)
      }
    })
    files.value = []
    error.value = null
  }

  /**
   * 获取第一个文件（用于单文件上传场景）
   * @returns 第一个文件或 null
   */
  function getFirstFile(): UploadedFile | null {
    return files.value[0] || null
  }

  /**
   * 获取第一个文件的预览 URL
   * @returns 预览 URL 或 null
   */
  function getFirstPreviewUrl(): string | null {
    return files.value[0]?.previewUrl || null
  }

  return {
    files,
    isUploading,
    error,
    addFiles,
    removeFile,
    clearFiles,
    getFirstFile,
    getFirstPreviewUrl,
    validateFile,
  }
}
