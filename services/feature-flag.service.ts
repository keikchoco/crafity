import "server-only"

import { featureFlagRepository } from "@/repositories/feature-flag.repository"
import type { FeatureFlagDocument } from "@/models/FeatureFlag"

async function list(): Promise<FeatureFlagDocument[]> {
  return featureFlagRepository.findAll()
}

async function setEnabled(
  key: string,
  enabled: boolean,
  description: string,
  userId: string,
): Promise<FeatureFlagDocument> {
  return featureFlagRepository.upsertByKey(key, { enabled, description, updatedBy: userId })
}

export const featureFlagService = { list, setEnabled }
