import type { ContentStatus } from "./lifecycle"

export interface Testimonial {
  _id: string
  clientName: string
  position: string
  company: string
  image?: string
  review: string
  rating: number
  projectId: string | null
  order: number
  status: ContentStatus
  createdAt: Date
  updatedAt: Date
}
