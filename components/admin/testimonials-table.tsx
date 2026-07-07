"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

import {
  publishTestimonialAction,
  archiveTestimonialAction,
  deleteTestimonialAction,
  reorderTestimonialAction,
} from "@/actions/testimonials"
import { DataTable, type DataTableColumn } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"

export interface TestimonialRow {
  id: string
  clientName: string
  company: string
  status: "draft" | "published" | "archived"
  order: number
  createdAt: string
}

interface TestimonialsTableProps {
  rows: TestimonialRow[]
  total: number
  page: number
  limit: number
}

function TestimonialsTable({ rows, total, page, limit }: TestimonialsTableProps) {
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

  async function handleReorder(id: string, direction: "up" | "down") {
    const response = await reorderTestimonialAction(id, direction)
    if (!response.success) {
      toast.error(response.error.message)
      return
    }
    router.refresh()
  }

  const columns: DataTableColumn<TestimonialRow>[] = [
    {
      key: "clientName",
      label: "Client",
      render: (row) => (
        <Link href={`/admin/testimonials/${row.id}`} className="font-medium hover:underline">
          {row.clientName}
        </Link>
      ),
    },
    { key: "company", label: "Company", render: (row) => row.company },
    { key: "status", label: "Status", render: (row) => <span className="capitalize">{row.status}</span> },
    { key: "order", label: "Order", render: (row) => row.order },
  ]

  return (
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => runAction(deleteTestimonialAction, row.id, "Testimonial deleted")}
          >
            Delete
          </Button>
        </>
      )}
    />
  )
}

export { TestimonialsTable }
