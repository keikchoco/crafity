import { requirePermission } from "@/lib/permissions"
import { serviceInquiryService } from "@/services/service-inquiry.service"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"
import { InquiriesTable, type InquiryRow } from "@/components/admin/inquiries-table"

interface AdminInquiriesPageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function AdminInquiriesPage({ searchParams }: AdminInquiriesPageProps) {
  try {
    await requirePermission("inquiries", "view")
  } catch {
    return (
      <ErrorState title="No permission" description="You don't have permission to view inquiries." />
    )
  }

  const params = await searchParams
  const page = Number(params.page ?? "1") || 1
  const limit = 20

  let rows: InquiryRow[] = []
  let total = 0
  let loadFailed = false

  try {
    const result = await serviceInquiryService.list(
      {},
      { page, limit, sort: params.sort, search: params.q },
    )

    rows = result.items.map((item) => ({
      id: String(item._id),
      name: item.name,
      email: item.email,
      company: item.company,
      service: item.service,
      budget: item.budget,
      timeline: item.timeline,
      description: item.description,
      status: item.status,
      notes: item.notes,
      createdAt: new Date(item.createdAt).toISOString(),
    }))
    total = result.total
  } catch {
    loadFailed = true
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Typography as="h1" variant="h1">
        Inquiries
      </Typography>

      {loadFailed ? (
        <ErrorState
          title="Unable to load inquiries"
          description="The database isn't reachable right now. Check MONGODB_URI in .env.local."
        />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No inquiries yet"
          description="Service inquiry submissions will appear here."
        />
      ) : (
        <InquiriesTable rows={rows} total={total} page={page} limit={limit} />
      )}
    </div>
  )
}
