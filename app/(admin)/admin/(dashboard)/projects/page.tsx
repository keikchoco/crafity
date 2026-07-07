import Link from "next/link"

import { requirePermission } from "@/lib/permissions"
import { projectService } from "@/services/project.service"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { ProjectsTable, type ProjectRow } from "@/components/admin/projects-table"

interface AdminProjectsPageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function AdminProjectsPage({ searchParams }: AdminProjectsPageProps) {
  try {
    await requirePermission("projects", "view")
  } catch {
    return (
      <ErrorState title="No permission" description="You don't have permission to view projects." />
    )
  }

  const params = await searchParams
  const page = Number(params.page ?? "1") || 1
  const limit = 20

  let rows: ProjectRow[] = []
  let total = 0
  let loadFailed = false

  try {
    const result = await projectService.list(
      { includeDeleted: true },
      { page, limit, sort: params.sort, search: params.q },
    )

    rows = result.items.map((item) => ({
      id: String(item._id),
      title: item.title,
      slug: item.slug,
      category: item.category,
      status: item.status,
      featured: item.featured,
      deletedAt: item.deletedAt ? new Date(item.deletedAt).toISOString() : null,
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
          Projects
        </Typography>
        <Button render={<Link href="/admin/projects/new" />}>New Project</Button>
      </div>

      {loadFailed ? (
        <ErrorState
          title="Unable to load projects"
          description="The database isn't reachable right now. Check MONGODB_URI in .env.local."
        />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first case study to showcase your work."
        />
      ) : (
        <ProjectsTable rows={rows} total={total} page={page} limit={limit} />
      )}
    </div>
  )
}
