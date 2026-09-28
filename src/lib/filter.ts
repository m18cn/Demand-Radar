import type {
  Requirement,
  RequirementStatus,
  SourceType,
} from '@/types/requirement'

export type SortField = 'updatedAt' | 'opportunityScore' | 'discoveredAt'
export type SortDirection = 'asc' | 'desc'

export interface RequirementFilters {
  search: string
  status: RequirementStatus | 'all'
  source: SourceType | 'all'
  tags: string[]
  minScore: number
  sort: SortField
  sortDir: SortDirection
}

export const DEFAULT_FILTERS: RequirementFilters = {
  search: '',
  status: 'all',
  source: 'all',
  tags: [],
  minScore: 0,
  sort: 'updatedAt',
  sortDir: 'desc',
}

export function sortRequirements(
  items: Requirement[],
  field: SortField,
  dir: SortDirection,
): Requirement[] {
  return [...items].sort((a, b) => {
    const cmp =
      field === 'opportunityScore'
        ? a.opportunityScore - b.opportunityScore
        : a[field].localeCompare(b[field])
    return dir === 'desc' ? -cmp : cmp
  })
}

export function filterRequirements(
  items: Requirement[],
  filters: RequirementFilters,
): Requirement[] {
  const query = filters.search.trim().toLowerCase()

  const filtered = items.filter((requirement) => {
    if (filters.status !== 'all' && requirement.status !== filters.status) {
      return false
    }
    if (filters.source !== 'all' && requirement.source.type !== filters.source) {
      return false
    }
    if (
      filters.tags.length > 0 &&
      !filters.tags.some((tag) => requirement.tags.includes(tag))
    ) {
      return false
    }
    if (
      filters.minScore > 0 &&
      requirement.opportunityScore < filters.minScore
    ) {
      return false
    }
    if (query) {
      const haystack = [
        requirement.title,
        requirement.description,
        requirement.targetUser,
        requirement.scenario,
        requirement.source.note ?? '',
        ...requirement.tags,
        ...requirement.painPoints,
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })

  return sortRequirements(filtered, filters.sort, filters.sortDir)
}

export function collectTags(items: Requirement[]): string[] {
  const set = new Set<string>()
  items.forEach((requirement) =>
    requirement.tags.forEach((tag) => set.add(tag)),
  )
  return [...set].sort((a, b) => a.localeCompare(b))
}

export function isFilterActive(filters: RequirementFilters): boolean {
  return (
    filters.search.trim() !== '' ||
    filters.status !== 'all' ||
    filters.source !== 'all' ||
    filters.tags.length > 0 ||
    filters.minScore > 0
  )
}
