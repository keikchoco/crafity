import "server-only"

import { projectRepository, type ProjectFilter } from "@/repositories/project.repository"
import { ensureUniqueSlug } from "@/lib/slug"
import { NotFoundError } from "@/lib/errors"
import type { ProjectDocument } from "@/models/Project"
import type { ListQueryOptions, PaginatedResult } from "@/types/api"
import type { InferredProjectInput } from "@/schemas/project.schema"

async function list(
  filter: ProjectFilter,
  options?: ListQueryOptions,
): Promise<PaginatedResult<ProjectDocument>> {
  return projectRepository.findAll(filter, options)
}

async function getById(id: string): Promise<ProjectDocument> {
  const project = await projectRepository.findById(id)
  if (!project) throw new NotFoundError("Project not found")
  return project
}

async function getPublishedBySlug(slug: string): Promise<ProjectDocument | null> {
  const project = await projectRepository.findBySlug(slug)
  if (!project || project.status !== "published") return null
  return project
}

async function create(input: InferredProjectInput, userId: string): Promise<ProjectDocument> {
  const slug = input.slug
    ? await ensureUniqueSlug(input.slug, (candidate) => projectRepository.slugExists(candidate))
    : await ensureUniqueSlug(input.title, (candidate) => projectRepository.slugExists(candidate))

  return projectRepository.create({
    ...input,
    slug,
    status: "draft",
    createdBy: userId,
    updatedBy: userId,
  })
}

async function update(
  id: string,
  input: InferredProjectInput,
  userId: string,
): Promise<ProjectDocument> {
  const existing = await getById(id)

  let slug = existing.slug
  if (input.slug && input.slug !== existing.slug) {
    slug = await ensureUniqueSlug(input.slug, (candidate) =>
      projectRepository.slugExists(candidate, id),
    )
  }

  const updated = await projectRepository.update(id, { ...input, slug, updatedBy: userId })
  if (!updated) throw new NotFoundError("Project not found")
  return updated
}

async function publish(id: string, userId: string): Promise<ProjectDocument> {
  const updated = await projectRepository.setStatus(id, "published", userId)
  if (!updated) throw new NotFoundError("Project not found")
  return updated
}

async function archive(id: string, userId: string): Promise<ProjectDocument> {
  const updated = await projectRepository.setStatus(id, "archived", userId)
  if (!updated) throw new NotFoundError("Project not found")
  return updated
}

async function remove(id: string, userId: string): Promise<void> {
  const deleted = await projectRepository.softDelete(id, userId)
  if (!deleted) throw new NotFoundError("Project not found")
}

async function restore(id: string): Promise<ProjectDocument> {
  const restored = await projectRepository.restore(id)
  if (!restored) throw new NotFoundError("Project not found")
  return restored
}

export const projectService = {
  list,
  getById,
  getPublishedBySlug,
  create,
  update,
  publish,
  archive,
  remove,
  restore,
}
