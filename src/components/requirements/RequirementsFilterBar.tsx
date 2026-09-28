import { Search, Tag, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SOURCE_LABELS, STATUS_LABELS } from '@/lib/constants'
import {
  DEFAULT_FILTERS,
  type RequirementFilters,
  type SortDirection,
  type SortField,
} from '@/lib/filter'
import { cn } from '@/lib/utils'
import {
  REQUIREMENT_STATUSES,
  SOURCE_TYPES,
  type RequirementStatus,
  type SourceType,
} from '@/types/requirement'

const SCORE_OPTIONS = [
  { value: '0', label: '全部分数' },
  { value: '40', label: '≥ 40' },
  { value: '60', label: '≥ 60' },
  { value: '72', label: '≥ 72' },
  { value: '80', label: '≥ 80' },
]

const SORT_OPTIONS: { value: string; label: string; field: SortField; dir: SortDirection }[] = [
  { value: 'updatedAt:desc', label: '最近更新', field: 'updatedAt', dir: 'desc' },
  { value: 'opportunityScore:desc', label: '机会分数最高', field: 'opportunityScore', dir: 'desc' },
  { value: 'discoveredAt:desc', label: '最近发现', field: 'discoveredAt', dir: 'desc' },
  { value: 'discoveredAt:asc', label: '最早发现', field: 'discoveredAt', dir: 'asc' },
]

interface RequirementsFilterBarProps {
  filters: RequirementFilters
  onChange: (filters: RequirementFilters) => void
  allTags: string[]
}

export function RequirementsFilterBar({
  filters,
  onChange,
  allTags,
}: RequirementsFilterBarProps) {
  const set = (patch: Partial<RequirementFilters>) =>
    onChange({ ...filters, ...patch })

  const toggleTag = (tag: string) => {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag]
    set({ tags: next })
  }

  const sortValue = `${filters.sort}:${filters.sortDir}`
  const hasTagFilter = filters.tags.length > 0
  const isActive =
    filters.search ||
    filters.status !== 'all' ||
    filters.source !== 'all' ||
    hasTagFilter ||
    filters.minScore > 0

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <div className="relative min-w-[180px] flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="搜索标题、描述、用户、标签…"
          className="pl-8"
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(v) => set({ status: v as RequirementStatus | 'all' })}
      >
        <SelectTrigger className="w-[132px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部状态</SelectItem>
          {REQUIREMENT_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.source}
        onValueChange={(v) => set({ source: v as SourceType | 'all' })}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部来源</SelectItem>
          {SOURCE_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {SOURCE_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={String(filters.minScore)}
        onValueChange={(v) => set({ minScore: Number(v) })}
      >
        <SelectTrigger className="w-[116px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SCORE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={hasTagFilter ? 'secondary' : 'outline'}
            className={cn(hasTagFilter && 'font-semibold')}
          >
            <Tag />
            标签
            {hasTagFilter && (
              <span className="rounded-full bg-primary px-1.5 text-[11px] leading-4 text-primary-foreground">
                {filters.tags.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>按标签筛选</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allTags.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">暂无标签</p>
          ) : (
            allTags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={filters.tags.includes(tag)}
                onCheckedChange={() => toggleTag(tag)}
              >
                {tag}
              </DropdownMenuCheckboxItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Select
        value={sortValue}
        onValueChange={(v) => {
          const option = SORT_OPTIONS.find((o) => o.value === v)
          if (option) set({ sort: option.field, sortDir: option.dir })
        }}
      >
        <SelectTrigger className="w-[132px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="text-muted-foreground"
        >
          <X />
          清除
        </Button>
      )}
    </div>
  )
}
