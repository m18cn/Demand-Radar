import { z } from 'zod'
import { REQUIREMENT_STATUSES, SOURCE_TYPES } from '@/types/requirement'

export const quickAddSchema = z.object({
  title: z.string().trim().min(1, '请输入需求标题'),
  targetUser: z.string().trim(),
  source: z.enum(SOURCE_TYPES),
  url: z.string().trim(),
  note: z.string().trim(),
})

export type QuickAddValues = z.infer<typeof quickAddSchema>

export const requirementFormSchema = z.object({
  title: z.string().trim().min(1, '请输入需求标题'),
  status: z.enum(REQUIREMENT_STATUSES),
  targetUser: z.string().trim(),
  scenario: z.string().trim(),
  description: z.string().trim(),
  painPoints: z.array(z.string().trim().min(1)),
  currentSolution: z.string().trim(),
  competitors: z.array(z.string().trim().min(1)),
  sourceType: z.enum(SOURCE_TYPES),
  sourceUrl: z.string().trim(),
  sourceNote: z.string().trim(),
  tags: z.array(z.string().trim().min(1)),
  discoveredAt: z.string().trim(),
})

export type RequirementFormValues = z.infer<typeof requirementFormSchema>
