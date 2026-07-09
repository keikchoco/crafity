import { requirePermission } from "@/lib/permissions"
import { serviceService } from "@/services/service.service"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"
import { ServicesTable, type ServiceRow } from "@/components/admin/services-table"
import { NewServiceButton } from "@/components/admin/new-service-button"

interface AdminServicesPageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function AdminServicesPage({ searchParams }: AdminServicesPageProps) {
  try {
    await requirePermission("services", "view")
  } catch {
    return (
      <ErrorState title="No permission" description="You don't have permission to view services." />
    )
  }

  const params = await searchParams
  const page = Number(params.page ?? "1") || 1
  const limit = 20

  let rows: ServiceRow[] = []
  let total = 0
  let loadFailed = false

  try {
    const result = await serviceService.list({}, { page, limit, sort: params.sort, search: params.q })

    rows = result.items.map((item) => ({
      id: String(item._id),
      title: item.title,
      status: item.status,
      order: item.order,
      createdAt: new Date(item.createdAt).toISOString(),
      defaultValues: {
        title: item.title,
        slug: item.slug,
        description: item.description,
        icon: item.icon,
        features: item.features,
        order: item.order,
      },
    }))
    total = result.total
  } catch {
    loadFailed = true
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <Typography as="h1" variant="h1">
          Services
        </Typography>
        <NewServiceButton />
      </div>

      {loadFailed ? (
        <ErrorState
          title="Unable to load services"
          description="The database isn't reachable right now. Check MONGODB_URI in .env.local."
        />
      ) : rows.length === 0 ? (
        <EmptyState title="No services yet" description="Add your first service offering." />
      ) : (
        <ServicesTable rows={rows} total={total} page={page} limit={limit} />
      )}
    </div>
  )
}
