import { SCORE_DESCRIPTIONS, SCORE_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useRequirementStore } from '@/store/requirementStore'
import {
  SCORE_KEYS,
  type Requirement,
  type RequirementScores,
  type ScoreKey,
} from '@/types/requirement'

const SCORE_RANGE = [1, 2, 3, 4, 5] as const

export function ScoreEditor({ requirement }: { requirement: Requirement }) {
  const updateScores = useRequirementStore((s) => s.updateScores)

  const setScore = (key: ScoreKey, value: number) => {
    const next: RequirementScores = { ...requirement.scores, [key]: value }
    void updateScores(requirement.id, next)
  }

  return (
    <div className="space-y-4">
      {SCORE_KEYS.map((key) => (
        <div key={key}>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium">{SCORE_LABELS[key]}</span>
            <span className="text-sm font-semibold tabular-nums">
              {requirement.scores[key]}
              <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                / 5
              </span>
            </span>
          </div>
          <p className="mb-2 mt-0.5 text-xs text-muted-foreground">
            {SCORE_DESCRIPTIONS[key]}
          </p>
          <div className="flex gap-1.5">
            {SCORE_RANGE.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setScore(key, value)}
                aria-label={`${SCORE_LABELS[key]} ${value} 分`}
                className={cn(
                  'h-7 flex-1 rounded-md border text-sm font-medium transition-colors',
                  requirement.scores[key] === value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input hover:bg-accent',
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
