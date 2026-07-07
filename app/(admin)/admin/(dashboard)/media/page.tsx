import { requirePermission } from "@/lib/permissions"
import { mediaService } from "@/services/media.service"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { MediaLibraryGrid } from "@/components/admin/media-library-grid"

export default async function AdminMediaPage() {
  try {
    await requirePermission("media", "view")
  } catch {
    return (
      <ErrorState title="No permission" description="You don't have permission to view media." />
    )
  }

  let items: { id: string; filename: string; url: string; altText: string; createdAt: string }[] = []
  let loadFailed = false

  try {
    const result = await mediaService.list({ limit: 60 })
    items = result.items.map((item) => ({
      id: String(item._id),
      filename: item.filename,
      url: item.url,
      altText: item.altText,
      createdAt: new Date(item.createdAt).toISOString(),
    }))
  } catch {
    loadFailed = true
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Typography as="h1" variant="h1">
        Media Library
      </Typography>

      {loadFailed ? (
        <ErrorState
          title="Unable to load media"
          description="The database or storage isn't reachable right now. Check MONGODB_URI and BLOB_READ_WRITE_TOKEN in .env.local."
        />
      ) : (
        <MediaLibraryGrid items={items} />
      )}
    </div>
  )
}
