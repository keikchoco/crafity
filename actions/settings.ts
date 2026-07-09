"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/lib/permissions"
import { createAuditLog } from "@/lib/audit-log"
import { successResponse, errorResponse } from "@/lib/api-response"
import type { ApiResponse } from "@/types/api"

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/blog",
  "/contact",
  "/contact/service-inquiry",
  "/privacy-policy",
  "/terms",
]

export async function refreshCacheAction(): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("settings", "edit")

    for (const path of PUBLIC_PATHS) {
      revalidatePath(path, "layout")
    }
    revalidatePath("/portfolio/[slug]", "page")
    revalidatePath("/blog/[slug]", "page")

    await createAuditLog({
      userId: admin.userId,
      action: "UPDATE",
      resource: "settings",
      resourceId: "cache",
    })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}
