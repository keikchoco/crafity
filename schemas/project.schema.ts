import { z } from "zod"

import { slugSchema } from "@/schemas/common.schema"

const galleryImageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
})

const seoFieldsSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
})

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: slugSchema.optional(),
  shortDescription: z.string().min(1, "Short description is required").max(300),
  description: z.string().min(1, "Description is required"),
  coverImage: z.string().min(1, "Cover image is required"),
  gallery: z.array(galleryImageSchema).default([]),
  category: z.string().min(1, "Category is required"),
  technologies: z.array(z.string()).default([]),
  client: z.string().min(1, "Client is required"),
  timeline: z.string().min(1, "Timeline is required"),
  role: z.string().min(1, "Role is required"),
  websiteLink: z.union([z.string().url("Enter a valid URL"), z.literal("")]).default(""),
  budget: z.string().max(120).default(""),
  budgetVisible: z.boolean().default(false),
  problem: z.string().default(""),
  research: z.string().default(""),
  solution: z.string().default(""),
  designProcess: z.string().default(""),
  developmentProcess: z.string().default(""),
  results: z.string().default(""),
  featured: z.boolean().default(false),
  seo: seoFieldsSchema.default({}),
})

export type InferredProjectInput = z.infer<typeof projectSchema>
