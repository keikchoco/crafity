import Link from "next/link"

import { requirePermission } from "@/lib/permissions"
import { testimonialService } from "@/services/testimonial.service"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { TestimonialsTable, type TestimonialRow } from "@/components/admin/testimonials-table"

interface AdminTestimonialsPageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function AdminTestimonialsPage({ searchParams }: AdminTestimonialsPageProps) {
  try {
    await requirePermission("testimonials", "view")
  } catch {
    return (
      <ErrorState
        title="No permission"
        description="You don't have permission to view testimonials."
      />
    )
  }

  const params = await searchParams
  const page = Number(params.page ?? "1") || 1
  const limit = 20

  let rows: TestimonialRow[] = []
  let total = 0
  let loadFailed = false

  try {
    const result = await testimonialService.list(
      {},
      { page, limit, sort: params.sort, search: params.q },
    )

    rows = result.items.map((item) => ({
      id: String(item._id),
      clientName: item.clientName,
      company: item.company,
      status: item.status,
      order: item.order,
      createdAt: new Date(item.createdAt).toISOString(),
    }))
    total = result.total
  } catch {
    loadFailed = true
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <Typography as="h1" variant="h1">
          Testimonials
        </Typography>
        <Button render={<Link href="/admin/testimonials/new" />}>New Testimonial</Button>
      </div>

      {loadFailed ? (
        <ErrorState
          title="Unable to load testimonials"
          description="The database isn't reachable right now. Check MONGODB_URI in .env.local."
        />
      ) : rows.length === 0 ? (
        <EmptyState title="No testimonials yet" description="Add your first client review." />
      ) : (
        <TestimonialsTable rows={rows} total={total} page={page} limit={limit} />
      )}
    </div>
  )
}
