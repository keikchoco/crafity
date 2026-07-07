import "server-only"
import { currentUser } from "@clerk/nextjs/server"
import { AuthenticationError, AuthorizationError } from "@/lib/errors"
import type { Action, ClerkPublicMetadata, CurrentAdmin, Resource } from "@/types/permissions"

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const user = await currentUser()

  if (!user) {
    return null
  }

  const metadata = user.publicMetadata as ClerkPublicMetadata

  return {
    userId: user.id,
    role: metadata.role,
    isSuperAdmin: metadata.isSuperAdmin === true,
    permissions: metadata.permissions ?? {},
  }
}

export function isSuperAdmin(admin: CurrentAdmin | null): boolean {
  return admin?.isSuperAdmin === true
}

export function hasPermission(admin: CurrentAdmin | null, resource: Resource, action: Action): boolean {
  if (!admin) {
    return false
  }

  if (isSuperAdmin(admin)) {
    return true
  }

  return admin.permissions[resource]?.[action] === true
}

export async function requirePermission(resource: Resource, action: Action): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin()

  if (!admin) {
    throw new AuthenticationError()
  }

  if (!hasPermission(admin, resource, action)) {
    throw new AuthorizationError()
  }

  return admin
}
