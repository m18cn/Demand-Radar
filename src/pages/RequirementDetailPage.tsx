import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/requirements/StatusBadge'
import { OpportunityScoreBadge } from '@/components/requirements/OpportunityScoreBadge'
import { RequirementFormDialog } from '@/components/requirements/RequirementFormDialog'
import { DeleteRequirementDialog } from '@/components/requirements/DeleteRequirementDialog'
import { ScoreEditor } from '@/components/requirements/ScoreEditor'
import { SOURCE_LABELS, STATUS_LABELS } from '@/lib/constants'
import { formatDateTime } from '@/lib/format'
import { scoreTone, SCORE_TONE_BAR } from '@/lib/scoreTone'
import { cn } from '@/lib/utils'
import { useRequirementStore } from '@/store/requirementStore'
import { REQUIREMENT_STATUSES } from '@/types/requirement'
import type { RequirementStatus } from '@/types/requirement'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">{children}</CardContent>
    </Card>
  )
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}

export function RequirementDetailPage() {
  const { id } = useParams<{ id: string }>()
  const requirements = useRequirementStore((s) => s.requirements)
  const setStatus = useRequirementStore((s) => s.setStatus)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const requirement = requirements.find((r) => r.id === id)

  if (!requirement) {
    return (
      <div className="flex flex-col items-start gap-4">
        <Link
          to="/requirements"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回需求池
        </Link>
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          找不到这条需求，它可能已被删除。
        </div>
      </div>
    )
  }

  const tone = scoreTone(requirement.opportunityScore)

  return (
    <div>
      <Link
        to="/requirements"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        返回需求池
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={requirement.status} />
            <OpportunityScoreBadge score={requirement.opportunityScore} />
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            {requirement.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil />
            编辑
          </Button>
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 />
            删除
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="描述">
            {requirement.description ? (
              <p className="whitespace-pre-wrap leading-relaxed">
                {requirement.description}
              </p>
            ) : (
              <Empty>暂无描述</Empty>
            )}
          </Section>

          <div className="grid gap-6 sm:grid-cols-2">
            <Section title="目标用户">
              {requirement.targetUser ? (
                <p>{requirement.targetUser}</p>
              ) : (
                <Empty>暂无</Empty>
              )}
            </Section>
            <Section title="使用场景">
              {requirement.scenario ? (
                <p className="whitespace-pre-wrap">{requirement.scenario}</p>
              ) : (
                <Empty>暂无</Empty>
              )}
            </Section>
          </div>

          <Section title="痛点">
            {requirement.painPoints.length > 0 ? (
              <ul className="space-y-2">
                {requirement.painPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>暂无痛点记录</Empty>
            )}
          </Section>

          <div className="grid gap-6 sm:grid-cols-2">
            <Section title="当前解决方案">
              {requirement.currentSolution ? (
                <p className="whitespace-pre-wrap">
                  {requirement.currentSolution}
                </p>
              ) : (
                <Empty>暂无</Empty>
              )}
            </Section>
            <Section title="竞品">
              {requirement.competitors.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {requirement.competitors.map((competitor) => (
                    <Badge key={competitor} variant="secondary">
                      {competitor}
                    </Badge>
                  ))}
                </div>
              ) : (
                <Empty>暂无竞品记录</Empty>
              )}
            </Section>
          </div>
        </div>

        <div className="space-y-6">
          <Section title="概览">
            <div className="space-y-4">
              <div>
                <p className="mb-1.5 text-xs text-muted-foreground">状态</p>
                <Select
                  value={requirement.status}
                  onValueChange={(v) =>
                    void setStatus(requirement.id, v as RequirementStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUIREMENT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="mb-1.5 text-xs text-muted-foreground">
                  Opportunity Score
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-semibold tabular-nums">
                    {requirement.opportunityScore}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn('h-full rounded-full', SCORE_TONE_BAR[tone])}
                      style={{ width: `${requirement.opportunityScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">发现时间</span>
                  <span>{formatDateTime(requirement.discoveredAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">更新时间</span>
                  <span>{formatDateTime(requirement.updatedAt)}</span>
                </div>
              </div>
            </div>
          </Section>

          <Section title="评分">
            <ScoreEditor requirement={requirement} />
          </Section>

          <Section title="来源">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">类型</span>
                <span>{SOURCE_LABELS[requirement.source.type]}</span>
              </div>
              {requirement.source.url && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">链接</span>
                  <a
                    href={requirement.source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex max-w-[60%] items-center gap-1 truncate text-foreground hover:underline"
                  >
                    <span className="truncate">{requirement.source.url}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
              )}
              {requirement.source.note && (
                <p className="text-muted-foreground">
                  备注：{requirement.source.note}
                </p>
              )}
            </div>
          </Section>

          <Section title="标签">
            {requirement.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {requirement.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <Empty>暂无标签</Empty>
            )}
          </Section>
        </div>
      </div>

      <RequirementFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        requirement={requirement}
      />
      <DeleteRequirementDialog
        requirement={requirement}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  )
}
