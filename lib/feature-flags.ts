import "server-only"

import { featureFlagRepository } from "@/repositories/feature-flag.repository"
import { getFeatureFlagDefault } from "@/constants/feature-flags"

export async function isFeatureEnabled(key: string): Promise<boolean> {
  try {
    const flag = await featureFlagRepository.findByKey(key)
    if (!flag) return getFeatureFlagDefault(key)
    return flag.enabled
  } catch {
    return getFeatureFlagDefault(key)
  }
}
