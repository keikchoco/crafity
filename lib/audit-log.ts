import "server-only"

import { connectToDatabase } from "@/lib/database"
import { AuditLog, type AuditLogDocument } from "@/models/AuditLog"
import type { AuditAction } from "@/types/audit-log"
import type { ListQueryOptions, PaginatedResult } from "@/types/api"

interface CreateAuditLogInput {
  userId: string
  action: AuditAction
  resource: string
  resourceId: string
  oldValue?: unknown
  newValue?: unknown
  ipAddress?: string | null
}

export async function createAuditLog(entry: CreateAuditLogInput): Promise<void> {
  await connectToDatabase()

  await AuditLog.create({
    userId: entry.userId,
    action: entry.action,
    resource: entry.resource,
    resourceId: entry.resourceId,
    oldValue: entry.oldValue ?? null,
    newValue: entry.newValue ?? null,
    ipAddress: entry.ipAddress ?? null,
  })
}

export interface AuditLogFilter {
  resource?: string
  userId?: string
}

export async function listAuditLogs(
  filter: AuditLogFilter,
  { page = 1, limit = 30, sort = "-createdAt", search }: ListQueryOptions = {},
): Promise<PaginatedResult<AuditLogDocument>> {
  await connectToDatabase()

  const query: Record<string, unknown> = {}
  if (filter.resource) query.resource = filter.resource
  if (filter.userId) query.userId = filter.userId
  if (search) {
    query.$or = [
      { resource: { $regex: search, $options: "i" } },
      { resourceId: { $regex: search, $options: "i" } },
      { userId: { $regex: search, $options: "i" } },
    ]
  }

  const [items, total] = await Promise.all([
    AuditLog.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(query),
  ])

  return { items: items as unknown as AuditLogDocument[], total, page, limit }
}
