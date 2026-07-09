import "server-only"

import { connectToDatabase } from "@/lib/database"
import { Project, type ProjectDocument } from "@/models/Project"
import type { ListQueryOptions, PaginatedResult } from "@/types/api"

export interface ProjectFilter {
  status?: "draft" | "published" | "archived"
  includeDeleted?: boolean
}

async function findAll(
  filter: ProjectFilter,
  { page = 1, limit = 20, sort = "order", search }: ListQueryOptions = {},
): Promise<PaginatedResult<ProjectDocument>> {
  await connectToDatabase()

  const query: Record<string, unknown> = filter.includeDeleted ? {} : { deletedAt: null }
  if (filter.status) query.status = filter.status
  if (search) query.title = { $regex: search, $options: "i" }

  const [items, total] = await Promise.all([
    Project.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Project.countDocuments(query),
  ])

  return { items: items as unknown as ProjectDocument[], total, page, limit }
}

async function findById(id: string): Promise<ProjectDocument | null> {
  await connectToDatabase()
  return Project.findOne({ _id: id, deletedAt: null }).lean() as Promise<ProjectDocument | null>
}

async function findBySlug(slug: string): Promise<ProjectDocument | null> {
  await connectToDatabase()
  return Project.findOne({ slug, deletedAt: null }).lean() as Promise<ProjectDocument | null>
}

async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  await connectToDatabase()
  const query: Record<string, unknown> = { slug }
  if (excludeId) query._id = { $ne: excludeId }
  return (await Project.countDocuments(query)) > 0
}

async function create(data: Partial<ProjectDocument>): Promise<ProjectDocument> {
  await connectToDatabase()
  return Project.create(data)
}

async function update(id: string, data: Partial<ProjectDocument>): Promise<ProjectDocument | null> {
  await connectToDatabase()
  return Project.findByIdAndUpdate(id, data, { new: true })
}

async function setStatus(
  id: string,
  status: "draft" | "published" | "archived",
  userId: string,
): Promise<ProjectDocument | null> {
  await connectToDatabase()
  return Project.findByIdAndUpdate(id, { status, updatedBy: userId }, { new: true })
}

async function softDelete(id: string, userId: string): Promise<ProjectDocument | null> {
  await connectToDatabase()
  return Project.findByIdAndUpdate(
    id,
    { deletedAt: new Date(), deletedBy: userId },
    { new: true },
  )
}

async function restore(id: string): Promise<ProjectDocument | null> {
  await connectToDatabase()
  return Project.findByIdAndUpdate(id, { deletedAt: null, deletedBy: null }, { new: true })
}

export const projectRepository = {
  findAll,
  findById,
  findBySlug,
  slugExists,
  create,
  update,
  setStatus,
  softDelete,
  restore,
}
