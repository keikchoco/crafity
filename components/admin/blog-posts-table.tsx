"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { publishBlogPostAction, archiveBlogPostAction, deleteBlogPostAction } from "@/actions/blog-posts"
import { DataTable, type DataTableColumn } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"

export interface BlogPostRow {
  id: string
  title: string
  category: string
  status: "draft" | "published" | "archived"
  createdAt: string
}

interface BlogPostsTableProps {
  rows: BlogPostRow[]
  total: number
  page: number
  limit: number
}

function BlogPostsTable({ rows, total, page, limit }: BlogPostsTableProps) {
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

  const columns: DataTableColumn<BlogPostRow>[] = [
    {
      key: "title",
      label: "Title",
      render: (row) => (
        <Link href={`/admin/blog/${row.id}`} className="font-medium hover:underline">
          {row.title}
        </Link>
      ),
    },
    { key: "category", label: "Category", render: (row) => row.category },
    { key: "status", label: "Status", render: (row) => <span className="capitalize">{row.status}</span> },
    {
      key: "createdAt",
      label: "Created",
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
      basePath="/admin/blog"
      getRowId={(row) => row.id}
      searchPlaceholder="Search posts..."
      rowActions={(row) => (
        <>
          {row.status !== "published" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => runAction(publishBlogPostAction, row.id, "Post published")}
            >
              Publish
            </Button>
          )}
          {row.status !== "archived" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => runAction(archiveBlogPostAction, row.id, "Post archived")}
            >
              Archive
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => runAction(deleteBlogPostAction, row.id, "Post deleted")}
          >
            Delete
          </Button>
        </>
      )}
    />
  )
}

export { BlogPostsTable }
