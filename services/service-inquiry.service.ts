import "server-only"

import { serviceInquiryRepository, type ServiceInquiryFilter } from "@/repositories/service-inquiry.repository"
import { NotFoundError } from "@/lib/errors"
import type { ServiceInquiryDocument } from "@/models/ServiceInquiry"
import type { ServiceInquiryStatus } from "@/types/inquiry"
import type { ListQueryOptions, PaginatedResult } from "@/types/api"
import type { InferredServiceInquiryInput } from "@/schemas/service-inquiry.schema"

async function list(
  filter: ServiceInquiryFilter,
  options?: ListQueryOptions,
): Promise<PaginatedResult<ServiceInquiryDocument>> {
  return serviceInquiryRepository.findAll(filter, options)
}

async function create(input: InferredServiceInquiryInput): Promise<ServiceInquiryDocument> {
  return serviceInquiryRepository.create(input)
}

async function updateStatus(id: string, status: ServiceInquiryStatus): Promise<ServiceInquiryDocument> {
  const updated = await serviceInquiryRepository.updateStatus(id, status)
  if (!updated) throw new NotFoundError("Inquiry not found")
  return updated
}

async function updateNotes(id: string, notes: string): Promise<ServiceInquiryDocument> {
  const updated = await serviceInquiryRepository.updateNotes(id, notes)
  if (!updated) throw new NotFoundError("Inquiry not found")
  return updated
}

export const serviceInquiryService = { list, create, updateStatus, updateNotes }
