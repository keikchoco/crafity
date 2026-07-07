import "server-only"

import { connectToDatabase } from "@/lib/database"
import { Message, type MessageDocument } from "@/models/Message"
import type { MessageStatus } from "@/types/message"
import type { ListQueryOptions, PaginatedResult } from "@/types/api"

export interface MessageFilter {
  status?: MessageStatus
}

async function findAll(
  filter: MessageFilter,
  { page = 1, limit = 20, sort = "-createdAt", search }: ListQueryOptions = {},
): Promise<PaginatedResult<MessageDocument>> {
  await connectToDatabase()

  const query: Record<string, unknown> = {}
  if (filter.status) query.status = filter.status
  if (search) query.name = { $regex: search, $options: "i" }

  const [items, total] = await Promise.all([
    Message.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Message.countDocuments(query),
  ])

  return { items: items as unknown as MessageDocument[], total, page, limit }
}

async function create(data: Pick<MessageDocument, "name" | "email" | "company" | "subject" | "message">): Promise<MessageDocument> {
  await connectToDatabase()
  return Message.create(data)
}

async function updateStatus(id: string, status: MessageStatus): Promise<MessageDocument | null> {
  await connectToDatabase()
  return Message.findByIdAndUpdate(id, { status }, { new: true })
}

export const messageRepository = { findAll, create, updateStatus }
