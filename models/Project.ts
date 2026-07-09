import { Schema, model, models, type Document, type Model } from "mongoose"
import type { ContentStatus } from "@/types/lifecycle"
import type { GalleryImage, SeoFields } from "@/types/project"

export interface ProjectDocument extends Document {
  title: string
  slug: string
  shortDescription: string
  description: string
  coverImage: string
  gallery: GalleryImage[]
  category: string
  technologies: string[]
  client: string
  timeline: string
  role: string
  websiteLink: string
  problem: string
  research: string
  solution: string
  designProcess: string
  developmentProcess: string
  results: string
  featured: boolean
  seo: SeoFields
  status: ContentStatus
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  deletedBy: string | null
}

const galleryImageSchema = new Schema<GalleryImage>(
  {
    url: { type: String, required: true },
    alt: { type: String, required: true },
    caption: { type: String },
  },
  { _id: false },
)

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

const projectSchema = new Schema<ProjectDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    gallery: { type: [galleryImageSchema], default: [] },
    category: { type: String, required: true },
    technologies: { type: [String], default: [] },
    client: { type: String, required: true },
    timeline: { type: String, required: true },
    role: { type: String, required: true },
    websiteLink: { type: String, default: "" },
    problem: { type: String, default: "" },
    research: { type: String, default: "" },
    solution: { type: String, default: "" },
    designProcess: { type: String, default: "" },
    developmentProcess: { type: String, default: "" },
    results: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    seo: { type: seoFieldsSchema, default: () => ({}) },
    status: { type: String, enum: ["draft", "published", "archived"], required: true, default: "draft" },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: String, default: null },
  },
  { timestamps: true },
)

projectSchema.index({ status: 1 })
projectSchema.index({ featured: 1 })
projectSchema.index({ createdAt: -1 })

export const Project: Model<ProjectDocument> =
  models.Project ?? model<ProjectDocument>("Project", projectSchema)
