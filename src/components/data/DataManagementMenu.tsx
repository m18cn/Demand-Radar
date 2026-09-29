import { useRef, useState, type ChangeEvent } from 'react'
import { Database, Download, RotateCcw, Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useRequirementStore } from '@/store/requirementStore'
import {
  exportRequirementsToJson,
  parseImportedRequirements,
} from '@/lib/dataTransfer'
import type { Requirement } from '@/types/requirement'

type PendingAction =
  | { kind: 'sample' }
  | { kind: 'clear' }
  | { kind: 'import'; data: Requirement[] }

export function DataManagementMenu() {
  const requirements = useRequirementStore((s) => s.requirements)
  const replaceAll = useRequirementStore((s) => s.replaceAll)
  const loadSampleData = useRequirementStore((s) => s.loadSampleData)
  const clearAllData = useRequirementStore((s) => s.clearAllData)

  const [pending, setPending] = useState<PendingAction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const text = await file.text()
    const result = parseImportedRequirements(text)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setPending({ kind: 'import', data: result.data })
  }

  const dialog = (() => {
    if (!pending) return { title: '', description: '' }
    switch (pending.kind) {
      case 'sample':
        return {
          title: '加载示例数据',
          description: '将用示例数据替换当前所有需求。此操作无法撤销。',
        }
      case 'clear':
        return {
          title: '清空所有数据',
          description: '将删除全部需求。此操作无法撤销。',
        }
      case 'import':
        return {
          title: '导入数据',
          description: `将用导入文件替换当前 ${requirements.length} 条需求。此操作无法撤销。`,
        }
    }
  })()

  const confirm = async () => {
    if (!pending) return
    if (pending.kind === 'sample') await loadSampleData()
    else if (pending.kind === 'clear') await clearAllData()
    else if (pending.kind === 'import') await replaceAll(pending.data)
    setPending(null)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Database />
            <span className="hidden md:inline">数据</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>数据管理</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => exportRequirementsToJson(requirements)}
          >
            <Download />
            导出 JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileRef.current?.click()}>
            <Upload />
            导入 JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setPending({ kind: 'sample' })}>
            <RotateCcw />
            加载示例数据
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={() => setPending({ kind: 'clear' })}
          >
            <Trash2 />
            清空所有数据
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => void handleFile(event)}
      />

      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className={
                pending?.kind === 'clear'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : undefined
              }
              onClick={() => void confirm()}
            >
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={error !== null}
        onOpenChange={(open) => {
          if (!open) setError(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>导入失败</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>知道了</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
