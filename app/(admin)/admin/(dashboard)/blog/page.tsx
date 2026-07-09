import { requirePermission } from "@/lib/permissions"
import { blogPostService } from "@/services/blog-post.service"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { EmptyState } from "@/components/shared/empty-state"
import { BlogPostsTable, type BlogPostRow } from "@/components/admin/blog-posts-table"
import { NewBlogPostButton } from "@/components/admin/new-blog-post-button"

interface AdminBlogPageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
  try {
    await requirePermission("blog", "view")
  } catch {
    return (
      <ErrorState title="No permission" description="You don't have permission to view blog posts." />
    )
  }

  const params = await searchParams
  const page = Number(params.page ?? "1") || 1
  const limit = 20

  let rows: BlogPostRow[] = []
  let total = 0
  let loadFailed = false

  try {
    const result = await blogPostService.list({}, { page, limit, sort: params.sort, search: params.q })

    rows = result.items.map((item) => ({
      id: String(item._id),
      title: item.title,
      category: item.category,
      status: item.status,
      createdAt: new Date(item.createdAt).toISOString(),
      defaultValues: {
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: item.content,
        coverImage: item.coverImage,
        author: item.author,
        category: item.category,
        tags: item.tags,
        seo: item.seo,
      },
    }))
    total = result.total
  } catch {
    loadFailed = true
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <Typography as="h1" variant="h1">
          Blog
        </Typography>
        <NewBlogPostButton />
      </div>

      {loadFailed ? (
        <ErrorState
          title="Unable to load blog posts"
          description="The database isn't reachable right now. Check MONGODB_URI in .env.local."
        />
      ) : rows.length === 0 ? (
        <EmptyState title="No posts yet" description="Write your first blog post." />
      ) : (
        <BlogPostsTable rows={rows} total={total} page={page} limit={limit} />
      )}
    </div>
  )
}
