"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

import {
  publishTestimonialAction,
  archiveTestimonialAction,
  deleteTestimonialAction,
  reorderTestimonialAction,
} from "@/actions/testimonials"
import type { InferredTestimonialInput } from "@/schemas/testimonial.schema"
import { DataTable, type DataTableColumn } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { FormDialog } from "@/components/admin/form-dialog"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { TestimonialForm } from "@/components/admin/testimonial-form"
import { StarRating } from "@/components/shared/star-rating"

export interface TestimonialRow {
  id: string
  clientName: string
  company: string
  status: "draft" | "published" | "archived"
  order: number
  rating: number
  createdAt: string
  defaultValues: InferredTestimonialInput
}

interface TestimonialsTableProps {
  rows: TestimonialRow[]
  total: number
  page: number
  limit: number
  projectOptions: { id: string; title: string }[]
}

function TestimonialsTable({ rows, total, page, limit, projectOptions }: TestimonialsTableProps) {
  const router = useRouter()
  const [editingRow, setEditingRow] = React.useState<TestimonialRow | null>(null)
  const [deletingRow, setDeletingRow] = React.useState<TestimonialRow | null>(null)
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

  async function handleReorder(id: string, direction: "up" | "down") {
    const response = await reorderTestimonialAction(id, direction)
    if (!response.success) {
      toast.error(response.error.message)
      return
    }
    router.refresh()
  }

  async function handleDeleteConfirm() {
    if (!deletingRow) return
    setIsDeleting(true)
    const response = await deleteTestimonialAction(deletingRow.id)
    setIsDeleting(false)
    if (!response.success) {
      toast.error(response.error?.message ?? "Something went wrong")
      return
    }
    toast.success("Testimonial deleted")
    setDeletingRow(null)
    router.refresh()
  }

  const columns: DataTableColumn<TestimonialRow>[] = [
    {
      key: "clientName",
      label: "Client",
      render: (row) => (
        <button
          type="button"
          className="font-medium hover:underline"
          onClick={() => setEditingRow(row)}
        >
          {row.clientName}
        </button>
      ),
    },
    { key: "company", label: "Company", render: (row) => row.company },
    { key: "rating", label: "Rating", render: (row) => <StarRating rating={row.rating} /> },
    { key: "status", label: "Status", render: (row) => <span className="capitalize">{row.status}</span> },
    { key: "order", label: "Order", render: (row) => row.order },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows}
        total={total}
        page={page}
        limit={limit}
        basePath="/admin/testimonials"
        getRowId={(row) => row.id}
        searchPlaceholder="Search testimonials..."
        rowActions={(row) => (
          <>
            <Button variant="ghost" size="icon-sm" onClick={() => handleReorder(row.id, "up")}>
              <ArrowUpIcon />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => handleReorder(row.id, "down")}>
              <ArrowDownIcon />
            </Button>
            {row.status !== "published" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => runAction(publishTestimonialAction, row.id, "Testimonial published")}
              >
                Publish
              </Button>
            )}
            {row.status !== "archived" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => runAction(archiveTestimonialAction, row.id, "Testimonial archived")}
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
        title="Edit testimonial"
      >
        {editingRow && (
          <TestimonialForm
            testimonialId={editingRow.id}
            defaultValues={editingRow.defaultValues}
            projectOptions={projectOptions}
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
        title="Delete testimonial?"
        description={deletingRow ? `Review from "${deletingRow.clientName}" will be removed.` : undefined}
        isConfirming={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}

export { TestimonialsTable }
