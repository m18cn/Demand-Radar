import seedData from '@/data/seed.json'
import type { Requirement } from '@/types/requirement'
import { computeOpportunityScore } from '@/lib/opportunityScore'
import { requirementArraySchema } from '@/lib/validation/requirementSchema'

/**
 * 读取示例数据（仅由用户主动加载），并保证 opportunityScore 与 scores 一致。
 */
export function loadSeedRequirements(): Requirement[] {
  const parsed = requirementArraySchema.parse(seedData)
  return parsed.map((requirement) => ({
    ...requirement,
    opportunityScore: computeOpportunityScore(requirement.scores),
  }))
}
