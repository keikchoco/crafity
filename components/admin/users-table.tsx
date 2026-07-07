"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { AdminListItem } from "@/lib/admin-users"
import { disableAdminAction } from "@/actions/admin-users"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PermissionEditor } from "@/components/admin/permission-editor"

interface UsersTableProps {
  admins: AdminListItem[]
  viewerUserId: string
  viewerIsSuperAdmin: boolean
}

function UsersTable({ admins, viewerUserId, viewerIsSuperAdmin }: UsersTableProps) {
  const router = useRouter()
  const [editing, setEditing] = React.useState<AdminListItem | null>(null)

  async function handleDisable(admin: AdminListItem) {
    if (!window.confirm(`Remove CMS access for ${admin.name}? This does not delete their account.`)) {
      return
    }

    const response = await disableAdminAction(admin.id)

    if (!response.success) {
      toast.error(response.error.message)
      return
    }

    toast.success(`Access removed for ${admin.name}`)
    router.refresh()
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>
                {admin.isSuperAdmin ? "Super Admin" : (admin.role ?? "—")}
              </TableCell>
              <TableCell>{admin.banned ? "Banned" : "Active"}</TableCell>
              <TableCell>{admin.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>
                {admin.lastActiveAt ? admin.lastActiveAt.toLocaleDateString() : "Never"}
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(admin)}>
                  Edit Permissions
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDisable(admin)}
                  disabled={admin.id === viewerUserId && !viewerIsSuperAdmin}
                >
                  Disable
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editing && (
        <PermissionEditor
          open={Boolean(editing)}
          onOpenChange={(open) => !open && setEditing(null)}
          target={{
            userId: editing.id,
            name: editing.name,
            role: editing.isSuperAdmin || editing.role === "super_admin" ? "super_admin" : "admin",
            isSuperAdmin: editing.isSuperAdmin,
            permissions: editing.permissions,
          }}
          viewerIsSuperAdmin={viewerIsSuperAdmin}
          isSelf={editing.id === viewerUserId}
          onSaved={() => router.refresh()}
        />
      )}
    </>
  )
}

export { UsersTable }
