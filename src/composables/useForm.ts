/**
 * @file 表单管理 Composable
 * @description 提供表单状态管理、验证和提交等功能
 */

import { reactive, computed } from 'vue'
import type { ValidationResult, ValidatorFunction } from '../config/validationRules'

/**
 * 字段验证规则
 */
export interface FieldValidation {
  /** 验证器函数 */
  validator: ValidatorFunction
  /** 触发时机 */
  trigger?: 'blur' | 'change' | 'submit'
}

/**
 * 字段配置
 */
export interface FieldConfig<T = any> {
  /** 初始值 */
  initialValue: T
  /** 验证规则 */
  rules?: FieldValidation[]
}

/**
 * 字段状态
 */
export interface FieldState<T = any> {
  /** 当前值 */
  value: T
  /** 错误消息 */
  error: string | null
  /** 是否已触碰（用户是否交互过） */
  touched: boolean
  /** 是否正在验证 */
  validating: boolean
  /** 是否通过验证 */
  valid: boolean
}

/**
 * 表单配置
 */
export interface FormConfig<T extends Record<string, any>> {
  /** 字段配置 */
  fields: {
    [K in keyof T]: FieldConfig<T[K]>
  }
  /** 表单级验证函数（可选） */
  validate?: (values: T) => Promise<ValidationResult> | ValidationResult
  /** 提交处理函数 */
  onSubmit?: (values: T) => Promise<void> | void
}

/**
 * 表单管理 Hook
 * @param config - 表单配置
 * @returns 表单状态和方法
 */
export function useForm<T extends Record<string, any>>(config: FormConfig<T>) {
  // 初始化字段状态
  const fieldsState: any = reactive(
    Object.keys(config.fields).reduce((acc: any, key) => {
      const fieldKey = key as keyof T
      acc[fieldKey] = {
        value: config.fields[fieldKey].initialValue,
        error: null,
        touched: false,
        validating: false,
        valid: true,
      }
      return acc
    }, {})
  )

  // 表单级状态
  const formState = reactive({
    submitting: false,
    submitted: false,
    error: null as string | null,
  })

  /**
   * 表单是否有效（所有字段都通过验证）
   */
  const isValid = computed(() => {
    return Object.values(fieldsState).every((field: any) => field.valid && !field.error)
  })

  /**
   * 表单是否有修改（任意字段被触碰）
   */
  const isDirty = computed(() => {
    return Object.values(fieldsState).some((field: any) => field.touched)
  })

  /**
   * 获取表单值
   */
  const values = computed(() => {
    return Object.keys(fieldsState).reduce((acc, key) => {
      const fieldKey = key as keyof T
      acc[fieldKey] = fieldsState[fieldKey].value
      return acc
    }, {} as T)
  })

  /**
   * 验证单个字段
   * @param fieldName - 字段名
   * @returns 是否通过验证
   */
  async function validateField(fieldName: keyof T): Promise<boolean> {
    const field = fieldsState[fieldName] as any
    const fieldConfig = config.fields[fieldName]

    if (!fieldConfig.rules || fieldConfig.rules.length === 0) {
      field.valid = true
      field.error = null
      return true
    }

    field.validating = true
    field.error = null

    try {
      for (const rule of fieldConfig.rules) {
        const result = await Promise.resolve(rule.validator(field.value))
        if (!result.valid) {
          field.valid = false
          field.error = result.message || '验证失败'
          return false
        }
      }

      field.valid = true
      field.error = null
      return true
    } catch (error) {
      field.valid = false
      field.error = '验证过程出错'
      return false
    } finally {
      field.validating = false
    }
  }

  /**
   * 验证所有字段
   * @returns 是否全部通过验证
   */
  async function validateAll(): Promise<boolean> {
    const validations = Object.keys(fieldsState).map((key) =>
      validateField(key as keyof T)
    )
    const results = await Promise.all(validations)
    const allValid = results.every((valid) => valid)

    // 执行表单级验证
    if (allValid && config.validate) {
      try {
        const formValidation = await Promise.resolve(config.validate(values.value))
        if (!formValidation.valid) {
          formState.error = formValidation.message || '表单验证失败'
          return false
        }
      } catch (error) {
        formState.error = '表单验证出错'
        return false
      }
    }

    formState.error = null
    return allValid
  }

  /**
   * 设置字段值
   * @param fieldName - 字段名
   * @param value - 新值
   * @param validate - 是否立即验证
   */
  async function setFieldValue(
    fieldName: keyof T,
    value: T[keyof T],
    validate = false
  ) {
    const field = fieldsState[fieldName] as any
    field.value = value
    field.touched = true

    if (validate) {
      await validateField(fieldName)
    }
  }

  /**
   * 设置字段错误
   * @param fieldName - 字段名
   * @param error - 错误消息
   */
  function setFieldError(fieldName: keyof T, error: string | null) {
    const field = fieldsState[fieldName] as any
    field.error = error
    field.valid = !error
  }

  /**
   * 标记字段为已触碰
   * @param fieldName - 字段名
   */
  function touchField(fieldName: keyof T) {
    const field = fieldsState[fieldName] as any
    field.touched = true
  }

  /**
   * 处理字段失焦事件
   * @param fieldName - 字段名
   */
  async function handleBlur(fieldName: keyof T) {
    touchField(fieldName)
    const fieldConfig = config.fields[fieldName]
    const shouldValidate = fieldConfig.rules?.some((rule) => rule.trigger === 'blur')
    if (shouldValidate) {
      await validateField(fieldName)
    }
  }

  /**
   * 处理字段变更事件
   * @param fieldName - 字段名
   * @param value - 新值
   */
  async function handleChange(fieldName: keyof T, value: T[keyof T]) {
    await setFieldValue(fieldName, value, false)
    const fieldConfig = config.fields[fieldName]
    const shouldValidate = fieldConfig.rules?.some((rule) => rule.trigger === 'change')
    if (shouldValidate) {
      await validateField(fieldName)
    }
  }

  /**
   * 重置表单
   */
  function reset() {
    Object.keys(fieldsState).forEach((key) => {
      const fieldKey = key as keyof T
      const field = fieldsState[fieldKey] as any
      field.value = config.fields[fieldKey].initialValue
      field.error = null
      field.touched = false
      field.validating = false
      field.valid = true
    })
    formState.submitting = false
    formState.submitted = false
    formState.error = null
  }

  /**
   * 提交表单
   * @returns 提交是否成功
   */
  async function submit(): Promise<boolean> {
    // 标记所有字段为已触碰
    Object.keys(fieldsState).forEach((key) => {
      touchField(key as keyof T)
    })

    // 验证所有字段
    const valid = await validateAll()
    if (!valid) {
      return false
    }

    // 执行提交
    if (config.onSubmit) {
      formState.submitting = true
      formState.error = null

      try {
        await config.onSubmit(values.value)
        formState.submitted = true
        return true
      } catch (error: any) {
        formState.error = error?.message || '提交失败'
        return false
      } finally {
        formState.submitting = false
      }
    }

    return true
  }

  return {
    // 字段状态
    fields: fieldsState,
    // 表单状态
    formState,
    // 计算属性
    isValid,
    isDirty,
    values,
    // 方法
    validateField,
    validateAll,
    setFieldValue,
    setFieldError,
    touchField,
    handleBlur,
    handleChange,
    reset,
    submit,
  }
}
