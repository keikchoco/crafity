import "server-only"

import { connectToDatabase } from "@/lib/database"
import { BlogPost, type BlogPostDocument } from "@/models/BlogPost"
import type { ListQueryOptions, PaginatedResult } from "@/types/api"

export interface BlogPostFilter {
  status?: "draft" | "published" | "archived"
  category?: string
}

async function findAll(
  filter: BlogPostFilter,
  { page = 1, limit = 20, sort = "-createdAt", search }: ListQueryOptions = {},
): Promise<PaginatedResult<BlogPostDocument>> {
  await connectToDatabase()

  const query: Record<string, unknown> = {}
  if (filter.status) query.status = filter.status
  if (filter.category) query.category = filter.category
  if (search) query.title = { $regex: search, $options: "i" }

  const [items, total] = await Promise.all([
    BlogPost.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments(query),
  ])

  return { items: items as unknown as BlogPostDocument[], total, page, limit }
}

async function findById(id: string): Promise<BlogPostDocument | null> {
  await connectToDatabase()
  return BlogPost.findById(id)
}

async function findBySlug(slug: string): Promise<BlogPostDocument | null> {
  await connectToDatabase()
  return BlogPost.findOne({ slug })
}

async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  await connectToDatabase()
  const query: Record<string, unknown> = { slug }
  if (excludeId) query._id = { $ne: excludeId }
  return (await BlogPost.countDocuments(query)) > 0
}

async function create(data: Partial<BlogPostDocument>): Promise<BlogPostDocument> {
  await connectToDatabase()
  return BlogPost.create(data)
}

async function update(id: string, data: Partial<BlogPostDocument>): Promise<BlogPostDocument | null> {
  await connectToDatabase()
  return BlogPost.findByIdAndUpdate(id, data, { new: true })
}

async function setStatus(
  id: string,
  status: "draft" | "published" | "archived",
): Promise<BlogPostDocument | null> {
  await connectToDatabase()

  const update: Record<string, unknown> = { status }
  if (status === "published") {
    const existing = await BlogPost.findById(id)
    if (existing && !existing.publishedAt) update.publishedAt = new Date()
  }

  return BlogPost.findByIdAndUpdate(id, update, { new: true })
}

async function hardDelete(id: string): Promise<void> {
  await connectToDatabase()
  await BlogPost.findByIdAndDelete(id)
}

export const blogPostRepository = {
  findAll,
  findById,
  findBySlug,
  slugExists,
  create,
  update,
  setStatus,
  hardDelete,
}
