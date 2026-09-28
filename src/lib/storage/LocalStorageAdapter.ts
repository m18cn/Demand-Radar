import type { Requirement } from '@/types/requirement'
import type { StorageAdapter } from './StorageAdapter'

export const DEFAULT_STORAGE_KEY = 'demand-radar:requirements'

/**
 * 浏览器 localStorage 实现。
 * 页面与 store 永远通过 StorageAdapter 接口访问数据，
 * 不得直接调用 localStorage 读取需求数据。
 */
export class LocalStorageAdapter implements StorageAdapter {
  private readonly key: string

  constructor(key: string = DEFAULT_STORAGE_KEY) {
    this.key = key
  }

  async load(): Promise<Requirement[]> {
    const raw = window.localStorage.getItem(this.key)
    if (!raw) return []
    try {
      const parsed: unknown = JSON.parse(raw)
      return Array.isArray(parsed) ? (parsed as Requirement[]) : []
    } catch {
      // 数据损坏时返回空列表，交由上层决定是否回退到演示数据
      return []
    }
  }

  async save(requirements: Requirement[]): Promise<void> {
    window.localStorage.setItem(this.key, JSON.stringify(requirements))
  }

  async clear(): Promise<void> {
    window.localStorage.removeItem(this.key)
  }
}
