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
import type { Requirement } from '@/types/requirement'

interface DeleteRequirementDialogProps {
  requirement: Requirement | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteRequirementDialog({
  requirement,
  open,
  onOpenChange,
}: DeleteRequirementDialogProps) {
  const deleteRequirement = useRequirementStore((s) => s.deleteRequirement)

  const handleDelete = async () => {
    if (!requirement) return
    await deleteRequirement(requirement.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>删除需求</AlertDialogTitle>
          <AlertDialogDescription>
            确定要删除「{requirement?.title}」吗？此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => void handleDelete()}
          >
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
