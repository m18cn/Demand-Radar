import type {
  Requirement,
  RequirementScores,
  RequirementSource,
  RequirementStatus,
  SourceType,
} from '@/types/requirement'
import { computeOpportunityScore } from '@/lib/opportunityScore'

export interface RequirementDraft {
  title: string
  description?: string
  targetUser?: string
  scenario?: string
  painPoints?: string[]
  currentSolution?: string
  competitors?: string[]
  source?: RequirementSource
  tags?: string[]
  status?: RequirementStatus
  scores?: Partial<RequirementScores>
  discoveredAt?: string
}

export interface QuickAddInput {
  title: string
  targetUser: string
  source: SourceType
  url?: string
  note?: string
}

const DEFAULT_SCORES: RequirementScores = {
  frequency: 1,
  pain: 1,
  willingnessToPay: 1,
  marketDemand: 1,
  feasibility: 1,
}

export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function nowIso(): string {
  return new Date().toISOString()
}

/** 从草稿创建一条需求，自动补全默认字段。 */
export function createRequirement(input: RequirementDraft): Requirement {
  const now = nowIso()
  const scores: RequirementScores = { ...DEFAULT_SCORES, ...input.scores }
  return {
    id: createId(),
    title: input.title.trim(),
    description: input.description ?? '',
    targetUser: input.targetUser ?? '',
    scenario: input.scenario ?? '',
    painPoints: input.painPoints ?? [],
    currentSolution: input.currentSolution,
    competitors: input.competitors ?? [],
    source: input.source ?? { type: 'other' },
    tags: input.tags ?? [],
    status: input.status ?? 'inbox',
    scores,
    opportunityScore: computeOpportunityScore(scores),
    discoveredAt: input.discoveredAt ?? now,
    createdAt: now,
    updatedAt: now,
  }
}

/** 快速记录只需要最小字段，其余自动补全默认值。 */
export function createRequirementFromQuickAdd(input: QuickAddInput): Requirement {
  return createRequirement({
    title: input.title,
    targetUser: input.targetUser,
    source: {
      type: input.source,
      url: input.url?.trim() || undefined,
      note: input.note?.trim() || undefined,
    },
  })
}

/** 更新评分并重算 opportunityScore。 */
export function withScores(
  requirement: Requirement,
  scores: RequirementScores,
): Requirement {
  return {
    ...requirement,
    scores,
    opportunityScore: computeOpportunityScore(scores),
    updatedAt: nowIso(),
  }
}

/** 保证 opportunityScore 与 scores 一致（从存储读取时调用）。 */
export function normalizeRequirement(requirement: Requirement): Requirement {
  return {
    ...requirement,
    opportunityScore: computeOpportunityScore(requirement.scores),
  }
}
