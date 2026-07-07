"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/lib/permissions"
import { serviceInquiryService } from "@/services/service-inquiry.service"
import { createAuditLog } from "@/lib/audit-log"
import { ValidationError } from "@/lib/errors"
import { successResponse, errorResponse } from "@/lib/api-response"
import type { ApiResponse } from "@/types/api"
import type { ServiceInquiryStatus } from "@/types/inquiry"

const VALID_STATUSES: ServiceInquiryStatus[] = ["new", "reviewed", "contacted", "completed", "archived"]

export async function updateInquiryStatusAction(
  id: string,
  status: string,
): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("inquiries", "edit")

    if (!VALID_STATUSES.includes(status as ServiceInquiryStatus)) {
      throw new ValidationError("Invalid status")
    }

    await serviceInquiryService.updateStatus(id, status as ServiceInquiryStatus)

    await createAuditLog({
      userId: admin.userId,
      action: "UPDATE",
      resource: "inquiries",
      resourceId: id,
      newValue: { status },
    })

    revalidatePath("/admin/inquiries")

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function updateInquiryNotesAction(
  id: string,
  notes: string,
): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("inquiries", "edit")

    await serviceInquiryService.updateNotes(id, notes)

    await createAuditLog({
      userId: admin.userId,
      action: "UPDATE",
      resource: "inquiries",
      resourceId: id,
      newValue: { notes },
    })

    revalidatePath("/admin/inquiries")

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}
