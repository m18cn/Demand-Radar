import { useState, type FormEvent, type ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  SOURCE_LABELS,
  STATUS_LABELS,
} from '@/lib/constants'
import {
  requirementFormSchema,
  type RequirementFormValues,
} from '@/lib/validation/forms'
import {
  REQUIREMENT_STATUSES,
  SOURCE_TYPES,
  type Requirement,
  type RequirementSource,
} from '@/types/requirement'
import { ChipInput } from './ChipInput'

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function toFormValues(initial?: Requirement | null): RequirementFormValues {
  if (!initial) {
    return {
      title: '',
      status: 'inbox',
      targetUser: '',
      scenario: '',
      description: '',
      painPoints: [],
      currentSolution: '',
      competitors: [],
      sourceType: 'other',
      sourceUrl: '',
      sourceNote: '',
      tags: [],
      discoveredAt: new Date().toISOString().slice(0, 10),
    }
  }
  return {
    title: initial.title,
    status: initial.status,
    targetUser: initial.targetUser,
    scenario: initial.scenario,
    description: initial.description,
    painPoints: initial.painPoints,
    currentSolution: initial.currentSolution ?? '',
    competitors: initial.competitors,
    sourceType: initial.source.type,
    sourceUrl: initial.source.url ?? '',
    sourceNote: initial.source.note ?? '',
    tags: initial.tags,
    discoveredAt: initial.discoveredAt.slice(0, 10),
  }
}

export function dateInputToIso(value: string): string | undefined {
  if (!value) return undefined
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

/** 表单值 → 可写字段（source 已拼装）。 */
export function formValuesToFields(values: RequirementFormValues): {
  title: string
  status: Requirement['status']
  targetUser: string
  scenario: string
  description: string
  painPoints: string[]
  currentSolution: string | undefined
  competitors: string[]
  source: RequirementSource
  tags: string[]
} {
  return {
    title: values.title.trim(),
    status: values.status,
    targetUser: values.targetUser.trim(),
    scenario: values.scenario.trim(),
    description: values.description.trim(),
    painPoints: values.painPoints,
    currentSolution: values.currentSolution.trim() || undefined,
    competitors: values.competitors,
    source: {
      type: values.sourceType,
      url: values.sourceUrl.trim() || undefined,
      note: values.sourceNote.trim() || undefined,
    },
    tags: values.tags,
  }
}

interface RequirementFormProps {
  initial?: Requirement | null
  submitLabel: string
  onSubmit: (values: RequirementFormValues) => void | Promise<void>
  onCancel?: () => void
}

export function RequirementForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: RequirementFormProps) {
  const [values, setValues] = useState<RequirementFormValues>(() =>
    toFormValues(initial),
  )
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof RequirementFormValues>(
    key: K,
    value: RequirementFormValues[K],
  ) => {
    setValues((v) => ({ ...v, [key]: value }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const parsed = requirementFormSchema.safeParse(values)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? '请检查表单')
      return
    }
    setError(null)
    void onSubmit(parsed.data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="标题" htmlFor="title" required error={error ?? undefined}>
        <Input
          id="title"
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="一句话描述这个需求"
          autoFocus
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="状态" htmlFor="status">
          <Select
            value={values.status}
            onValueChange={(v) => set('status', v as Requirement['status'])}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              {REQUIREMENT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="目标用户" htmlFor="targetUser">
          <Input
            id="targetUser"
            value={values.targetUser}
            onChange={(e) => set('targetUser', e.target.value)}
            placeholder="例如：独立开发者、宝妈"
          />
        </Field>
      </div>

      <Field label="使用场景" htmlFor="scenario">
        <Textarea
          id="scenario"
          value={values.scenario}
          onChange={(e) => set('scenario', e.target.value)}
          placeholder="用户在什么场景下遇到这个问题？"
          rows={2}
        />
      </Field>

      <Field label="描述" htmlFor="description">
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="详细描述这个需求以及你观察到的信号"
          rows={3}
        />
      </Field>

      <Field label="痛点" htmlFor="painPoints">
        <ChipInput
          value={values.painPoints}
          onChange={(v) => set('painPoints', v)}
          placeholder="输入后回车添加痛点"
        />
      </Field>

      <Field label="当前解决方案" htmlFor="currentSolution">
        <Textarea
          id="currentSolution"
          value={values.currentSolution}
          onChange={(e) => set('currentSolution', e.target.value)}
          placeholder="用户现在是怎么解决这个问题的？"
          rows={2}
        />
      </Field>

      <Field label="竞品" htmlFor="competitors">
        <ChipInput
          value={values.competitors}
          onChange={(v) => set('competitors', v)}
          placeholder="输入后回车添加竞品"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="来源类型" htmlFor="sourceType">
          <Select
            value={values.sourceType}
            onValueChange={(v) =>
              set('sourceType', v as RequirementSource['type'])
            }
          >
            <SelectTrigger id="sourceType">
              <SelectValue placeholder="选择来源" />
            </SelectTrigger>
            <SelectContent>
              {SOURCE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {SOURCE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="发现时间" htmlFor="discoveredAt">
          <Input
            id="discoveredAt"
            type="date"
            value={values.discoveredAt}
            onChange={(e) => set('discoveredAt', e.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="来源链接" htmlFor="sourceUrl">
          <Input
            id="sourceUrl"
            value={values.sourceUrl}
            onChange={(e) => set('sourceUrl', e.target.value)}
            placeholder="https://"
          />
        </Field>

        <Field label="来源备注" htmlFor="sourceNote">
          <Input
            id="sourceNote"
            value={values.sourceNote}
            onChange={(e) => set('sourceNote', e.target.value)}
            placeholder="记录发现信号的上下文"
          />
        </Field>
      </div>

      <Field label="标签" htmlFor="tags">
        <ChipInput
          value={values.tags}
          onChange={(v) => set('tags', v)}
          placeholder="输入后回车添加标签"
        />
      </Field>

      <div className="flex justify-end gap-2 border-t pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
        )}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
