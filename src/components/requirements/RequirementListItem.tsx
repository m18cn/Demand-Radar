import { Link } from 'react-router-dom'
import type { Requirement } from '@/types/requirement'
import { StatusBadge } from './StatusBadge'
import { OpportunityScoreBadge } from './OpportunityScoreBadge'

interface RequirementListItemProps {
  requirement: Requirement
  rank?: number
}

export function RequirementListItem({
  requirement,
  rank,
}: RequirementListItemProps) {
  return (
    <Link
      to={`/requirements/${requirement.id}`}
      className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-accent"
    >
      {rank !== undefined && (
        <span className="w-5 shrink-0 text-center text-xs font-semibold tabular-nums text-muted-foreground">
          {rank}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{requirement.title}</p>
        {requirement.targetUser && (
          <p className="truncate text-xs text-muted-foreground">
            {requirement.targetUser}
          </p>
        )}
      </div>
      <StatusBadge status={requirement.status} />
      <OpportunityScoreBadge score={requirement.opportunityScore} />
    </Link>
  )
}
