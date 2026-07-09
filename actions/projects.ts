"use server"

import { revalidatePath } from "next/cache"

import { requirePermission } from "@/lib/permissions"
import { projectService } from "@/services/project.service"
import { createAuditLog } from "@/lib/audit-log"
import { ValidationError, formatZodError } from "@/lib/errors"
import { successResponse, errorResponse } from "@/lib/api-response"
import { projectSchema } from "@/schemas/project.schema"
import type { ApiResponse } from "@/types/api"

export async function createProjectAction(input: unknown): Promise<ApiResponse<{ id: string }>> {
  try {
    const admin = await requirePermission("projects", "edit")

    const parsed = projectSchema.safeParse(input)
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error))
    }

    const project = await projectService.create(parsed.data, admin.userId)

    await createAuditLog({
      userId: admin.userId,
      action: "CREATE",
      resource: "projects",
      resourceId: String(project._id),
      newValue: parsed.data,
    })

    revalidatePath("/admin/projects")
    revalidatePath("/")
    revalidatePath("/portfolio")

    return successResponse({ id: String(project._id) })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function updateProjectAction(
  id: string,
  input: unknown,
): Promise<ApiResponse<{ id: string }>> {
  try {
    const admin = await requirePermission("projects", "edit")

    const parsed = projectSchema.safeParse(input)
    if (!parsed.success) {
      throw new ValidationError(formatZodError(parsed.error))
    }

    const project = await projectService.update(id, parsed.data, admin.userId)

    await createAuditLog({
      userId: admin.userId,
      action: "UPDATE",
      resource: "projects",
      resourceId: id,
      newValue: parsed.data,
    })

    revalidatePath("/admin/projects")
    revalidatePath(`/admin/projects/${id}`)
    revalidatePath("/")
    revalidatePath("/portfolio")
    revalidatePath(`/portfolio/${project.slug}`)

    return successResponse({ id: String(project._id) })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function publishProjectAction(id: string): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("projects", "edit")
    const project = await projectService.publish(id, admin.userId)
    await createAuditLog({ userId: admin.userId, action: "PUBLISH", resource: "projects", resourceId: id })
    revalidatePath("/admin/projects")
    revalidatePath("/")
    revalidatePath("/portfolio")
    revalidatePath(`/portfolio/${project.slug}`)
    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function archiveProjectAction(id: string): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("projects", "edit")
    const project = await projectService.archive(id, admin.userId)
    await createAuditLog({ userId: admin.userId, action: "ARCHIVE", resource: "projects", resourceId: id })
    revalidatePath("/admin/projects")
    revalidatePath("/")
    revalidatePath("/portfolio")
    revalidatePath(`/portfolio/${project.slug}`)
    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function deleteProjectAction(id: string): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("projects", "edit")
    const project = await projectService.getById(id)
    await projectService.remove(id, admin.userId)
    await createAuditLog({ userId: admin.userId, action: "DELETE", resource: "projects", resourceId: id })
    revalidatePath("/admin/projects")
    revalidatePath("/")
    revalidatePath("/portfolio")
    revalidatePath(`/portfolio/${project.slug}`)
    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function restoreProjectAction(id: string): Promise<ApiResponse<null>> {
  try {
    const admin = await requirePermission("projects", "edit")
    const project = await projectService.restore(id)
    await createAuditLog({ userId: admin.userId, action: "RESTORE", resource: "projects", resourceId: id })
    revalidatePath("/admin/projects")
    revalidatePath("/")
    revalidatePath("/portfolio")
    revalidatePath(`/portfolio/${project.slug}`)
    return successResponse(null)
  } catch (error) {
    return errorResponse(error)
  }
}
