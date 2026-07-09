"use server"

import { requirePermission } from "@/lib/permissions"
import { inviteAdmin, updateAdminMetadata, getAdminMetadata } from "@/lib/admin-users"
import { createAuditLog } from "@/lib/audit-log"
import { AuthorizationError, ValidationError, formatZodError } from "@/lib/errors"
import { successResponse, errorResponse } from "@/lib/api-response"
import { inviteAdminSchema, updatePermissionsSchema } from "@/schemas/admin-user.schema"
import type { ApiResponse } from "@/types/api"

export async function inviteAdminAction(input: unknown): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("users", "edit")

    const parsed = inviteAdminSchema.safeParse(input)
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error))
    }

    if (parsed.data.isSuperAdmin && !admin.isSuperAdmin) {
      throw new AuthorizationError("Only Super Admins can grant Super Admin access")
    }

    if (!admin.isSuperAdmin && hasUsersResourcePermission(parsed.data.permissions)) {
      throw new AuthorizationError("Only Super Admins can grant user management access")
    }

    await inviteAdmin(parsed.data)

    await createAuditLog({
      userId: admin.userId,
      action: "CREATE",
      resource: "users",
      resourceId: parsed.data.email,
      newValue: parsed.data,
    })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function updatePermissionsAction(input: unknown): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("users", "edit")

    const parsed = updatePermissionsSchema.safeParse(input)
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error))
    }

    if (parsed.data.userId === admin.userId && !admin.isSuperAdmin) {
      throw new AuthorizationError("You cannot modify your own permissions")
    }

    const oldValue = await getAdminMetadata(parsed.data.userId)

    if (Boolean(oldValue.isSuperAdmin) !== parsed.data.isSuperAdmin && !admin.isSuperAdmin) {
      throw new AuthorizationError("Only Super Admins can grant or remove Super Admin access")
    }

    const usersPermissionChanged =
      JSON.stringify(oldValue.permissions?.users ?? {}) !==
      JSON.stringify(parsed.data.permissions.users ?? {})

    if (!admin.isSuperAdmin && usersPermissionChanged) {
      throw new AuthorizationError("Only Super Admins can modify user management permissions")
    }

    await updateAdminMetadata(parsed.data.userId, parsed.data)

    await createAuditLog({
      userId: admin.userId,
      action: "PERMISSION_CHANGE",
      resource: "users",
      resourceId: parsed.data.userId,
      oldValue,
      newValue: parsed.data,
    })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function disableAdminAction(userId: string): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("users", "edit")

    if (userId === admin.userId && !admin.isSuperAdmin) {
      throw new AuthorizationError("You cannot modify your own permissions")
    }

    const oldValue = await getAdminMetadata(userId)

    if (oldValue.isSuperAdmin && !admin.isSuperAdmin) {
      throw new AuthorizationError("Only Super Admins can remove Super Admin access")
    }

    await updateAdminMetadata(userId, { role: "admin", isSuperAdmin: false, permissions: {} })

    await createAuditLog({
      userId: admin.userId,
      action: "PERMISSION_CHANGE",
      resource: "users",
      resourceId: userId,
      oldValue,
      newValue: { role: "user", isSuperAdmin: false, permissions: {} },
    })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

function hasUsersResourcePermission(permissions: { users?: { view?: boolean; edit?: boolean } }): boolean {
  return permissions.users?.view === true || permissions.users?.edit === true
}
