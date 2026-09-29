import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Radar } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { QuickAddRequirement } from '@/components/requirements/QuickAddRequirement'
import { RequirementCard } from '@/components/requirements/RequirementCard'
import { RequirementFormDialog } from '@/components/requirements/RequirementFormDialog'
import { DeleteRequirementDialog } from '@/components/requirements/DeleteRequirementDialog'
import { RequirementsFilterBar } from '@/components/requirements/RequirementsFilterBar'
import { useRequirementStore } from '@/store/requirementStore'
import {
  DEFAULT_FILTERS,
  collectTags,
  filterRequirements,
  type RequirementFilters,
} from '@/lib/filter'
import { REQUIREMENT_STATUSES, type Requirement } from '@/types/requirement'

export function RequirementsPage() {
  const requirements = useRequirementStore((s) => s.requirements)
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<RequirementFilters>(() => {
    const statusParam = searchParams.get('status')
    const status = REQUIREMENT_STATUSES.find((s) => s === statusParam)
    return { ...DEFAULT_FILTERS, status: status ?? 'all' }
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Requirement | null>(null)
  const [deleting, setDeleting] = useState<Requirement | null>(null)

  const allTags = useMemo(() => collectTags(requirements), [requirements])
  const filtered = useMemo(
    () => filterRequirements(requirements, filters),
    [requirements, filters],
  )

  return (
    <div>
      <PageHeader
        title="Requirements"
        description={`需求池 · 共 ${requirements.length} 条`}
        actions={
          <>
            <QuickAddRequirement />
            <Button variant="outline" onClick={() => setCreateOpen(true)}>
              <Plus />
              新建需求
            </Button>
          </>
        }
      />

      <RequirementsFilterBar
        filters={filters}
        onChange={setFilters}
        allTags={allTags}
      />

      {requirements.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-20 text-center">
          <Radar className="h-10 w-10 text-muted-foreground/50" />
          <div>
            <p className="text-sm font-medium">需求池为空</p>
            <p className="mt-1 text-sm text-muted-foreground">你可以：</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>记录用户反馈</li>
              <li>保存社区讨论</li>
              <li>添加市场信号</li>
            </ul>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus />
            创建需求
          </Button>
        </div>
      ) : (
        <>
          <p className="mb-3 text-xs text-muted-foreground">
            显示 {filtered.length} / {requirements.length} 条
          </p>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
              没有符合筛选条件的需求。
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((requirement) => (
                <RequirementCard
                  key={requirement.id}
                  requirement={requirement}
                  onEdit={setEditing}
                  onDelete={setDeleting}
                />
              ))}
            </div>
          )}
        </>
      )}

      <RequirementFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      <RequirementFormDialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
        requirement={editing}
      />
      <DeleteRequirementDialog
        requirement={deleting}
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
      />
    </div>
  )
}
