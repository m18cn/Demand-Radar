import { cn } from '@/lib/utils'
import { scoreTone, SCORE_TONE_BADGE } from '@/lib/scoreTone'

export function OpportunityScoreBadge({
  score,
  className,
}: {
  score: number
  className?: string
}) {
  const tone = scoreTone(score)
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold tabular-nums',
        SCORE_TONE_BADGE[tone],
        className,
      )}
      title="Opportunity Score"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {score}
    </span>
  )
}
