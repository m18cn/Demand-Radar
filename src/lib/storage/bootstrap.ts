const INITIALIZED_KEY = 'demand-radar:initialized'

/**
 * 首次启动标记，用于区分「从未初始化（应加载演示数据）」
 * 与「用户已清空数据（应保持为空）」。
 * 这不是需求数据本身，仅为引导逻辑所用。
 */
export function isInitialized(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(INITIALIZED_KEY) === '1'
}

export function markInitialized(): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(INITIALIZED_KEY, '1')
}
