import { Schema, model, models, type Document, type Model } from "mongoose"
import type { ServiceInquiryStatus } from "@/types/inquiry"

export interface ServiceInquiryDocument extends Document {
  name: string
  email: string
  company?: string
  projectType: string
  services: string[]
  budget: string
  timeline: string
  description: string
  status: ServiceInquiryStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const serviceInquirySchema = new Schema<ServiceInquiryDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String },
    projectType: { type: String, required: true },
    services: { type: [String], default: [] },
    budget: { type: String, required: true },
    timeline: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "reviewed", "contacted", "completed", "archived"],
      required: true,
      default: "new",
    },
    notes: { type: String },
  },
  { timestamps: true },
)

serviceInquirySchema.index({ status: 1 })
serviceInquirySchema.index({ createdAt: -1 })

export const ServiceInquiry: Model<ServiceInquiryDocument> =
  models.ServiceInquiry ?? model<ServiceInquiryDocument>("ServiceInquiry", serviceInquirySchema)
