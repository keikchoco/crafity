import "server-only"

import { connectToDatabase } from "@/lib/database"
import { FeatureFlag, type FeatureFlagDocument } from "@/models/FeatureFlag"

async function findAll(): Promise<FeatureFlagDocument[]> {
  await connectToDatabase()
  return FeatureFlag.find({}).sort("key")
}

async function findByKey(key: string): Promise<FeatureFlagDocument | null> {
  await connectToDatabase()
  return FeatureFlag.findOne({ key })
}

async function upsertByKey(
  key: string,
  data: { enabled: boolean; description: string; updatedBy: string },
): Promise<FeatureFlagDocument> {
  await connectToDatabase()
  return FeatureFlag.findOneAndUpdate(
    { key },
    { $set: data },
    { new: true, upsert: true },
  )
}

export const featureFlagRepository = { findAll, findByKey, upsertByKey }
