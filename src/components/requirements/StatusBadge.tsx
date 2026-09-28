import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { RequirementStatus } from '@/types/requirement'

const STATUS_CLASSES: Record<RequirementStatus, string> = {
  inbox:
    'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300',
  researching:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
  validated:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  mvp: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300',
  rejected:
    'border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400',
}

export function StatusBadge({
  status,
  className,
}: {
  status: RequirementStatus
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn('border', STATUS_CLASSES[status], className)}
    >
      {STATUS_LABELS[status]}
    </Badge>
  )
}
