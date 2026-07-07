import "server-only"

import { connectToDatabase } from "@/lib/database"
import { ServiceInquiry, type ServiceInquiryDocument } from "@/models/ServiceInquiry"
import type { ServiceInquiryStatus } from "@/types/inquiry"
import type { ListQueryOptions, PaginatedResult } from "@/types/api"

export interface ServiceInquiryFilter {
  status?: ServiceInquiryStatus
}

async function findAll(
  filter: ServiceInquiryFilter,
  { page = 1, limit = 20, sort = "-createdAt", search }: ListQueryOptions = {},
): Promise<PaginatedResult<ServiceInquiryDocument>> {
  await connectToDatabase()

  const query: Record<string, unknown> = {}
  if (filter.status) query.status = filter.status
  if (search) query.name = { $regex: search, $options: "i" }

  const [items, total] = await Promise.all([
    ServiceInquiry.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ServiceInquiry.countDocuments(query),
  ])

  return { items: items as unknown as ServiceInquiryDocument[], total, page, limit }
}

async function findById(id: string): Promise<ServiceInquiryDocument | null> {
  await connectToDatabase()
  return ServiceInquiry.findById(id)
}

async function create(
  data: Pick<
    ServiceInquiryDocument,
    "name" | "email" | "company" | "projectType" | "services" | "budget" | "timeline" | "description"
  >,
): Promise<ServiceInquiryDocument> {
  await connectToDatabase()
  return ServiceInquiry.create(data)
}

async function updateStatus(id: string, status: ServiceInquiryStatus): Promise<ServiceInquiryDocument | null> {
  await connectToDatabase()
  return ServiceInquiry.findByIdAndUpdate(id, { status }, { new: true })
}

async function updateNotes(id: string, notes: string): Promise<ServiceInquiryDocument | null> {
  await connectToDatabase()
  return ServiceInquiry.findByIdAndUpdate(id, { notes }, { new: true })
}

export const serviceInquiryRepository = { findAll, findById, create, updateStatus, updateNotes }
