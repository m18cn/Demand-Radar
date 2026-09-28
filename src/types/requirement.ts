export const REQUIREMENT_STATUSES = [
  'inbox',
  'researching',
  'validated',
  'mvp',
  'rejected',
] as const

export type RequirementStatus = (typeof REQUIREMENT_STATUSES)[number]

export const SOURCE_TYPES = [
  'xiaohongshu',
  'zhihu',
  'bilibili',
  'github',
  'reddit',
  'job',
  'ecommerce',
  'app',
  'wechat',
  'other',
] as const

export type SourceType = (typeof SOURCE_TYPES)[number]

export interface RequirementSource {
  type: SourceType
  url?: string
  note?: string
}

export interface RequirementScores {
  frequency: number
  pain: number
  willingnessToPay: number
  marketDemand: number
  feasibility: number
}

export const SCORE_KEYS = [
  'frequency',
  'pain',
  'willingnessToPay',
  'marketDemand',
  'feasibility',
] as const

export type ScoreKey = keyof RequirementScores

export interface Requirement {
  id: string
  title: string
  description: string
  targetUser: string
  scenario: string
  painPoints: string[]
  currentSolution?: string
  competitors: string[]
  source: RequirementSource
  tags: string[]
  status: RequirementStatus
  scores: RequirementScores
  opportunityScore: number
  discoveredAt: string
  createdAt: string
  updatedAt: string
}
