import { useMemo, type ReactNode } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Radar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/PageHeader'
import { RequirementListItem } from '@/components/requirements/RequirementListItem'
import { useRequirementStore } from '@/store/requirementStore'
import {
  sourceDistribution,
  statusDistribution,
  tagDistribution,
  targetUserDistribution,
  topOpportunities,
} from '@/lib/analytics'
import { SOURCE_LABELS, STATUS_LABELS } from '@/lib/constants'
import type {
  RequirementStatus,
  SourceType,
} from '@/types/requirement'

const STATUS_COLORS: Record<RequirementStatus, string> = {
  inbox: '#3b82f6',
  researching: '#f59e0b',
  validated: '#10b981',
  mvp: '#8b5cf6',
  rejected: '#a1a1aa',
}

const PALETTE = [
  '#6366f1',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#8b5cf6',
  '#ec4899',
  '#84cc16',
  '#f97316',
  '#64748b',
]

const TOOLTIP_PROPS = {
  contentStyle: {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '8px',
    fontSize: '12px',
  },
  labelStyle: { color: 'hsl(var(--foreground))' },
  itemStyle: { color: 'hsl(var(--foreground))' },
}

interface DonutDatum {
  label: string
  value: number
  color: string
}

interface BarDatum {
  label: string
  value: number
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max)}…` : value
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function DonutChart({ data }: { data: DonutDatum[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="h-[220px] w-full sm:w-1/2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip {...TOOLTIP_PROPS} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex w-full flex-col gap-1.5 sm:w-1/2">
        {data.map((entry) => (
          <div key={entry.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="min-w-0 flex-1 truncate">{entry.label}</span>
            <span className="tabular-nums text-muted-foreground">
              {entry.value}
            </span>
            <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
              {total ? Math.round((entry.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HorizontalBarChart({
  data,
  color,
}: {
  data: BarDatum[]
  color: string
}) {
  const height = Math.max(160, data.length * 34)
  return (
    <div className="text-muted-foreground">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={130}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: 'currentColor' }}
          />
          <Tooltip
            {...TOOLTIP_PROPS}
            cursor={{ fill: 'hsl(var(--muted))' }}
          />
          <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function InsightsPage() {
  const requirements = useRequirementStore((s) => s.requirements)

  const statusData = useMemo<DonutDatum[]>(
    () =>
      statusDistribution(requirements)
        .filter((entry) => entry.count > 0)
        .map((entry) => ({
          label: STATUS_LABELS[entry.key as RequirementStatus],
          value: entry.count,
          color: STATUS_COLORS[entry.key as RequirementStatus],
        })),
    [requirements],
  )

  const sourceData = useMemo<DonutDatum[]>(
    () =>
      sourceDistribution(requirements).map((entry, index) => ({
        label: SOURCE_LABELS[entry.key as SourceType],
        value: entry.count,
        color: PALETTE[index % PALETTE.length],
      })),
    [requirements],
  )

  const tagData = useMemo<BarDatum[]>(
    () =>
      tagDistribution(requirements, 10).map((entry) => ({
        label: truncate(entry.key, 18),
        value: entry.count,
      })),
    [requirements],
  )

  const userData = useMemo<BarDatum[]>(
    () =>
      targetUserDistribution(requirements, 10).map((entry) => ({
        label: truncate(entry.key, 14),
        value: entry.count,
      })),
    [requirements],
  )

  const top = useMemo(
    () => topOpportunities(requirements, 5),
    [requirements],
  )

  if (requirements.length === 0) {
    return (
      <div>
        <PageHeader title="Insights" description="基于需求池的分布洞察" />
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-24 text-center">
          <Radar className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            记录需求后，这里会展示来源、状态、标签与用户类型的分布。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Insights"
        description="基于需求池的分布与机会洞察"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="状态分布">
          <DonutChart data={statusData} />
        </ChartCard>
        <ChartCard title="来源分布">
          <DonutChart data={sourceData} />
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="标签分布（Top 10）">
          {tagData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              暂无标签
            </p>
          ) : (
            <HorizontalBarChart data={tagData} color="#6366f1" />
          )}
        </ChartCard>
        <ChartCard title="用户类型分布（Top 10）">
          {userData.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              暂无目标用户数据
            </p>
          ) : (
            <HorizontalBarChart data={userData} color="#10b981" />
          )}
        </ChartCard>
      </div>

      <div className="mt-6">
        <ChartCard title="高机会需求">
          <div className="space-y-1">
            {top.map((requirement) => (
              <RequirementListItem
                key={requirement.id}
                requirement={requirement}
              />
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
