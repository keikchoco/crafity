"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/lib/permissions"
import { blogPostService } from "@/services/blog-post.service"
import { createAuditLog } from "@/lib/audit-log"
import { ValidationError } from "@/lib/errors"
import { successResponse, errorResponse } from "@/lib/api-response"
import { blogPostSchema } from "@/schemas/blog-post.schema"
import type { ApiResponse } from "@/types/api"

export async function createBlogPostAction(input: unknown): Promise<ApiResponse<{ id: string }>> {
  try {
    const admin = await requirePermission("blog", "edit")

    const parsed = blogPostSchema.safeParse(input)
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input")
    }

    const post = await blogPostService.create(parsed.data)

    await createAuditLog({
      userId: admin.userId,
      action: "CREATE",
      resource: "blog",
      resourceId: String(post._id),
      newValue: parsed.data,
    })

    revalidatePath("/admin/blog")

    return successResponse({ id: String(post._id) })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function updateBlogPostAction(
  id: string,
  input: unknown,
): Promise<ApiResponse<{ id: string }>> {
  try {
    const admin = await requirePermission("blog", "edit")

    const parsed = blogPostSchema.safeParse(input)
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0]?.message ?? "Invalid input")
    }

    const post = await blogPostService.update(id, parsed.data)

    await createAuditLog({
      userId: admin.userId,
      action: "UPDATE",
      resource: "blog",
      resourceId: id,
      newValue: parsed.data,
    })

    revalidatePath("/admin/blog")

    return successResponse({ id: String(post._id) })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function publishBlogPostAction(id: string): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("blog", "edit")
    await blogPostService.publish(id)
    await createAuditLog({ userId: admin.userId, action: "PUBLISH", resource: "blog", resourceId: id })
    revalidatePath("/admin/blog")
    revalidatePath("/blog")
    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function archiveBlogPostAction(id: string): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("blog", "edit")
    await blogPostService.archive(id)
    await createAuditLog({ userId: admin.userId, action: "ARCHIVE", resource: "blog", resourceId: id })
    revalidatePath("/admin/blog")
    revalidatePath("/blog")
    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function deleteBlogPostAction(id: string): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("blog", "edit")
    await blogPostService.remove(id)
    await createAuditLog({ userId: admin.userId, action: "DELETE", resource: "blog", resourceId: id })
    revalidatePath("/admin/blog")
    revalidatePath("/blog")
    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}
