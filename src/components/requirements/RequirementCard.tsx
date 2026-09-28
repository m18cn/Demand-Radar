import { Link } from 'react-router-dom'
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SOURCE_LABELS } from '@/lib/constants'
import { formatDate } from '@/lib/format'
import type { Requirement } from '@/types/requirement'
import { StatusBadge } from './StatusBadge'
import { OpportunityScoreBadge } from './OpportunityScoreBadge'

interface RequirementCardProps {
  requirement: Requirement
  onEdit: (requirement: Requirement) => void
  onDelete: (requirement: Requirement) => void
}

export function RequirementCard({
  requirement,
  onEdit,
  onDelete,
}: RequirementCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/requirements/${requirement.id}`}
            className="min-w-0 flex-1"
          >
            <h3 className="truncate text-sm font-semibold transition-colors hover:underline">
              {requirement.title}
            </h3>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-mr-2 -mt-1 h-7 w-7 text-muted-foreground"
                aria-label="更多操作"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/requirements/${requirement.id}`}>
                  <Eye />
                  查看
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(requirement)}>
                <Pencil />
                编辑
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => onDelete(requirement)}
              >
                <Trash2 />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {requirement.description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {requirement.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={requirement.status} />
          <OpportunityScoreBadge score={requirement.opportunityScore} />
          <Badge variant="outline" className="text-muted-foreground">
            {SOURCE_LABELS[requirement.source.type]}
          </Badge>
          {requirement.targetUser && (
            <span className="text-xs text-muted-foreground">
              {requirement.targetUser}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {requirement.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
            {requirement.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{requirement.tags.length - 3}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            更新于 {formatDate(requirement.updatedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
