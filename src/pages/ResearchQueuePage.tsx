import { useMemo } from 'react'
import { FlaskConical } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { QuickAddRequirement } from '@/components/requirements/QuickAddRequirement'
import { RequirementListItem } from '@/components/requirements/RequirementListItem'
import { useRequirementStore } from '@/store/requirementStore'
import { researchQueue } from '@/lib/analytics'

export function ResearchQueuePage() {
  const requirements = useRequirementStore((s) => s.requirements)
  const queue = useMemo(() => researchQueue(requirements), [requirements])

  return (
    <div>
      <PageHeader
        title="Research Queue"
        description="Inbox 与 Researching 中的需求，按机会分数从高到低排序，从分数最高的开始研究。"
        actions={<QuickAddRequirement />}
      />

      {queue.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-20 text-center">
          <FlaskConical className="h-10 w-10 text-muted-foreground/50" />
          <div>
            <p className="text-sm font-medium">研究队列是空的</p>
            <p className="mt-1 text-sm text-muted-foreground">
              所有需求都已研究完毕，去发现新的信号吧。
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <div className="divide-y">
            {queue.map((requirement, index) => (
              <div key={requirement.id} className="px-3 py-1">
                <RequirementListItem
                  requirement={requirement}
                  rank={index + 1}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
