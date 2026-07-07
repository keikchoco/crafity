import { requirePermission } from "@/lib/permissions"
import { serviceService } from "@/services/service.service"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { ServiceForm } from "@/components/admin/service-form"
import type { InferredServiceInput } from "@/schemas/service.schema"

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  try {
    await requirePermission("services", "edit")
  } catch {
    return (
      <ErrorState title="No permission" description="You don't have permission to edit services." />
    )
  }

  const { id } = await params

  let defaultValues: InferredServiceInput | null = null

  try {
    const service = await serviceService.getById(id)
    defaultValues = {
      title: service.title,
      slug: service.slug,
      description: service.description,
      icon: service.icon,
      features: service.features,
      order: service.order,
    }
  } catch {
    return (
      <ErrorState
        title="Unable to load service"
        description="The service doesn't exist or the database isn't reachable."
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Typography as="h1" variant="h1">
        Edit Service
      </Typography>
      <ServiceForm serviceId={id} defaultValues={defaultValues} />
    </div>
  )
}
