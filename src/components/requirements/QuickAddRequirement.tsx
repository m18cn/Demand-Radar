import { useState } from 'react'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SOURCE_LABELS } from '@/lib/constants'
import { quickAddSchema } from '@/lib/validation/forms'
import { useRequirementStore } from '@/store/requirementStore'
import { SOURCE_TYPES, type SourceType } from '@/types/requirement'

interface QuickAddValues {
  title: string
  targetUser: string
  source: SourceType
  url: string
  note: string
}

const initialValues: QuickAddValues = {
  title: '',
  targetUser: '',
  source: 'other',
  url: '',
  note: '',
}

export function QuickAddRequirement() {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<QuickAddValues>(initialValues)
  const [error, setError] = useState<string | null>(null)
  const addQuickRequirement = useRequirementStore((s) => s.addQuickRequirement)

  const set = <K extends keyof QuickAddValues>(key: K, value: QuickAddValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const reset = () => {
    setValues(initialValues)
    setError(null)
  }

  const handleSubmit = async () => {
    const parsed = quickAddSchema.safeParse(values)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? '请检查输入')
      return
    }
    await addQuickRequirement({
      title: values.title,
      targetUser: values.targetUser,
      source: values.source,
      url: values.url || undefined,
      note: values.note || undefined,
    })
    reset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Zap />
          快速记录
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>快速记录需求</DialogTitle>
          <DialogDescription>
            只需填写最少的字段，其余信息稍后研究时再补充。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="quick-title">
              标题<span className="ml-0.5 text-destructive">*</span>
            </Label>
            <Input
              id="quick-title"
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="一句话描述这个需求"
              autoFocus
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quick-target">目标用户</Label>
            <Input
              id="quick-target"
              value={values.targetUser}
              onChange={(e) => set('targetUser', e.target.value)}
              placeholder="谁会用到它？"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quick-source">来源</Label>
            <Select
              value={values.source}
              onValueChange={(v) => set('source', v as SourceType)}
            >
              <SelectTrigger id="quick-source">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {SOURCE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quick-url">链接</Label>
            <Input
              id="quick-url"
              value={values.url}
              onChange={(e) => set('url', e.target.value)}
              placeholder="https://"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="quick-note">备注</Label>
            <Textarea
              id="quick-note"
              value={values.note}
              onChange={(e) => set('note', e.target.value)}
              placeholder="记录发现信号的上下文"
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              reset()
              setOpen(false)
            }}
          >
            取消
          </Button>
          <Button onClick={() => void handleSubmit()}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
