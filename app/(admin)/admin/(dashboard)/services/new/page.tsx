import { requirePermission } from "@/lib/permissions"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { ServiceForm } from "@/components/admin/service-form"

export default async function NewServicePage() {
  try {
    await requirePermission("services", "edit")
  } catch {
    return (
      <ErrorState
        title="No permission"
        description="You don't have permission to create services."
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Typography as="h1" variant="h1">
        New Service
      </Typography>
      <ServiceForm />
    </div>
  )
}
