import "server-only"

import { serviceRepository, type ServiceFilter } from "@/repositories/service.repository"
import { ensureUniqueSlug } from "@/lib/slug"
import { NotFoundError } from "@/lib/errors"
import type { ServiceDocument } from "@/models/Service"
import type { ListQueryOptions, PaginatedResult } from "@/types/api"
import type { InferredServiceInput } from "@/schemas/service.schema"

async function list(
  filter: ServiceFilter,
  options?: ListQueryOptions,
): Promise<PaginatedResult<ServiceDocument>> {
  return serviceRepository.findAll(filter, options)
}

async function getById(id: string): Promise<ServiceDocument> {
  const service = await serviceRepository.findById(id)
  if (!service) throw new NotFoundError("Service not found")
  return service
}

async function create(input: InferredServiceInput): Promise<ServiceDocument> {
  const slug = input.slug
    ? await ensureUniqueSlug(input.slug, (candidate) => serviceRepository.slugExists(candidate))
    : await ensureUniqueSlug(input.title, (candidate) => serviceRepository.slugExists(candidate))

  return serviceRepository.create({ ...input, slug, status: "draft" })
}

async function update(id: string, input: InferredServiceInput): Promise<ServiceDocument> {
  const existing = await getById(id)

  let slug = existing.slug
  if (input.slug && input.slug !== existing.slug) {
    slug = await ensureUniqueSlug(input.slug, (candidate) =>
      serviceRepository.slugExists(candidate, id),
    )
  }

  const updated = await serviceRepository.update(id, { ...input, slug })
  if (!updated) throw new NotFoundError("Service not found")
  return updated
}

async function publish(id: string): Promise<ServiceDocument> {
  const updated = await serviceRepository.setStatus(id, "published")
  if (!updated) throw new NotFoundError("Service not found")
  return updated
}

async function archive(id: string): Promise<ServiceDocument> {
  const updated = await serviceRepository.setStatus(id, "archived")
  if (!updated) throw new NotFoundError("Service not found")
  return updated
}

async function remove(id: string): Promise<void> {
  await getById(id)
  await serviceRepository.hardDelete(id)
}

export const serviceService = { list, getById, create, update, publish, archive, remove }
