"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { updateInquiryStatusAction, updateInquiryNotesAction } from "@/actions/inquiries"
import { DataTable, type DataTableColumn } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

export interface InquiryRow {
  id: string
  name: string
  email: string
  company?: string
  projectType: string
  services: string[]
  budget: string
  timeline: string
  description: string
  status: "new" | "reviewed" | "contacted" | "completed" | "archived"
  notes?: string
  createdAt: string
}

interface InquiriesTableProps {
  rows: InquiryRow[]
  total: number
  page: number
  limit: number
}

const STATUS_OPTIONS: InquiryRow["status"][] = ["new", "reviewed", "contacted", "completed", "archived"]

function InquiriesTable({ rows, total, page, limit }: InquiriesTableProps) {
  const router = useRouter()
  const [notesDraft, setNotesDraft] = React.useState<Record<string, string>>({})

  async function setStatus(id: string, status: InquiryRow["status"]) {
    const response = await updateInquiryStatusAction(id, status)
    if (!response.success) {
      toast.error(response.error.message)
      return
    }
    toast.success("Status updated")
    router.refresh()
  }

  async function saveNotes(id: string) {
    const notes = notesDraft[id] ?? ""
    const response = await updateInquiryNotesAction(id, notes)
    if (!response.success) {
      toast.error(response.error.message)
      return
    }
    toast.success("Notes saved")
    router.refresh()
  }

  const columns: DataTableColumn<InquiryRow>[] = [
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
    { key: "projectType", label: "Project Type", render: (row) => row.projectType },
    { key: "budget", label: "Budget", render: (row) => row.budget },
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
      basePath="/admin/inquiries"
      getRowId={(row) => row.id}
      searchPlaceholder="Search inquiries..."
      rowActions={(row) => (
        <Dialog>
          <DialogTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (row.status === "new") setStatus(row.id, "reviewed")
                }}
              />
            }
          >
            View
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{row.name}</DialogTitle>
              <DialogDescription>
                {row.email}
                {row.company ? ` · ${row.company}` : ""}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs uppercase text-muted-foreground">Project Type</span>
                  <p>{row.projectType}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-muted-foreground">Budget</span>
                  <p>{row.budget}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-muted-foreground">Timeline</span>
                  <p>{row.timeline}</p>
                </div>
                <div>
                  <span className="text-xs uppercase text-muted-foreground">Services</span>
                  <p>{row.services.join(", ") || "—"}</p>
                </div>
              </div>

              <div>
                <span className="text-xs uppercase text-muted-foreground">Description</span>
                <p className="whitespace-pre-wrap">{row.description}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs uppercase text-muted-foreground">Internal notes</span>
                <Textarea
                  rows={3}
                  defaultValue={row.notes ?? ""}
                  onChange={(event) =>
                    setNotesDraft((prev) => ({ ...prev, [row.id]: event.target.value }))
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={() => saveNotes(row.id)}
                >
                  Save notes
                </Button>
              </div>
            </div>

            <DialogFooter showCloseButton>
              <select
                className="h-9 rounded-md border border-input bg-transparent px-2.5 text-sm capitalize"
                value={row.status}
                onChange={(event) => setStatus(row.id, event.target.value as InquiryRow["status"])}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status} className="capitalize">
                    {status}
                  </option>
                ))}
              </select>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    />
  )
}

export { InquiriesTable }
