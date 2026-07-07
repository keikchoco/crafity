import type { ContentStatus } from "./lifecycle"

export interface Service {
  _id: string
  title: string
  slug: string
  description: string
  icon: string
  features: string[]
  order: number
  status: ContentStatus
  createdAt: Date
  updatedAt: Date
}
