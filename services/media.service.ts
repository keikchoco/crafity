import "server-only"
import { put, del } from "@vercel/blob"

import { mediaRepository } from "@/repositories/media.repository"
import { NotFoundError, ValidationError } from "@/lib/errors"
import type { MediaDocument } from "@/models/Media"
import type { MediaType } from "@/types/media"
import type { ListQueryOptions, PaginatedResult } from "@/types/api"

const ALLOWED_TYPES: MediaType[] = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
const MAX_SIZE_BYTES = 10 * 1024 * 1024

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-")
}

async function list(options?: ListQueryOptions): Promise<PaginatedResult<MediaDocument>> {
  return mediaRepository.findAll(options)
}

interface UploadInput {
  file: File
  altText: string
  caption?: string
  uploadedBy: string
  dimensions?: { width: number; height: number }
}

async function upload(input: UploadInput): Promise<MediaDocument> {
  const type = input.file.type as MediaType

  if (!ALLOWED_TYPES.includes(type)) {
    throw new ValidationError("Unsupported file type. Allowed: JPEG, PNG, WebP, SVG.")
  }

  if (input.file.size > MAX_SIZE_BYTES) {
    throw new ValidationError("File is too large. Maximum size is 10MB.")
  }

  const pathname = `media/${Date.now()}-${sanitizeFilename(input.file.name)}`

  const blob = await put(pathname, input.file, { access: "public" })

  return mediaRepository.create({
    filename: input.file.name,
    url: blob.url,
    type,
    size: input.file.size,
    dimensions: input.dimensions ?? null,
    altText: input.altText,
    caption: input.caption,
    uploadedBy: input.uploadedBy,
  })
}

async function remove(id: string): Promise<void> {
  const media = await mediaRepository.findById(id)
  if (!media) throw new NotFoundError("Media not found")

  await del(media.url)
  await mediaRepository.hardDelete(id)
}

export const mediaService = { list, upload, remove }
