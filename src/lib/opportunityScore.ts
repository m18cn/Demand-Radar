import type { RequirementScores } from '@/types/requirement'

export const MAX_SCORE = 5
export const MAX_TOTAL = MAX_SCORE * 5

/**
 * 每个维度 1~5，总分 25。
 * opportunityScore = round((sum / 25) * 100)
 */
export function computeOpportunityScore(scores: RequirementScores): number {
  const total =
    scores.frequency +
    scores.pain +
    scores.willingnessToPay +
    scores.marketDemand +
    scores.feasibility
  return Math.round((total / MAX_TOTAL) * 100)
}
