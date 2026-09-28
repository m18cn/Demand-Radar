export type ScoreTone = 'high' | 'mid' | 'low'

export function scoreTone(score: number): ScoreTone {
  if (score >= 72) return 'high'
  if (score >= 48) return 'mid'
  return 'low'
}

export const SCORE_TONE_BADGE: Record<ScoreTone, string> = {
  high: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  mid: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300',
  low: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
}

export const SCORE_TONE_BAR: Record<ScoreTone, string> = {
  high: 'bg-emerald-500',
  mid: 'bg-amber-500',
  low: 'bg-red-500',
}
