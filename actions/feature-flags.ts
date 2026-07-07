"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/lib/permissions"
import { featureFlagService } from "@/services/feature-flag.service"
import { createAuditLog } from "@/lib/audit-log"
import { ValidationError } from "@/lib/errors"
import { successResponse, errorResponse } from "@/lib/api-response"
import { FEATURE_FLAG_DEFINITIONS } from "@/constants/feature-flags"
import type { ApiResponse } from "@/types/api"

export async function toggleFeatureFlagAction(key: string, enabled: boolean): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("featureFlags", "edit")

    const definition = FEATURE_FLAG_DEFINITIONS.find((flag) => flag.key === key)
    if (!definition) {
      throw new ValidationError("Unknown feature flag")
    }

    await featureFlagService.setEnabled(key, enabled, definition.description, admin.userId)

    await createAuditLog({
      userId: admin.userId,
      action: "UPDATE",
      resource: "featureFlags",
      resourceId: key,
      newValue: { enabled },
    })

    revalidatePath("/admin/feature-flags")
    revalidatePath("/", "layout")

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}
