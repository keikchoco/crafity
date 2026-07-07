import type { ContentStatus } from "./lifecycle"
import type { SeoFields } from "./project"

export interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  author: string
  category: string
  tags: string[]
  seo: SeoFields
  status: ContentStatus
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
