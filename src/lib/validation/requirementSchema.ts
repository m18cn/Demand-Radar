import { z } from 'zod'
import {
  REQUIREMENT_STATUSES,
  SOURCE_TYPES,
  type Requirement,
} from '@/types/requirement'

const scoreSchema = z.object({
  frequency: z.number().int().min(1).max(5),
  pain: z.number().int().min(1).max(5),
  willingnessToPay: z.number().int().min(1).max(5),
  marketDemand: z.number().int().min(1).max(5),
  feasibility: z.number().int().min(1).max(5),
})

export const requirementSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  targetUser: z.string(),
  scenario: z.string(),
  painPoints: z.array(z.string()),
  currentSolution: z.string().optional(),
  competitors: z.array(z.string()),
  source: z.object({
    type: z.enum(SOURCE_TYPES),
    url: z.string().optional(),
    note: z.string().optional(),
  }),
  tags: z.array(z.string()),
  status: z.enum(REQUIREMENT_STATUSES),
  scores: scoreSchema,
  opportunityScore: z.number().int().min(0).max(100),
  discoveredAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const requirementArraySchema = z.array(requirementSchema)

/** 导入用：opportunityScore 可为空，由上层重算。 */
export const importRequirementSchema = requirementSchema.extend({
  opportunityScore: z.number().int().min(0).max(100).optional(),
})

export type RequirementSchema = z.infer<typeof requirementSchema>

/** 校验并规整一条需求（重新计算 opportunityScore 保证一致）。 */
export function validateRequirement(value: unknown): Requirement | null {
  const parsed = requirementSchema.safeParse(value)
  return parsed.success ? parsed.data : null
}
