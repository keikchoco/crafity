import { Schema, model, models, type Document, type Model } from "mongoose"
import type { AdminRole, UserStatus } from "@/types/user"

export interface UserDocument extends Document {
  clerkUserId: string
  name: string
  email: string
  role: AdminRole
  lastLogin: Date | null
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<UserDocument>(
  {
    clerkUserId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, enum: ["admin", "super_admin"], required: true, default: "admin" },
    lastLogin: { type: Date, default: null },
    status: { type: String, enum: ["active", "disabled"], required: true, default: "active" },
  },
  { timestamps: true },
)

userSchema.index({ status: 1 })

export const User: Model<UserDocument> = models.User ?? model<UserDocument>("User", userSchema)
