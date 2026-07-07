import "server-only"

import { blogPostRepository, type BlogPostFilter } from "@/repositories/blog-post.repository"
import { ensureUniqueSlug } from "@/lib/slug"
import { NotFoundError } from "@/lib/errors"
import type { BlogPostDocument } from "@/models/BlogPost"
import type { ListQueryOptions, PaginatedResult } from "@/types/api"
import type { InferredBlogPostInput } from "@/schemas/blog-post.schema"

async function list(
  filter: BlogPostFilter,
  options?: ListQueryOptions,
): Promise<PaginatedResult<BlogPostDocument>> {
  return blogPostRepository.findAll(filter, options)
}

async function getById(id: string): Promise<BlogPostDocument> {
  const post = await blogPostRepository.findById(id)
  if (!post) throw new NotFoundError("Blog post not found")
  return post
}

async function getPublishedBySlug(slug: string): Promise<BlogPostDocument | null> {
  const post = await blogPostRepository.findBySlug(slug)
  if (!post || post.status !== "published") return null
  return post
}

async function create(input: InferredBlogPostInput): Promise<BlogPostDocument> {
  const slug = input.slug
    ? await ensureUniqueSlug(input.slug, (candidate) => blogPostRepository.slugExists(candidate))
    : await ensureUniqueSlug(input.title, (candidate) => blogPostRepository.slugExists(candidate))

  return blogPostRepository.create({ ...input, slug, status: "draft" })
}

async function update(id: string, input: InferredBlogPostInput): Promise<BlogPostDocument> {
  const existing = await getById(id)

  let slug = existing.slug
  if (input.slug && input.slug !== existing.slug) {
    slug = await ensureUniqueSlug(input.slug, (candidate) =>
      blogPostRepository.slugExists(candidate, id),
    )
  }

  const updated = await blogPostRepository.update(id, { ...input, slug })
  if (!updated) throw new NotFoundError("Blog post not found")
  return updated
}

async function publish(id: string): Promise<BlogPostDocument> {
  const updated = await blogPostRepository.setStatus(id, "published")
  if (!updated) throw new NotFoundError("Blog post not found")
  return updated
}

async function archive(id: string): Promise<BlogPostDocument> {
  const updated = await blogPostRepository.setStatus(id, "archived")
  if (!updated) throw new NotFoundError("Blog post not found")
  return updated
}

async function remove(id: string): Promise<void> {
  await getById(id)
  await blogPostRepository.hardDelete(id)
}

export const blogPostService = { list, getById, getPublishedBySlug, create, update, publish, archive, remove }
