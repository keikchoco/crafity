import { z } from "zod"

import { slugSchema } from "@/schemas/common.schema"

const seoFieldsSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
})

export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: slugSchema.optional(),
  excerpt: z.string().min(1, "Excerpt is required").max(300),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().min(1, "Cover image is required"),
  author: z.string().min(1, "Author is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  seo: seoFieldsSchema.default({}),
})

export type InferredBlogPostInput = z.infer<typeof blogPostSchema>
