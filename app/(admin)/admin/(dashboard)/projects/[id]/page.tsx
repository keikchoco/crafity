import { requirePermission } from "@/lib/permissions"
import { projectService } from "@/services/project.service"
import { Typography } from "@/components/shared/typography"
import { ErrorState } from "@/components/shared/error-state"
import { ProjectForm } from "@/components/admin/project-form"
import type { InferredProjectInput } from "@/schemas/project.schema"

interface EditProjectPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  try {
    await requirePermission("projects", "edit")
  } catch {
    return (
      <ErrorState title="No permission" description="You don't have permission to edit projects." />
    )
  }

  const { id } = await params

  let defaultValues: InferredProjectInput | null = null

  try {
    const project = await projectService.getById(id)
    defaultValues = {
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription,
      description: project.description,
      coverImage: project.coverImage,
      gallery: project.gallery,
      category: project.category,
      technologies: project.technologies,
      client: project.client,
      timeline: project.timeline,
      role: project.role,
      problem: project.problem,
      research: project.research,
      solution: project.solution,
      designProcess: project.designProcess,
      developmentProcess: project.developmentProcess,
      results: project.results,
      featured: project.featured,
      seo: project.seo,
    }
  } catch {
    return (
      <ErrorState
        title="Unable to load project"
        description="The project doesn't exist or the database isn't reachable."
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Typography as="h1" variant="h1">
        Edit Project
      </Typography>
      <ProjectForm projectId={id} defaultValues={defaultValues} />
    </div>
  )
}
