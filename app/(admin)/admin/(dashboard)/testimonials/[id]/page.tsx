import { requirePermission } from "@/lib/permissions"
import { testimonialService } from "@/services/testimonial.service"
import { projectService } from "@/services/project.service"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { TestimonialForm } from "@/components/admin/testimonial-form"
import type { InferredTestimonialInput } from "@/schemas/testimonial.schema"

interface EditTestimonialPageProps {
  params: Promise<{ id: string }>
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  try {
    await requirePermission("testimonials", "edit")
  } catch {
    return (
      <ErrorState
        title="No permission"
        description="You don't have permission to edit testimonials."
      />
    )
  }

  const { id } = await params

  let defaultValues: InferredTestimonialInput | null = null

  try {
    const testimonial = await testimonialService.getById(id)
    defaultValues = {
      clientName: testimonial.clientName,
      position: testimonial.position,
      company: testimonial.company,
      image: testimonial.image,
      review: testimonial.review,
      projectId: testimonial.projectId ? String(testimonial.projectId) : null,
      order: testimonial.order,
    }
  } catch {
    return (
      <ErrorState
        title="Unable to load testimonial"
        description="The testimonial doesn't exist or the database isn't reachable."
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
        Edit Testimonial
      </Typography>
      <TestimonialForm testimonialId={id} defaultValues={defaultValues} projectOptions={projectOptions} />
    </div>
  )
}
