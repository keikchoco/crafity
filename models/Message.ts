import { Schema, model, models, type Document, type Model } from "mongoose"
import type { MessageStatus } from "@/types/message"

export interface MessageDocument extends Document {
  name: string
  email: string
  company?: string
  subject: string
  message: string
  status: MessageStatus
  createdAt: Date
}

const messageSchema = new Schema<MessageDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "archived", "completed"], required: true, default: "new" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

messageSchema.index({ status: 1 })
messageSchema.index({ createdAt: -1 })

export const Message: Model<MessageDocument> =
  models.Message ?? model<MessageDocument>("Message", messageSchema)
