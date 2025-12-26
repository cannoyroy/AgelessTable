/**
 * @file 全局常量配置
 * @description 定义应用程序中使用的所有常量
 */

/**
 * LocalStorage 存储键名
 */
export const STORAGE_KEYS = {
  /** 认证信息 */
  AUTH: 'ageless.auth.v1',
  /** 用户列表 */
  USERS: 'ageless.users.v1',
  /** 扫描历史 */
  HISTORY: 'ageless-table-history',
  /** 收藏列表 */
  FAVORITES: 'ageless-table-favorites',
  /** 健康偏好 */
  HEALTH_PREFERENCES: 'ageless-table-health-preferences',
  /** 应用设置 */
  APP_SETTINGS: 'ageless-table-settings',
  /** 操作日志 */
  OPERATION_LOGS: 'ageless-table-operation-logs',
} as const

/**
 * 文件上传限制
 */
export const FILE_UPLOAD = {
  /** 最大文件大小（字节） */
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  /** 允许的图片类型 */
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  /** 允许的文件扩展名 */
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
} as const

/**
 * 验证规则常量
 */
export const VALIDATION = {
  /** 邮箱正则表达式 */
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  /** 密码最小长度 */
  PASSWORD_MIN_LENGTH: 6,
  /** 密码最大长度 */
  PASSWORD_MAX_LENGTH: 32,
  /** 昵称最小长度 */
  NAME_MIN_LENGTH: 2,
  /** 昵称最大长度 */
  NAME_MAX_LENGTH: 20,
  /** 手机号正则表达式（中国大陆） */
  PHONE_REGEX: /^1[3-9]\d{9}$/,
} as const

/**
 * Toast 通知配置
 */
export const TOAST = {
  /** 默认显示时长（毫秒） */
  DEFAULT_DURATION: 3000,
  /** 成功消息显示时长 */
  SUCCESS_DURATION: 3000,
  /** 错误消息显示时长 */
  ERROR_DURATION: 4000,
  /** 警告消息显示时长 */
  WARNING_DURATION: 3500,
  /** 信息消息显示时长 */
  INFO_DURATION: 3000,
} as const

/**
 * 数据限制
 */
export const LIMITS = {
  /** 最大历史记录数 */
  MAX_HISTORY: 50,
  /** 最大错误日志数 */
  MAX_ERROR_LOGS: 100,
  /** 最大操作日志数 */
  MAX_OPERATION_LOGS: 200,
  /** 最大收藏数 */
  MAX_FAVORITES: 100,
} as const

/**
 * 动画配置
 */
export const ANIMATION = {
  /** 扫描动画时长（毫秒） */
  SCAN_DURATION: 2000,
  /** 页面过渡时长（毫秒） */
  PAGE_TRANSITION: 300,
  /** Toast 淡入淡出时长 */
  TOAST_TRANSITION: 200,
  /** 震动反馈时长（毫秒） */
  VIBRATE_DURATION: 30,
} as const

/**
 * API 配置（预留）
 */
export const API = {
  /** API 基础 URL */
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  /** 请求超时时间（毫秒） */
  TIMEOUT: 10000,
  /** 重试次数 */
  RETRY_COUNT: 3,
} as const

/**
 * 路由路径
 */
export const ROUTES = {
  SCAN: '/scan',
  INSIGHT: '/insight',
  LAB: '/lab',
  PROFILE: '/profile',
  AUTH: '/auth',
  SETTINGS: '/settings',
  HELP: '/help',
  LOGS: '/logs',
} as const

/**
 * 应用元数据
 */
export const APP_META = {
  /** 应用名称 */
  NAME: '逆龄餐桌',
  /** 应用英文名称 */
  NAME_EN: 'Ageless Table',
  /** 版本号 */
  VERSION: '1.0.0',
  /** 作者 */
  AUTHOR: 'Ageless Table Team',
  /** 描述 */
  DESCRIPTION: 'Knowledge-graph + multi-agent anti-aging nutrition analysis engine',
} as const

/**
 * 健康档案配置
 */
export const HEALTH_PROFILES = {
  NONE: 'none',
  DIABETES: 'diabetes',
  INFLAMMATION: 'inflammation',
  WEIGHT_LOSS: 'weight-loss',
  HEART_HEALTH: 'heart-health',
  GUT_HEALTH: 'gut-health',
} as const

/**
 * 分数评级阈值
 */
export const SCORE_THRESHOLDS = {
  /** 优秀 */
  EXCELLENT: 80,
  /** 良好 */
  GOOD: 60,
  /** 一般 */
  FAIR: 40,
  /** 较差 */
  POOR: 0,
} as const

/**
 * 通路等级
 */
export const PATHWAY_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  OPTIMAL: 'Optimal',
  RISK: 'Risk',
} as const
