import type { RequirementStatus, ScoreKey, SourceType } from '@/types/requirement'

export const STATUS_LABELS: Record<RequirementStatus, string> = {
  inbox: 'Inbox',
  researching: 'Researching',
  validated: 'Validated',
  mvp: 'MVP',
  rejected: 'Rejected',
}

export const STATUS_ORDER: RequirementStatus[] = [
  'inbox',
  'researching',
  'validated',
  'mvp',
  'rejected',
]

export const SOURCE_LABELS: Record<SourceType, string> = {
  xiaohongshu: '小红书',
  zhihu: '知乎',
  bilibili: 'B 站',
  github: 'GitHub',
  reddit: 'Reddit',
  job: '工作',
  ecommerce: '电商',
  app: 'App',
  wechat: '微信',
  other: '其他',
}

export const SCORE_LABELS: Record<ScoreKey, string> = {
  frequency: '出现频率',
  pain: '痛点强度',
  willingnessToPay: '付费意愿',
  marketDemand: '市场需求',
  feasibility: '可实现性',
}

export const SCORE_DESCRIPTIONS: Record<ScoreKey, string> = {
  frequency: '这个需求被提及的频率有多高？',
  pain: '用户当前的痛点有多痛？',
  willingnessToPay: '用户愿意为解决方案付多少钱？',
  marketDemand: '潜在市场规模与需求有多大？',
  feasibility: '以你的能力实现起来有多容易？',
}
