"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/lib/permissions"
import { messageService } from "@/services/message.service"
import { createAuditLog } from "@/lib/audit-log"
import { ValidationError } from "@/lib/errors"
import { successResponse, errorResponse } from "@/lib/api-response"
import type { ApiResponse } from "@/types/api"
import type { MessageStatus } from "@/types/message"

const VALID_STATUSES: MessageStatus[] = ["new", "read", "archived", "completed"]

export async function updateMessageStatusAction(
  id: string,
  status: string,
): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("messages", "edit")

    if (!VALID_STATUSES.includes(status as MessageStatus)) {
      throw new ValidationError("Invalid status")
    }

    await messageService.updateStatus(id, status as MessageStatus)

    await createAuditLog({
      userId: admin.userId,
      action: "UPDATE",
      resource: "messages",
      resourceId: id,
      newValue: { status },
    })

    revalidatePath("/admin/messages")

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}
