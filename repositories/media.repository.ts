import "server-only"

import { connectToDatabase } from "@/lib/database"
import { Media, type MediaDocument } from "@/models/Media"
import type { ListQueryOptions, PaginatedResult } from "@/types/api"

async function findAll(
  { page = 1, limit = 40, sort = "-createdAt" }: ListQueryOptions = {},
): Promise<PaginatedResult<MediaDocument>> {
  await connectToDatabase()

  const [items, total] = await Promise.all([
    Media.find()
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Media.countDocuments(),
  ])

  return { items: items as unknown as MediaDocument[], total, page, limit }
}

async function findById(id: string): Promise<MediaDocument | null> {
  await connectToDatabase()
  return Media.findById(id)
}

async function create(data: Partial<MediaDocument>): Promise<MediaDocument> {
  await connectToDatabase()
  return Media.create(data)
}

async function hardDelete(id: string): Promise<void> {
  await connectToDatabase()
  await Media.findByIdAndDelete(id)
}

export const mediaRepository = {
  findAll,
  findById,
  create,
  hardDelete,
}
