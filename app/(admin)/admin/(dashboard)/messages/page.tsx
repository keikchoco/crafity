import { requirePermission } from "@/lib/permissions"
import { messageService } from "@/services/message.service"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"
import { MessagesTable, type MessageRow } from "@/components/admin/messages-table"

interface AdminMessagesPageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function AdminMessagesPage({ searchParams }: AdminMessagesPageProps) {
  try {
    await requirePermission("messages", "view")
  } catch {
    return (
      <ErrorState title="No permission" description="You don't have permission to view messages." />
    )
  }

  const params = await searchParams
  const page = Number(params.page ?? "1") || 1
  const limit = 20

  let rows: MessageRow[] = []
  let total = 0
  let loadFailed = false

  try {
    const result = await messageService.list({}, { page, limit, sort: params.sort, search: params.q })

    rows = result.items.map((item) => ({
      id: String(item._id),
      name: item.name,
      email: item.email,
      company: item.company,
      subject: item.subject,
      message: item.message,
      status: item.status,
      createdAt: new Date(item.createdAt).toISOString(),
    }))
    total = result.total
  } catch {
    loadFailed = true
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Typography as="h1" variant="h1">
        Messages
      </Typography>

      {loadFailed ? (
        <ErrorState
          title="Unable to load messages"
          description="The database isn't reachable right now. Check MONGODB_URI in .env.local."
        />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Contact form submissions will appear here."
        />
      ) : (
        <MessagesTable rows={rows} total={total} page={page} limit={limit} />
      )}
    </div>
  )
}
