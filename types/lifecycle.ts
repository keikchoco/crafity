export type ContentStatus = "draft" | "published" | "archived"

export interface Lifecycle {
  status: ContentStatus
  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy: string
  deletedAt: Date | null
  deletedBy: string | null
}
