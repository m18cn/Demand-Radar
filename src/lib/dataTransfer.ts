import { z } from 'zod'
import { computeOpportunityScore } from '@/lib/opportunityScore'
import { importRequirementSchema } from '@/lib/validation/requirementSchema'
import type { Requirement } from '@/types/requirement'

export type ImportResult =
  | { ok: true; data: Requirement[] }
  | { ok: false; error: string }

export function exportRequirementsToJson(requirements: Requirement[]): void {
  const json = JSON.stringify(requirements, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `demand-radar-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function parseImportedRequirements(text: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: '无法解析 JSON 文件' }
  }

  const result = z.array(importRequirementSchema).safeParse(parsed)
  if (!result.success) {
    return { ok: false, error: '文件不是有效的需求数据（字段缺失或格式错误）' }
  }

  const data: Requirement[] = result.data.map((item) => ({
    ...item,
    opportunityScore: computeOpportunityScore(item.scores),
  }))
  return { ok: true, data }
}
