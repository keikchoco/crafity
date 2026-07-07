import { requirePermission } from "@/lib/permissions"
import { featureFlagService } from "@/services/feature-flag.service"
import { FEATURE_FLAG_DEFINITIONS } from "@/constants/feature-flags"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { FeatureFlagsList, type FeatureFlagRow } from "@/components/admin/feature-flags-list"

export default async function AdminFeatureFlagsPage() {
  try {
    await requirePermission("featureFlags", "view")
  } catch {
    return (
      <ErrorState
        title="No permission"
        description="You don't have permission to view feature flags."
      />
    )
  }

  let rows: FeatureFlagRow[] = []
  let loadFailed = false

  try {
    const flags = await featureFlagService.list()
    const flagsByKey = new Map(flags.map((flag) => [flag.key, flag]))

    rows = FEATURE_FLAG_DEFINITIONS.map((definition) => ({
      key: definition.key,
      label: definition.label,
      description: definition.description,
      enabled: flagsByKey.get(definition.key)?.enabled ?? definition.defaultEnabled,
    }))
  } catch {
    loadFailed = true
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Typography as="h1" variant="h1">
        Feature Flags
      </Typography>

      {loadFailed ? (
        <ErrorState
          title="Unable to load feature flags"
          description="The database isn't reachable right now. Check MONGODB_URI in .env.local."
        />
      ) : (
        <FeatureFlagsList flags={rows} />
      )}
    </div>
  )
}
