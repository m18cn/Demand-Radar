import {
  REQUIREMENT_STATUSES,
  SOURCE_TYPES,
  type Requirement,
  type RequirementStatus,
} from '@/types/requirement'

export interface StatusCounts {
  total: number
  inbox: number
  researching: number
  validated: number
  mvp: number
  rejected: number
}

export function countByStatus(items: Requirement[]): StatusCounts {
  const count = (status: RequirementStatus) =>
    items.filter((r) => r.status === status).length
  return {
    total: items.length,
    inbox: count('inbox'),
    researching: count('researching'),
    validated: count('validated'),
    mvp: count('mvp'),
    rejected: count('rejected'),
  }
}

export function recentRequirements(items: Requirement[], n = 5): Requirement[] {
  return [...items]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, n)
}

/** 高机会需求：排除已拒绝，按 opportunityScore 降序。 */
export function topOpportunities(items: Requirement[], n = 5): Requirement[] {
  return [...items]
    .filter((r) => r.status !== 'rejected')
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, n)
}

/** 研究队列：Inbox + Researching，按机会分数降序（优先研究）。 */
export function researchQueue(items: Requirement[]): Requirement[] {
  return [...items]
    .filter((r) => r.status === 'inbox' || r.status === 'researching')
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
}

export interface DistributionEntry {
  key: string
  count: number
}

export function statusDistribution(
  items: Requirement[],
): DistributionEntry[] {
  return REQUIREMENT_STATUSES.map((status) => ({
    key: status,
    count: items.filter((r) => r.status === status).length,
  }))
}

export function sourceDistribution(items: Requirement[]): DistributionEntry[] {
  return SOURCE_TYPES.map((type) => ({
    key: type,
    count: items.filter((r) => r.source.type === type).length,
  })).filter((entry) => entry.count > 0)
}

export function tagDistribution(
  items: Requirement[],
  limit = 10,
): DistributionEntry[] {
  const map = new Map<string, number>()
  items.forEach((r) =>
    r.tags.forEach((tag) => map.set(tag, (map.get(tag) ?? 0) + 1)),
  )
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function targetUserDistribution(
  items: Requirement[],
  limit = 10,
): DistributionEntry[] {
  const map = new Map<string, number>()
  items.forEach((r) => {
    const key = r.targetUser.trim()
    if (key) map.set(key, (map.get(key) ?? 0) + 1)
  })
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
