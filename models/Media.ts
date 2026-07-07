import { Schema, model, models, type Document, type Model } from "mongoose"
import type { MediaDimensions, MediaType } from "@/types/media"

export interface MediaDocument extends Document {
  filename: string
  url: string
  type: MediaType
  size: number
  dimensions: MediaDimensions | null
  altText: string
  caption?: string
  uploadedBy: string
  createdAt: Date
}

const dimensionsSchema = new Schema<MediaDimensions>(
  {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  { _id: false },
)

const mediaSchema = new Schema<MediaDocument>(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    type: {
      type: String,
      enum: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
      required: true,
    },
    size: { type: Number, required: true },
    dimensions: { type: dimensionsSchema, default: null },
    altText: { type: String, required: true },
    caption: { type: String },
    uploadedBy: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

mediaSchema.index({ uploadedBy: 1 })
mediaSchema.index({ createdAt: -1 })

export const Media: Model<MediaDocument> = models.Media ?? model<MediaDocument>("Media", mediaSchema)
