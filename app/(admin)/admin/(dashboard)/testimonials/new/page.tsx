import { requirePermission } from "@/lib/permissions"
import { projectService } from "@/services/project.service"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { TestimonialForm } from "@/components/admin/testimonial-form"

export default async function NewTestimonialPage() {
  try {
    await requirePermission("testimonials", "edit")
  } catch {
    return (
      <ErrorState
        title="No permission"
        description="You don't have permission to create testimonials."
      />
    )
  }

  let projectOptions: { id: string; title: string }[] = []
  try {
    const result = await projectService.list({ status: "published" }, { limit: 100 })
    projectOptions = result.items.map((item) => ({ id: String(item._id), title: item.title }))
  } catch {
    projectOptions = []
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Typography as="h1" variant="h1">
        New Testimonial
      </Typography>
      <TestimonialForm projectOptions={projectOptions} />
    </div>
  )
}
