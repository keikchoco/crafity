import { requirePermission } from "@/lib/permissions"
import { blogPostService } from "@/services/blog-post.service"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { BlogPostForm } from "@/components/admin/blog-post-form"
import type { InferredBlogPostInput } from "@/schemas/blog-post.schema"

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  try {
    await requirePermission("blog", "edit")
  } catch {
    return (
      <ErrorState title="No permission" description="You don't have permission to edit blog posts." />
    )
  }

  const { id } = await params

  let defaultValues: InferredBlogPostInput | null = null

  try {
    const post = await blogPostService.getById(id)
    defaultValues = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      author: post.author,
      category: post.category,
      tags: post.tags,
      seo: post.seo,
    }
  } catch {
    return (
      <ErrorState
        title="Unable to load post"
        description="The post doesn't exist or the database isn't reachable."
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Typography as="h1" variant="h1">
        Edit Post
      </Typography>
      <BlogPostForm postId={id} defaultValues={defaultValues} />
    </div>
  )
}
