import { requirePermission } from "@/lib/permissions"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { ProjectForm } from "@/components/admin/project-form"

export default async function NewProjectPage() {
  try {
    await requirePermission("projects", "edit")
  } catch {
    return (
      <ErrorState
        title="No permission"
        description="You don't have permission to create projects."
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Typography as="h1" variant="h1">
        New Project
      </Typography>
      <ProjectForm />
    </div>
  )
}
