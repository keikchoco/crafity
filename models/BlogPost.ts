import { Schema, model, models, type Document, type Model } from "mongoose"
import type { ContentStatus } from "@/types/lifecycle"
import type { SeoFields } from "@/types/project"

export interface BlogPostDocument extends Document {
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

const seoFieldsSchema = new Schema<SeoFields>(
  {
    title: { type: String },
    description: { type: String },
    keywords: { type: [String], default: [] },
    ogImage: { type: String },
    canonicalUrl: { type: String },
  },
  { _id: false },
)

const blogPostSchema = new Schema<BlogPostDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    seo: { type: seoFieldsSchema, default: () => ({}) },
    status: { type: String, enum: ["draft", "published", "archived"], required: true, default: "draft" },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

blogPostSchema.index({ status: 1 })
blogPostSchema.index({ category: 1 })
blogPostSchema.index({ publishedAt: -1 })

export const BlogPost: Model<BlogPostDocument> =
  models.BlogPost ?? model<BlogPostDocument>("BlogPost", blogPostSchema)
