import { Schema, model, models, type Document, type Model } from "mongoose"
import type { ContentStatus } from "@/types/lifecycle"

export interface ServiceDocument extends Document {
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

const serviceSchema = new Schema<ServiceDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    features: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "archived"], required: true, default: "draft" },
  },
  { timestamps: true },
)

serviceSchema.index({ status: 1 })
serviceSchema.index({ order: 1 })

export const Service: Model<ServiceDocument> =
  models.Service ?? model<ServiceDocument>("Service", serviceSchema)
