import { requirePermission } from "@/lib/permissions"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { RefreshCacheButton } from "@/components/admin/refresh-cache-button"

export default async function AdminSettingsPage() {
  try {
    await requirePermission("settings", "view")
  } catch {
    return (
      <ErrorState title="No permission" description="You don't have permission to view settings." />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Typography as="h1" variant="h1">
        Settings
      </Typography>

      <Card>
        <CardHeader>
          <CardTitle>Public site cache</CardTitle>
          <CardDescription>
            CreaThink caches public pages for performance. If published content isn&apos;t showing up
            after a change, refresh the cache to regenerate pages from the latest data in MongoDB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RefreshCacheButton />
        </CardContent>
      </Card>
    </div>
  )
}
