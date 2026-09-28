import { useMemo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  Inbox,
  Radar,
  Rocket,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/PageHeader'
import { QuickAddRequirement } from '@/components/requirements/QuickAddRequirement'
import { RequirementListItem } from '@/components/requirements/RequirementListItem'
import { useRequirementStore } from '@/store/requirementStore'
import {
  countByStatus,
  recentRequirements,
  researchQueue,
  topOpportunities,
} from '@/lib/analytics'
import type { LucideIcon } from 'lucide-react'

function StatCard({
  label,
  value,
  to,
  icon: Icon,
}: {
  label: string
  value: number
  to: string
  icon: LucideIcon
}) {
  return (
    <Link to={to} className="group">
      <Card className="transition-colors group-hover:border-primary/40 group-hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{label}</span>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="space-y-1">{children}</CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const requirements = useRequirementStore((s) => s.requirements)

  const counts = useMemo(() => countByStatus(requirements), [requirements])
  const recent = useMemo(
    () => recentRequirements(requirements, 5),
    [requirements],
  )
  const top = useMemo(() => topOpportunities(requirements, 5), [requirements])
  const queue = useMemo(
    () => researchQueue(requirements).slice(0, 6),
    [requirements],
  )

  const stats = [
    { label: '总需求', value: counts.total, to: '/requirements', icon: Radar },
    { label: 'Inbox', value: counts.inbox, to: '/requirements?status=inbox', icon: Inbox },
    { label: 'Researching', value: counts.researching, to: '/requirements?status=researching', icon: FlaskConical },
    { label: 'Validated', value: counts.validated, to: '/requirements?status=validated', icon: CheckCircle2 },
    { label: 'MVP', value: counts.mvp, to: '/requirements?status=mvp', icon: Rocket },
  ]

  if (requirements.length === 0) {
    return (
      <div>
        <PageHeader title="Dashboard" description="你的个人产品需求雷达" />
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-24 text-center">
          <Radar className="h-10 w-10 text-muted-foreground/50" />
          <div>
            <p className="text-sm font-medium">还没有任何需求</p>
            <p className="mt-1 text-sm text-muted-foreground">
              从快速记录一个需求信号开始。
            </p>
          </div>
          <QuickAddRequirement />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="今天应该研究哪些需求？"
        actions={<QuickAddRequirement />}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="接下来研究什么"
          action={
            <Link
              to="/research"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              全部
              <ArrowRight className="h-3 w-3" />
            </Link>
          }
        >
          {queue.length === 0 ? (
            <p className="px-2 py-4 text-sm text-muted-foreground">
              没有待研究的需求。去发现新的信号吧。
            </p>
          ) : (
            queue.map((requirement, index) => (
              <RequirementListItem
                key={requirement.id}
                requirement={requirement}
                rank={index + 1}
              />
            ))
          )}
        </SectionCard>

        <div className="lg:col-span-2 space-y-6">
          <SectionCard
            title="高机会需求"
            action={
              <Link
                to="/insights"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                洞察
                <ArrowRight className="h-3 w-3" />
              </Link>
            }
          >
            {top.map((requirement) => (
              <RequirementListItem key={requirement.id} requirement={requirement} />
            ))}
          </SectionCard>

          <SectionCard title="最近更新">
            {recent.map((requirement) => (
              <RequirementListItem key={requirement.id} requirement={requirement} />
            ))}
          </SectionCard>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between rounded-lg border bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground">
          发现新信号？快速记录，别让灵感流失。
        </p>
        <Button variant="outline" asChild>
          <Link to="/requirements">
            <Zap />
            打开需求池
          </Link>
        </Button>
      </div>
    </div>
  )
}
