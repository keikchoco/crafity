"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { updateMessageStatusAction } from "@/actions/messages"
import { DataTable, type DataTableColumn } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

export interface MessageRow {
  id: string
  name: string
  email: string
  company?: string
  subject: string
  message: string
  status: "new" | "read" | "archived" | "completed"
  createdAt: string
}

interface MessagesTableProps {
  rows: MessageRow[]
  total: number
  page: number
  limit: number
}

function MessagesTable({ rows, total, page, limit }: MessagesTableProps) {
  const router = useRouter()

  async function setStatus(id: string, status: MessageRow["status"], label: string) {
    const response = await updateMessageStatusAction(id, status)
    if (!response.success) {
      toast.error(response.error.message)
      return
    }
    toast.success(label)
    router.refresh()
  }

  const columns: DataTableColumn<MessageRow>[] = [
    {
      key: "name",
      label: "From",
      render: (row) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    { key: "subject", label: "Subject", render: (row) => row.subject },
    {
      key: "status",
      label: "Status",
      render: (row) => <span className="capitalize">{row.status}</span>,
    },
    {
      key: "createdAt",
      label: "Received",
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
      basePath="/admin/messages"
      getRowId={(row) => row.id}
      searchPlaceholder="Search messages..."
      rowActions={(row) => (
        <>
          <Dialog>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (row.status === "new") setStatus(row.id, "read", "Marked as read")
                  }}
                />
              }
            >
              View
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{row.subject}</DialogTitle>
                <DialogDescription>
                  {row.name} &lt;{row.email}&gt;{row.company ? ` · ${row.company}` : ""}
                </DialogDescription>
              </DialogHeader>
              <p className="whitespace-pre-wrap text-sm text-foreground">{row.message}</p>
              <DialogFooter showCloseButton>
                {row.status !== "archived" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStatus(row.id, "archived", "Archived")}
                  >
                    Archive
                  </Button>
                )}
                {row.status !== "completed" && (
                  <Button size="sm" onClick={() => setStatus(row.id, "completed", "Marked complete")}>
                    Mark complete
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    />
  )
}

export { MessagesTable }
