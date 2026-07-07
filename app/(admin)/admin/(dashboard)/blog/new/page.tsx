import { requirePermission } from "@/lib/permissions"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { BlogPostForm } from "@/components/admin/blog-post-form"

export default async function NewBlogPostPage() {
  try {
    await requirePermission("blog", "edit")
  } catch {
    return (
      <ErrorState title="No permission" description="You don't have permission to create blog posts." />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Typography as="h1" variant="h1">
        New Post
      </Typography>
      <BlogPostForm />
    </div>
  )
}
