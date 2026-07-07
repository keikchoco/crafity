"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

import {
  publishServiceAction,
  archiveServiceAction,
  deleteServiceAction,
  reorderServiceAction,
} from "@/actions/services"
import { DataTable, type DataTableColumn } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"

export interface ServiceRow {
  id: string
  title: string
  status: "draft" | "published" | "archived"
  order: number
  createdAt: string
}

interface ServicesTableProps {
  rows: ServiceRow[]
  total: number
  page: number
  limit: number
}

function ServicesTable({ rows, total, page, limit }: ServicesTableProps) {
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
    const response = await reorderServiceAction(id, direction)
    if (!response.success) {
      toast.error(response.error.message)
      return
    }
    router.refresh()
  }

  const columns: DataTableColumn<ServiceRow>[] = [
    {
      key: "title",
      label: "Title",
      render: (row) => (
        <Link href={`/admin/services/${row.id}`} className="font-medium hover:underline">
          {row.title}
        </Link>
      ),
    },
    { key: "status", label: "Status", render: (row) => <span className="capitalize">{row.status}</span> },
    { key: "order", label: "Order", render: (row) => row.order },
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
      basePath="/admin/services"
      getRowId={(row) => row.id}
      searchPlaceholder="Search services..."
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
              onClick={() => runAction(publishServiceAction, row.id, "Service published")}
            >
              Publish
            </Button>
          )}
          {row.status !== "archived" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => runAction(archiveServiceAction, row.id, "Service archived")}
            >
              Archive
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => runAction(deleteServiceAction, row.id, "Service deleted")}
          >
            Delete
          </Button>
        </>
      )}
    />
  )
}

export { ServicesTable }
