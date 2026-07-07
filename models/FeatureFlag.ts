import { Schema, model, models, type Document, type Model } from "mongoose"

export interface FeatureFlagDocument extends Document {
  key: string
  enabled: boolean
  description: string
  updatedBy: string
  updatedAt: Date
}

const featureFlagSchema = new Schema<FeatureFlagDocument>(
  {
    key: { type: String, required: true, unique: true },
    enabled: { type: Boolean, required: true, default: false },
    description: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
)


export const FeatureFlag: Model<FeatureFlagDocument> =
  models.FeatureFlag ?? model<FeatureFlagDocument>("FeatureFlag", featureFlagSchema)
