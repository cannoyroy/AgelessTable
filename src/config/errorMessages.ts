/**
 * @file 错误消息配置
 * @description 集中管理所有错误提示消息
 */

/**
 * 验证错误消息
 */
export const VALIDATION_ERRORS = {
  // 邮箱相关
  EMAIL_REQUIRED: '请输入邮箱地址',
  EMAIL_INVALID: '请输入有效的邮箱地址',
  EMAIL_EXISTS: '该邮箱已被注册，请直接登录',

  // 密码相关
  PASSWORD_REQUIRED: '请输入密码',
  PASSWORD_TOO_SHORT: '密码至少需要 6 位字符',
  PASSWORD_TOO_LONG: '密码最多 32 位字符',
  PASSWORD_WEAK: '密码强度不足，建议包含数字和字母',
  PASSWORD_MISMATCH: '两次输入的密码不一致',

  // 昵称相关
  NAME_REQUIRED: '请输入昵称',
  NAME_TOO_SHORT: '昵称至少需要 2 个字符',
  NAME_TOO_LONG: '昵称最多 20 个字符',
  NAME_INVALID: '昵称只能包含中文、字母、数字和下划线',

  // 手机号相关
  PHONE_REQUIRED: '请输入手机号码',
  PHONE_INVALID: '请输入有效的手机号码',

  // 通用验证
  REQUIRED: '此项为必填项',
  INVALID_FORMAT: '格式不正确',
  TOO_SHORT: '内容过短',
  TOO_LONG: '内容过长',
} as const

/**
 * 认证错误消息
 */
export const AUTH_ERRORS = {
  LOGIN_FAILED: '邮箱或密码不正确',
  REGISTER_FAILED: '注册失败，请稍后重试',
  LOGOUT_FAILED: '退出登录失败',
  SESSION_EXPIRED: '登录已过期，请重新登录',
  UNAUTHORIZED: '无权访问，请先登录',
  TOKEN_INVALID: '登录凭证无效',
} as const

/**
 * 网络错误消息
 */
export const NETWORK_ERRORS = {
  CONNECTION_FAILED: '网络连接失败，请检查网络后重试',
  TIMEOUT: '请求超时，请稍后重试',
  SERVER_ERROR: '服务器错误，请稍后重试',
  NOT_FOUND: '请求的资源不存在',
  FORBIDDEN: '没有权限访问该资源',
  BAD_REQUEST: '请求参数错误',
} as const

/**
 * 文件上传错误消息
 */
export const FILE_UPLOAD_ERRORS = {
  SIZE_EXCEEDED: '文件大小超过限制',
  TYPE_NOT_ALLOWED: '不支持该文件类型',
  UPLOAD_FAILED: '文件上传失败',
  READ_FAILED: '文件读取失败',
  INVALID_FILE: '无效的文件',
  NO_FILE_SELECTED: '请选择文件',
} as const

/**
 * 业务错误消息
 */
export const BUSINESS_ERRORS = {
  // 扫描相关
  SCAN_FAILED: '扫描失败，请重试',
  PRODUCT_NOT_FOUND: '未找到该产品信息',
  INVALID_BARCODE: '无效的条形码',

  // 历史记录
  HISTORY_LOAD_FAILED: '加载历史记录失败',
  HISTORY_SAVE_FAILED: '保存历史记录失败',
  HISTORY_DELETE_FAILED: '删除历史记录失败',

  // 收藏相关
  FAVORITE_ADD_FAILED: '添加收藏失败',
  FAVORITE_REMOVE_FAILED: '取消收藏失败',
  FAVORITE_LIMIT_EXCEEDED: '收藏数量已达上限',

  // 设置相关
  SETTINGS_LOAD_FAILED: '加载设置失败',
  SETTINGS_SAVE_FAILED: '保存设置失败',

  // 操作日志
  LOG_LOAD_FAILED: '加载日志失败',
  LOG_SAVE_FAILED: '保存日志失败',
} as const

/**
 * 通用错误消息
 */
export const GENERAL_ERRORS = {
  UNKNOWN: '发生了未知错误',
  OPERATION_FAILED: '操作失败，请重试',
  DATA_LOAD_FAILED: '数据加载失败',
  DATA_SAVE_FAILED: '数据保存失败',
  PERMISSION_DENIED: '权限不足',
  FEATURE_NOT_AVAILABLE: '该功能暂不可用',
  MAINTENANCE: '系统维护中，请稍后访问',
} as const

/**
 * 成功消息
 */
export const SUCCESS_MESSAGES = {
  // 认证相关
  LOGIN_SUCCESS: '登录成功',
  REGISTER_SUCCESS: '注册成功',
  LOGOUT_SUCCESS: '已退出登录',

  // 操作相关
  SAVE_SUCCESS: '保存成功',
  DELETE_SUCCESS: '删除成功',
  UPDATE_SUCCESS: '更新成功',
  COPY_SUCCESS: '复制成功',

  // 扫描相关
  SCAN_SUCCESS: '扫描完成',

  // 收藏相关
  FAVORITE_ADDED: '已添加到收藏',
  FAVORITE_REMOVED: '已取消收藏',

  // 设置相关
  SETTINGS_SAVED: '设置已保存',
  PREFERENCE_UPDATED: '偏好已更新',
} as const

/**
 * 警告消息
 */
export const WARNING_MESSAGES = {
  UNSAVED_CHANGES: '有未保存的更改，确定离开吗？',
  DELETE_CONFIRM: '确定要删除吗？此操作无法撤销',
  CLEAR_CONFIRM: '确定要清空吗？此操作无法撤销',
  LOGOUT_CONFIRM: '确定要退出登录吗？',
  NETWORK_UNSTABLE: '网络不稳定，部分功能可能受影响',
  STORAGE_FULL: '本地存储空间不足',
  BETA_FEATURE: '这是测试功能，可能不稳定',
} as const

/**
 * 信息提示消息
 */
export const INFO_MESSAGES = {
  LOADING: '加载中...',
  PROCESSING: '处理中...',
  UPLOADING: '上传中...',
  SYNCING: '同步中...',
  PLEASE_WAIT: '请稍候...',
  NO_DATA: '暂无数据',
  EMPTY_LIST: '列表为空',
  COMING_SOON: '敬请期待',
  DEMO_MODE: '演示模式',
} as const

/**
 * 根据错误类型获取错误消息
 * @param error - 错误对象
 * @returns 用户友好的错误消息
 */
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  return GENERAL_ERRORS.UNKNOWN
}
