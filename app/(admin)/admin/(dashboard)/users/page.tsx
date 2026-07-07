import { requirePermission } from "@/lib/permissions"
import { listAdmins } from "@/lib/admin-users"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"
import { InviteAdminDialog } from "@/components/admin/invite-admin-dialog"
import { UsersTable } from "@/components/admin/users-table"

export default async function AdminUsersPage() {
  let admin
  try {
    admin = await requirePermission("users", "view")
  } catch {
    return (
      <ErrorState
        title="No permission"
        description="You don't have permission to view administrators."
      />
    )
  }

  let admins: Awaited<ReturnType<typeof listAdmins>>["admins"] = []
  let loadFailed = false

  try {
    const result = await listAdmins({ limit: 50 })
    admins = result.admins
  } catch {
    loadFailed = true
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <Typography as="h1" variant="h1">
          Users
        </Typography>
        <InviteAdminDialog viewerIsSuperAdmin={admin.isSuperAdmin} />
      </div>

      {loadFailed ? (
        <ErrorState
          title="Unable to load administrators"
          description="Clerk isn't reachable right now. Check your Clerk API keys in .env.local."
        />
      ) : admins.length === 0 ? (
        <EmptyState
          title="No administrators yet"
          description="Invite your first administrator to start managing Crafity."
        />
      ) : (
        <UsersTable
          admins={admins}
          viewerUserId={admin.userId}
          viewerIsSuperAdmin={admin.isSuperAdmin}
        />
      )}
    </div>
  )
}
