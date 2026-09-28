import { create } from 'zustand'
import type {
  Requirement,
  RequirementScores,
  RequirementStatus,
} from '@/types/requirement'
import { LocalStorageAdapter } from '@/lib/storage/LocalStorageAdapter'
import type { StorageAdapter } from '@/lib/storage/StorageAdapter'
import { loadSeedRequirements } from '@/lib/storage/seed'
import { isInitialized, markInitialized } from '@/lib/storage/bootstrap'
import { validateRequirement } from '@/lib/validation/requirementSchema'
import {
  createRequirement,
  createRequirementFromQuickAdd,
  normalizeRequirement,
  withScores,
  type QuickAddInput,
  type RequirementDraft,
} from '@/services/requirementService'

type StoreStatus = 'idle' | 'loading' | 'ready' | 'error'

interface RequirementStore {
  requirements: Requirement[]
  status: StoreStatus
  error: string | null

  initialize: () => Promise<void>
  addRequirement: (input: RequirementDraft) => Promise<Requirement>
  addQuickRequirement: (input: QuickAddInput) => Promise<Requirement>
  updateRequirement: (id: string, patch: Partial<Requirement>) => Promise<void>
  deleteRequirement: (id: string) => Promise<void>
  setStatus: (id: string, status: RequirementStatus) => Promise<void>
  updateScores: (id: string, scores: RequirementScores) => Promise<void>
  clearAllData: () => Promise<void>
  resetDemoData: () => Promise<void>
  replaceAll: (items: Requirement[]) => Promise<void>
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

function normalizeStored(items: Requirement[]): Requirement[] {
  return items
    .map((item) => validateRequirement(item))
    .filter((item): item is Requirement => item !== null)
    .map(normalizeRequirement)
}

const adapter: StorageAdapter = new LocalStorageAdapter()

export const useRequirementStore = create<RequirementStore>()((set, get) => {
  const commit = async (next: Requirement[]) => {
    set({ requirements: next })
    try {
      await adapter.save(next)
    } catch (error) {
      set({ error: errorMessage(error) })
    }
  }

  return {
    requirements: [],
    status: 'idle',
    error: null,

    initialize: async () => {
      const current = get().status
      if (current === 'loading' || current === 'ready') return
      set({ status: 'loading', error: null })
      try {
        const stored = await adapter.load()
        if (stored.length > 0) {
          set({ requirements: normalizeStored(stored), status: 'ready' })
        } else if (!isInitialized()) {
          const seed = loadSeedRequirements()
          await adapter.save(seed)
          markInitialized()
          set({ requirements: seed, status: 'ready' })
        } else {
          set({ requirements: [], status: 'ready' })
        }
      } catch (error) {
        set({ status: 'error', error: errorMessage(error) })
      }
    },

    addRequirement: async (input) => {
      const requirement = createRequirement(input)
      await commit([...get().requirements, requirement])
      return requirement
    },

    addQuickRequirement: async (input) => {
      const requirement = createRequirementFromQuickAdd(input)
      await commit([...get().requirements, requirement])
      return requirement
    },

    updateRequirement: async (id, patch) => {
      const next = get().requirements.map((requirement) => {
        if (requirement.id !== id) return requirement
        const merged: Requirement = {
          ...requirement,
          ...patch,
          updatedAt: new Date().toISOString(),
        }
        // opportunityScore 是派生数据，始终重算保证一致
        merged.opportunityScore = normalizeRequirement(merged).opportunityScore
        return merged
      })
      await commit(next)
    },

    deleteRequirement: async (id) => {
      await commit(get().requirements.filter((r) => r.id !== id))
    },

    setStatus: async (id, status) => {
      await get().updateRequirement(id, { status })
    },

    updateScores: async (id, scores) => {
      const next = get().requirements.map((requirement) =>
        requirement.id === id ? withScores(requirement, scores) : requirement,
      )
      await commit(next)
    },

    clearAllData: async () => {
      set({ requirements: [] })
      try {
        await adapter.clear()
      } catch (error) {
        set({ error: errorMessage(error) })
      }
    },

    resetDemoData: async () => {
      const seed = loadSeedRequirements()
      await commit(seed)
    },

    replaceAll: async (items) => {
      await commit(normalizeStored(items))
    },
  }
})
