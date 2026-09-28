import { useState } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ChipInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function ChipInput({
  value,
  onChange,
  placeholder,
  className,
}: ChipInputProps) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const item = draft.trim()
    if (!item) return
    if (!value.includes(item)) onChange([...value, item])
    setDraft('')
  }

  const remove = (item: string) => {
    onChange(value.filter((v) => v !== item))
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5 rounded-md border border-input px-2 py-1.5 shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring',
        className,
      )}
    >
      {value.map((item) => (
        <Badge key={item} variant="secondary" className="gap-1 pr-1">
          {item}
          <button
            type="button"
            onClick={() => remove(item)}
            className="rounded-sm opacity-60 transition-opacity hover:opacity-100"
            aria-label={`移除 ${item}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            add()
          } else if (e.key === 'Backspace' && !draft && value.length > 0) {
            onChange(value.slice(0, -1))
          }
        }}
        onBlur={add}
        placeholder={value.length === 0 ? placeholder : undefined}
        className="h-6 min-w-[8rem] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}
