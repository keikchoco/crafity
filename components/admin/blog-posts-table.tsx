"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { publishBlogPostAction, archiveBlogPostAction, deleteBlogPostAction } from "@/actions/blog-posts"
import type { InferredBlogPostInput } from "@/schemas/blog-post.schema"
import { DataTable, type DataTableColumn } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { FormDialog } from "@/components/admin/form-dialog"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { BlogPostForm } from "@/components/admin/blog-post-form"

export interface BlogPostRow {
  id: string
  title: string
  category: string
  status: "draft" | "published" | "archived"
  createdAt: string
  defaultValues: InferredBlogPostInput
}

interface BlogPostsTableProps {
  rows: BlogPostRow[]
  total: number
  page: number
  limit: number
}

function BlogPostsTable({ rows, total, page, limit }: BlogPostsTableProps) {
  const router = useRouter()
  const [editingRow, setEditingRow] = React.useState<BlogPostRow | null>(null)
  const [deletingRow, setDeletingRow] = React.useState<BlogPostRow | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

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

  async function handleDeleteConfirm() {
    if (!deletingRow) return
    setIsDeleting(true)
    const response = await deleteBlogPostAction(deletingRow.id)
    setIsDeleting(false)
    if (!response.success) {
      toast.error(response.error?.message ?? "Something went wrong")
      return
    }
    toast.success("Post deleted")
    setDeletingRow(null)
    router.refresh()
  }

  const columns: DataTableColumn<BlogPostRow>[] = [
    {
      key: "title",
      label: "Title",
      render: (row) => (
        <button
          type="button"
          className="font-medium hover:underline"
          onClick={() => setEditingRow(row)}
        >
          {row.title}
        </button>
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
    <>
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
            <Button variant="outline" size="sm" onClick={() => setEditingRow(row)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setDeletingRow(row)}>
              Delete
            </Button>
          </>
        )}
      />

      <FormDialog
        open={editingRow !== null}
        onOpenChange={(open) => !open && setEditingRow(null)}
        title="Edit post"
      >
        {editingRow && (
          <BlogPostForm
            postId={editingRow.id}
            defaultValues={editingRow.defaultValues}
            onSuccess={() => {
              setEditingRow(null)
              router.refresh()
            }}
          />
        )}
      </FormDialog>

      <ConfirmDialog
        open={deletingRow !== null}
        onOpenChange={(open) => !open && setDeletingRow(null)}
        title="Delete post?"
        description={deletingRow ? `"${deletingRow.title}" will be removed.` : undefined}
        isConfirming={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}

export { BlogPostsTable }
