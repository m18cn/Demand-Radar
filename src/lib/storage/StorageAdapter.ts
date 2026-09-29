import type { Requirement } from '@/types/requirement'

export interface StorageAdapter {
  load(): Promise<Requirement[]>
  save(requirements: Requirement[]): Promise<void>
}
