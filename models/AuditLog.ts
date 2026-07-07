import { Schema, model, models, type Document, type Model } from "mongoose"
import type { AuditAction } from "@/types/audit-log"

export interface AuditLogDocument extends Document {
  userId: string
  action: AuditAction
  resource: string
  resourceId: string
  oldValue: unknown
  newValue: unknown
  ipAddress: string | null
  createdAt: Date
}

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    userId: { type: String, required: true },
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "RESTORE", "PUBLISH", "ARCHIVE", "LOGIN", "PERMISSION_CHANGE"],
      required: true,
    },
    resource: { type: String, required: true },
    resourceId: { type: String, required: true },
    oldValue: { type: Schema.Types.Mixed, default: null },
    newValue: { type: Schema.Types.Mixed, default: null },
    ipAddress: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

auditLogSchema.index({ userId: 1 })
auditLogSchema.index({ resource: 1 })
auditLogSchema.index({ createdAt: -1 })

export const AuditLog: Model<AuditLogDocument> =
  models.AuditLog ?? model<AuditLogDocument>("AuditLog", auditLogSchema)
