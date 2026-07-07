import "server-only"

import { messageRepository, type MessageFilter } from "@/repositories/message.repository"
import { NotFoundError } from "@/lib/errors"
import type { MessageDocument } from "@/models/Message"
import type { MessageStatus } from "@/types/message"
import type { ListQueryOptions, PaginatedResult } from "@/types/api"
import type { InferredContactInput } from "@/schemas/contact.schema"

async function list(
  filter: MessageFilter,
  options?: ListQueryOptions,
): Promise<PaginatedResult<MessageDocument>> {
  return messageRepository.findAll(filter, options)
}

async function create(input: InferredContactInput): Promise<MessageDocument> {
  return messageRepository.create(input)
}

async function updateStatus(id: string, status: MessageStatus): Promise<MessageDocument> {
  const updated = await messageRepository.updateStatus(id, status)
  if (!updated) throw new NotFoundError("Message not found")
  return updated
}

export const messageService = { list, create, updateStatus }
