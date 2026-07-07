"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  publishProjectAction,
  archiveProjectAction,
  restoreProjectAction,
  deleteProjectAction,
} from "@/actions/projects"
import { DataTable, type DataTableColumn } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"

export interface ProjectRow {
  id: string
  title: string
  slug: string
  category: string
  status: "draft" | "published" | "archived"
  featured: boolean
  deletedAt: string | null
  createdAt: string
}

interface ProjectsTableProps {
  rows: ProjectRow[]
  total: number
  page: number
  limit: number
}

function ProjectsTable({ rows, total, page, limit }: ProjectsTableProps) {
  const router = useRouter()

  async function runAction(
    action: (id: string) => Promise<{ success: boolean; error?: { message: string } }>,
    id: string,
    successMessage: string,
  ) {
    const response = await action(id)
    if (!response.success) {
      toast.error(response.error?.message ?? "Something went wrong")
      return
    }
    toast.success(successMessage)
    router.refresh()
  }

  const columns: DataTableColumn<ProjectRow>[] = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (row) => (
        <Link href={`/admin/projects/${row.id}`} className="font-medium hover:underline">
          {row.title}
        </Link>
      ),
    },
    { key: "category", label: "Category", render: (row) => row.category },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <span className="capitalize">{row.deletedAt ? "Deleted" : row.status}</span>
      ),
    },
    { key: "featured", label: "Featured", render: (row) => (row.featured ? "Yes" : "—") },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ]

  return (
    <DataTable
      columns={columns}
      rows={rows}
      total={total}
      page={page}
      limit={limit}
      basePath="/admin/projects"
      getRowId={(row) => row.id}
      searchPlaceholder="Search projects..."
      rowActions={(row) =>
        row.deletedAt ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => runAction(restoreProjectAction, row.id, "Project restored")}
          >
            Restore
          </Button>
        ) : (
          <>
            {row.status !== "published" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => runAction(publishProjectAction, row.id, "Project published")}
              >
                Publish
              </Button>
            )}
            {row.status !== "archived" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => runAction(archiveProjectAction, row.id, "Project archived")}
              >
                Archive
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => runAction(deleteProjectAction, row.id, "Project deleted")}
            >
              Delete
            </Button>
          </>
        )
      }
    />
  )
}

export { ProjectsTable }
