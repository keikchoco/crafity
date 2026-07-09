"use server"

import { requirePermission } from "@/lib/permissions"
import { mediaService } from "@/services/media.service"
import { createAuditLog } from "@/lib/audit-log"
import { ValidationError, formatZodError } from "@/lib/errors"
import { successResponse, errorResponse } from "@/lib/api-response"
import { mediaMetadataSchema } from "@/schemas/media.schema"
import type { ApiResponse } from "@/types/api"
import type { MediaDocument } from "@/models/Media"

export interface MediaListItem {
  id: string
  filename: string
  url: string
  altText: string
  createdAt: string
}

export async function listMediaAction(page = 1): Promise<ApiResponse<{ items: MediaListItem[]; total: number }>> {
  try {
    await requirePermission("media", "view")

    const result = await mediaService.list({ page, limit: 40 })

    return successResponse({
      items: result.items.map((item) => ({
        id: String(item._id),
        filename: item.filename,
        url: item.url,
        altText: item.altText,
        createdAt: new Date(item.createdAt).toISOString(),
      })),
      total: result.total,
    })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function uploadMediaAction(formData: FormData): Promise<ApiResponse<{ id: string; url: string }>> {
  try {
    const admin = await requirePermission("media", "edit")

    const file = formData.get("file")
    if (!(file instanceof File) || file.size === 0) {
      throw new ValidationError("No file provided")
    }

    const parsed = mediaMetadataSchema.safeParse({
      altText: formData.get("altText"),
      caption: formData.get("caption") || undefined,
    })

    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error))
    }

    const media: MediaDocument = await mediaService.upload({
      file,
      altText: parsed.data.altText,
      caption: parsed.data.caption,
      uploadedBy: admin.userId,
    })

    await createAuditLog({
      userId: admin.userId,
      action: "CREATE",
      resource: "media",
      resourceId: String(media._id),
      newValue: { filename: media.filename, url: media.url },
    })

    return successResponse({ id: String(media._id), url: media.url })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function deleteMediaAction(id: string): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("media", "edit")

    await mediaService.remove(id)

    await createAuditLog({
      userId: admin.userId,
      action: "DELETE",
      resource: "media",
      resourceId: id,
    })

    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}
