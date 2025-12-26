/**
 * @file 表单验证规则配置
 * @description 定义各种输入字段的验证规则
 */

import { VALIDATION } from './constants'

/**
 * 验证结果
 */
export interface ValidationResult {
  /** 是否通过验证 */
  valid: boolean
  /** 错误消息 */
  message?: string
}

/**
 * 验证函数类型
 */
export type ValidatorFunction = (value: any) => ValidationResult

/**
 * 必填项验证
 * @param value - 待验证的值
 * @param fieldName - 字段名称（用于错误消息）
 * @returns 验证结果
 */
export function required(value: any, fieldName = '此项'): ValidationResult {
  const isEmpty =
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)

  return {
    valid: !isEmpty,
    message: isEmpty ? `${fieldName}为必填项` : undefined,
  }
}

/**
 * 邮箱格式验证
 * @param email - 邮箱地址
 * @returns 验证结果
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { valid: false, message: '请输入邮箱地址' }
  }

  const isValid = VALIDATION.EMAIL_REGEX.test(email)
  return {
    valid: isValid,
    message: isValid ? undefined : '请输入有效的邮箱地址',
  }
}

/**
 * 密码强度验证
 * @param password - 密码
 * @returns 验证结果
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, message: '请输入密码' }
  }

  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      message: `密码至少需要 ${VALIDATION.PASSWORD_MIN_LENGTH} 位字符`,
    }
  }

  if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
    return {
      valid: false,
      message: `密码最多 ${VALIDATION.PASSWORD_MAX_LENGTH} 位字符`,
    }
  }

  // 检查密码强度（至少包含字母和数字）
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)

  if (!hasLetter || !hasNumber) {
    return {
      valid: true, // 不强制要求，只给出建议
      message: '建议密码包含字母和数字以提高安全性',
    }
  }

  return { valid: true }
}

/**
 * 密码确认验证
 * @param password - 原密码
 * @param confirmPassword - 确认密码
 * @returns 验证结果
 */
export function validatePasswordConfirm(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword) {
    return { valid: false, message: '请再次输入密码' }
  }

  const isMatch = password === confirmPassword
  return {
    valid: isMatch,
    message: isMatch ? undefined : '两次输入的密码不一致',
  }
}

/**
 * 昵称验证
 * @param name - 昵称
 * @returns 验证结果
 */
export function validateName(name: string): ValidationResult {
  if (!name) {
    return { valid: false, message: '请输入昵称' }
  }

  const trimmedName = name.trim()

  if (trimmedName.length < VALIDATION.NAME_MIN_LENGTH) {
    return {
      valid: false,
      message: `昵称至少需要 ${VALIDATION.NAME_MIN_LENGTH} 个字符`,
    }
  }

  if (trimmedName.length > VALIDATION.NAME_MAX_LENGTH) {
    return {
      valid: false,
      message: `昵称最多 ${VALIDATION.NAME_MAX_LENGTH} 个字符`,
    }
  }

  // 检查昵称格式（只允许中文、字母、数字、下划线）
  const validNameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]+$/
  if (!validNameRegex.test(trimmedName)) {
    return {
      valid: false,
      message: '昵称只能包含中文、字母、数字和下划线',
    }
  }

  return { valid: true }
}

/**
 * 手机号验证（中国大陆）
 * @param phone - 手机号
 * @returns 验证结果
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { valid: false, message: '请输入手机号码' }
  }

  const isValid = VALIDATION.PHONE_REGEX.test(phone)
  return {
    valid: isValid,
    message: isValid ? undefined : '请输入有效的手机号码',
  }
}

/**
 * 长度范围验证
 * @param value - 待验证的值
 * @param min - 最小长度
 * @param max - 最大长度
 * @param fieldName - 字段名称
 * @returns 验证结果
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName = '内容'
): ValidationResult {
  const length = value?.length || 0

  if (length < min) {
    return {
      valid: false,
      message: `${fieldName}至少需要 ${min} 个字符`,
    }
  }

  if (length > max) {
    return {
      valid: false,
      message: `${fieldName}最多 ${max} 个字符`,
    }
  }

  return { valid: true }
}

/**
 * URL 格式验证
 * @param url - URL 地址
 * @returns 验证结果
 */
export function validateUrl(url: string): ValidationResult {
  if (!url) {
    return { valid: false, message: '请输入 URL 地址' }
  }

  try {
    new URL(url)
    return { valid: true }
  } catch {
    return { valid: false, message: '请输入有效的 URL 地址' }
  }
}

/**
 * 数字范围验证
 * @param value - 待验证的值
 * @param min - 最小值
 * @param max - 最大值
 * @param fieldName - 字段名称
 * @returns 验证结果
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName = '数值'
): ValidationResult {
  if (typeof value !== 'number' || isNaN(value)) {
    return { valid: false, message: `请输入有效的${fieldName}` }
  }

  if (value < min) {
    return {
      valid: false,
      message: `${fieldName}不能小于 ${min}`,
    }
  }

  if (value > max) {
    return {
      valid: false,
      message: `${fieldName}不能大于 ${max}`,
    }
  }

  return { valid: true }
}

/**
 * 自定义正则验证
 * @param value - 待验证的值
 * @param regex - 正则表达式
 * @param message - 错误消息
 * @returns 验证结果
 */
export function validatePattern(
  value: string,
  regex: RegExp,
  message = '格式不正确'
): ValidationResult {
  const isValid = regex.test(value)
  return {
    valid: isValid,
    message: isValid ? undefined : message,
  }
}

/**
 * 组合多个验证器
 * @param validators - 验证器数组
 * @returns 组合后的验证函数
 */
export function composeValidators(
  ...validators: ValidatorFunction[]
): ValidatorFunction {
  return (value: any) => {
    for (const validator of validators) {
      const result = validator(value)
      if (!result.valid) {
        return result
      }
    }
    return { valid: true }
  }
}

/**
 * 预定义的验证规则集合
 */
export const validationRules = {
  email: validateEmail,
  password: validatePassword,
  passwordConfirm: validatePasswordConfirm,
  name: validateName,
  phone: validatePhone,
  url: validateUrl,
  required,
  length: validateLength,
  range: validateRange,
  pattern: validatePattern,
  compose: composeValidators,
}
