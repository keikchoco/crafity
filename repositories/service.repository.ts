import "server-only"

import { connectToDatabase } from "@/lib/database"
import { Service, type ServiceDocument } from "@/models/Service"
import type { ListQueryOptions, PaginatedResult } from "@/types/api"

export interface ServiceFilter {
  status?: "draft" | "published" | "archived"
}

async function findAll(
  filter: ServiceFilter,
  { page = 1, limit = 20, sort = "order", search }: ListQueryOptions = {},
): Promise<PaginatedResult<ServiceDocument>> {
  await connectToDatabase()

  const query: Record<string, unknown> = {}
  if (filter.status) query.status = filter.status
  if (search) query.title = { $regex: search, $options: "i" }

  const [items, total] = await Promise.all([
    Service.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Service.countDocuments(query),
  ])

  return { items: items as unknown as ServiceDocument[], total, page, limit }
}

async function findById(id: string): Promise<ServiceDocument | null> {
  await connectToDatabase()
  return Service.findById(id)
}

async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  await connectToDatabase()
  const query: Record<string, unknown> = { slug }
  if (excludeId) query._id = { $ne: excludeId }
  return (await Service.countDocuments(query)) > 0
}

async function create(data: Partial<ServiceDocument>): Promise<ServiceDocument> {
  await connectToDatabase()
  return Service.create(data)
}

async function update(id: string, data: Partial<ServiceDocument>): Promise<ServiceDocument | null> {
  await connectToDatabase()
  return Service.findByIdAndUpdate(id, data, { new: true })
}

async function setStatus(
  id: string,
  status: "draft" | "published" | "archived",
): Promise<ServiceDocument | null> {
  await connectToDatabase()
  return Service.findByIdAndUpdate(id, { status }, { new: true })
}

async function hardDelete(id: string): Promise<void> {
  await connectToDatabase()
  await Service.findByIdAndDelete(id)
}

export const serviceRepository = {
  findAll,
  findById,
  slugExists,
  create,
  update,
  setStatus,
  hardDelete,
}
