import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRequirementStore } from '@/store/requirementStore'
import type { Requirement } from '@/types/requirement'
import {
  RequirementForm,
  dateInputToIso,
  formValuesToFields,
} from './RequirementForm'
import type { RequirementFormValues } from '@/lib/validation/forms'

interface RequirementFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requirement?: Requirement | null
}

export function RequirementFormDialog({
  open,
  onOpenChange,
  requirement,
}: RequirementFormDialogProps) {
  const addRequirement = useRequirementStore((s) => s.addRequirement)
  const updateRequirement = useRequirementStore((s) => s.updateRequirement)

  const handleSubmit = async (values: RequirementFormValues) => {
    const fields = formValuesToFields(values)
    if (requirement) {
      await updateRequirement(requirement.id, {
        ...fields,
        discoveredAt: dateInputToIso(values.discoveredAt) ?? requirement.discoveredAt,
      })
    } else {
      await addRequirement({
        ...fields,
        discoveredAt: dateInputToIso(values.discoveredAt),
      })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{requirement ? '编辑需求' : '新建需求'}</DialogTitle>
          <DialogDescription>
            {requirement
              ? '补充或修改需求的研究信息。'
              : '完整记录一条需求信号。'}
          </DialogDescription>
        </DialogHeader>
        <RequirementForm
          initial={requirement}
          submitLabel={requirement ? '保存修改' : '创建需求'}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
